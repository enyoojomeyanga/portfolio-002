import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read=p=>readFileSync(new URL(`../${p}`, import.meta.url),"utf8");
test("draft update uses compare-and-swap revision",()=>{const s=read("src/app/studio/content-actions.ts");assert.match(s,/\.eq\("revision",rev\)/);assert.match(s,/\.eq\("item_id",itemId\)/)});
test("every write independently checks studio authorization",()=>{const s=read("src/app/studio/content-actions.ts");assert.equal((s.match(/await studioDb\(\)/g)||[]).length,2)});
test("draft editor does not publish",()=>{const s=read("src/app/studio/items/[id]/draft-editor.tsx");assert.doesNotMatch(s,/publishDraft|publishRevision/)});
test("private routes use dynamic data",()=>{assert.match(read("src/app/studio/items/[id]/page.tsx"),/force-dynamic/)});
