import { db } from "../config/firebase.js";
import admin from "../config/firebase.js";
import { AppError } from "../utils/errorHandler.js";
import axios from "axios";

// Note: Perbaiki Querynya agar cepat
// export const register = async (username, email, password) => {
//   try {
//     const userRecord = await admin.auth().createUser({
//       email: email,
//       username: username,
//       password: password,
//     });

//     const userProfile = {
//       username: username,
//       email: email,
//       profilePic: "",
//       createdAt: admin.firestore.FieldValue.serverTimestamp(),
//     };

//     await db.collection("users").doc(userRecord.uid).set(userProfile);

//     return {
//       id: userRecord.uid,
//       ...userProfile,
//     };
//   } catch (error) {
//     if (error.code === "auth/email-already-exists") {
//       throw new AppError("Email already in use", 400);
//     }
//     ("Error registering user: ", error);
//     throw error;
//   }
// };

export const createUser = async (uid, userData) => {
  try {
    const userDoc = await db.collection("users").doc(uid).get();

    if (userDoc.exists) {
      throw new AppError("User already exists", 400);
    }

    await db.collection("users").doc(uid).set({
      uid: uid,
      email: userData.email,
      name: userData.name,
      role: "user",
      onboardingCompleted: false,
      major: "",
      subjects: [],
      learningStyle: "",
      goal: [],
      streakCount: 0,
      lastActivityDate: null,
      totalPoints: 0,
      createdAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      return null;
    }

    return userDoc.data();
  } catch (error) {
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const apikey = process.env.FIREBASE_API_KEY;

    if (!apikey) {
      throw new AppError("Firebase API key is not configured", 500);
    }

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apikey}`;

    const response = await axios.post(url, {
      email: email,
      password: password,
      returnSecureToken: true,
    });

    const { idToken, localId } = response.data;

    return {
      token: idToken,
      userId: localId,
    };
  } catch (error) {
    // Handle the error
    throw error;
  }
};
