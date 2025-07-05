import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { env } from "@/config/env";
import { createUser, findByEmail } from "@/models/user.model";

export async function register(req: Request, res: Response) {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });

  if (await findByEmail(email))
    return res.status(409).json({ message: "อีเมลนี้ถูกใช้แล้ว" });

  await createUser(username, email, password);
  res.status(201).json({ message: "สมัครสมาชิกสำเร็จ" });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await findByEmail(email);
  if (!user)
    return res.status(400).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok)
    return res.status(400).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
  const token = jwt.sign(
    { id: user.id, email: user.email },
    env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );
  res.json({ token });
}
