import { login, register } from "../services/auth.service.js";

export const registerController = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const newUser = await register(username, email, password);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const token = await login(email, password);

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: token,
    });
  } catch (error) {
    next(error);
  }
};
