import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  getQuizByIdController,
  getUserQuizzesController,
  updateQuizScoreController,
} from "../controllers/quiz.controller.js";

export const quizRouter = express.Router();

quizRouter.get("/", verifyToken, getUserQuizzesController);
quizRouter.get("/:quizId", verifyToken, getQuizByIdController);
quizRouter.patch("/:quizId/score", verifyToken, updateQuizScoreController);
