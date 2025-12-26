import { db } from "../config/firebase.js";
import { uploadToCloudinary } from "../helper/uploadFile.js";
import {
  chatWithTutor,
  generateQuiz,
  generateQuizFromMaterial,
  summarizeMaterial,
} from "../services/gemini.service.js";
import { v2 as cloudinary } from "cloudinary";

export const chatWithTutorController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { messages, history } = req.body;

    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    const userContext = {
      major: userData.major || "Umum",
      learningStyle: userData.learningStyle || "Text Biasa",
      goal: userData.goal || "Belajar Konsep",
    };

    const response = await chatWithTutor(messages, history, userContext);

    const chatRecord = {
      userId: userId,
      messages: [
        {
          role: "users",
          text: messages,
          timestamps: new Date(),
        },
        {
          role: "model",
          text: response,
          timestamps: new Date(),
        },
      ],
      history: history || [],
    };

    await db.collection("chat_sessions").add(chatRecord);

    return res.status(201).json({
      success: true,
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const generateQuizController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { topic, difficulty, amount } = req.body;

    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    const userContext = {
      major: userData.major || "Umum",
      goal: userData.goal || "Latihan",
    };

    const quiz = await generateQuiz(topic, difficulty, userContext, amount);

    const quizRecord = {
      topic: topic,
      difficulty: difficulty,
      generatedBy: userId,
      questions: quiz,
      createdAt: new Date(),
    };

    const docRef = await db.collection("quizzes").add(quizRecord);

    return res.status(201).json({
      success: true,
      quizId: docRef.id,
      data: quiz,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const generateQuizFromMaterialController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const file = req.file;
    const { amount, difficulty } = req.body;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File data is required.",
      });
    }

    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    const userContext = {
      major: userData.major || "Umum",
      goal: userData.goal || "Latihan",
    };

    const quiz = await generateQuizFromMaterial(
      file.buffer,
      file.mimetype,
      userContext,
      amount || 5,
      difficulty
    );

    const quizRecord = {
      topic: `Generated from material: ${file.originalname}`,
      difficulty: difficulty,
      generatedBy: userId,
      questions: quiz,
      createdAt: new Date(),
    };

    const docRef = await db.collection("quizzes").add(quizRecord);

    return res.status(201).json({
      success: true,
      quizId: docRef.id,
      data: quiz,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const summarizeMaterialController = async (req, res) => {
  try {
    const userId = req.user.userId;

    const file = req.file;
    const { title } = req.body;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File data is required.",
      });
    }

    const summary = await summarizeMaterial(file.buffer, file.mimetype);

    const fileName = `${userId}-${Date.now()}-${file.originalname.split(".")[0]}`;

    const cloudinaryResult = await uploadToCloudinary(file.buffer, "hackathon_materials", fileName);

    // const result = await cloudinary.uploader.upload_stream({
    //   resource_type: "auto",
    //   folder: "hackathon_materials",
    //   public_id: `${userId}-${Date.now()}-${file.originalname.split(".")[0]}`, // Nama file unik
    // });

    // const base64FileData = file.buffer.toString("base64");

    const materialRecord = {
      uploadedBy: userId,
      title: title || file.originalname,
      summary: summary.summary,
      fullContent: summary.originalText,
      fileUrl: cloudinaryResult.secure_url,
      filePublicId: cloudinaryResult.public_id,
      fileType: file.mimetype,
      createdAt: new Date(),
    };

    await db.collection("materials").add(materialRecord);

    return res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
