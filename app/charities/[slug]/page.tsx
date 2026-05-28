import Link from "next/link";
import { notFound } from "next/navigation";
import { RatingBadge } from "@/components/RatingBadge";
import { RatingBreakdown } from "@/components/RatingBreakdown";
import { charities } from "@/data/charities";

type CharityProfilePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return charities.map((charity) => ({
    slug: charity.slug,
  }));
}

export async function generateMetadata({ params }: CharityProfilePageProps) {
  const { slug } = await params;
  const charity = charities.find((item) => item.slug === slug);

  if (!charity) {
    return {
      title: "Charity not found | Yanapay",
    };
  }

  return {
    title: `${charity.name} | Yanapay`,
    description: charity.tagline,
  };
}

export default async function CharityProfilePage({ params }: CharityProfilePageProps) {
  const { slug } = await params;
  const charity = charities.find((item) => item.slug === slug);

  if (!charity) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link href="/charities" className="text-sm font-bold text-emerald-700">
        Back to directory
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <RatingBadge rating={charity.rating} />
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
              {charity.verified ? "Verified profile" : "Verification in progress"}
            </span>
          </div>
          <p className="text-sm font-semibold text-emerald-700">{charity.location}</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
            {charity.name}
          </h1>
          <p className="mt-4 text-xl leading-8 text-slate-600">{charity.tagline}</p>
          <div className="mt-8">
            <h2 className="text-xl font-bold text-slate-950">Mission</h2>
            <p className="mt-3 leading-8 text-slate-600">{charity.mission}</p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-500">Founded</p>
              <p className="mt-1 text-2xl font-black text-slate-950">
                {charity.founded}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-500">Primary region</p>
              <p className="mt-1 text-2xl font-black text-slate-950">
                {charity.region}
              </p>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-bold text-slate-950">Evidence notes</h2>
            <ul className="mt-4 space-y-3">
              {charity.evidence.map((item) => (
                <li key={item} className="rounded-2xl bg-emerald-50 p-4 text-slate-700">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Rating breakdown</h2>
            <div className="mt-5">
              <RatingBreakdown rating={charity.rating} />
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Support this charity</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Donation processing is a placeholder in the MVP. This link can later
              connect to a verified giving flow.
            </p>
            <a
              href={charity.supportUrl}
              className="mt-5 inline-flex w-full justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              Visit support link
            </a>
            <div className="mt-5 text-sm text-slate-600">
              <p>{charity.website}</p>
              <p>{charity.contactEmail}</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Program highlights</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              {charity.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
