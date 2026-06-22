create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  name text not null,
  target_amount numeric not null,
  current_amount numeric not null default 0,
  target_date date,
  created_at timestamptz not null default now()
);

alter table goals add column if not exists target_date date;

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

create table if not exists paychecks (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  gross numeric not null,
  taxes numeric not null default 0,
  retirement_401k numeric not null default 0,
  pay_date date not null,
  created_at timestamptz not null default now()
);

alter table paychecks enable row level security;

create policy "Users can view their own paychecks"
  on paychecks for select
  using (user_id = auth.jwt()->>'sub');

create policy "Users can insert their own paychecks"
  on paychecks for insert
  with check (user_id = auth.jwt()->>'sub');

create policy "Users can delete their own paychecks"
  on paychecks for delete
  using (user_id = auth.jwt()->>'sub');

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  type text not null check (type in ('income', 'expense')),
  category text not null,
  amount numeric not null,
  description text,
  occurred_on date not null default current_date,
  created_at timestamptz not null default now()
);

alter table transactions enable row level security;

create policy "Users can view their own transactions"
  on transactions for select
  using (user_id = auth.jwt()->>'sub');

create policy "Users can insert their own transactions"
  on transactions for insert
  with check (user_id = auth.jwt()->>'sub');

create policy "Users can delete their own transactions"
  on transactions for delete
  using (user_id = auth.jwt()->>'sub');

create table if not exists budgets (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  category text not null,
  monthly_limit numeric not null,
  created_at timestamptz not null default now(),
  unique (user_id, category)
);

alter table budgets enable row level security;

create policy "Users can view their own budgets"
  on budgets for select
  using (user_id = auth.jwt()->>'sub');

create policy "Users can insert their own budgets"
  on budgets for insert
  with check (user_id = auth.jwt()->>'sub');

create policy "Users can update their own budgets"
  on budgets for update
  using (user_id = auth.jwt()->>'sub');

create policy "Users can delete their own budgets"
  on budgets for delete
  using (user_id = auth.jwt()->>'sub');
