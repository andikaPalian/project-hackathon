import { chatModel, quizModel } from "../config/gemini.js";
import { createRequire } from "module";
import { extractTextFromPdf } from "../helper/extractPdf.js";

const require = createRequire(import.meta.url);
const officeParser = require("officeparser");

export const chatWithTutor = async (messages, history, userContext) => {
  try {
    // const chatSession = chatModel.startChat({
    //   history: history || [],
    // });

    // materialId: materialId && materialId !== "undefined" ? materialId : null;

    let safeHistory = (history || []).map((item) => ({
      role: item.role === "assistant" ? "model" : "user",
      parts: [{ text: item.content || item.text || "" }],
    }));

    if (safeHistory.length > 0 && safeHistory[0].role === "model") {
      safeHistory.shift();
    }

    const chatSession = chatModel.startChat({
      history: safeHistory,
    });

    const prompt = `
    ${userContext.materialInfo}

    [INFO USER]
    Jurusan: ${userContext.major}
    Gaya Belajar: ${userContext.learningStyle}
    Tujuan Saat Ini: ${userContext.goal}

    [INSTRUKSI KHUSUS]
    Tolong jawab pertanyaan user di bawah ini dengan menyesuaikan info User di atas:
    - Jika gaya belajar 'Visual', berikan deskripsi imajinatif atau minta user membayangkan gambar.
    - Jika 'Step by step', gunakan poin-poin 1, 2, 3.
    - Hubungkan jawaban dengan jurusan mereka (${userContext.major}).
    - Jika user bertanya tentang sesuatu yang tidak ada di dokumen, tetap bantu jelaskan menggunakan pengetahuanmu namun kaitkan dengan konteks materi tersebut.

    [INSTRUKSI MODE TUTOR: ${userContext.mode}]
    - Jika mode 'kayak-anak-sma': Gunakan bahasa santai, hindari istilah terlalu teknis, gunakan analogi sehari-hari.
    - Jika mode 'ringkas': Berikan jawaban yang to-the-point dan hanya poin penting.
    - Jika mode 'step-by-step': Pecah penjelasan menjadi langkah-langkah logis 1, 2, 3.
    - Jika mode 'detail': Berikan penjelasan mendalam, teknis, dan komprehensif.

    [PERTANYAAN USER]
    ${messages}
    `;

    const result = await chatSession.sendMessage(prompt);

    return result.response.text();
  } catch (error) {
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

    // rawText = rawText.replace(/```json/g, "").replace(/```/g, "");

    const firstBracket = rawText.indexOf("[");
    const lastBracket = rawText.lastIndexOf("]");

    if (firstBracket === -1 || lastBracket === -1) {
      rawText = rawText.substring(firstBracket, lastBracket + 1);
    }

    let cleanJson = rawText.substring(firstBracket, lastBracket + 1);

    cleanJson = cleanJson.trim();

    return JSON.parse(cleanJson);
  } catch (error) {
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
    throw new Error("Gagal membuat kuis dari materi. Coba lagi nanti ya!");
  }
};

export const summarizeMaterial = async (fileData, mimeType, textContent = null) => {
  try {
    let textToSummarize = "";

    if (textContent) {
      textToSummarize = textContent;
    } else if (fileData) {
      if (mimeType === "application/pdf") {
        textToSummarize = await extractTextFromPdf(fileData);
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
      }
    }

    // if (mimeType === "application/pdf") {
    //   textToSummarize = await extractTextFromPdf(fileData);
    // } else if (
    //   mimeType === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
    //   mimeType === "application/vnd.ms-powerpoint"
    // ) {
    //   textToSummarize = await new Promise((resolve, reject) => {
    //     officeParser.parseOffice(fileData, (data, err) => {
    //       if (err) reject(err);
    //       else resolve(data);
    //     });
    //   });
    // } else {
    //   throw new Error("Unsupported file type for summarization.");
    // }

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
      5. Output wajib dalam format JSON murni:
        Buatlah output dalam format JSON dengan struktur:
        {
          "summary": "Teks ringkasan umum dalam markdown",
          "examPreparation": {
            "title": "Ringkasan UTS/UAS: [Judul]",
            "sections": [
              { "title": "Bab 1: ...", "points": ["poin utama", "poin utama"] }
            ],
            "checklist": ["Pahami konsep A", "Hafal rumus B"]
          }
        }
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
    let rawText = result.response.text();

    const firstBracket = rawText.indexOf("{");
    const lastBracket = rawText.lastIndexOf("}");

    if (firstBracket === -1 || lastBracket === -1) {
      rawText = rawText.substring(firstBracket, lastBracket + 1);
    }

    let cleanJson = rawText.substring(firstBracket, lastBracket + 1).trim();

    const parsedData = JSON.parse(cleanJson);

    return {
      summary: parsedData.summary,
      examPreparation: parsedData.examPreparation,
      originalText: textToSummarize,
    };
  } catch (error) {
    throw new Error("Gagal meringkas materi. Coba lagi nanti ya!");
  }
};

export const generateTopicsFromMaterial = async (fileData, mimeType) => {
  try {
    let textContent = "";
    if (mimeType === "application/pdf") {
      textContent = await extractTextFromPdf(fileData);
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
    } else {
      throw new Error("Unsupported file type for summarization.");
    }

    const prompt = `
      Kamu adalah seorang asisten belajar yangg ahili dalam meringkas materi pembelajaran.
      Tolong buat ringkasan dan persiapan ujian dari materi berikut ini, buatkan kurikulum belajar yang tersturktur: 

      [MATERI]
      ${textContent.substring(0, 25000)}
      [SELESAI]

      Instruksi Output:
      1. Wajib format JSON Array.
      2. Jangan pakai markdown.
      3. Struktur harus:
      [
        {
          "title": "Judul Topik Utama",
          "difficulty": "easy/medium/hard",
          "mastery": 0,
          "summary": "Ringkasan konsep singkat untuk topik ini (1 paragraf)",
          "keyPoints": ["Poin 1", "Poin 2"],
          "example": "Analogi atau contoh sederhana",
          "confusionPoint": "Hal yang sering membingungkan",
          "subtopics": [
            { "title": "Sub Topik 1", "completed": false },
            { "title": "Sub Topik 2", "completed": false }
          ]
        }
      ]

      PENTING: Berikan output HANYA dalam format JSON murni. 
      Jangan memberikan kata pengantar, salam, atau penjelasan apapun di luar JSON.
    `;

    const result = await chatModel.generateContent(prompt);
    let rawText = result.response.text();

    rawText = rawText.replace(/```json/g, "").replace(/```/g, "");

    const firstBracket = rawText.indexOf("[");
    const lastBracket = rawText.lastIndexOf("]");

    if (firstBracket === -1 || lastBracket === -1) {
      rawText = rawText.substring(firstBracket, lastBracket + 1);
    }

    return JSON.parse(rawText);
  } catch (error) {
    throw new Error("Gagal meringkas materi. Coba lagi nanti ya!");
  }
};
