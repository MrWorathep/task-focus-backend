import { Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env";

const supabase = createClient(env.SUPABASE_URL!, env.SUPABASE_ANON_KEY!);

export async function register(req: Request, res: Response) {
  const { email, password, username } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "กรุณากรอกข้อมูลให้ครบถ้วน",
    });
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  });

  if (error || !data?.user) {
    return res
      .status(400)
      .json({ message: error?.message || "สมัครไม่สำเร็จ" });
  }

  res.status(201).json({
    message: "สมัครสมาชิกสำเร็จ",
    data: {
      user: {
        id: data.user.id,
        email: data.user.email,
        username: data.user.user_metadata?.username,
      },
    },
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data?.user) {
    return res
      .status(401)
      .json({ message: error?.message || "เข้าสู่ระบบไม่สำเร็จ" });
  }

  res.json({
    message: "เข้าสู่ระบบสำเร็จ",
    data: {
      user: {
        id: data.user.id,
        email: data.user.email,
        username: data.user.user_metadata?.username,
      },
    },
  });
}
