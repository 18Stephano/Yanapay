import { buildYanapayRating } from "@/lib/ratings";
import { buildRubricPrompt } from "@/lib/research/rubric-prompt";
import type { RatingDimension, RatingEvidence } from "@/lib/types";

export type ResearchDraftResult = {
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
  evidenceNotes: string[];
  rating: ReturnType<typeof buildYanapayRating>;
  rawModelOutput?: string;
};

type ModelPayload = {
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
  evidenceNotes: string[];
  rating: {
    legalidadRegistro: number;
    transparenciaFinanciera: number;
    gobernanzaRendicion: number;
    impactoEfectividad: number;
    culturaReputacion: number;
    confidence: "high" | "medium" | "low";
    summary: string;
    missingInformation: string[];
    redFlags: string[];
    dimensionSummaries?: Partial<Record<RatingDimension, string>>;
    evidence?: Array<{
      dimension: RatingDimension;
      sourceTitle: string;
      sourceUrl: string;
      finding: string;
      confidence: "high" | "medium" | "low";
    }>;
  };
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildStubDraft(
  charityName: string,
  website?: string,
  notes?: string,
): ResearchDraftResult {
  const slug = slugify(charityName);
  const site = website ?? `https://example.org/${slug}`;

  const rating = buildYanapayRating({
    breakdown: {
      legalidadRegistro: 8,
      transparenciaFinanciera: 12,
      gobernanzaRendicion: 10,
      impactoEfectividad: 12,
      culturaReputacion: 9,
    },
    confidence: "low",
    summary:
      "Borrador generado sin LLM configurado. Requiere revisión humana y fuentes verificadas antes de publicar.",
    status: "draft",
    missingInformation: [
      "Verificación APCI no confirmada automáticamente",
      "Estados financieros auditados no verificados",
      "Directorio y políticas de gobernanza pendientes de revisión",
    ],
    redFlags: notes?.toLowerCase().includes("alert") ? ["Notas del administrador mencionan alerta"] : [],
    evidence: [
      {
        dimension: "legalidadRegistro",
        sourceTitle: "Entrada manual / sitio proporcionado",
        sourceUrl: site,
        finding: `Investigación iniciada para ${charityName}.`,
        confidence: "low",
      },
    ],
  });

  return {
    slug,
    name: charityName,
    tagline: `Borrador de perfil para ${charityName}`,
    mission: notes ?? `Perfil en revisión para ${charityName} en el contexto peruano.`,
    location: "Perú",
    region: "Por confirmar",
    categories: ["Por clasificar"],
    founded: new Date().getFullYear(),
    website: site,
    supportUrl: site,
    contactEmail: `contacto@${slug}.org`,
    highlights: ["Borrador — requiere revisión administrativa"],
    evidenceNotes: [],
    rating,
  };
}

async function callClaude(prompt: string): Promise<ModelPayload | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL ?? "claude-3-5-haiku-latest",
      max_tokens: 4000,
      system: "You output only valid JSON for charity evaluation.",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = (await response.json()) as {
    content: Array<{ type: "text"; text: string }>;
  };
  const content = data.content.find((block) => block.type === "text")?.text;
  if (!content) return null;

  return JSON.parse(content) as ModelPayload;
}

function payloadToDraft(payload: ModelPayload, raw?: string): ResearchDraftResult {
  const evidence: RatingEvidence[] =
    payload.rating.evidence?.map((e) => ({
      dimension: e.dimension,
      sourceTitle: e.sourceTitle,
      sourceUrl: e.sourceUrl,
      finding: e.finding,
      confidence: e.confidence,
    })) ?? [];

  const rating = buildYanapayRating({
    breakdown: {
      legalidadRegistro: payload.rating.legalidadRegistro,
      transparenciaFinanciera: payload.rating.transparenciaFinanciera,
      gobernanzaRendicion: payload.rating.gobernanzaRendicion,
      impactoEfectividad: payload.rating.impactoEfectividad,
      culturaReputacion: payload.rating.culturaReputacion,
    },
    confidence: payload.rating.confidence,
    summary: payload.rating.summary,
    status: "draft",
    missingInformation: payload.rating.missingInformation,
    redFlags: payload.rating.redFlags,
    dimensionSummaries: payload.rating.dimensionSummaries,
    evidence,
  });

  return {
    slug: payload.slug,
    name: payload.name,
    tagline: payload.tagline,
    mission: payload.mission,
    location: payload.location,
    region: payload.region,
    categories: payload.categories,
    founded: payload.founded,
    website: payload.website,
    supportUrl: payload.supportUrl,
    contactEmail: payload.contactEmail,
    highlights: payload.highlights,
    evidenceNotes: payload.evidenceNotes,
    rating,
    rawModelOutput: raw,
  };
}

export async function runCharityResearch(input: {
  charityName: string;
  website?: string;
  ruc?: string;
  notes?: string;
}): Promise<ResearchDraftResult> {
  const prompt = buildRubricPrompt(
    input.charityName,
    input.website,
    input.ruc,
    input.notes,
  );

  try {
    const payload = await callClaude(prompt);
    if (payload) {
      return payloadToDraft(payload);
    }
  } catch {
    // fall through to stub
  }

  return buildStubDraft(input.charityName, input.website, input.notes);
}
