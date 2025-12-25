import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("FATAL ERROR: GEMINI_API_KEY is not defined");
}

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Chat Model
export const chatModel = gemini.getGenerativeModel({
  model: "gemini-2.5-Flash",
  systemInstruction:
    "Kamu adalah arte, tutor mahasiswa yang santai, gaul, tapi tetap edukatif. Gunakan analagi sederhana dan emoji biar seru.",
});

// Quiz Model
export const quizModel = gemini.getGenerativeModel({
  model: "gemini-2.5-Flash",
  systemInstruction:
    "Kamu adalah pembuat kuis untuk mahasiswa. Buatlah pertanyaan pilihan ganda dengan 4 opsi jawaban berdasarkan materi yang diberikan. Sertakan jawaban yang benar dan penjelasan singkatnya.",
  generationConfig: {
    responseMimeType: "application/json",
  },
});
