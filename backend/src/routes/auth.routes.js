import express from "express";
import { loginController, registerController } from "../controllers/auth.controller.js";

export const authRouter = express.Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
