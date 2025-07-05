import { pool } from "@/db/pool";
import bcrypt from "bcryptjs";

export interface UserRow {
  id: number;
  username: string;
  email: string;
  password_hash: string;
}

export async function findByEmail(email: string) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return (rows as UserRow[])[0] || null;
}

export async function createUser(
  username: string,
  email: string,
  password: string
) {
  const hash = await bcrypt.hash(password, 10);

  const [result] = await pool.query(
    "INSERT INTO users(username,email,password_hash) VALUES (?,?,?)",
    [username, email, hash]
  );

  const insertId = (result as any).insertId as number;

  // ตั้งเวลาเพื่อลบผู้ใช้หลังจาก 10 นาที
  setTimeout(async () => {
    try {
      await pool.query(`DELETE FROM users WHERE id = ?`, [insertId]);
    } catch (err) {
      console.error("ลบข้อมูล user ผิดพลาด", err);
    }
  }, 10 * 60 * 1000);

  return insertId;
}
