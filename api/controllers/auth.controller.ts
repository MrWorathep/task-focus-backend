import { Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env";
import { createUser } from "../models/user.model";

const supabase = createClient(env.SUPABASE_URL!, env.SUPABASE_ANON_KEY!);
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
    options: { data: { username } },
  });

  if (error || !data?.user?.id) {
    let errorMessage = "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
    switch (error?.code) {
      case "user_already_exists":
        errorMessage = "อีเมลนี้ถูกใช้ไปแล้ว";
        break;
      case "validation_failed":
        errorMessage = "รูปแบบอีเมลไม่ถูกต้อง";
        break;
      case "weak_password":
        errorMessage = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
        break;
    }
    return res.status(400).json({
      message: "ไม่สามารถสมัครสมาชิกได้",
      details: errorMessage,
    });
  }

  await createUser(username, email, data.user.id);

  // const userId = data.user.id;
  // setTimeout(async () => {
  //   try {
  //     await supabaseAdmin.auth.admin.deleteUser(userId);
  //     console.log(`ลบผู้ใช้ ${userId} ออกจากระบบ Auth แล้ว`);
  //   } catch (err: unknown) {
  //     console.error("ลบผู้ใช้ไม่สำเร็จ:", (err as Error).message);
  //   }
  // }, 15 * 60 * 1000);

  return res.status(201).json({
    message: "สมัครสมาชิกสำเร็จ",
    data: {
      user: {
        email,
        username,
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
      session: {
        access_token: data.session?.access_token,
      },
    },
  });
}
