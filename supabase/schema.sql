-- Execute no SQL Editor de um projeto novo; não sobrescreve tabela existente.
create table public.comments (
 id uuid primary key default gen_random_uuid(),
 post_slug text not null check (post_slug ~ '^[a-z0-9-]{1,100}$'),
 name text not null check (char_length(btrim(name)) between 1 and 40 and char_length(name) <= 40),
 comment text not null check (char_length(btrim(comment)) between 1 and 600 and char_length(comment) <= 600),
 created_at timestamptz not null default now()
);
create index comments_post_date_idx on public.comments (post_slug, created_at desc);
alter table public.comments enable row level security;
revoke all on public.comments from anon, authenticated;
grant select on public.comments to anon, authenticated;
grant insert (post_slug,name,comment) on public.comments to anon, authenticated;
create policy "Read public comments" on public.comments for select to anon, authenticated using (true);
create policy "Write valid public comments" on public.comments for insert to anon, authenticated
 with check (
 char_length(btrim(name)) between 1 and 40 and char_length(name) <= 40
 and char_length(btrim(comment)) between 1 and 600 and char_length(comment) <= 600
 and post_slug ~ '^[a-z0-9-]{1,100}$'
);
-- Data e id são definidos pelo servidor; não há UPDATE/DELETE para visitantes.
-- Modere pelo dashboard com sua conta administrativa.
