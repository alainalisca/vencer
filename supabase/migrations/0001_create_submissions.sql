-- =============================================================
-- Vencer admin — submissions table
-- Run this in Supabase → SQL Editor → New Query
-- (Or via `supabase db push` if you set up the CLI later.)
-- =============================================================

create table if not exists public.submissions (
  id              uuid primary key default gen_random_uuid(),
  type            text not null check (type in ('contact', 'referral')),

  -- Submitter identity (who filled out the form)
  name            text not null,
  email           text not null,
  phone           text,

  -- Contact-form-specific
  project_type    text,

  -- Referral-form-specific (the prospect being referred)
  prospect_name   text,
  prospect_contact text,

  -- The pitch / message body (populated for both types)
  message         text not null,

  -- Inbox state
  status          text not null default 'new'
                  check (status in ('new', 'read', 'replied', 'archived')),

  -- Tracking metadata (IP, user-agent, referrer, posthog session id, etc.)
  metadata        jsonb default '{}'::jsonb,

  -- Timestamps
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Auto-update `updated_at` on row update
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists submissions_set_updated_at on public.submissions;
create trigger submissions_set_updated_at
  before update on public.submissions
  for each row execute function public.set_updated_at();

-- Useful indexes
create index if not exists submissions_status_idx        on public.submissions (status);
create index if not exists submissions_type_idx          on public.submissions (type);
create index if not exists submissions_created_at_desc   on public.submissions (created_at desc);

-- =============================================================
-- Row Level Security
--
-- The form-submission Server Actions use the SERVICE_ROLE key
-- (server-side only), which bypasses RLS — so inserts always
-- succeed regardless of policy.
--
-- Reads from the admin inbox use the user's auth session (the
-- magic-link login), so we lock SELECT/UPDATE/DELETE behind a
-- policy that only the admin's email can satisfy.
--
-- The admin email is hardcoded into the policy below — replace
-- 'alain@vencer.dev' with your own if forking.
-- =============================================================

alter table public.submissions enable row level security;

-- Admin can read everything
drop policy if exists "admin can read submissions" on public.submissions;
create policy "admin can read submissions"
  on public.submissions for select
  using ( (auth.jwt() ->> 'email') = 'alain@vencer.dev' );

-- Admin can update status / archive
drop policy if exists "admin can update submissions" on public.submissions;
create policy "admin can update submissions"
  on public.submissions for update
  using ( (auth.jwt() ->> 'email') = 'alain@vencer.dev' );

-- (No public INSERT policy — server-side service-role key bypasses RLS for inserts.)
-- (No DELETE policy — submissions are archived, not deleted, to preserve history.)
