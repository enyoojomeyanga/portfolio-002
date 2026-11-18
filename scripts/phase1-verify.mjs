#!/usr/bin/env node
/** One-command Phase 1 integration checks. Explicitly does not deploy or modify services. */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
const commands=[['Foundation tests','npm',['run','test:foundation']],['Project source preflight','npm',['run','cf:preflight']],['TypeScript','npm',['run','typecheck']]];
const hasAdapter=existsSync('vite.config.ts') || existsSync('vite.config.mts');
if(hasAdapter) commands.push(['Cloudflare build','npm',['run','build:vinext']]);
else commands.push(['Next.js build','npm',['run','build']]);
let failed=false;
for(const [name,cmd,args] of commands){
 console.log(`\n=== ${name} ===`);
 const x=spawnSync(cmd,args,{stdio:'inherit',shell:false});
 if(x.error || x.status!==0){failed=true;console.error(`FAILED: ${name}`);break;}
}
if(!hasAdapter) console.warn('\nNOT VERIFIED: Cloudflare adapter is not initialized. Run npm run phase1:setup-cloudflare when ready.');
console.log(failed?'\nPHASE 1 CHECKS FAILED':'\nPHASE 1 LOCAL CHECKS PASSED. Route smoke checks require a running server; no cloud deployment has been tested.');
process.exit(failed?1:0);
