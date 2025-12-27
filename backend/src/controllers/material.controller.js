// import { generateTopicsFromMaterial } from "../services/gemini.service.js";
import {
  createMaterial,
  getMaterialById,
  getMaterialByUser,
} from "../services/material.service.js";

export const createMaterialController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const file = req.file;
    const { title, subject } = req.body;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File data is required.",
      });
    }

    const result = await createMaterial(userId, file, title, subject);

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMaterialByUserController = async (req, res) => {
  try {
    const userId = req.user.userId;

    const materials = await getMaterialByUser(userId);

    return res.status(200).json({
      success: true,
      data: materials,
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      messagge: error.message,
    });
  }
};

export const getMaterialByIdController = async (req, res) => {
  try {
    const { materialId } = req.params;
    const userId = req.user.userId;

    const material = await getMaterialById(materialId, userId);

    return res.status(200).json({
      success: true,
      data: material,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
