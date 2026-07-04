-- ═══════════════════════════════════════════════════
-- ENOCH'S DEDICATION — GUEST INVITATION SYSTEM SCHEMA
-- ═══════════════════════════════════════════════════

-- Design variants: rotating accent themes for tables.
-- Same overall look (fonts, layout, palette) with a distinct
-- accent color / ribbon tone / ornament per variant, cycling
-- across tables so nearby tables don't repeat the same look.
create table design_variants (
  id serial primary key,
  name text not null,
  accent_color text not null,       -- hex, e.g. '#7a9aaa'
  accent_light text not null,       -- hex, lighter tint
  ornament text not null default 'floral'  -- floral | ribbon | leaf | dove
);

insert into design_variants (name, accent_color, accent_light, ornament) values
  ('Dusty Blue',    '#7a9aaa', '#ddeaf0', 'ribbon'),
  ('Sage Green',    '#8aa88a', '#e0ece0', 'leaf'),
  ('Powder Blue',   '#9cb8cc', '#e6eef4', 'dove'),
  ('Soft Teal',     '#6fa3a0', '#dcece9', 'floral'),
  ('Warm Sand',     '#c2a877', '#f2e9d8', 'ribbon'),
  ('Muted Lilac',   '#a89cc8', '#eae6f4', 'floral'),
  ('Sky Mist',      '#8fb4c9', '#e2eef3', 'leaf'),
  ('Antique Rose',  '#c49a9a', '#f2e2e2', 'ribbon');

-- Tables: each table is assigned a design variant, cycling
-- through the 8 variants above (table 1 -> variant 1, table 9 -> variant 1, etc.)
create table event_tables (
  table_number integer primary key,
  design_variant_id integer references design_variants(id) not null,
  label text  -- optional custom label, e.g. "Family Table"
);

-- Guests: one row per invitation. Table number can be reassigned
-- at any time by the admin — the guest's permanent slug/link never changes.
create table guests (
  id serial primary key,
  slug text unique not null,             -- permanent, unguessable URL segment
  full_name text not null,
  table_number integer references event_tables(table_number),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_guests_slug on guests(slug);
create index idx_guests_table on guests(table_number);

-- Auto-update the updated_at timestamp whenever a guest row changes
-- (e.g. table reassignment) — this is what makes "live" PDF generation
-- always reflect the latest state.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_guests_updated_at
before update on guests
for each row execute function set_updated_at();

-- Row Level Security: guests table is publicly READABLE by slug only
-- (so the guest-facing invite page can fetch by slug without auth),
-- but only authenticated admins can INSERT/UPDATE/DELETE.
alter table guests enable row level security;
alter table event_tables enable row level security;
alter table design_variants enable row level security;

create policy "Public can read guests by slug"
  on guests for select
  using (true);

create policy "Public can read tables"
  on event_tables for select
  using (true);

create policy "Public can read design variants"
  on design_variants for select
  using (true);

create policy "Only authenticated admin can modify guests"
  on guests for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Only authenticated admin can modify tables"
  on event_tables for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
