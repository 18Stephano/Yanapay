import { isAdminAuthorized, unauthorizedResponse } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  if (!isAdminAuthorized(request)) {
    return unauthorizedResponse();
  }

  const body = (await request.json()) as { draftCharityId?: string };
  if (!body.draftCharityId) {
    return Response.json({ error: "draftCharityId is required" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return Response.json({ error: "Admin Supabase not configured" }, { status: 503 });
  }

  const { data: draft, error: draftError } = await supabase
    .from("draft_charities")
    .select("*")
    .eq("id", body.draftCharityId)
    .eq("status", "draft")
    .single();

  if (draftError || !draft) {
    return Response.json({ error: "Draft not found" }, { status: 404 });
  }

  const { data: draftRating } = await supabase
    .from("draft_charity_ratings")
    .select("*")
    .eq("draft_charity_id", draft.id)
    .single();

  if (!draftRating) {
    return Response.json({ error: "Draft rating not found" }, { status: 404 });
  }

  const { data: charity, error: charityError } = await supabase
    .from("charities")
    .upsert(
      {
        slug: draft.slug,
        name: draft.name,
        tagline: draft.tagline,
        mission: draft.mission,
        location: draft.location,
        region: draft.region,
        categories: draft.categories,
        founded: draft.founded,
        website: draft.website,
        support_url: draft.support_url,
        contact_email: draft.contact_email,
        verified: draft.verified,
        highlights: draft.highlights,
        evidence: draft.evidence,
        published: true,
        rating: {},
      },
      { onConflict: "slug" },
    )
    .select("id")
    .single();

  if (charityError || !charity) {
    return Response.json({ error: charityError?.message }, { status: 500 });
  }

  const { data: publishedRating, error: ratingError } = await supabase
    .from("charity_ratings")
    .upsert(
      {
        charity_id: charity.id,
        overall_score: draftRating.overall_score,
        confidence: draftRating.confidence,
        summary: draftRating.summary,
        status: "published",
        legalidad_registro: draftRating.legalidad_registro,
        transparencia_financiera: draftRating.transparencia_financiera,
        gobernanza_rendicion: draftRating.gobernanza_rendicion,
        impacto_efectividad: draftRating.impacto_efectividad,
        cultura_reputacion: draftRating.cultura_reputacion,
        missing_information: draftRating.missing_information,
        red_flags: draftRating.red_flags,
        reviewed_at: new Date().toISOString(),
      },
      { onConflict: "charity_id" },
    )
    .select("id")
    .single();

  if (ratingError || !publishedRating) {
    return Response.json({ error: ratingError?.message }, { status: 500 });
  }

  const rawEvidence = (draftRating.evidence ?? []) as Array<Record<string, string>>;

  if (rawEvidence.length) {
    await supabase.from("rating_evidence").delete().eq("rating_id", publishedRating.id);
    await supabase.from("rating_evidence").insert(
      rawEvidence.map((e) => ({
        rating_id: publishedRating.id,
        dimension: e.dimension,
        source_title: e.sourceTitle ?? e.source_title,
        source_url: e.sourceUrl ?? e.source_url,
        finding: e.finding,
        confidence: e.confidence ?? "medium",
      })),
    );
  }

  await supabase
    .from("draft_charities")
    .update({ status: "approved", updated_at: new Date().toISOString() })
    .eq("id", draft.id);

  return Response.json({
    charityId: charity.id,
    slug: draft.slug,
    message: "Published to public charities.",
  });
}
