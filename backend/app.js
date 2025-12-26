import express from "express";
import cors from "cors";
import "dotenv/config";
import helmet from "helmet";
import morgan from "morgan";
import { authRouter } from "./src/routes/auth.routes.js";
import { geminiRouter } from "./src/routes/gemini.routes.js";
import { connectCloudinary } from "./src/config/cloudinary.js";

const app = express();
const port = process.env.PORT || 3000;
connectCloudinary();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use("/api/", geminiRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
