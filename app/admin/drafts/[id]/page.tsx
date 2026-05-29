import Link from "next/link";
import { notFound } from "next/navigation";
import { PublishDraftButton } from "@/components/admin/PublishDraftButton";
import { RatingBreakdown } from "@/components/RatingBreakdown";
import { getDraftById } from "@/lib/admin-drafts";

type AdminDraftPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminDraftDetailPage({ params }: AdminDraftPageProps) {
  const { id } = await params;
  const draft = await getDraftById(id);

  if (!draft) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Link href="/admin/drafts" className="text-sm font-bold text-emerald-700">
        ← Borradores
      </Link>
      <h1 className="mt-6 text-3xl font-black text-slate-950">{draft.name}</h1>
      <p className="mt-2 text-slate-600">{draft.tagline}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-slate-950">Perfil propuesto</h2>
          <dl className="mt-4 space-y-2 text-sm text-slate-600">
            <div>
              <dt className="font-semibold text-slate-800">Región</dt>
              <dd>{draft.region}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-800">Misión</dt>
              <dd>{draft.mission}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-800">Web</dt>
              <dd>{draft.website}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-slate-950">Puntuación propuesta</h2>
          {draft.rating ? (
            <>
              <p className="mt-2 text-3xl font-black text-emerald-700">
                {draft.rating.overallScore}/100
              </p>
              <p className="mt-2 text-sm text-slate-600">{draft.rating.summary}</p>
              <div className="mt-4">
                <RatingBreakdown rating={draft.rating} detailed />
              </div>
            </>
          ) : (
            <p className="mt-2 text-sm text-slate-500">Sin puntuación</p>
          )}
        </section>
      </div>

      {draft.status === "draft" && (
        <div className="mt-8">
          <PublishDraftButton draftCharityId={draft.id} />
        </div>
      )}
    </div>
  );
}
