# Phase 4: Authentication foundation (not production-ready)

## Scope
Adds invitation-only login, private route, server-verified user identity, current membership lookup, sign-out and private no-store session refresh. **It does not provide account provisioning, MFA enrollment/enforcement, invitations, publishing, media management, session administration, or Owner/Editor mutations.** Do not deploy the Studio to production until those security requirements are fulfilled and integration tested.

## New and changed files
- Updated: `package.json`, `.env.example`, `src/app/studio/page.tsx`
- Added: `src/lib/supabase/{env,server,browser}.ts`, `src/lib/studio/access.ts`, `src/proxy.ts`, `src/app/studio/{layout,actions,studio.css}`, `src/app/studio/login/{page,studio-login-form}.tsx`, `tests/phase4-auth.test.mjs`.
- Unchanged: public routes, public styles, Phase 3 migration, Cloudflare configuration.

## Ubuntu installation (apply update from Downloads)
```bash
cd ~/Downloads
cp -a three-worlds-foundation three-worlds-foundation-backup-phase3
mkdir -p /tmp/tw-phase4
unzip -q three-worlds-phase4-update.zip -d /tmp/tw-phase4
cp -a /tmp/tw-phase4/. three-worlds-foundation/
cd three-worlds-foundation
npm install
npm run test:phase4
npm run typecheck
npm run build
```
**Do not copy a full-project ZIP onto an existing project.** The update contains only new/changed files. `npm install` is necessary because this update adds two packages.

## Supabase setup (optional until safe backend provisioning)
1. Create a **disposable development** Supabase project. Never start with production content.
2. Review and apply the Phase 3 migration to that disposable project. It has not been executed in this package and may require corrections found by real database testing.
3. Configure permitted test identities through Supabase dashboard, **not through public sign-up**.
4. For a first authorized Owner, an operator must create the identity and membership in the trusted admin/database console. The application deliberately has no self-serve owner bootstrap. Avoid running any copied SQL against production.
5. Copy `.env.example` to `.env.local` and set the URL, publishable key and **secret key**. This secret must only be used in a trusted server environment. Keep `.env.local` out of Git.
6. Restart `npm run dev` and navigate to `/studio/login`.
7. Test no-credentials, invalid credentials, authenticated nonmember, active Editor and active Owner. These are **pending integration tests** until the disposable backend exists.

## Security boundaries and limitations
- The login interface uses password authentication; mandatory MFA is not yet present. **Do not use this package as a production admin system.**
- Auth uses server-side `getUser()` and checks membership on every protected page load. Every future mutation must recheck membership and MFA independently.
- A server-only Supabase secret key is used for a restricted membership lookup because Phase 3 revokes user-scoped table access. Protect this key, rotate if exposed, and later replace with least-privileged database operations or narrowly constrained trusted functions.
- Private response cache is disabled at `/studio` proxy routes; CDN must never publicly cache cookie-bearing responses.
- Sign-out uses Supabase Auth; session revocation administration is not yet implemented.
- The fallback when env is absent is closed (Studio 404; login shows setup unavailable).
- Cloudflare Workers deployment and SSR cookie functionality have **not been runtime-tested** here.

## Rollback
Restore only the files listed above from your backup; remove newly added Phase 4 files. Then run `npm install` to restore the former dependency state. Do not delete your database or Supabase project.

## Sources
- https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs
- https://supabase.com/docs/guides/auth/server-side/nextjs
