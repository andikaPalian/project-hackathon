import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  chatWithTutorController,
  generateQuizController,
  summarizeMaterialController,
} from "../controllers/gemini.controller.js";

export const geminiRouter = express.Router();

geminiRouter.post("/chat", verifyToken, chatWithTutorController);
geminiRouter.post("/quiz", verifyToken, generateQuizController);
geminiRouter.post("/summarize", verifyToken, summarizeMaterialController);
