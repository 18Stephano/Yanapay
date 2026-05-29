import {
  RATING_DIMENSIONS,
  ratingDescriptions,
  ratingLabels,
  ratingMaxScores,
} from "@/lib/ratings";

export function buildRubricPrompt(charityName: string, website?: string, ruc?: string, notes?: string) {
  const dimensionsBlock = RATING_DIMENSIONS.map(
    (d) => `- ${ratingLabels[d]} (max ${ratingMaxScores[d]}): ${ratingDescriptions[d]}`,
  ).join("\n");

  return `You are a charity evaluator for Yanapay, a Peru-focused donation platform.
Research the organization "${charityName}"${website ? ` (website: ${website})` : ""}${ruc ? ` (RUC: ${ruc})` : ""}.
${notes ? `Additional notes: ${notes}` : ""}

Score using ONLY these five dimensions (total 100 points):
${dimensionsBlock}

Return valid JSON only with this shape:
{
  "slug": "kebab-case-slug",
  "name": "",
  "tagline": "",
  "mission": "",
  "location": "",
  "region": "",
  "categories": [],
  "founded": 0,
  "website": "",
  "supportUrl": "",
  "contactEmail": "",
  "highlights": [],
  "evidenceNotes": [],
  "rating": {
    "legalidadRegistro": 0,
    "transparenciaFinanciera": 0,
    "gobernanzaRendicion": 0,
    "impactoEfectividad": 0,
    "culturaReputacion": 0,
    "confidence": "high|medium|low",
    "summary": "",
    "missingInformation": [],
    "redFlags": [],
    "dimensionSummaries": {},
    "evidence": [{"dimension":"","sourceTitle":"","sourceUrl":"","finding":"","confidence":"medium"}]
  }
}

Be conservative. Use missingInformation when data is not found. Never invent audited financials or APCI registration without a source.`;
}
