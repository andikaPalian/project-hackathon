import express from "express";
import { loginController, registerController } from "../controllers/auth.controller.js";
import { validateBody } from "../middlewares/zodValidator.js";
import { loginSchema, registerSchema } from "../validator/authValidator.js";

export const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), registerController);
authRouter.post("/login", validateBody(loginSchema), loginController);
