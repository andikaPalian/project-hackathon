import { db } from "../config/firebase.js";

export const getUserQuizzesController = async (req, res) => {
  try {
    const userId = req.user.userId;

    const snapshot = await db
      .collection("quizzes")
      .where("generatedBy", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    const quizzes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

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
