import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getUserStats, getWeeklyStats } from "../controllers/stats.controller.js";

export const statsRouter = express.Router();

statsRouter.get("/", verifyToken, getUserStats);
statsRouter.get("/weekly", verifyToken, getWeeklyStats);
