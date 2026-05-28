import Link from "next/link";
import { CharityCard } from "@/components/CharityCard";
import { getCharities } from "@/lib/charities";

export default async function Home() {
  const charities = await getCharities();
  const featuredCharities = charities.slice(0, 3);
  return (
    <div>
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800">
            Transparent giving for Peru
          </p>
          <h1 className="text-5xl font-black tracking-tight text-slate-950 md:text-7xl">
            Support charities doing trusted work across Peru.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Yanapay helps donors discover Peruvian nonprofits, compare clear
            rating signals, and understand where support can make a difference.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/charities"
              className="rounded-full bg-emerald-600 px-6 py-3 text-center text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
            >
              Support Charities
            </Link>
            <Link
              href="/entrepreneurship"
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-center text-sm font-bold text-slate-950 transition hover:border-slate-950"
            >
              Support Entrepreneurship Projects
            </Link>
          </div>
        </div>

        <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
            Rating model
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
            Scores built around trust, not hype.
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Each profile starts with five dimensions: transparency, financial
            health, governance, impact evidence, and community trust.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm font-semibold text-slate-700">
            {["Transparency", "Financial health", "Governance", "Impact", "Community trust"].map(
              (item) => (
                <div key={item} className="rounded-2xl bg-slate-50 p-4">
                  {item}
                </div>
              ),
            )}
          </div>
        </aside>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-emerald-700">Featured charities</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Start with vetted profiles
            </h2>
          </div>
          <Link href="/charities" className="text-sm font-bold text-emerald-700">
            View all
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {featuredCharities.map((charity) => (
            <CharityCard key={charity.slug} charity={charity} />
          ))}
        </div>
      </section>
    </div>
  );
}
