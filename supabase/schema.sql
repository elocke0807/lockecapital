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

create table if not exists accounts (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  name text not null,
  type text not null check (type in ('cash', 'investment', 'other')),
  balance numeric not null default 0,
  created_at timestamptz not null default now()
);

alter table accounts enable row level security;

create policy "Users can view their own accounts"
  on accounts for select
  using (user_id = auth.jwt()->>'sub');

create policy "Users can insert their own accounts"
  on accounts for insert
  with check (user_id = auth.jwt()->>'sub');

create policy "Users can update their own accounts"
  on accounts for update
  using (user_id = auth.jwt()->>'sub');

create policy "Users can delete their own accounts"
  on accounts for delete
  using (user_id = auth.jwt()->>'sub');

create table if not exists net_worth_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  snapshot_date date not null,
  total numeric not null,
  created_at timestamptz not null default now(),
  unique (user_id, snapshot_date)
);

alter table net_worth_snapshots enable row level security;

create policy "Users can view their own snapshots"
  on net_worth_snapshots for select
  using (user_id = auth.jwt()->>'sub');

create policy "Users can insert their own snapshots"
  on net_worth_snapshots for insert
  with check (user_id = auth.jwt()->>'sub');

create policy "Users can update their own snapshots"
  on net_worth_snapshots for update
  using (user_id = auth.jwt()->>'sub');

create table if not exists holdings (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  ticker text not null,
  name text not null,
  shares numeric not null,
  price numeric not null,
  created_at timestamptz not null default now()
);

alter table holdings enable row level security;

create policy "Users can view their own holdings"
  on holdings for select
  using (user_id = auth.jwt()->>'sub');

create policy "Users can insert their own holdings"
  on holdings for insert
  with check (user_id = auth.jwt()->>'sub');

create policy "Users can update their own holdings"
  on holdings for update
  using (user_id = auth.jwt()->>'sub');

create policy "Users can delete their own holdings"
  on holdings for delete
  using (user_id = auth.jwt()->>'sub');

alter table accounts add column if not exists plaid_account_id text;
alter table accounts add column if not exists plaid_item_id text;
alter table holdings add column if not exists plaid_account_id text;
alter table holdings add column if not exists plaid_item_id text;

create table if not exists plaid_items (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  item_id text not null unique,
  access_token text not null,
  institution_name text,
  created_at timestamptz not null default now()
);

alter table plaid_items enable row level security;

create policy "Users can view their own plaid items"
  on plaid_items for select
  using (user_id = auth.jwt()->>'sub');

create policy "Users can insert their own plaid items"
  on plaid_items for insert
  with check (user_id = auth.jwt()->>'sub');

create policy "Users can delete their own plaid items"
  on plaid_items for delete
  using (user_id = auth.jwt()->>'sub');

create table if not exists market_snapshots (
  id uuid primary key default gen_random_uuid(),
  symbol text not null,
  snapshot_date date not null,
  value numeric not null,
  created_at timestamptz not null default now(),
  unique (symbol, snapshot_date)
);

alter table market_snapshots enable row level security;

create policy "Anyone can view market snapshots"
  on market_snapshots for select
  using (true);
