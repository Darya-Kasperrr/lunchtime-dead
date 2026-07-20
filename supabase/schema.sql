-- Lunchtime Dead — CMS schema
-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query).
-- Safe to re-run: every statement is idempotent (create-if-not-exists / drop-then-create policies).

-- ─────────── admins allowlist ───────────
create table if not exists admins (
  email text primary key
);
alter table admins enable row level security;

-- security definer so this can be checked from policies on OTHER tables
-- without needing a public-read policy on admins itself.
create or replace function is_admin() returns boolean
language sql security definer stable as $$
  select exists (
    select 1 from admins where email = auth.jwt()->>'email'
  );
$$;

-- ─────────── tracks (player) ───────────
create table if not exists tracks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  artist text not null default 'Lunchtime Dead',
  audio_url text not null,
  art_url text,
  position int not null default 0,
  created_at timestamptz not null default now()
);
alter table tracks enable row level security;
drop policy if exists "tracks public read" on tracks;
create policy "tracks public read" on tracks for select using (true);
drop policy if exists "tracks admin write" on tracks;
create policy "tracks admin write" on tracks for insert with check (is_admin());
drop policy if exists "tracks admin update" on tracks;
create policy "tracks admin update" on tracks for update using (is_admin());
drop policy if exists "tracks admin delete" on tracks;
create policy "tracks admin delete" on tracks for delete using (is_admin());

-- ─────────── gigs (live schedule) ───────────
create table if not exists gigs (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  venue text not null,
  city text not null,
  note text not null default '',
  ticket_url text,
  ticket_label text not null default 'TICKETS',
  is_past boolean not null default false,
  position int not null default 0
);
alter table gigs enable row level security;
drop policy if exists "gigs public read" on gigs;
create policy "gigs public read" on gigs for select using (true);
drop policy if exists "gigs admin write" on gigs;
create policy "gigs admin write" on gigs for insert with check (is_admin());
drop policy if exists "gigs admin update" on gigs;
create policy "gigs admin update" on gigs for update using (is_admin());
drop policy if exists "gigs admin delete" on gigs;
create policy "gigs admin delete" on gigs for delete using (is_admin());

-- ─────────── clips (video archive) ───────────
create table if not exists clips (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  youtube_url text not null,
  watch_label text not null default 'WATCH ON YOUTUBE ↗',
  position int not null default 0
);
alter table clips enable row level security;
drop policy if exists "clips public read" on clips;
create policy "clips public read" on clips for select using (true);
drop policy if exists "clips admin write" on clips;
create policy "clips admin write" on clips for insert with check (is_admin());
drop policy if exists "clips admin update" on clips;
create policy "clips admin update" on clips for update using (is_admin());
drop policy if exists "clips admin delete" on clips;
create policy "clips admin delete" on clips for delete using (is_admin());

-- ─────────── site_settings (hero video/poster) ───────────
create table if not exists site_settings (
  id int primary key default 1 check (id = 1),
  hero_video_url text,
  hero_poster_url text
);
alter table site_settings enable row level security;
drop policy if exists "settings public read" on site_settings;
create policy "settings public read" on site_settings for select using (true);
drop policy if exists "settings admin write" on site_settings;
create policy "settings admin write" on site_settings for insert with check (is_admin());
drop policy if exists "settings admin update" on site_settings;
create policy "settings admin update" on site_settings for update using (is_admin());

insert into site_settings (id) values (1) on conflict (id) do nothing;

-- ─────────── storage buckets ───────────
insert into storage.buckets (id, name, public)
  values ('tracks-audio', 'tracks-audio', true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public)
  values ('track-art', 'track-art', true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public)
  values ('hero-media', 'hero-media', true)
  on conflict (id) do nothing;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects for select
  using (bucket_id in ('tracks-audio', 'track-art', 'hero-media'));

drop policy if exists "media admin write" on storage.objects;
create policy "media admin write" on storage.objects for insert
  with check (bucket_id in ('tracks-audio', 'track-art', 'hero-media') and is_admin());

drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects for update
  using (bucket_id in ('tracks-audio', 'track-art', 'hero-media') and is_admin());

drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects for delete
  using (bucket_id in ('tracks-audio', 'track-art', 'hero-media') and is_admin());

-- ─────────── postcards (public fan wall) ───────────
-- the only public-WRITE surface in this schema — everything else is public-read/admin-write.
-- text-only postcards publish instantly; postcards with a photo are held for admin review,
-- enforced server-side below (not just trusted from the client).
create table if not exists postcards (
  id uuid primary key default gen_random_uuid(),
  name text,
  message text not null check (char_length(message) <= 500),
  photo_url text,
  status text not null default 'approved' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);
alter table postcards enable row level security;

drop policy if exists "postcards public read" on postcards;
create policy "postcards public read" on postcards for select
  using (status = 'approved' or is_admin());

drop policy if exists "postcards public insert" on postcards;
create policy "postcards public insert" on postcards for insert
  with check (
    (photo_url is null and status = 'approved') or
    (photo_url is not null and status = 'pending')
  );

drop policy if exists "postcards admin update" on postcards;
create policy "postcards admin update" on postcards for update using (is_admin());
drop policy if exists "postcards admin delete" on postcards;
create policy "postcards admin delete" on postcards for delete using (is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  values ('postcard-photos', 'postcard-photos', true, 8388608,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
  on conflict (id) do nothing;

drop policy if exists "postcard photos public read" on storage.objects;
create policy "postcard photos public read" on storage.objects for select
  using (bucket_id = 'postcard-photos');

-- anyone can upload — fans submit anonymously. no public update/delete,
-- so nobody can overwrite or remove someone else's photo.
drop policy if exists "postcard photos public insert" on storage.objects;
create policy "postcard photos public insert" on storage.objects for insert
  with check (bucket_id = 'postcard-photos');

drop policy if exists "postcard photos admin delete" on storage.objects;
create policy "postcard photos admin delete" on storage.objects for delete
  using (bucket_id = 'postcard-photos' and is_admin());

-- ─────────── seed: today's content, so the cutover doesn't lose anything ───────────
insert into tracks (name, artist, audio_url, art_url, position)
values
  ('Tsubame big joy — A city with Green', 'Lunchtime Dead',
    'assets/tsubame.mp3', null, 0),
  ('Flying Girl', 'Lunchtime Dead',
    'assets/Lunchtime%20Dead%20-%20Flying%20Girl.mp3', 'assets/unnamed.png', 1)
on conflict do nothing;

insert into gigs (date, venue, city, note, ticket_url, ticket_label, is_past, position)
values (
  '2026-08-15', 'U.F.O.CLUB', 'TOKYO ・ 東高円寺',
  '【MELTING AWAY】 with サマーウーフ ・ OrbisSoundscape ・ Galapagos ・ 赤い花
OPEN 18:30 ・ START 19:00 ・ ¥3,000 ADV / ¥3,500 DOOR (+1D)',
  'https://www.instagram.com/lunchtimedead/', 'TICKETS ▸ DM', false, 0
)
on conflict do nothing;

insert into clips (title, youtube_url, watch_label, position)
values (
  'Tsubame big joy — A city with Green',
  'https://www.youtube.com/embed/mLlyXlstjaM',
  'WATCH ON YOUTUBE ↗', 0
)
on conflict do nothing;
