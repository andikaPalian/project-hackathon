import express from "express";
import {
  getMeController,
  googleLogin,
  loginController,
  registerController,
  updateProfileController,
} from "../controllers/auth.controller.js";
import { validateBody } from "../middlewares/zodValidator.js";
// import { loginSchema, registerSchema } from "../validator/authValidator.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { onboardingSchema } from "../validator/onboardingValidator.js";
import { onboardingUserController } from "../controllers/onboarding.controller.js";
import { uploadImage } from "../middlewares/uploadImage.js";

export const authRouter = express.Router();

// authRouter.post("/register", validateBody(registerSchema), registerController);
// authRouter.post("/login", validateBody(loginSchema), loginController);
authRouter.post("/register", registerController);
authRouter.post("/login", verifyToken, loginController);
authRouter.get("/me", verifyToken, getMeController);
authRouter.post(
  "/onboarding",
  verifyToken,
  validateBody(onboardingSchema),
  onboardingUserController
);
authRouter.patch("/profile", verifyToken, uploadImage, updateProfileController);
authRouter.post("/google", googleLogin);
