import { db } from "../config/firebase.js";

export const onboardingUser = async (userId, onboardingData) => {
  try {
    await db
      .collection("users")
      .doc(userId)
      .set(
        {
          ...onboardingData,
          onboardingCompleted: true,
          updatedAt: new Date(),
        },
        { merge: true }
      );

    return { success: true };
  } catch (error) {
    console.error("Onboarding error: ", error);
    throw new Error("Gagal melakukan onboarding. Silakan coba lagi.");
  }
};
