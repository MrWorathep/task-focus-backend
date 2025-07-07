import { supabase } from "../db/pool";

export interface UserRow {
  id: string;
  email: string;
  username: string;
  created_at: string;
}

export async function findByEmail(email: string): Promise<UserRow | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, username, created_at")
    .eq("email", email)
    .single();

  if (error) {
    console.error("findByEmail error:", error.message);
    return null;
  }

  return data;
}

export async function createUser(
  username: string,
  email: string
): Promise<string | null> {
  const existing = await findByEmail(email);
  if (existing) {
    console.warn("createUser: email ซ้ำ");
    return null;
  }

  const { data, error } = await supabase
    .from("users")
    .insert([{ username, email, created_at: new Date().toISOString() }])
    .select("id")
    .single();

  if (error) {
    console.error("createUser error:", error.message);
    return null;
  }

  return data.id;
}

export async function findById(id: string): Promise<UserRow | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, username, created_at")
    .eq("id", id)
    .single();

  if (error) {
    console.error("findById error:", error.message);
    return null;
  }

  return data;
}
