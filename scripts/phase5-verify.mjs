import { spawnSync } from "node:child_process";
const p=spawnSync(process.execPath,["--test","tests/phase5.test.mjs"],{stdio:"inherit"});process.exit(p.status??1);
