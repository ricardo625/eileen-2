-- ============================================================
-- SCHEMA
-- Run this in the Supabase SQL editor (once)
-- ============================================================

create table if not exists public.banners (
  id               serial primary key,
  banner           text    not null unique,
  checked          integer not null default 0,
  past30           integer not null default 0,
  sku_oos_rate     text    not null default '0%',
  sku_low_stock_rate text  not null default '0%',
  brand_not_found  integer not null default 0,
  sku_not_carried  integer not null default 0,
  on_sale_rate     text    not null default '0%',
  unique_skus      integer not null default 0,
  risk_label       text    not null default 'Low',
  risk_percent     integer not null default 0,
  linked_fields    text[]  not null default '{}',
  signal           text    not null default '',
  ai_suggestions   text[]  not null default '{}',
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

create table if not exists public.submissions (
  id               text    primary key,
  store_name       text    not null,
  address          text    not null,
  image            text    not null default '',
  badges           text[]  not null default '{}',
  badge_counts     jsonb           default '{}',
  archived         boolean not null default false,
  image_count      integer         default 1,
  completed_at     text,
  completed_by     text,
  completed_avatar text,
  note_count       integer         default 0,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- Allow all access (tighten with auth policies later)
alter table public.banners    enable row level security;
alter table public.submissions enable row level security;

create policy "allow_all_banners"     on public.banners    for all using (true) with check (true);
create policy "allow_all_submissions" on public.submissions for all using (true) with check (true);
