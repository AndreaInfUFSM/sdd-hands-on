create table public.chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Nova Conversa',
  module text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references public.chats(id) on delete cascade,
  role text not null,
  content text not null,
  citations jsonb default '[]'::jsonb,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index chats_user_id_idx on public.chats(user_id);
create index messages_chat_id_idx on public.messages(chat_id);
create index messages_created_at_idx on public.messages(created_at);

alter table public.chats enable row level security;
alter table public.messages enable row level security;

grant usage on schema public to authenticated;

grant select, insert, update, delete on public.chats to authenticated;
grant select, insert, update, delete on public.messages to authenticated;

create policy "Users manage own chats"
on public.chats
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users read messages from own chats"
on public.messages
for select
using (
  exists (
    select 1
    from public.chats
    where chats.id = messages.chat_id
      and chats.user_id = auth.uid()
  )
);

create policy "Users insert messages into own chats"
on public.messages
for insert
with check (
  exists (
    select 1
    from public.chats
    where chats.id = messages.chat_id
      and chats.user_id = auth.uid()
  )
);

create policy "Users update messages from own chats"
on public.messages
for update
using (
  exists (
    select 1
    from public.chats
    where chats.id = messages.chat_id
      and chats.user_id = auth.uid()
  )
);

create policy "Users delete messages from own chats"
on public.messages
for delete
using (
  exists (
    select 1
    from public.chats
    where chats.id = messages.chat_id
      and chats.user_id = auth.uid()
  )
);
