"use server";
import { redirect } from "next/navigation";
import { createStudioAuthClient } from "@/lib/supabase/server";
export async function signOutStudio() {
  const client = await createStudioAuthClient();
  if (client) await client.auth.signOut();
  redirect("/studio/login");
}
