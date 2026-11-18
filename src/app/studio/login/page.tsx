import { getSupabasePublicEnv } from "@/lib/supabase/env";
import StudioLoginForm from "./studio-login-form";
export const dynamic = "force-dynamic";
export default function StudioLoginPage() {
  const ready = Boolean(getSupabasePublicEnv());
  return <main className="studio-gate"><div className="studio-panel">
    <p className="eyebrow">Private administration</p>
    <h1>Content Studio sign in</h1>
    <p>Invitation-only access. No public registration is available.</p>
    {ready ? <StudioLoginForm /> : <p role="status">Authentication is not configured. See docs/PHASE-4.md.</p>}
  </div></main>;
}
