import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getStudioAccess } from "@/lib/studio/access";
import { studioDb } from "@/lib/studio/data";
import { signOutStudio } from "./actions";
import { createContent } from "./content-actions";
export const dynamic = "force-dynamic";
export default async function StudioPage() {
 const access = await getStudioAccess();
 if (access.kind === "unconfigured") notFound();
 if (access.kind === "anonymous") redirect("/studio/login");
 if (access.kind === "denied") return <main className="studio-gate"><div className="studio-panel"><h1>Access not authorized</h1><form action={signOutStudio}><button>Sign out</button></form></div></main>;
 const ctx = await studioDb();
 const result = await ctx!.db.from("studio_content_items").select("id,slug,content_type,created_at").order("created_at", {ascending:false}).limit(40);
 return <main className="studio-workspace"><header className="studio-top"><div><p className="eyebrow">Private Content Studio</p><h1>Overview</h1><p>{access.email} · {access.role}</p></div><form action={signOutStudio}><button>Sign out</button></form></header>
 <section className="studio-card"><h2>Create content</h2><p>Create a private project or service. Publishing is disabled.</p><form action={createContent} className="studio-create"><label>World<select name="type" required><option value="engineering">Engineering project</option><option value="graphics">Graphics design project</option><option value="visibility">Business visibility service</option></select></label><label>URL slug<input name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={80} placeholder="sample-project" /></label><button type="submit">Create draft</button></form></section>
 <section className="studio-card"><h2>Existing content</h2>{result.error?<p role="alert">Unable to load content. Confirm the Phase 3 migration is applied.</p>:result.data?.length?<ul className="studio-items">{result.data.map(item=><li key={item.id}><Link href={`/studio/items/${item.id}`}>{item.slug}</Link><small>{item.content_type}</small></li>)}</ul>:<p>No items yet. Create a draft above.</p>}</section>
 </main>;
}
