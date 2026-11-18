"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createStudioBrowserClient } from "@/lib/supabase/browser";
export default function StudioLoginForm() {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [busy,setBusy] = useState(false);
  const [message,setMessage] = useState("");
  const router = useRouter();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();setBusy(true);setMessage("");
    try {
      const client = createStudioBrowserClient();
      if (!client) throw new Error("Authentication unavailable");
      const { error } = await client.auth.signInWithPassword({ email, password });
      if (error) { setMessage("Sign-in failed. Check your credentials or contact an Owner."); return; }
      router.replace("/studio");router.refresh();
    } catch { setMessage("Unable to sign in at this time."); }
    finally { setBusy(false);setPassword(""); }
  }
  return <form onSubmit={submit} className="studio-form">
    <label htmlFor="studio-email">Email</label>
    <input id="studio-email" type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)} />
    <label htmlFor="studio-password">Password</label>
    <input id="studio-password" type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} />
    <button disabled={busy} type="submit">{busy?"Checking…":"Sign in"}</button>
    <p role="status" aria-live="polite">{message}</p>
  </form>;
}
