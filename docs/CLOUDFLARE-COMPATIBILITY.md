# Cloudflare Workers compatibility proof of concept (Phase 1B)

This is an **opt-in migration/test**, not production deployment. The approved Three Worlds site and Content Studio specifications remain unchanged. **No Supabase credentials, real client content or domain needed.** The existing Next.js scripts should remain usable alongside vinext.

## 0. Prerequisites (Ubuntu)

- Node.js 22+ and npm, already used for foundation v0.1.
- `git` (install with `sudo apt update && sudo apt install git -y`).
- An existing working local Three Worlds foundation with all four checks passing.
- Internet access to install npm packages. No Cloudflare account is needed for the preflight and local testing.

```bash
cd ~/Downloads/three-worlds-foundation
node -v
npm -v
git --version
npm run typecheck
npm run test:foundation
npm run build
npm run cf:preflight
```

## 1. Preserve existing work before migration

If Git is already initialized:

```bash
git status
# Review changes before committing.
git add .
git commit -m "Checkpoint before Cloudflare compatibility test"
git switch -c test/cloudflare-vinext
```

If `git status` reports "not a git repository", use `git init`, review `.gitignore`, then `git add . && git commit -m "Foundation checkpoint"` before creating the branch. Or create a separate folder copy instead. Never commit `.env` credentials or `node_modules`.

## 2. First run Cloudflare's non-destructive compatibility scanner

```bash
npx vinext@latest check
```

This downloads and executes the current vinext CLI if it isn't already installed. Read its compatibility output before proceeding. Stop if it identifies a blocker; record the failure instead of treating it as a pass.

## 3. Configure a local vinext target (only if the check passes)

```bash
npx vinext@latest init
```

Choose **Cloudflare Workers** when prompted and review the generated file changes. As documented by Cloudflare, this command installs packages, adds separate `dev:vinext` / `build:vinext` / `start:vinext` scripts, and creates Vite/Cloudflare configuration; existing Next.js commands can continue to work alongside them. Never run any deploy command during this proof of concept.

View generated scripts and configuration:

```bash
npm pkg get scripts
ls -la vite.config.ts cloudflare.config.ts wrangler.jsonc 2>/dev/null || true
```

If the initializer changes files, it is expected. Review them with `git diff` before committing. File names vary with the current CLI version. Avoid manually copying outdated configuration from tutorials.

## 4. Test the two development environments

Terminal A:

```bash
npm run dev
```

Open http://localhost:3000 and verify the homepage, three world routes, `/api/health`, and that `/studio` is inaccessible (404). Stop with Ctrl+C.

Terminal B (after stopping A to avoid port conflicts):

```bash
npm run dev:vinext
```

Use the local URL displayed by vinext. Repeat the same routes and browser checks, including narrow/mobile viewport and keyboard navigation.

## 5. Production-style build checks

```bash
npm run typecheck
npm run test:foundation
npm run cf:preflight
npm run build
npm run build:vinext
```

If provided by generated scripts, preview the built vinext application with `npm run start:vinext`; consult CLI output for host/port. Cloudflare's documented Workers target must be tested locally, not assumed based on a successful regular `next build`.

HTTP smoke tests (replace `PORT` with the displayed port):

```bash
PORT=3000
curl -i "http://localhost:$PORT/api/health"
curl -i "http://localhost:$PORT/studio"
```

**Expected**: health endpoint returns HTTP 200 with non-sensitive JSON; `/studio` returns HTTP 404. Test all three world pages manually. No authentication/secret-management assertions can be proven yet because Supabase Auth is not implemented.

## 6. Pass/fail gate

Record the outcome for each item:

- [ ] Existing Next.js `dev`, `typecheck`, `test:foundation`, `build` continue to pass
- [ ] `vinext check` identifies no blocking issue, or blockers are resolved
- [ ] vinext development server starts
- [ ] vinext production build completes
- [ ] Homepage and engineering/graphics/visibility routes render
- [ ] Health endpoint responds with 200 and no secrets
- [ ] `/studio` remains inaccessible (404)
- [ ] Navigation, mobile layout, keyboard focus and reduced-motion behavior remain usable
- [ ] No cloud deployment was performed and no paid service was provisioned

**Not testable yet:** Supabase Auth cookies/MFA, RLS, Drizzle/Hyperdrive, media upload, durable drafts, publication, cache invalidation, backup/restore. These require later integration phases and cannot be labeled as passed now.

## 7. Undo the experiment

If using the dedicated Git branch and you want to discard all vinext-only changes, switch back to the foundation branch **after saving any desired work**:

```bash
git status
# Review uncommitted changes. Never discard edits you want to keep.
git switch -
```

If your modifications are uncommitted, Git may block switching branches; either commit on the test branch or copy/backup your files before reverting. Do not run destructive `git reset --hard` blindly.

## 8. Common problems

- `npx: command not found`: check Node/npm installation; re-open the terminal after nvm setup.
- Port 3000 already in use: stop the prior server or use the port printed by the new one.
- Registry/network errors: retry when online; do not infer compatibility from an incomplete install.
- Compatibility errors: capture the full `vinext check` output, package versions and the failing route.
- TypeScript errors after migration: compare generated configuration and preserve the pre-migration checkpoint.
- Broken production build: do not deploy; verify with the official current vinext docs.

## Official references

- https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
- https://github.com/cloudflare/vinext
- https://developers.cloudflare.com/workers/framework-guides/automatic-configuration/
