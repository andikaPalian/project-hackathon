import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("FATAL ERROR: GEMINI_API_KEY is not defined");
}

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Chat Model
export const chatModel = gemini.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction:
    "Kamu adalah KIRA, tutor mahasiswa yang santai dan gaul. " +
    "Tugasmu menjelaskan materi kuliah dengan analogi sederhana dan emoji. " +
    "PENTING: Gunakan format Markdown (tebal, list, atau heading) agar penjelasanmu mudah dibaca. " +
    "Jangan terlalu banyak basa-basi di awal, langsung ke inti penjelasan setelah menyapa.",
});

// Quiz Model
export const quizModel = gemini.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction:
    "Kamu adalah pembuat kuis untuk mahasiswa. Buatlah pertanyaan pilihan ganda dengan 4 opsi jawaban berdasarkan materi yang diberikan. Sertakan jawaban yang benar dan penjelasan singkatnya.",
  generationConfig: {
    responseMimeType: "application/json",
  },
});
