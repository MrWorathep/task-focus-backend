import { Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env";
import { createUser } from "../models/user.model";

const supabase = createClient(env.SUPABASE_URL!, env.SUPABASE_ANON_KEY!);

export async function register(req: Request, res: Response) {
  const { email, password, username } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "กรุณากรอกข้อมูลให้ครบถ้วน",
    });
  }

  const { data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  });

  if (data?.user?.id) {
    await createUser(username, email, data.user.id);

    setTimeout(async () => {
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", data.user!.id);

      if (error) {
        console.error("ลบผู้ใช้ไม่สำเร็จหลัง 5 นาที:", error.message);
      } else {
        console.log(`✅ ลบผู้ใช้ ${data.user!.id} สำเร็จ`);
      }
    }, 5 * 60 * 1000);
  }

  res.status(201).json({
    message: "สมัครสมาชิกสำเร็จ",
    data: {
      user: {
        email: email,
        username: username,
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
