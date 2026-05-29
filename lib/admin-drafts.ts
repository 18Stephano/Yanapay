import { buildDimensionScores } from "@/lib/ratings";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import type { YanapayRating } from "@/lib/types";

export type DraftListItem = {
  id: string;
  slug: string;
  name: string;
  status: string;
  overallScore: number | null;
  createdAt: string;
};

export type DraftDetail = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  mission: string;
  location: string;
  region: string;
  categories: string[];
  founded: number;
  website: string;
  supportUrl: string;
  contactEmail: string;
  highlights: string[];
  evidence: string[];
  status: string;
  rating: YanapayRating | null;
};

export async function listDrafts(): Promise<DraftListItem[]> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("draft_charities")
    .select("id, slug, name, status, created_at, draft_charity_ratings(overall_score)")
    .order("created_at", { ascending: false });

  return (
    data?.map((row) => {
      const ratings = row.draft_charity_ratings as
        | { overall_score: number }
        | { overall_score: number }[]
        | null;
      const score = Array.isArray(ratings) ? ratings[0]?.overall_score : ratings?.overall_score;

      return {
        id: row.id,
        slug: row.slug,
        name: row.name,
        status: row.status,
        overallScore: score ?? null,
        createdAt: row.created_at,
      };
    }) ?? []
  );
}

export async function getDraftById(id: string): Promise<DraftDetail | null> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;

  const { data: draft } = await supabase
    .from("draft_charities")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!draft) return null;

  const { data: ratingRow } = await supabase
    .from("draft_charity_ratings")
    .select("*")
    .eq("draft_charity_id", id)
    .maybeSingle();

  let rating: YanapayRating | null = null;

  if (ratingRow) {
    const breakdown = {
      legalidadRegistro: ratingRow.legalidad_registro,
      transparenciaFinanciera: ratingRow.transparencia_financiera,
      gobernanzaRendicion: ratingRow.gobernanza_rendicion,
      impactoEfectividad: ratingRow.impacto_efectividad,
      culturaReputacion: ratingRow.cultura_reputacion,
    };
    const summaries = ratingRow.dimension_summaries as Record<string, string>;

    rating = {
      overallScore: ratingRow.overall_score,
      confidence: ratingRow.confidence,
      summary: ratingRow.summary,
      status: "draft",
      dimensions: buildDimensionScores(
        breakdown,
        summaries as Partial<Record<keyof typeof breakdown, string>>,
      ),
      evidence: (ratingRow.evidence as YanapayRating["evidence"]) ?? [],
      missingInformation: ratingRow.missing_information ?? [],
      redFlags: ratingRow.red_flags ?? [],
    };
  }

  return {
    id: draft.id,
    slug: draft.slug,
    name: draft.name,
    tagline: draft.tagline,
    mission: draft.mission,
    location: draft.location,
    region: draft.region,
    categories: draft.categories,
    founded: draft.founded,
    website: draft.website,
    supportUrl: draft.support_url,
    contactEmail: draft.contact_email,
    highlights: draft.highlights,
    evidence: draft.evidence,
    status: draft.status,
    rating,
  };
}
