create table if not exists public.entrepreneurship_projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  tagline text not null,
  story text not null,
  founder text not null,
  team text not null,
  region text not null,
  location text not null,
  categories text[] not null default '{}',
  goal_amount integer not null,
  raised_amount integer not null default 0,
  currency text not null default 'USD',
  status text not null check (status in ('active', 'funded', 'coming_soon')),
  milestones jsonb not null default '[]'::jsonb,
  support_url text not null,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.entrepreneurship_projects enable row level security;

create policy "Public can read published entrepreneurship projects"
  on public.entrepreneurship_projects
  for select
  using (published = true);

insert into public.entrepreneurship_projects (
  slug,
  title,
  tagline,
  story,
  founder,
  team,
  region,
  location,
  categories,
  goal_amount,
  raised_amount,
  currency,
  status,
  milestones,
  support_url
) values
(
  'andean-artisan-collective',
  'Andean Artisan Collective',
  'A digital marketplace for Quechua textile cooperatives.',
  'This project helps artisan groups in the Sacred Valley sell directly to buyers, track orders, and reinvest profits into training for young weavers.',
  'María Quispe',
  '6 cooperative leaders and 2 product designers',
  'Cusco',
  'Ollantaytambo, Peru',
  array['E-commerce', 'Indigenous artisans', 'Rural income'],
  18000,
  9200,
  'USD',
  'active',
  '[
    {"title":"Pilot storefront launched","status":"completed"},
    {"title":"Onboard 40 artisan listings","status":"in_progress"},
    {"title":"Launch bilingual customer support","status":"planned"}
  ]'::jsonb,
  'https://example.org/andean-artisan-collective'
),
(
  'solar-labs-cusco',
  'Solar Labs Cusco',
  'Affordable solar kits for off-grid community centers.',
  'Solar Labs Cusco designs modular solar kits for schools and health posts that lack reliable electricity, with local technicians handling installation and maintenance.',
  'Diego Rojas',
  '4 engineers and 8 community technicians',
  'Cusco',
  'Cusco, Peru',
  array['Clean energy', 'Hardware', 'Rural infrastructure'],
  25000,
  14100,
  'USD',
  'active',
  '[
    {"title":"Prototype kit tested in 3 villages","status":"completed"},
    {"title":"Certify installation partners","status":"in_progress"},
    {"title":"Deploy 25 community centers","status":"planned"}
  ]'::jsonb,
  'https://example.org/solar-labs-cusco'
),
(
  'lima-food-rescue',
  'Lima Food Rescue',
  'Routing surplus food from markets to neighborhood kitchens.',
  'Lima Food Rescue coordinates pickup routes, cold storage, and volunteer drivers so surplus produce reaches community kitchens instead of landfills.',
  'Camila Torres',
  '12 logistics volunteers and 5 kitchen partners',
  'Lima',
  'Lima, Peru',
  array['Food waste', 'Logistics', 'Social enterprise'],
  12000,
  12000,
  'USD',
  'funded',
  '[
    {"title":"Route planning software pilot","status":"completed"},
    {"title":"Expand to 8 districts","status":"completed"},
    {"title":"Launch donor transparency dashboard","status":"in_progress"}
  ]'::jsonb,
  'https://example.org/lima-food-rescue'
)
on conflict (slug) do nothing;
