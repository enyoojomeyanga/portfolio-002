import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getSupabasePublicEnv } from "./env";

export async function createStudioAuthClient() {
  const env = getSupabasePublicEnv();
  if (!env) return null;
  const jar = await cookies();
  return createServerClient(env.url, env.key, {
    cookies: {
      getAll() { return jar.getAll(); },
      setAll(changes) {
        try { changes.forEach(({ name, value, options }) => jar.set(name, value, options)); }
        catch { /* Server Component: proxy handles session refresh. */ }
      },
    },
  });
}
