import type {
  ConfidenceLevel,
  DimensionScore,
  RatingBreakdown,
  RatingDimension,
  YanapayRating,
} from "@/lib/types";

export const RATING_DIMENSIONS: RatingDimension[] = [
  "legalidadRegistro",
  "transparenciaFinanciera",
  "gobernanzaRendicion",
  "impactoEfectividad",
  "culturaReputacion",
];

export const ratingMaxScores: Record<RatingDimension, number> = {
  legalidadRegistro: 15,
  transparenciaFinanciera: 25,
  gobernanzaRendicion: 20,
  impactoEfectividad: 25,
  culturaReputacion: 15,
};

export const ratingLabels: Record<RatingDimension, string> = {
  legalidadRegistro: "Legalidad y Registro",
  transparenciaFinanciera: "Transparencia Financiera",
  gobernanzaRendicion: "Gobernanza y Rendición de Cuentas",
  impactoEfectividad: "Impacto y Efectividad",
  culturaReputacion: "Cultura, Reputación y Gestión",
};

export const ratingDescriptions: Record<RatingDimension, string> = {
  legalidadRegistro:
    "Registro APCI, RUC activo/habido en SUNAT, existencia legal en SUNARP, tipo de organización (ONGD, ENIEX, IPREDA, asociación, fundación).",
  transparenciaFinanciera:
    "Memorias anuales, estados financieros auditados, gastos por programa vs administrativos, diversificación de fondos, información presupuestal pública.",
  gobernanzaRendicion:
    "Visibilidad del directorio, política de conflicto de interés, canal de denuncias, responsable de cumplimiento, auditorías externas, declaraciones APCI.",
  impactoEfectividad:
    "Teoría del cambio, métricas de resultado (no solo actividades), evaluaciones externas, costo por beneficiario, divulgación de aprendizajes.",
  culturaReputacion:
    "Prácticas de personal/voluntariado, cumplimiento laboral, reconocimientos, alianzas, reputación pública, premios y señales de alerta.",
};

export function calculateOverallScore(breakdown: RatingBreakdown): number {
  return RATING_DIMENSIONS.reduce((total, dimension) => {
    const max = ratingMaxScores[dimension];
    const score = Math.min(Math.max(0, breakdown[dimension] ?? 0), max);
    return total + score;
  }, 0);
}

export function buildDimensionScores(
  breakdown: RatingBreakdown,
  summaries: Partial<Record<RatingDimension, string>> = {},
  confidences: Partial<Record<RatingDimension, ConfidenceLevel>> = {},
): Record<RatingDimension, DimensionScore> {
  const dimensions = {} as Record<RatingDimension, DimensionScore>;

  for (const dimension of RATING_DIMENSIONS) {
    const maxScore = ratingMaxScores[dimension];
    const score = Math.min(Math.max(0, breakdown[dimension] ?? 0), maxScore);
    dimensions[dimension] = {
      score,
      maxScore,
      summary: summaries[dimension] ?? ratingDescriptions[dimension],
      confidence: confidences[dimension] ?? "medium",
    };
  }

  return dimensions;
}

export function buildYanapayRating(input: {
  breakdown: RatingBreakdown;
  confidence?: ConfidenceLevel;
  summary?: string;
  status?: YanapayRating["status"];
  evidence?: YanapayRating["evidence"];
  missingInformation?: string[];
  redFlags?: string[];
  reviewedAt?: string;
  dimensionSummaries?: Partial<Record<RatingDimension, string>>;
  dimensionConfidences?: Partial<Record<RatingDimension, ConfidenceLevel>>;
}): YanapayRating {
  const dimensions = buildDimensionScores(
    input.breakdown,
    input.dimensionSummaries,
    input.dimensionConfidences,
  );

  return {
    overallScore: calculateOverallScore(input.breakdown),
    confidence: input.confidence ?? "medium",
    summary:
      input.summary ??
      "Puntuación Yanapay basada en cinco dimensiones adaptadas al contexto peruano.",
    status: input.status ?? "published",
    dimensions,
    evidence: input.evidence ?? [],
    missingInformation: input.missingInformation ?? [],
    redFlags: input.redFlags ?? [],
    reviewedAt: input.reviewedAt,
  };
}

export function getRatingLabel(score: number) {
  if (score >= 90) return "Excelente";
  if (score >= 75) return "Bueno";
  if (score >= 60) return "En desarrollo";
  if (score >= 50) return "Necesita mejorar";
  return "Revisión requerida";
}

export function getRatingTone(score: number) {
  if (score >= 85) return "bg-emerald-100 text-emerald-800 ring-emerald-200";
  if (score >= 70) return "bg-sky-100 text-sky-800 ring-sky-200";
  if (score >= 60) return "bg-amber-100 text-amber-800 ring-amber-200";
  return "bg-rose-100 text-rose-800 ring-rose-200";
}

export function getConfidenceLabel(confidence: ConfidenceLevel) {
  if (confidence === "high") return "Alta confianza";
  if (confidence === "low") return "Baja confianza";
  return "Confianza media";
}

export function getConfidenceTone(confidence: ConfidenceLevel) {
  if (confidence === "high") return "bg-emerald-50 text-emerald-700";
  if (confidence === "low") return "bg-rose-50 text-rose-700";
  return "bg-slate-100 text-slate-700";
}
