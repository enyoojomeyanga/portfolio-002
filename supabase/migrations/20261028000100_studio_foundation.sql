-- Three Worlds: initial private CMS data foundation.
-- Draft migration; apply ONLY to a disposable local Supabase project after review.
-- No app uses these tables yet. Avoid service-role credentials in browsers.
begin;
create extension if not exists pgcrypto;

create table public.studio_administrators (
  user_id uuid primary key references auth.users(id) on delete restrict,
  role text not null check (role in ('owner','editor')),
  status text not null default 'active' check (status in ('active','disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.studio_invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  invited_role text not null check (invited_role in ('owner','editor')),
  state text not null default 'pending' check (state in ('pending','accepted','revoked','expired')),
  invited_by uuid not null references public.studio_administrators(user_id),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  accepted_by uuid references auth.users(id),
  check (expires_at > created_at)
);
create unique index studio_one_pending_invitation_per_email on public.studio_invitations (lower(email)) where state='pending';

create table public.studio_media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  original_filename text not null,
  mime_type text not null,
  byte_size bigint not null check (byte_size > 0),
  width integer check (width > 0),
  height integer check (height > 0),
  sha256 text,
  rights_note text,
  archived_at timestamptz,
  uploaded_by uuid references public.studio_administrators(user_id),
  created_at timestamptz not null default now(),
  check (length(trim(storage_path)) > 0)
);
create table public.studio_content_items (
  id uuid primary key default gen_random_uuid(),
  content_type text not null check (content_type in ('engineering','graphics','visibility')),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  current_version_id uuid,
  archived_at timestamptz,
  created_by uuid references public.studio_administrators(user_id),
  created_at timestamptz not null default now(),
  unique (content_type,slug)
);
create table public.studio_content_drafts (
  item_id uuid primary key references public.studio_content_items(id) on delete restrict,
  revision bigint not null default 1 check (revision > 0),
  content jsonb not null default '{}'::jsonb check (jsonb_typeof(content)='object'),
  saved_by uuid references public.studio_administrators(user_id),
  saved_at timestamptz not null default now()
);
create table public.studio_published_versions (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.studio_content_items(id) on delete restrict,
  version_number integer not null check (version_number > 0),
  content jsonb not null check (jsonb_typeof(content)='object'),
  published_by uuid not null references public.studio_administrators(user_id),
  published_at timestamptz not null default now(),
  operation_id uuid not null unique,
  unique (item_id,version_number),
  unique (item_id,id)
);
alter table public.studio_content_items add constraint studio_current_version_same_item
  foreign key (id,current_version_id) references public.studio_published_versions(item_id,id)
  deferrable initially immediate;
create table public.studio_published_asset_refs (
  version_id uuid not null references public.studio_published_versions(id) on delete restrict,
  asset_id uuid not null references public.studio_media_assets(id) on delete restrict,
  placement_key text not null,
  placement jsonb not null check (jsonb_typeof(placement)='object'),
  primary key (version_id, placement_key)
);
create index studio_published_asset_refs_asset_idx on public.studio_published_asset_refs(asset_id);

create table public.studio_shared_areas (
  area text primary key check (area in ('profile','homepage')),
  draft_revision bigint not null default 1 check (draft_revision>0),
  draft_content jsonb not null default '{}'::jsonb check (jsonb_typeof(draft_content)='object'),
  current_version_id uuid
);
create table public.studio_shared_versions (
  id uuid primary key default gen_random_uuid(),
  area text not null references public.studio_shared_areas(area) on delete restrict,
  version_number integer not null check(version_number>0),
  content jsonb not null check(jsonb_typeof(content)='object'),
  operation_id uuid not null unique,
  published_by uuid not null references public.studio_administrators(user_id),
  published_at timestamptz not null default now(),
  unique(area,version_number),
  unique(area,id)
);
alter table public.studio_shared_areas add constraint studio_shared_current_version_same_area
  foreign key (area,current_version_id) references public.studio_shared_versions(area,id)
  deferrable initially immediate;
create table public.studio_audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id),
  action text not null,
  target_type text not null,
  target_id text,
  detail jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

-- Published snapshots and asset references cannot be changed by normal operations.
create function public.studio_reject_history_mutation() returns trigger language plpgsql
set search_path = '' as $$ begin
  raise exception 'Historical records are immutable';
end $$;
create trigger studio_versions_immutable before update or delete on public.studio_published_versions
  for each row execute function public.studio_reject_history_mutation();
create trigger studio_placements_immutable before update or delete on public.studio_published_asset_refs
  for each row execute function public.studio_reject_history_mutation();
create trigger studio_shared_versions_immutable before update or delete on public.studio_shared_versions
  for each row execute function public.studio_reject_history_mutation();

-- Deny frontend direct database access. Future server operations must be narrowly scoped.
-- In the Supabase API, public schema defaults vary by project: explicitly revoke access.
revoke all on public.studio_administrators, public.studio_invitations,
  public.studio_media_assets, public.studio_content_items, public.studio_content_drafts,
  public.studio_published_versions, public.studio_published_asset_refs,
  public.studio_shared_areas, public.studio_shared_versions, public.studio_audit_events
  from anon, authenticated;
revoke all on function public.studio_reject_history_mutation() from public;
alter table public.studio_administrators enable row level security;
alter table public.studio_invitations enable row level security;
alter table public.studio_media_assets enable row level security;
alter table public.studio_content_items enable row level security;
alter table public.studio_content_drafts enable row level security;
alter table public.studio_published_versions enable row level security;
alter table public.studio_published_asset_refs enable row level security;
alter table public.studio_shared_areas enable row level security;
alter table public.studio_shared_versions enable row level security;
alter table public.studio_audit_events enable row level security;
-- No permissive policies are created: default deny for anon/authenticated.
-- Future application operations must not use elevated keys without verifying identity,
-- current role, revision, and operation-specific authorization on the server.
commit;
