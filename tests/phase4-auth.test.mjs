import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('Studio uses verified identity and current membership',()=>{
 const s=read('src/lib/studio/access.ts');
 assert.match(s,/auth\.getUser\(/);assert.match(s,/studio_administrators/);assert.match(s,/status.*active/);
});
test('Private route is dynamic and denies unconfigured installs',()=>{
 const s=read('src/app/studio/page.tsx');
 assert.match(s,/force-dynamic/);assert.match(s,/notFound\(\)/);
});
test('No client-side secret, no public registration',()=>{
 const s=read('src/app/studio/login/studio-login-form.tsx');
 assert.doesNotMatch(s,/SUPABASE_SECRET_KEY|signUp/);
});
test('Proxy limits session handling to private routes and disables caching',()=>{
 const s=read('src/proxy.ts');
 assert.match(s,/\/studio\/:path\*/);assert.match(s,/private, no-store/);
});
test('No privileges to publish are exposed in phase 4',()=>{
 const s=read('src/app/studio/page.tsx');
 assert.doesNotMatch(s,/from\("studio_published_versions"\)|\.insert\(/);
});
