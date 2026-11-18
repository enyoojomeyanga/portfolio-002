"use client";
import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicEnv } from "./env";
export function createStudioBrowserClient() {
  const env = getSupabasePublicEnv();
  return env ? createBrowserClient(env.url, env.key) : null;
}
