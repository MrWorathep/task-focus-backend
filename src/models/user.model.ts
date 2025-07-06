import { supabase } from "../db/pool";

export interface UserRow {
  id: string;
  email: string;
  username?: string;
  created_at?: string;
}

export async function findByEmail(email: string): Promise<UserRow | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email)
    .single();

  if (error) return null;
  return data;
}

export async function createUser(
  username: string,
  email: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from("profiles")
    .insert([{ username, email }])
    .select("id")
    .single();

  if (error) {
    console.error("createUser error:", error.message);
    return null;
  }

  return data.id;
}
