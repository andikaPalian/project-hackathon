import { onboardingUser } from "../services/onboarding.service.js";

export const onboardingUserController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { major, subjects, learningStyle, goal } = req.body;

    const onboardingData = {
      major: major,
      subjects: subjects,
      learningStyle: learningStyle,
      goals: goal || [],
    };

    await onboardingUser(userId, onboardingData);

    return res.status(200).json({
      success: true,
      data: onboardingData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
