import { db } from "../config/firebase.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AppError } from "../utils/errorHandler.js";

// Note: Perbaiki Querynya agar cepat
export const register = async (username, email, password) => {
  try {
    const user = await db.collection("users").where("email", "==", email).limit(1).get();
    if (!user.empty) throw new AppError("Email already exists", 400);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create New User
    const newUser = await db.collection("users").add({
      username,
      email,
      password: hashedPassword,
      profilePic: "",
      createdAt: new Date(),
    });

    const userDoc = await db.collection("users").doc(newUser.id).get();
    const userData = userDoc.data();

    return userData;
  } catch (error) {
    // Handle the error
    console.error("Error registering user: ", error);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const user = await db.collection("users").where("email", "==", email).get();
    if (user.empty) throw new AppError("User not found", 404);

    const userDoc = user.docs[0];
    const userData = userDoc.data();

    // Compare password
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) throw new AppError("Invalid password", 401);

    // Generate JWT token
    const token = jwt.sign(
      {
        id: userDoc.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return token;
  } catch (error) {
    // Handle the error
    console.error("Error login user: ", error);
    throw error;
  }
};
