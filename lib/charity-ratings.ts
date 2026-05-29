import { charityRatingsBySlug } from "@/data/charity-ratings";
import { buildDimensionScores, buildYanapayRating } from "@/lib/ratings";
import { createSupabaseClient } from "@/lib/supabase";
import type {
  ConfidenceLevel,
  RatingDimension,
  RatingEvidence,
  YanapayRating,
} from "@/lib/types";

type CharityRatingRow = {
  id: string;
  overall_score: number;
  confidence: ConfidenceLevel;
  summary: string;
  status: YanapayRating["status"];
  legalidad_registro: number;
  transparencia_financiera: number;
  gobernanza_rendicion: number;
  impacto_efectividad: number;
  cultura_reputacion: number;
  missing_information: string[];
  red_flags: string[];
  reviewed_at: string | null;
};

function rowToRating(row: Omit<CharityRatingRow, "id">, evidence: RatingEvidence[]): YanapayRating {
  const breakdown = {
    legalidadRegistro: row.legalidad_registro,
    transparenciaFinanciera: row.transparencia_financiera,
    gobernanzaRendicion: row.gobernanza_rendicion,
    impactoEfectividad: row.impacto_efectividad,
    culturaReputacion: row.cultura_reputacion,
  };

  return {
    overallScore: row.overall_score,
    confidence: row.confidence,
    summary: row.summary,
    status: row.status,
    dimensions: buildDimensionScores(breakdown),
    evidence,
    missingInformation: row.missing_information ?? [],
    redFlags: row.red_flags ?? [],
    reviewedAt: row.reviewed_at ?? undefined,
  };
}

function emptyFallback(): YanapayRating {
  return buildYanapayRating({
    breakdown: {
      legalidadRegistro: 0,
      transparenciaFinanciera: 0,
      gobernanzaRendicion: 0,
      impactoEfectividad: 0,
      culturaReputacion: 0,
    },
    confidence: "low",
    summary: "Sin puntuación publicada.",
    status: "draft",
  });
}

export async function getRatingForCharity(
  charityId: string | null,
  slug: string,
): Promise<YanapayRating> {
  const fallback = charityRatingsBySlug[slug] ?? emptyFallback();
  const supabase = createSupabaseClient();

  if (!supabase || !charityId) {
    return fallback;
  }

  const { data: ratingRow } = await supabase
    .from("charity_ratings")
    .select(
      "id, overall_score, confidence, summary, status, legalidad_registro, transparencia_financiera, gobernanza_rendicion, impacto_efectividad, cultura_reputacion, missing_information, red_flags, reviewed_at",
    )
    .eq("charity_id", charityId)
    .eq("status", "published")
    .maybeSingle();

  if (!ratingRow) {
    return fallback;
  }

  const { data: evidenceRows } = await supabase
    .from("rating_evidence")
    .select("dimension, source_title, source_url, finding, confidence")
    .eq("rating_id", ratingRow.id);

  const evidence: RatingEvidence[] =
    evidenceRows?.length
      ? evidenceRows.map((row) => ({
          dimension: row.dimension as RatingDimension,
          sourceTitle: row.source_title,
          sourceUrl: row.source_url,
          finding: row.finding,
          confidence: row.confidence as ConfidenceLevel,
        }))
      : fallback.evidence;

  const { id, ...rest } = ratingRow;
  void id;
  return rowToRating(rest, evidence);
}
