import { db } from "../config/firebase.js";
import { calculateAverageMastery } from "../helper/calculatMastery.js";

export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    const quizSnapshot = await db
      .collection("quizzes")
      .where("generatedBy", "==", userId)
      .where("status", "==", "selesai")
      .orderBy("updatedAt", "desc")
      .get();

    const materialSnapshot = await db
      .collection("materials")
      .where("uploadedBy", "==", userId)
      .get();

    const topicProgress = materialSnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      mastery: doc.data().lastScore !== undefined ? doc.data().lastScore : 0,
    }));

    const quizHistory = quizSnapshot.docs.slice(0, 5).map((doc) => ({
      id: doc.id,
      ...doc.data(),
      completedAt: doc.data().updatedAt?.toDate().toLocaleDateString("id-ID"),
    }));

    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const today = new Date();
    const activityMap = {};

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      activityMap[days[d.getDay()]] = 0;
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    quizSnapshot.forEach((doc) => {
      const date = doc.data().updatedAt?.toDate();
      if (date >= sevenDaysAgo) {
        const dayName = days[date.getDay()];
        if (activityMap[dayName] !== undefined) activityMap[dayName]++;
      }
    });

    const weeklyActivity = Object.keys(activityMap)
      .reverse()
      .map((day) => ({
        day,
        count: activityMap[day],
        percentage: Math.min((activityMap[day] / 10) * 100, 100),
      }));

    // let totalScore = 0;
    // let materialCount = 0;

    // materialSnapshot.forEach((doc) => {
    //   const data = doc.data();
    //   if (data.lastScore) {
    //     totalScore += data.lastScore;
    //     materialCount++;
    //   }
    // });

    // const averageMatery = materialCount > 0 ? Math.round(totalScore / materialCount) : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalMastery: calculateAverageMastery(topicProgress),
        streak: userData.streakCount || 0,
        quizCompleted: quizSnapshot.size,
        topicProgress,
        quizHistory,
        weeklyActivity,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getWeeklyStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const snapshot = await db
      .collection("quizzes")
      .where("generatedBy", "==", userId)
      .where("updatedAt", ">=", sevenDaysAgo)
      .where("updatedAt", "<=", today)
      .where("status", "==", "selesai")
      .get();

    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const activityMap = {};

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dayName = days[d.getDay()];
      activityMap[dayName] = 0;
    }

    snapshot.forEach((doc) => {
      const data = doc.data();
      const date = data.updatedAt.toDate();
      const dayName = days[date.getDay()];
      // activityMap[dayName]++;
      if (activityMap[dayName] !== undefined) {
        activityMap[dayName] += 1;
      }
    });

    const result = Object.keys(activityMap)
      .reverse()
      .map((day) => ({
        day,
        count: activityMap[day],
        percentage: Math.min((activityMap[day] / 10) * 100, 100),
      }));

    return res.status(200).json({
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
