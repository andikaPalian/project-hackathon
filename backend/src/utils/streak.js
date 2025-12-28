import { db } from "../config/firebase.js";

export const updateStreak = async (userId) => {
  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();

  if (!userDoc.exists) return 0;

  const userData = userDoc.data();
  const today = new Date().toISOString().split("T")[0];
  const lastActivity = userData.lastActivityDate;

  if (lastActivity === today) {
    return userData.streakCount || 0;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  let newStreak = 1;

  if (lastActivity === yesterdayStr) {
    newStreak = (userData.streakCount || 0) + 1;
  } else {
    newStreak = 1;
  }

  await userRef.update({
    streakCount: newStreak,
    lastActivityDate: today,
    updatedAt: new Date(),
  });

  return newStreak;
};
