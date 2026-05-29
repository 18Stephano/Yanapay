import { runCharityResearch } from "@/lib/research/run-research";
import { isAdminAuthorized, unauthorizedResponse } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export const maxDuration = 60;

export async function POST(request: Request) {
  if (!isAdminAuthorized(request)) {
    return unauthorizedResponse();
  }

  const body = (await request.json()) as {
    charityName?: string;
    website?: string;
    ruc?: string;
    notes?: string;
  };

  if (!body.charityName?.trim()) {
    return Response.json({ error: "charityName is required" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return Response.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY required for admin research" },
      { status: 503 },
    );
  }

  const { data: researchRequest, error: requestError } = await supabase
    .from("charity_research_requests")
    .insert({
      charity_name: body.charityName.trim(),
      website: body.website ?? null,
      ruc: body.ruc ?? null,
      notes: body.notes ?? null,
      status: "running",
    })
    .select("id")
    .single();

  if (requestError || !researchRequest) {
    return Response.json({ error: requestError?.message }, { status: 500 });
  }

  try {
    const draft = await runCharityResearch({
      charityName: body.charityName.trim(),
      website: body.website,
      ruc: body.ruc,
      notes: body.notes,
    });

    const { data: draftCharity, error: draftError } = await supabase
      .from("draft_charities")
      .insert({
        research_request_id: researchRequest.id,
        slug: draft.slug,
        name: draft.name,
        tagline: draft.tagline,
        mission: draft.mission,
        location: draft.location,
        region: draft.region,
        categories: draft.categories,
        founded: draft.founded,
        website: draft.website,
        support_url: draft.supportUrl,
        contact_email: draft.contactEmail,
        highlights: draft.highlights,
        evidence: draft.evidenceNotes,
        status: "draft",
      })
      .select("id")
      .single();

    if (draftError || !draftCharity) {
      throw new Error(draftError?.message ?? "Failed to save draft charity");
    }

    await supabase.from("draft_charity_ratings").insert({
      draft_charity_id: draftCharity.id,
      overall_score: draft.rating.overallScore,
      confidence: draft.rating.confidence,
      summary: draft.rating.summary,
      legalidad_registro: draft.rating.dimensions.legalidadRegistro.score,
      transparencia_financiera: draft.rating.dimensions.transparenciaFinanciera.score,
      gobernanza_rendicion: draft.rating.dimensions.gobernanzaRendicion.score,
      impacto_efectividad: draft.rating.dimensions.impactoEfectividad.score,
      cultura_reputacion: draft.rating.dimensions.culturaReputacion.score,
      missing_information: draft.rating.missingInformation,
      red_flags: draft.rating.redFlags,
      dimension_summaries: Object.fromEntries(
        Object.entries(draft.rating.dimensions).map(([k, v]) => [k, v.summary]),
      ),
      evidence: draft.rating.evidence,
      review_required: true,
    });

    if (draft.rating.evidence.length) {
      await supabase.from("charity_research_findings").insert(
        draft.rating.evidence.map((e) => ({
          request_id: researchRequest.id,
          source_title: e.sourceTitle,
          source_url: e.sourceUrl,
          finding: e.finding,
          dimension: e.dimension,
          confidence: e.confidence,
        })),
      );
    }

    await supabase
      .from("charity_research_requests")
      .update({ status: "complete", updated_at: new Date().toISOString() })
      .eq("id", researchRequest.id);

    return Response.json({
      requestId: researchRequest.id,
      draftCharityId: draftCharity.id,
      draft,
      message: "Draft created. Human review required before publishing.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Research failed";
    await supabase
      .from("charity_research_requests")
      .update({ status: "failed", error_message: message })
      .eq("id", researchRequest.id);

    return Response.json({ error: message }, { status: 500 });
  }
}
