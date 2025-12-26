import { createUser, getUserProfile } from "../services/auth.service.js";

// export const registerController = async (req, res, next) => {
//   try {
//     const { username, email, password } = req.body;

//     const newUser = await register(username, email, password);

//     return res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       data: newUser,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const registerController = async (req, res) => {
  try {
    const { uid, name, email, password } = req.body;

    if (!uid || !name || !email) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    await createUser(uid, { name, email });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const userId = req.user.userId;

    const userData = await getUserProfile(userId);

    return res.status(200).json({
      success: true,
      data: {
        username: userData.username,
        email: userData.email,
        onboardingCompleted: userData.onboardingCompleted,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};

export const getMeController = async (req, res) => {
  try {
    const userId = req.user.userId;

    const userData = await getUserProfile(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        ...userData,
        userId: userId,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// export const loginController = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     const result = await login(email, password);

//     return res.status(200).json({
//       success: true,
//       message: "User logged in successfully",
//       data: {
//         token: result.token,
//         userId: result.userId,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };
