#!/usr/bin/env node
/** Optional, explicit user-invoked Cloudflare initializer. Does not deploy or access cloud accounts. */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
const fail=(m)=>{console.error(`ERROR: ${m}`);process.exit(1)};
if (!existsSync('package.json')) fail('Run from project root');
const pkg=JSON.parse(readFileSync('package.json','utf8'));
if(pkg.name!=='three-worlds-foundation') fail('Unexpected project');
if(existsSync('vite.config.ts') || existsSync('vite.config.mts')){
 console.log('vinext config already present; not running initialization again.'); process.exit(0);
}
console.log('Configuring official vinext Cloudflare adapter. This installs packages and updates project configuration. It does NOT deploy.');
for(const args of [['vinext@latest','check'],['vinext@latest','init','--platform=cloudflare']]){
 console.log(`\n> npx ${args.join(' ')}`);
 const result=spawnSync('npx',['--yes',...args],{stdio:'inherit',shell:false});
 if(result.error || result.status!==0) fail(`npx ${args[0]} ${args[1]} exited unsuccessfully. Resolve findings before proceeding.`);
}
console.log('\nAdapter setup finished. Review git diff and run npm run phase1:verify.');
