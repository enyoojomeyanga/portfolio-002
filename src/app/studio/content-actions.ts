"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { studioDb, validSlug, validType, validateDraft } from "@/lib/studio/data";

export type EditState = { message: string; status: "idle" | "ok" | "error" | "conflict" };
export async function createContent(form: FormData) {
  const ctx = await studioDb();
  if (!ctx) redirect("/studio/login");
  const content_type = String(form.get("type") ?? "");
  const slug = String(form.get("slug") ?? "").trim();
  if (!validType(content_type) || !validSlug(slug)) redirect("/studio?error=invalid");
  const { data, error } = await ctx.db.from("studio_content_items")
    .insert({ content_type, slug, created_by: ctx.access.userId }).select("id").single();
  if (error || !data) redirect("/studio?error=create");
  const { error: draftError } = await ctx.db.from("studio_content_drafts").insert({ item_id: data.id, revision: 1, content: { title: "", summary: "", body: "" }, saved_by: ctx.access.userId });
  if (draftError) {
    // A partially initialized item is never offered for editing. Admin recovery can inspect it.
    redirect("/studio?error=draft-init");
  }
  revalidatePath("/studio");
  redirect(`/studio/items/${data.id}`);
}

export async function saveDraft(_previous: EditState, form: FormData): Promise<EditState> {
  const ctx = await studioDb();
  if (!ctx) return { status: "error", message: "Not authorized. Sign in again; edits were not saved." };
  const itemId = String(form.get("itemId") ?? "");
  const rev = Number(form.get("revision"));
  if (!/^[0-9a-f-]{36}$/i.test(itemId) || !Number.isSafeInteger(rev) || rev < 1) return { status: "error", message: "Invalid revision." };
  const content = {title:String(form.get("title")??"").trim(), summary:String(form.get("summary")??"").trim(), body:String(form.get("body")??"").trim()};
  if (!validateDraft(content)) return {status:"error",message:"Field exceeds allowed length; nothing was saved."};
  const { data, error } = await ctx.db.from("studio_content_drafts")
    .update({content, revision:rev+1, saved_by:ctx.access.userId, saved_at:new Date().toISOString()})
    .eq("item_id",itemId).eq("revision",rev).select("revision").maybeSingle();
  if (error) return {status:"error",message:"Save not confirmed; your edits are still in the form."};
  if (!data) return {status:"conflict",message:"A newer draft revision exists. Copy your edits before reloading; nothing was overwritten."};
  revalidatePath(`/studio/items/${itemId}`);
  return {status:"ok",message:`Saved as revision ${data.revision}. Reload before another save to use the new revision.`};
}
