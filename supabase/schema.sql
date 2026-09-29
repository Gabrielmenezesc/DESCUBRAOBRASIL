-- Execute no SQL Editor de um projeto Supabase novo.
create table if not exists public.traveler_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  progress jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.tourism_offers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  company_name text not null check (char_length(company_name) between 2 and 100),
  title text not null check (char_length(title) between 3 and 120),
  city text not null check (char_length(city) between 2 and 100),
  original_cents integer not null check (original_cents > 0),
  price_cents integer not null check (price_cents >= 0 and price_cents < original_cents),
  starts_at timestamptz not null,
  ends_at timestamptz not null check (ends_at > starts_at),
  terms text not null check (char_length(terms) between 20 and 2000),
  source_url text not null check (source_url ~ '^https://'),
  contact_url text not null check (contact_url ~ '^https://'),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

alter table public.traveler_progress enable row level security;
alter table public.tourism_offers enable row level security;
create policy "progress_owner_read" on public.traveler_progress for select using (auth.uid()=user_id);
create policy "progress_owner_write" on public.traveler_progress for insert with check (auth.uid()=user_id);
create policy "progress_owner_update" on public.traveler_progress for update using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "offers_public_approved" on public.tourism_offers for select using (status='approved' or auth.uid()=owner_id);
create policy "offers_owner_insert_pending" on public.tourism_offers for insert with check (auth.uid()=owner_id and status='pending');
create policy "offers_owner_delete_unpublished" on public.tourism_offers for delete using (auth.uid()=owner_id and status<>'approved');

-- Aprovação é uma ação administrativa feita no painel Supabase.
-- Nunca exponha a service_role key no navegador ou no repositório.
