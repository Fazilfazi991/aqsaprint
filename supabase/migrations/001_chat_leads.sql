create table if not exists chat_leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  phone text,
  email text,
  company text,
  service_needed text,
  quantity text,
  size text,
  location text,
  deadline text,
  artwork_available text,
  message text,
  source_page text,
  created_at timestamptz default now()
);

alter table chat_leads enable row level security;

drop policy if exists "No public chat lead access" on chat_leads;

create policy "No public chat lead access"
  on chat_leads
  for all
  using (false)
  with check (false);
