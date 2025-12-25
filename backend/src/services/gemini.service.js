import { chatModel, quizModel } from "../config/gemini";

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

    return JSON.parse(result.response.text());
  } catch (error) {
    console.error("Quiz generation error: ", error);
    throw new Error("Gagal membuat kuis. Coba ganti topik atau tingkat kesulitan.");
  }
};

export const summarizeMaterial = async (fileData, mimeType) => {
  try {
    const prompt = `
      Kamu adalah seorang asisten belajar yang ahli dalam meringkas materi pembelajaran.
      Tolong buatkan ringkasan dari dokumen yang saya lampirkan ini.

      Instruksi:
      1. Filter informasi sampah, ambil hanya yang penting dan relevan.
      2. Kelompokkan berdasarkan Bab atau Topik utama.
      3. Gunakan formatting markdown (Bold, Bullet points) agar mudah dibaca cepat (skimming).
      4. Jika ada rumus tuliskan dengan jelas.
    `;

    const request = [
      {
        text: prompt,
      },
      {
        inlineData: {
          mimeType: mimeType,
          data: fileData,
        },
      },
    ];

    const result = await chatModel.generateContent(request);
    return result.response.text();
  } catch (error) {
    console.error("Summarization error: ", error);
    throw new Error("Gagal meringkas materi. Coba lagi nanti ya!");
  }
};
