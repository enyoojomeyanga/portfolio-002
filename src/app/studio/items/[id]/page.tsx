import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { studioDb } from "@/lib/studio/data";
import { DraftEditor } from "./draft-editor";
export const dynamic = "force-dynamic";
export default async function ItemEditor({params}:{params:Promise<{id:string}>}) {
 const {id}=await params;
 if(!/^[0-9a-f-]{36}$/i.test(id)) notFound();
 const ctx=await studioDb(); if(!ctx) redirect("/studio/login");
 const [item,draft]=await Promise.all([ctx.db.from("studio_content_items").select("id,slug,content_type").eq("id",id).maybeSingle(),ctx.db.from("studio_content_drafts").select("revision,content,saved_at").eq("item_id",id).maybeSingle()]);
 if(item.error||draft.error||!item.data||!draft.data) notFound();
 const value=draft.data.content as {title?:unknown;summary?:unknown;body?:unknown};
 const content={title:typeof value?.title==="string"?value.title:"",summary:typeof value?.summary==="string"?value.summary:"",body:typeof value?.body==="string"?value.body:""};
 return <main className="studio-workspace"><p><Link href="/studio">← Overview</Link></p><p className="eyebrow">{item.data.content_type} · Private draft</p><h1>{item.data.slug}</h1><p>Manual save · Version {draft.data.revision} · No publishing in Phase 5</p><DraftEditor key={`${id}:${draft.data.revision}`} itemId={id} revision={draft.data.revision} content={content}/></main>;
}
