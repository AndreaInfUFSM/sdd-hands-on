create table public.clinical_cases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  case_data jsonb not null,
  schema_version text not null default '1.0.0',
  created_at timestamptz not null default now()
);

create index clinical_cases_user_id_idx on public.clinical_cases(user_id);

alter table public.clinical_cases enable row level security;

grant select, insert, update, delete on public.clinical_cases to authenticated;

create policy "Users manage own clinical cases"
on public.clinical_cases
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
