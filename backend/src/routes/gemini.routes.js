import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  chatWithTutorController,
  generateQuizController,
  generateQuizFromMaterialController,
  summarizeMaterialController,
} from "../controllers/gemini.controller.js";
import { uploadMaterial } from "../middlewares/multer.js";

export const geminiRouter = express.Router();

geminiRouter.post("/chat", verifyToken, chatWithTutorController);
geminiRouter.post("/quiz", verifyToken, generateQuizController);
geminiRouter.post("/quiz/upload", verifyToken, uploadMaterial, generateQuizFromMaterialController);
geminiRouter.post("/summarize", verifyToken, uploadMaterial, summarizeMaterialController);
