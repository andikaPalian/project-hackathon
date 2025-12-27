import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { uploadMaterial } from "../middlewares/multer.js";
import {
  createMaterialController,
  getMaterialByIdController,
  getMaterialByUserController,
} from "../controllers/material.controller.js";

export const materialRouter = express.Router();

materialRouter.post("/upload", verifyToken, uploadMaterial, createMaterialController);
materialRouter.get("/", verifyToken, getMaterialByUserController);
materialRouter.get("/:materialId", verifyToken, getMaterialByIdController);
