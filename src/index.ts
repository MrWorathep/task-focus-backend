import express from "express";
import cors from "cors";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/taskfocus/auth", authRoutes);

app.listen(env.PORT, () => {
  console.log("🚀 API Start: http://localhost:" + env.PORT);
});
