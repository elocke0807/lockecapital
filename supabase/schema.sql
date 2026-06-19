create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  name text not null,
  target_amount numeric not null,
  current_amount numeric not null default 0,
  created_at timestamptz not null default now()
);

alter table goals enable row level security;

create policy "Users can view their own goals"
  on goals for select
  using (user_id = auth.jwt()->>'sub');

create policy "Users can insert their own goals"
  on goals for insert
  with check (user_id = auth.jwt()->>'sub');

create policy "Users can update their own goals"
  on goals for update
  using (user_id = auth.jwt()->>'sub');

create policy "Users can delete their own goals"
  on goals for delete
  using (user_id = auth.jwt()->>'sub');
