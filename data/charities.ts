import type { Charity } from "@/lib/types";

export const charities: Charity[] = [
  {
    slug: "kuska-educa",
    name: "Kuska Educa",
    tagline: "After-school learning circles for students in the Andes.",
    mission:
      "Kuska Educa supports rural students with tutoring, digital learning access, and family engagement programs in Quechua-speaking communities.",
    location: "Cusco, Peru",
    region: "Cusco",
    categories: ["Education", "Rural communities", "Youth"],
    founded: 2016,
    website: "https://example.org/kuska-educa",
    supportUrl: "https://example.org/kuska-educa/donate",
    contactEmail: "hola@kuskaeduca.org",
    verified: true,
    rating: {
      transparency: 92,
      financialHealth: 84,
      accountability: 88,
      impactEvidence: 86,
      communityTrust: 94,
    },
    highlights: [
      "Publishes annual activity reports",
      "Tracks student attendance and grade improvement",
      "Partners with local teachers and parent committees",
    ],
    evidence: [
      "1,200 students reached in 18 communities",
      "68% of regular participants improved math assessment scores",
      "Community advisory board meets quarterly",
    ],
  },
  {
    slug: "salud-en-ruta",
    name: "Salud en Ruta",
    tagline: "Mobile health brigades for underserved coastal neighborhoods.",
    mission:
      "Salud en Ruta brings preventive care, maternal health guidance, and basic screenings to families with limited clinic access.",
    location: "Lima Norte, Peru",
    region: "Lima",
    categories: ["Health", "Women and families", "Prevention"],
    founded: 2019,
    website: "https://example.org/salud-en-ruta",
    supportUrl: "https://example.org/salud-en-ruta/support",
    contactEmail: "contacto@saludenruta.org",
    verified: true,
    rating: {
      transparency: 81,
      financialHealth: 78,
      accountability: 76,
      impactEvidence: 83,
      communityTrust: 89,
    },
    highlights: [
      "Works with volunteer clinicians",
      "Runs monthly neighborhood health days",
      "Maintains patient referral partnerships",
    ],
    evidence: [
      "4,600 screenings completed last year",
      "32 community health volunteers trained",
      "Referral follow-up tracked for high-risk patients",
    ],
  },
  {
    slug: "amazonia-viva",
    name: "Amazonia Viva",
    tagline: "Conservation and livelihood support in the Peruvian Amazon.",
    mission:
      "Amazonia Viva protects forest ecosystems by funding community monitoring, sustainable crops, and youth environmental education.",
    location: "Iquitos, Peru",
    region: "Loreto",
    categories: ["Environment", "Indigenous communities", "Livelihoods"],
    founded: 2014,
    website: "https://example.org/amazonia-viva",
    supportUrl: "https://example.org/amazonia-viva/donate",
    contactEmail: "equipo@amazoniaviva.org",
    verified: false,
    rating: {
      transparency: 74,
      financialHealth: 72,
      accountability: 69,
      impactEvidence: 79,
      communityTrust: 86,
    },
    highlights: [
      "Supports community-led forest patrols",
      "Pilots sustainable cacao and aguaje income programs",
      "Builds school-based conservation clubs",
    ],
    evidence: [
      "2,800 hectares monitored with local partners",
      "140 families participating in livelihood pilots",
      "External financial reporting still under review",
    ],
  },
  {
    slug: "manos-que-alimentan",
    name: "Manos que Alimentan",
    tagline: "Food security and nutrition support for vulnerable households.",
    mission:
      "Manos que Alimentan connects surplus food, community kitchens, and nutrition education for families facing food insecurity.",
    location: "Arequipa, Peru",
    region: "Arequipa",
    categories: ["Food security", "Community kitchens", "Nutrition"],
    founded: 2020,
    website: "https://example.org/manos-que-alimentan",
    supportUrl: "https://example.org/manos-que-alimentan/support",
    contactEmail: "apoyo@manosalimentan.org",
    verified: true,
    rating: {
      transparency: 88,
      financialHealth: 80,
      accountability: 82,
      impactEvidence: 77,
      communityTrust: 91,
    },
    highlights: [
      "Coordinates donations from markets and restaurants",
      "Publishes monthly meal distribution totals",
      "Pairs food relief with nutrition workshops",
    ],
    evidence: [
      "92,000 meals distributed in 2025",
      "21 community kitchens supported",
      "Impact measurement for nutrition outcomes is in progress",
    ],
  },
];

export const categories = Array.from(
  new Set(charities.flatMap((charity) => charity.categories)),
).sort();
