import "server-only";
import { createClient } from "@supabase/supabase-js";
import { createStudioAuthClient } from "../supabase/server";
import { getSupabasePublicEnv } from "../supabase/env";
export type StudioRole = "owner" | "editor";
export type StudioAccess =
  | { kind: "unconfigured" }
  | { kind: "anonymous" }
  | { kind: "denied" }
  | { kind: "authorized"; userId: string; role: StudioRole; email: string | undefined };

/** Never authorize from a browser-provided role or stale JWT role claim. */
export async function getStudioAccess(): Promise<StudioAccess> {
  const env = getSupabasePublicEnv();
  const serverKey = process.env.SUPABASE_SECRET_KEY;
  if (!env || !serverKey) return { kind: "unconfigured" };
  const client = await createStudioAuthClient();
  if (!client) return { kind: "unconfigured" };
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) return { kind: "anonymous" };
  // Service key is server-only; restrict use to one read of one exact membership.
  // This is defense-in-depth with current DB membership, not a substitute for RLS.
  const admin = createClient(env.url, serverKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error: membershipError } = await admin.from("studio_administrators")
    .select("role,status").eq("user_id", user.id).maybeSingle();
  if (membershipError || data?.status !== "active" || (data.role !== "owner" && data.role !== "editor")) return { kind: "denied" };
  return { kind: "authorized", userId: user.id, email: user.email, role: data.role };
}
