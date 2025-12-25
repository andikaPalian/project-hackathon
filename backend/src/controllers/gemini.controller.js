import { db } from "../config/firebase.js";
import { chatWithTutor, generateQuiz, summarizeMaterial } from "../services/gemini.service.js";

export const chatWithTutorController = async (req, res) => {
  try {
    const { userId } = req.user.userId;
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
      questions: [quiz],
      createdAt: new Date(),
    };

    await db.collection("quizzes").add(quizRecord);

    return res.status(201).json({
      success: true,
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
    const { fileData, mimeType } = req.body;

    const summary = await summarizeMaterial(fileData, mimeType);

    const summaryRecord = {
      title: "",
    };
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
