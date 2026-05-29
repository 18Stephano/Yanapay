import Link from "next/link";
import { notFound } from "next/navigation";
import { RatingBadge } from "@/components/RatingBadge";
import { RatingBreakdown } from "@/components/RatingBreakdown";
import { RATING_DIMENSIONS, ratingLabels } from "@/lib/ratings";
import { getCharityBySlug } from "@/lib/charities";

type RatingDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: RatingDetailsPageProps) {
  const { slug } = await params;
  const charity = await getCharityBySlug(slug);

  if (!charity) {
    return { title: "Puntuación no encontrada | Yanapay" };
  }

  return {
    title: `Puntuación Yanapay — ${charity.name}`,
    description: `Detalle de la evaluación Yanapay para ${charity.name}.`,
  };
}

export default async function RatingDetailsPage({ params }: RatingDetailsPageProps) {
  const { slug } = await params;
  const charity = await getCharityBySlug(slug);

  if (!charity) {
    notFound();
  }

  const { rating } = charity;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link href={`/charities/${slug}`} className="text-sm font-bold text-emerald-700">
        ← Volver al perfil
      </Link>

      <div className="mt-8 max-w-3xl">
        <p className="text-sm font-semibold text-emerald-700">Metodología Yanapay</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
          Cómo evaluamos a {charity.name}
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Yanapay adapta conceptos de evaluación de impacto al contexto peruano, usando
          fuentes como APCI, SUNAT, SUNARP, memorias anuales, sitios web de las ONGs y
          reportes públicos. Esta puntuación no es de Charity Navigator.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
        <section className="space-y-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <RatingBadge rating={rating} showConfidence />
            <p className="mt-4 leading-7 text-slate-600">{rating.summary}</p>
            {rating.reviewedAt && (
              <p className="mt-3 text-sm text-slate-500">
                Última revisión:{" "}
                {new Date(rating.reviewedAt).toLocaleDateString("es-PE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Desglose por dimensión</h2>
            <div className="mt-6">
              <RatingBreakdown rating={rating} detailed />
            </div>
          </div>

          {rating.evidence.length > 0 && (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-950">Evidencia por dimensión</h2>
              <div className="mt-6 space-y-6">
                {RATING_DIMENSIONS.map((dimension) => {
                  const items = rating.evidence.filter((e) => e.dimension === dimension);
                  if (!items.length) return null;

                  return (
                    <div key={dimension}>
                      <h3 className="font-semibold text-slate-950">
                        {ratingLabels[dimension]}
                      </h3>
                      <ul className="mt-3 space-y-3">
                        {items.map((item) => (
                          <li
                            key={`${item.sourceUrl}-${item.finding}`}
                            className="rounded-2xl bg-slate-50 p-4 text-sm"
                          >
                            <p className="text-slate-700">{item.finding}</p>
                            <a
                              href={item.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-block font-semibold text-emerald-700"
                            >
                              {item.sourceTitle}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        <aside className="space-y-6">
          {rating.missingInformation.length > 0 && (
            <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6">
              <h2 className="text-lg font-bold text-amber-900">Información no encontrada</h2>
              <ul className="mt-3 space-y-2 text-sm text-amber-800">
                {rating.missingInformation.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          )}

          {rating.redFlags.length > 0 && (
            <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-6">
              <h2 className="text-lg font-bold text-rose-900">Señales de alerta</h2>
              <ul className="mt-3 space-y-2 text-sm text-rose-800">
                {rating.redFlags.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">Las 5 dimensiones (100 pts)</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>Legalidad y Registro — 15 pts</li>
              <li>Transparencia Financiera — 25 pts</li>
              <li>Gobernanza y Rendición de Cuentas — 20 pts</li>
              <li>Impacto y Efectividad — 25 pts</li>
              <li>Cultura, Reputación y Gestión — 15 pts</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
