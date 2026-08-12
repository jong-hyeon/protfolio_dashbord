create type public.account_type as enum ('isa', 'brokerage', 'cash');
create type public.asset_class as enum ('us_stock', 'kr_stock', 'bond', 'gold', 'cash');

create table public.assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  account_type public.account_type not null,
  asset_class public.asset_class not null,
  quantity numeric not null check (quantity > 0),
  current_price numeric not null check (current_price > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.assets enable row level security;

create policy "Users manage their own assets"
on public.assets
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_assets_updated_at
before update on public.assets
for each row execute function public.set_updated_at();
