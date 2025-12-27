import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getUserQuizzesController } from "../controllers/quiz.controller.js";

export const quizRouter = express.Router();

quizRouter.get("/", verifyToken, getUserQuizzesController);
