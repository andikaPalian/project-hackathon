import { chatModel, quizModel } from "../config/gemini.js";
import { createRequire } from "module";
import { extractTextFromPdf } from "../helper/extractPdf.js";

const require = createRequire(import.meta.url);
const officeParser = require("officeparser");

export const chatWithTutor = async (messages, history, userContext) => {
  try {
    const chatSession = chatModel.startChat({
      history: history || [],
    });

    const prompt = `
    [INFO USER]
    Jurusan: ${userContext.major}
    Gaya Belajar: ${userContext.learningStyle}
    Tujuan Saat Ini: ${userContext.goal}

    [INSTRUKSI KHUSUS]
    Tolong jawab pertanyaan user di bawah ini dengan menyesuaikan info User di atas:
    - Jika gaya belajar 'Visual', berikan deskripsi imajinatif atau minta user membayangkan gambar.
    - Jika 'Step by step', gunakan poin-poin 1, 2, 3.
    - Hubungkan jawaban dengan jurusan mereka (${userContext.major}).

    [PERTANYAAN USER]
    ${messages}
    `;

    const result = await chatSession.sendMessage(prompt);

    return result.response.text();
  } catch (error) {
    console.error("Chat error: ", error);
    throw new Error("Duh, arte lagi mikir keras. Coba lagi nanti ya!");
  }
};

export const generateQuiz = async (topic, difficulty, userContext, amount = 5) => {
  try {
    const contextInfo = `
      Konteks User:
      - Jurusan: ${userContext.major}
      - Tujuan: ${userContext.goal}

      Instruksi Tambahan:
      Buat soal yang relevan dengan jurusan dan tujuan belajar user di atas jika memungkinkan.
    `;

    const prompt = `
    ${contextInfo}

    Buatkan ${amount} soal pilihan ganda tentang "${topic}" dengan tingkat kesulitan "${difficulty}".
    
    Instruksi Output:
    1. Wajib dalam format JSON Array murni.
    2. Jangan pakai markdown (\`\`\`json).
    3. Stuktur Object:
    [
      {
        "question": "Pertanyaan...",
        "options": ["A", "B", "C", "D"],
        "correctIndex": 0, // (0=A, 1=B, 2=C, 3=D)
        "explanation": "Kenapa jawabannya itu..."
      }
    ]
        `;

    const result = await quizModel.generateContent(prompt);
    let rawText = result.response.text();

    rawText = rawText.replace(/```json/g, "").replace(/```/g, "");

    const firstBracket = rawText.indexOf("[");
    const lastBracket = rawText.lastIndexOf("]");

    if (firstBracket === -1 || lastBracket === -1) {
      rawText = rawText.substring(firstBracket, lastBracket + 1);
    }

    return JSON.parse(rawText);
  } catch (error) {
    console.error("Quiz generation error: ", error);
    throw new Error("Gagal membuat kuis. Coba ganti topik atau tingkat kesulitan.");
  }
};

export const generateQuizFromMaterial = async (
  fileData,
  mimeType,
  userContext,
  amount = 5,
  difficulty
) => {
  try {
    const contextInfo = `
      Konteks User:
      - Jurusan: ${userContext.major}
      - Tujuan: ${userContext.goal}

      Instruksi Tambahan:
      Buat soal yang relevan dengan jurusan dan tujuan belajar user di atas jika memungkinkan.
    `;

    let textContent = "";

    if (mimeType === "application/pdf") {
      textContent = await extractTextFromPdf(fileData);
      console.log("Berhasil membaca PDF, panjang teks:", textContent.length);
    } else if (
      mimeType === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
      mimeType === "application/vnd.ms-powerpoint"
    ) {
      textContent = await new Promise((resolve, reject) => {
        officeParser.parseOffice(fileData, (data, err) => {
          if (err) reject(err);
          else resolve(data);
        });
      });
      console.log("Berhasil membaca PPT/PPTX, panjang teks:", textContent.length);
    } else {
      throw new Error("Unsupported file type for quiz generation.");
    }

    if (!textContent || textContent.trim().length === 0) {
      throw new Error("Failed to extract text from the provided material.");
    }

    const prompt = `
      ${contextInfo}

      Buatkan ${amount} soal pilihan ganda dengan tingkat kesulitan ${difficulty} berdasarkan materi berikut ini:

      [MULAI MATERI]
      ${textContent.substring(0, 20000)} 
      [SELESAI MATERI]

      Instruksi Output:
      1. Soal HARUS diambil dari teks materi di atas.
      2. Format WAJIB JSON Array murni.
      3. Jangan pakai markdown (\`\`\`json).
      4. Struktur: [{ "question": "...", "options": ["A","B","C","D"], "correctIndex": 0, "explanation": "..." }]
    `;

    const result = await quizModel.generateContent(prompt);
    let rawText = result.response.text();

    rawText = rawText.replace(/```json/g, "").replace(/```/g, "");

    const firstBracket = rawText.indexOf("[");
    const lastBracket = rawText.lastIndexOf("]");

    if (firstBracket === -1 || lastBracket === -1) {
      rawText = rawText.substring(firstBracket, lastBracket + 1);
    }

    return JSON.parse(rawText);
  } catch (error) {
    console.error("Quiz from material error: ", error);
    throw new Error("Gagal membuat kuis dari materi. Coba lagi nanti ya!");
  }
};

export const summarizeMaterial = async (fileData, mimeType) => {
  try {
    console.log("➡️ Menerima File. MIME Type:", mimeType);

    let textToSummarize = "";

    if (mimeType === "application/pdf") {
      textToSummarize = await extractTextFromPdf(fileData);
      console.log("Berhasil membaca PDF, panjang teks:", textToSummarize.length);
    } else if (
      mimeType === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
      mimeType === "application/vnd.ms-powerpoint"
    ) {
      textToSummarize = await new Promise((resolve, reject) => {
        officeParser.parseOffice(fileData, (data, err) => {
          if (err) reject(err);
          else resolve(data);
        });
      });
      console.log("Berhasil membaca PPT/PPTX, panjang teks:", textToSummarize.length);
    } else {
      throw new Error("Unsupported file type for summarization.");
    }

    if (!textToSummarize || textToSummarize.trim().length === 0) {
      throw new Error("Failed to extract text from the provided material.");
    }
    const prompt = `
      Kamu adalah seorang asisten belajar yang ahli dalam meringkas materi pembelajaran.
      Tolong ringkas materi berikut ini:
      
      [MULAI MATERI]
      ${textToSummarize.substring(0, 30000)}
      [SELESAI MATERI]

      Instruksi:
      1. Filter informasi sampah, ambil hanya yang penting dan relevan.
      2. Kelompokkan berdasarkan Bab atau Topik utama.
      3. Gunakan formatting markdown (Bold, Bullet points) agar mudah dibaca cepat (skimming).
      4. Jika ada rumus tuliskan dengan jelas.
    `;

    // const request = [
    //   {
    //     text: prompt,
    //   },
    //   {
    //     inlineData: {
    //       mimeType: mimeType,
    //       data: cleanFileData,
    //     },
    //   },
    // ];

    const result = await chatModel.generateContent(prompt);
    return {
      summary: result.response.text(),
      originalText: textToSummarize,
    };
  } catch (error) {
    console.error("Summarization error: ", error);
    throw new Error("Gagal meringkas materi. Coba lagi nanti ya!");
  }
};
