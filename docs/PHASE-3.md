# Phase 3: Supabase PostgreSQL data foundation

**Scope:** reviewed SQL migration, no production connection, no Auth/Storage provisioning, no new JavaScript dependencies, no public-site or Studio UI changes. The SQL is not applied by the ZIP.

## IMPORTANT: never run against production first
This draft migration creates private administrative, content, media-metadata, version, and audit tables. All app tables deny `anon` and `authenticated` and enable RLS **without any permissive policies**. That is intentional: the site remains static until Phase 4 secure server operations exist. Do not put Supabase service-role/secret keys or database credentials in browser code or Git.

## Install update to existing Ubuntu project
Download `three-worlds-phase3-update.zip` to `~/Downloads`. Inside the ZIP are the `supabase/`, `docs/`, `tests/` and `scripts/` directories only. Back up first:

```bash
cd ~/Downloads
cp -a three-worlds-foundation three-worlds-backup-before-phase3
mkdir -p /tmp/three-worlds-phase3-update
unzip -q three-worlds-phase3-update.zip -d /tmp/three-worlds-phase3-update
cp -a /tmp/three-worlds-phase3-update/supabase ~/Downloads/three-worlds-foundation/
cp -a /tmp/three-worlds-phase3-update/docs/. ~/Downloads/three-worlds-foundation/docs/
cp -a /tmp/three-worlds-phase3-update/tests/. ~/Downloads/three-worlds-foundation/tests/
cp -a /tmp/three-worlds-phase3-update/scripts/. ~/Downloads/three-worlds-foundation/scripts/
cd ~/Downloads/three-worlds-foundation
node scripts/verify-phase3.mjs
```

The update does not replace `package.json`, installed modules, public pages, or Cloudflare files. There is **no `npm install`** for this phase and no need to repeat the earlier build if your Phase 2 build already passed.

## Optional: validate against disposable local Supabase (separate explicit action)
The delivered test checks migration structure only, not PostgreSQL execution. When you're ready for database testing, install Docker Engine and Supabase CLI using their official instructions: https://docs.docker.com/engine/install/ubuntu/ and https://supabase.com/docs/guides/local-development/cli/getting-started . Do not blindly install CLI globally via `npm install -g supabase` (not supported). Start local Supabase in a *separate disposable test workspace*, verify CLI migrations and reset test DB there. **Do not apply this migration to a live Supabase project until migrations and role policies have been independently reviewed.**

## What this migration does / does not do
- **Does:** Tables and constraints for owners/editors, invitations, content identities/drafts/published history, media metadata/reference protection, shared profile/homepage versions and audit events.
- **Does:** Deny browser database access by default; immutable published-version and placement triggers; published pointer belongs to same item.
- **Does not:** Create a real Owner, invite an admin, make any page dynamic, configure buckets, seed content, implement conflict-safe saves, publication transactions, role-change serialization, recovery, or backups.
- **Limitations:** Supabase Auth schema must exist when applying; `auth.users` is referenced. Version records and storage objects require transactional application logic later. A published asset reference FK protects the database record, not an external Storage object. Last-owner protection is NOT yet implemented; do not allow administrator role mutations until that transaction exists.

## Rollback
For the ZIP alone, remove the new `supabase/migrations/20261028000100_studio_foundation.sql`, `docs/PHASE-3.md`, `scripts/verify-phase3.mjs`, and `tests/phase3-data.test.mjs` or restore your folder backup. No database rollback is needed if the migration was not applied. If you later apply it locally, reset the **disposable** database only; destructive reverse migrations are deliberately not provided for production.

## Next phase
Implement authorization and server-only data access, verify current memberships, isolate elevated credentials, and add transactional operations before any private Studio route is opened.
