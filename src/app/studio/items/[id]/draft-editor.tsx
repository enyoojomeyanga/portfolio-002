"use client";
import { useActionState, useState } from "react";
import { saveDraft, type EditState } from "../../content-actions";
const initial:EditState={status:"idle",message:"No changes have been saved in this session."};
export function DraftEditor({itemId,revision,content}:{itemId:string;revision:number;content:{title:string;summary:string;body:string}}){
 const [state,action,pending]=useActionState(saveDraft,initial);
 const [fields,setFields]=useState(content);
 const [dirty,setDirty]=useState(false);
 function edit(k:keyof typeof content,v:string){setFields(p=>({...p,[k]:v}));setDirty(true)}
 return <div className="studio-columns"><section className="studio-card"><h2>Editor</h2><form action={action} className="studio-edit"><input type="hidden" name="itemId" value={itemId}/><input type="hidden" name="revision" value={revision}/><label>Title<input name="title" maxLength={140} value={fields.title} onChange={e=>edit("title",e.target.value)}/></label><label>Summary<textarea name="summary" maxLength={1200} rows={4} value={fields.summary} onChange={e=>edit("summary",e.target.value)}/></label><label>Project or service details<textarea name="body" maxLength={30000} rows={12} value={fields.body} onChange={e=>edit("body",e.target.value)}/></label><button disabled={pending} type="submit">{pending?"Saving…":"Save Draft"}</button><p role="status">{state.status==="ok"?"Server-confirmed: ":dirty?"Unsaved edits may exist. ":""}{state.message}</p></form></section><aside className="studio-card"><h2>Private preview</h2><p className="eyebrow">Current editor fields · Not public</p><h3>{fields.title||"[Project title]"}</h3><p>{fields.summary||"[Summary]"}</p><p style={{whiteSpace:"pre-wrap"}}>{fields.body||"[Details]"}</p><small>Preview is illustrative and is not the approved public layout. No draft data is sent to a public route.</small></aside></div>
}
