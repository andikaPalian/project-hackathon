import { db } from "../config/firebase.js";
import { uploadToCloudinary } from "../helper/uploadFile.js";
import { createUser, getUserProfile } from "../services/auth.service.js";
import admin from "../config/firebase.js";

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

export const updateProfileController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, learningStyle } = req.body;
    const profilePicture = req.file;

    let profilePicUrl;

    const fileName = `${userId}-${Date.now()}`;

    if (profilePicture) {
      const result = await uploadToCloudinary(
        profilePicture.buffer,
        "profilePictures",
        fileName,
        true
      );

      profilePicUrl = result.secure_url;
    }

    const updateData = {
      name,
      learningStyle,
      profilePicture: profilePicUrl,
      updatedAt: new Date().toISOString(),
    };

    await db.collection("users").doc(userId).update(updateData);

    return res.status(200).json({
      success: true,
      data: updateData,
    });
  } catch (error) {
    return res.status(500).json({});
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

export const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name, picture } = decodedToken;

    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    let userData;

    if (!userDoc.exists) {
      userData = {
        id: uid,
        email: email,
        name: name || "User Google",
        avatar: picture || "",
        major: "",
        learningStyle: "",
        onboardingCompleted: false,
        createdAt: new Date().toISOString(),
        streak: 0,
        totalMastery: 0,
      };
      await userRef.set(userData);
    } else {
      userData = userDoc.data();
    }

    res.status(200).json({
      status: "success",
      message: "Google login successful",
      user: userData,
    });
  } catch (error) {
    console.error("🚨 Error Google Verify:", error.message);
    res.status(401).json({
      status: "error",
      message: "Invalid or expired Google token",
    });
  }
};
