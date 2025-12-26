import express from "express";
import { loginController, registerController } from "../controllers/auth.controller.js";
import { validateBody } from "../middlewares/zodValidator.js";
import { loginSchema, registerSchema } from "../validator/authValidator.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { onboardingSchema } from "../validator/onboardingValidator.js";
import { onboardingUserController } from "../controllers/onboarding.controller.js";

export const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), registerController);
authRouter.post("/login", validateBody(loginSchema), loginController);
authRouter.post(
  "/onboarding",
  verifyToken,
  validateBody(onboardingSchema),
  onboardingUserController
);
