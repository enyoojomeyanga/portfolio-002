# Three Worlds · Phase 1 consolidated foundation

Separate client project. `[CLIENT NAME]` and all example content remain placeholders. Approved Three Worlds and Content Studio design specifications remain authoritative. This is a foundation shell, not the completed portfolio or CMS.

## Requirements (Ubuntu)
- Node.js 22+ and npm; Git and unzip; VS Code optional.
- No Supabase, Cloudflare, domain, API keys, or payments are required for local Phase 1.

```bash
sudo apt update && sudo apt install -y git unzip curl ca-certificates
node -v && npm -v
```
If Node is missing, install nvm per https://github.com/nvm-sh/nvm and run `nvm install 22 && nvm use 22`.

## Fresh install
```bash
cd ~/Downloads
unzip three-worlds-phase1-full.zip -d three-worlds-phase1-unpack
cd three-worlds-phase1-unpack/three-worlds-phase1-complete
npm install
npm run phase1:setup-cloudflare    # only once; configures vinext, does not deploy
npm run phase1:verify              # single consolidated check
npm run dev:vinext                 # terminal 1; use actual address printed
```
Terminal 2:
```bash
npm run test:routes -- http://localhost:3000
```
If vinext has not been initialized, `npm run dev` runs the ordinary Next.js development server.

## Updating an existing v0.1/v0.2/v0.3 project
Use **three-worlds-phase1-update.zip** and see `docs/PHASE-1-COMPLETE.md`. Back up first. Only copy the listed control/documentation files, not old page source or generated adapter configurations. This preserves local edits.

## Check/build commands
- `npm run phase1:verify`: existing foundation tests, preflight, TypeScript, and one relevant build.
- `npm run test:routes -- http://localhost:3000`: read-only HTTP route smoke test. Requires a running development server.
- `npm run dev`: original Next.js local development.
- `npm run dev:vinext`: Cloudflare-compatible development **after adapter init**.
- `npm run build:vinext`: production adapter build **after adapter init**.
- `npm run start`: original Next.js production server **after `npm run build`**.

## Boundaries
- `/studio` intentionally responds with 404 until secure admin authentication and authorization exist.
- No secrets belong in Git. `.env.example` may document safe keys; real `.env*` files are gitignored.
- No published client claims, clients, testimonials or outcomes are real.
- No cloud deployment, authentication, CMS, storage or DB exists as part of this starter.

## Test gate and rollback
See [Phase 1 consolidated handoff](docs/PHASE-1-COMPLETE.md). Keep a Git checkpoint/backup before adapter init. If configuration causes failure, restore the checkpoint and report the exact error; don't overwrite functioning app files with older ZIP content.

## Phase 3 schema foundation
See [Phase 3 install, safe verification and rollout notes](docs/PHASE-3.md). No database has been created by this package.


## Phase 4 authentication foundation

See `docs/PHASE-4.md` for safe update steps, dependencies, test commands, development-only Supabase setup, and security limitations. **Not production-ready.**
