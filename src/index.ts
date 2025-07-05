import express from "express";
import cors from "cors";
import { env } from "@/config/env";
import { pool } from "@/db/pool";
import authRoutes from "@/routes/auth.routes";

async function createTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use("/taskfocus/auth", authRoutes);
  app.listen(env.PORT, () =>
    console.log("API Start http://localhost:" + env.PORT)
  );
}

createTable().catch((err) => {
  console.error("Startup error", err);
  process.exit(1);
});
