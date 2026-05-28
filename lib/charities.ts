import { charities as seedCharities } from "@/data/charities";
import { createSupabaseClient } from "@/lib/supabase";
import type { Charity, RatingBreakdown } from "@/lib/types";

type CharityRow = {
  slug: string;
  name: string;
  tagline: string;
  mission: string;
  location: string;
  region: string;
  categories: string[];
  founded: number;
  website: string;
  support_url: string;
  contact_email: string;
  verified: boolean;
  rating: RatingBreakdown;
  highlights: string[];
  evidence: string[];
};

function mapRowToCharity(row: CharityRow): Charity {
  return {
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    mission: row.mission,
    location: row.location,
    region: row.region,
    categories: row.categories,
    founded: row.founded,
    website: row.website,
    supportUrl: row.support_url,
    contactEmail: row.contact_email,
    verified: row.verified,
    rating: row.rating,
    highlights: row.highlights,
    evidence: row.evidence,
  };
}

export async function getCharities(): Promise<Charity[]> {
  const supabase = createSupabaseClient();

  if (!supabase) {
    return seedCharities;
  }

  const { data, error } = await supabase
    .from("charities")
    .select(
      "slug, name, tagline, mission, location, region, categories, founded, website, support_url, contact_email, verified, rating, highlights, evidence",
    )
    .eq("published", true)
    .order("name");

  if (error || !data?.length) {
    return seedCharities;
  }

  return data.map((row) => mapRowToCharity(row as CharityRow));
}

export async function getCharityBySlug(slug: string): Promise<Charity | undefined> {
  const charities = await getCharities();
  return charities.find((charity) => charity.slug === slug);
}

export async function getCategories(charities: Charity[]): Promise<string[]> {
  return Array.from(new Set(charities.flatMap((charity) => charity.categories))).sort();
}

export async function getCharityPageData() {
  const charities = await getCharities();
  const categories = await getCategories(charities);

  return { charities, categories };
}
