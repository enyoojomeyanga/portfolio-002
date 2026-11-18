# Phase 5: Private editing foundation

## Boundaries
- Server-only Supabase secret key is required for currently deny-by-default Phase 3 tables.
- Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` in `.env.local` (never commit).
- Supabase Phase 3 migration must be applied to a **disposable dev project** and an active administrator membership must be provisioned through an authorized, reviewed process. The UI does **not** self-enroll Owners.
- Phase 5 supplies a minimal editor and local illustrative preview; **not** the final progressive editor/media system.
- The app must NOT be exposed publicly until MFA, account recovery, security tests, backups, and full authorization review are complete.

## Installing the update
Back up your project. Extract the ZIP into a temporary folder, then copy `src`, `docs`, `tests`, `scripts` subfolders into the project. This update does not replace `package.json`, `proxy.ts`, or Cloudflare configuration, and adds no packages.

## Testing
`node scripts/phase5-verify.mjs` checks source invariants. Run `npm run typecheck` then `npm run build` only after installing new source. Start `npm run dev` and visit `/studio` while signed in as an authorized test account.

## Limitations
- New item and initial draft are two requests and not atomic. If initial draft creation fails, item remains orphaned and requires admin repair. Do not treat this as production-ready.
- After saving, reload the page to get the new revision number; resubmission before reload is rejected as a conflict.
- The client component has no durable unsaved-change recovery and no global navigation warning.
- Private preview is a generic content preview, not final page-accurate rendering.
- Use a private disposable Supabase development project only.

## Rollback
Restore the project backup or revert only the Phase 5 files. Do not delete database records created in testing without reviewing references.
