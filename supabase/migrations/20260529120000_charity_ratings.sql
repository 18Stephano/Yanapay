create table if not exists public.charity_ratings (
  id uuid primary key default gen_random_uuid(),
  charity_id uuid not null references public.charities(id) on delete cascade,
  overall_score integer not null check (overall_score >= 0 and overall_score <= 100),
  confidence text not null check (confidence in ('high', 'medium', 'low')),
  summary text not null,
  status text not null default 'published' check (status in ('draft', 'reviewed', 'published')),
  legalidad_registro integer not null default 0,
  transparencia_financiera integer not null default 0,
  gobernanza_rendicion integer not null default 0,
  impacto_efectividad integer not null default 0,
  cultura_reputacion integer not null default 0,
  missing_information text[] not null default '{}',
  red_flags text[] not null default '{}',
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (charity_id)
);

create table if not exists public.rating_evidence (
  id uuid primary key default gen_random_uuid(),
  rating_id uuid not null references public.charity_ratings(id) on delete cascade,
  dimension text not null,
  source_title text not null,
  source_url text not null,
  finding text not null,
  confidence text not null check (confidence in ('high', 'medium', 'low')),
  created_at timestamptz not null default now()
);

alter table public.charity_ratings enable row level security;
alter table public.rating_evidence enable row level security;

create policy "Public can read published charity ratings"
  on public.charity_ratings
  for select
  using (
    status = 'published'
    and exists (
      select 1 from public.charities c
      where c.id = charity_id and c.published = true
    )
  );

create policy "Public can read evidence for published ratings"
  on public.rating_evidence
  for select
  using (
    exists (
      select 1 from public.charity_ratings cr
      join public.charities c on c.id = cr.charity_id
      where cr.id = rating_id
        and cr.status = 'published'
        and c.published = true
    )
  );

create table if not exists public.charity_research_requests (
  id uuid primary key default gen_random_uuid(),
  charity_name text not null,
  website text,
  ruc text,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'running', 'complete', 'failed')),
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.charity_research_findings (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.charity_research_requests(id) on delete cascade,
  source_title text not null,
  source_url text not null,
  finding text not null,
  dimension text,
  confidence text check (confidence in ('high', 'medium', 'low')),
  created_at timestamptz not null default now()
);

create table if not exists public.draft_charities (
  id uuid primary key default gen_random_uuid(),
  research_request_id uuid references public.charity_research_requests(id) on delete set null,
  slug text not null,
  name text not null,
  tagline text not null,
  mission text not null,
  location text not null,
  region text not null,
  categories text[] not null default '{}',
  founded integer not null default 0,
  website text not null default '',
  support_url text not null default '',
  contact_email text not null default '',
  verified boolean not null default false,
  highlights text[] not null default '{}',
  evidence text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.draft_charity_ratings (
  id uuid primary key default gen_random_uuid(),
  draft_charity_id uuid not null references public.draft_charities(id) on delete cascade,
  overall_score integer not null,
  confidence text not null,
  summary text not null,
  legalidad_registro integer not null default 0,
  transparencia_financiera integer not null default 0,
  gobernanza_rendicion integer not null default 0,
  impacto_efectividad integer not null default 0,
  cultura_reputacion integer not null default 0,
  missing_information text[] not null default '{}',
  red_flags text[] not null default '{}',
  dimension_summaries jsonb not null default '{}'::jsonb,
  evidence jsonb not null default '[]'::jsonb,
  review_required boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (draft_charity_id)
);

-- Seed published ratings for existing charities (map old jsonb scores to new rubric)
insert into public.charity_ratings (
  charity_id,
  overall_score,
  confidence,
  summary,
  status,
  legalidad_registro,
  transparencia_financiera,
  gobernanza_rendicion,
  impacto_efectividad,
  cultura_reputacion,
  missing_information,
  red_flags,
  reviewed_at
)
select
  c.id,
  case c.slug
    when 'kuska-educa' then 83
    when 'salud-en-ruta' then 74
    when 'amazonia-viva' then 63
    when 'manos-que-alimentan' then 77
    else 70
  end,
  case c.slug
    when 'kuska-educa' then 'high'
    when 'salud-en-ruta' then 'medium'
    when 'amazonia-viva' then 'low'
    else 'medium'
  end,
  'Puntuación Yanapay adaptada al marco peruano de evaluación.',
  'published',
  case c.slug
    when 'kuska-educa' then 13
    when 'salud-en-ruta' then 12
    when 'amazonia-viva' then 10
    when 'manos-que-alimentan' then 13
    else 10
  end,
  case c.slug
    when 'kuska-educa' then 20
    when 'salud-en-ruta' then 17
    when 'amazonia-viva' then 14
    when 'manos-que-alimentan' then 19
    else 15
  end,
  case c.slug
    when 'kuska-educa' then 16
    when 'salud-en-ruta' then 14
    when 'amazonia-viva' then 11
    when 'manos-que-alimentan' then 15
    else 12
  end,
  case c.slug
    when 'kuska-educa' then 21
    when 'salud-en-ruta' then 19
    when 'amazonia-viva' then 17
    when 'manos-que-alimentan' then 16
    else 15
  end,
  case c.slug
    when 'kuska-educa' then 13
    when 'salud-en-ruta' then 12
    when 'amazonia-viva' then 11
    when 'manos-que-alimentan' then 14
    else 11
  end,
  case c.slug
    when 'amazonia-viva' then array['Verificación financiera externa pendiente']
    else array[]::text[]
  end,
  case c.slug
    when 'amazonia-viva' then array['Información financiera externa en revisión']
    else array[]::text[]
  end,
  now()
from public.charities c
on conflict (charity_id) do nothing;
