# Phase 2: public website implementation (concept content)

## Scope
This is a cohesive public-site implementation of the approved Editorial Triptych and differentiated Engineering, Graphics Design and Local Business Visibility worlds. About and Contact are placeholder-only. The Content Studio remains a deliberate 404 until authentication is implemented.

## Before updating
1. Stop the development server with Ctrl+C.
2. Preserve the working folder or commit it to Git before copying files.
3. Do NOT replace any locally generated vinext/Vite/Workers configuration, package.json or lockfile. This update includes only source files, tests and this document.

## Update existing project (Ubuntu)
Download `three-worlds-phase2-update.zip` into Downloads, then run:

```bash
cd ~/Downloads
cp -a three-worlds-foundation three-worlds-foundation-backup-before-phase2
unzip -q three-worlds-phase2-update.zip -d three-worlds-phase2-update
cp -a three-worlds-phase2-update/src/. three-worlds-foundation/src/
cp -a three-worlds-phase2-update/tests/. three-worlds-foundation/tests/
cp -a three-worlds-phase2-update/docs/. three-worlds-foundation/docs/
cd three-worlds-foundation
```

## Dependencies
No new dependencies or package.json changes. Do not run npm install just for this update.

## ONE verification sequence
Run the checks for the changed public routes and styles once:

```bash
node --test tests/phase2.test.mjs
npm run typecheck
npm run build
```

Start the website with `npm run dev` (or `npm run dev:vinext` only if you have already configured vinext). Verify `/`, `/engineering`, `/graphics`, `/visibility`, `/about`, `/contact`. `/studio` intentionally returns 404. Do not run both dev servers at once on the same port.

## What is NOT complete
No real imagery or verified client biography, case studies, contact channels, world-specific detail content, CMS, Supabase, deployments, or production accessibility audits. All public routes remain `noindex` until client content and launch readiness have been confirmed. The font system uses safe local fallbacks; approved production font files have not been loaded.

## Rollback
Stop dev server. Restore from `~/Downloads/three-worlds-foundation-backup-before-phase2` or use your Git commit. Never blindly remove unrelated user changes.

## Troubleshooting
If `npm run build` reports missing modules, verify you are in the project root and that the existing `node_modules` was installed from the project's package.json. If a route doesn't load, restart the dev server and check the address. If vinext fails but Next.js succeeds, keep that result separate: runtime compatibility remains unverified.
