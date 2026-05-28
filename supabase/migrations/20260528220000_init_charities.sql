create table if not exists public.charities (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tagline text not null,
  mission text not null,
  location text not null,
  region text not null,
  categories text[] not null default '{}',
  founded integer not null,
  website text not null,
  support_url text not null,
  contact_email text not null,
  verified boolean not null default false,
  rating jsonb not null,
  highlights text[] not null default '{}',
  evidence text[] not null default '{}',
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.charities enable row level security;

create policy "Public can read published charities"
  on public.charities
  for select
  using (published = true);

insert into public.charities (
  slug,
  name,
  tagline,
  mission,
  location,
  region,
  categories,
  founded,
  website,
  support_url,
  contact_email,
  verified,
  rating,
  highlights,
  evidence
) values
(
  'kuska-educa',
  'Kuska Educa',
  'After-school learning circles for students in the Andes.',
  'Kuska Educa supports rural students with tutoring, digital learning access, and family engagement programs in Quechua-speaking communities.',
  'Cusco, Peru',
  'Cusco',
  array['Education', 'Rural communities', 'Youth'],
  2016,
  'https://example.org/kuska-educa',
  'https://example.org/kuska-educa/donate',
  'hola@kuskaeduca.org',
  true,
  '{"transparency":92,"financialHealth":84,"accountability":88,"impactEvidence":86,"communityTrust":94}'::jsonb,
  array[
    'Publishes annual activity reports',
    'Tracks student attendance and grade improvement',
    'Partners with local teachers and parent committees'
  ],
  array[
    '1,200 students reached in 18 communities',
    '68% of regular participants improved math assessment scores',
    'Community advisory board meets quarterly'
  ]
),
(
  'salud-en-ruta',
  'Salud en Ruta',
  'Mobile health brigades for underserved coastal neighborhoods.',
  'Salud en Ruta brings preventive care, maternal health guidance, and basic screenings to families with limited clinic access.',
  'Lima Norte, Peru',
  'Lima',
  array['Health', 'Women and families', 'Prevention'],
  2019,
  'https://example.org/salud-en-ruta',
  'https://example.org/salud-en-ruta/support',
  'contacto@saludenruta.org',
  true,
  '{"transparency":81,"financialHealth":78,"accountability":76,"impactEvidence":83,"communityTrust":89}'::jsonb,
  array[
    'Works with volunteer clinicians',
    'Runs monthly neighborhood health days',
    'Maintains patient referral partnerships'
  ],
  array[
    '4,600 screenings completed last year',
    '32 community health volunteers trained',
    'Referral follow-up tracked for high-risk patients'
  ]
),
(
  'amazonia-viva',
  'Amazonia Viva',
  'Conservation and livelihood support in the Peruvian Amazon.',
  'Amazonia Viva protects forest ecosystems by funding community monitoring, sustainable crops, and youth environmental education.',
  'Iquitos, Peru',
  'Loreto',
  array['Environment', 'Indigenous communities', 'Livelihoods'],
  2014,
  'https://example.org/amazonia-viva',
  'https://example.org/amazonia-viva/donate',
  'equipo@amazoniaviva.org',
  false,
  '{"transparency":74,"financialHealth":72,"accountability":69,"impactEvidence":79,"communityTrust":86}'::jsonb,
  array[
    'Supports community-led forest patrols',
    'Pilots sustainable cacao and aguaje income programs',
    'Builds school-based conservation clubs'
  ],
  array[
    '2,800 hectares monitored with local partners',
    '140 families participating in livelihood pilots',
    'External financial reporting still under review'
  ]
),
(
  'manos-que-alimentan',
  'Manos que Alimentan',
  'Food security and nutrition support for vulnerable households.',
  'Manos que Alimentan connects surplus food, community kitchens, and nutrition education for families facing food insecurity.',
  'Arequipa, Peru',
  'Arequipa',
  array['Food security', 'Community kitchens', 'Nutrition'],
  2020,
  'https://example.org/manos-que-alimentan',
  'https://example.org/manos-que-alimentan/support',
  'apoyo@manosalimentan.org',
  true,
  '{"transparency":88,"financialHealth":80,"accountability":82,"impactEvidence":77,"communityTrust":91}'::jsonb,
  array[
    'Coordinates donations from markets and restaurants',
    'Publishes monthly meal distribution totals',
    'Pairs food relief with nutrition workshops'
  ],
  array[
    '92,000 meals distributed in 2025',
    '21 community kitchens supported',
    'Impact measurement for nutrition outcomes is in progress'
  ]
)
on conflict (slug) do nothing;
