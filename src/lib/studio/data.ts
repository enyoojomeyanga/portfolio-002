import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv } from "@/lib/supabase/env";
import { getStudioAccess } from "@/lib/studio/access";

export type ContentType = "engineering" | "graphics" | "visibility";
export type DraftContent = { title: string; summary: string; body: string };
export function validType(x: string): x is ContentType { return ["engineering", "graphics", "visibility"].includes(x); }
export function validSlug(x: string): boolean { return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(x) && x.length <= 80; }
export function validateDraft(c: DraftContent) {
  return c.title.length <= 140 && c.summary.length <= 1200 && c.body.length <= 30000;
}
export async function studioDb() {
  const access = await getStudioAccess();
  if (access.kind !== "authorized") return null;
  const env = getSupabasePublicEnv();
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!env || !secret) return null;
  return { access, db: createClient(env.url, secret, { auth: { persistSession: false, autoRefreshToken: false } }) };
}
