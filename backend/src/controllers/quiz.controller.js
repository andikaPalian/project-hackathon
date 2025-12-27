import { db } from "../config/firebase.js";

export const getUserQuizzesController = async (req, res) => {
  try {
    const userId = req.user.userId;

    const snapshot = await db
      .collection("quizzes")
      .where("generatedBy", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    const quizzes = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.topic || "Kuis Tanpa Judul",
        difficulty: data.difficulty,
        questions: data.questions,
        score: data.lastScore, // Ambil skor terakhir
        completedAt: data.createdAt?.toDate().toLocaleDateString("id-ID"),
      };
    });

    return res.status(200).json({
      success: true,
      data: quizzes,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getQuizByIdController = async (req, res) => {
  try {
    const { quizId } = req.params;

    const doc = await db.collection("quizzes").doc(quizId).get();

    if (!doc.exists) return res.status(404).send("Quiz not found");

    res.json({ success: true, data: doc.data() });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateQuizScoreController = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { score } = req.body;

    if (score === undefined) {
      return res.status(400).json({
        success: false,
        message: "Score is required",
      });
    }

    await db.collection("quizzes").doc(quizId).update({
      lastScore: score,
      updatedAt: new Date(),
      status: "selesai",
    });

    return res.status(200).json({
      success: true,
      message: "Skor berhasil disimpan!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
