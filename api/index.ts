import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import { VercelRequest, VercelResponse } from "@vercel/node";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/taskfocus/auth", authRoutes);

export default (req: VercelRequest, res: VercelResponse) => {
  app(req, res);
};
