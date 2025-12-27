import { db } from "../config/firebase.js";
import { uploadToCloudinary } from "../helper/uploadFile.js";
import {
  chatWithTutor,
  generateQuiz,
  generateQuizFromMaterial,
  generateTopicsFromMaterial,
  summarizeMaterial,
} from "../services/gemini.service.js";

export const chatWithTutorController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { messages, history, materialId, topicId, mode } = req.body;

    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    // const materialDoc = await db.collection("materials").doc(materialId).get();
    // const m = materialDoc.data();

    let materialContext = "";

    // LOGIKA KRITIS: Hanya panggil Firestore jika materialId valid
    if (materialId && materialId !== "undefined" && materialId !== "null") {
      const materialDoc = await db.collection("materials").doc(materialId).get();

      if (materialDoc.exists) {
        const m = materialDoc.data();

        // Cari topik jika topicId ada
        const specificTopic = topicId ? m.topics?.find((t) => t.title === topicId) : null;

        materialContext = `
          [DOKUMEN SUMBER: ${m.title}]
          Isi Utama Materi: ${m.fullContent || m.summary || "Konten teks tidak tersedia"}
          ${
            specificTopic
              ? `
          [TOPIK AKTIF]
          Judul: ${specificTopic.title}
          Ringkasan: ${specificTopic.summary}
          `
              : ""
          }
        `;
      }
    }

    const userContext = {
      major: userData.major || "Umum",
      learningStyle: userData.learningStyle || "Text Biasa",
      goal: userData.goal || "Belajar Konsep",
      mode: mode || "step-by-step",
      materialInfo: materialContext,
    };

    const response = await chatWithTutor(messages, history, userContext);

    const chatRecord = {
      userId: userId,
      // materialId: materialId && materialId !== "undefined" ? materialId : "general",
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
    console.error("FATAL ERROR DI CONTROLLER:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const generateQuizController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { topic, difficulty, amount, materialId } = req.body;

    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    const userContext = {
      major: userData.major || "Umum",
      goal: userData.goal || "Latihan",
    };

    let finalTopic = topic;
    if (materialId && (!topic || topic === "")) {
      const matDoc = await db.collection("materials").doc(materialId).get();
      if (matDoc.exists) {
        finalTopic = matDoc.data().title;
      }
    }

    finalTopic = finalTopic || "Topik Umum";

    const quiz = await generateQuiz(topic, difficulty, userContext, amount);

    const quizRecord = {
      title: finalTopic,
      topic: finalTopic,
      difficulty: difficulty,
      generatedBy: userId,
      questions: quiz,
      createdAt: new Date(),
      lastScore: null,
    };

    const docRef = await db.collection("quizzes").add(quizRecord);

    return res.status(201).json({
      success: true,
      quizId: docRef.id,
      data: quiz,
    });
  } catch (error) {
    console.error("FATAL ERROR DI CONTROLLER:", error);
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
    const { title, subject } = req.body;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File data is required.",
      });
    }

    const summary = await summarizeMaterial(file.buffer, file.mimetype);

    // const fileName = `${userId}-${Date.now()}-${file.originalname.split(".")[0]}`;
    const fileName = `${userId}-${Date.now()}`;

    const cloudinaryResult = await uploadToCloudinary(file.buffer, "hackathon_materials", fileName);

    // const result = await cloudinary.uploader.upload_stream({
    //   resource_type: "auto",
    //   folder: "hackathon_materials",
    //   public_id: `${userId}-${Date.now()}-${file.originalname.split(".")[0]}`, // Nama file unik
    // });

    // const base64FileData = file.buffer.toString("base64");

    const statusEnum = ["belum_dimulai", "sedang_belajar", "dikuasai"];

    const materialRecord = {
      uploadedBy: userId,
      title: title || file.originalname,
      subject: subject,
      summary: summary.summary,
      fullContent: summary.originalText,
      fileUrl: cloudinaryResult.secure_url,
      filePublicId: cloudinaryResult.public_id,
      fileType: file.mimetype,
      status: statusEnum[0],
      topics: [],
      topicCount: 0,
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
