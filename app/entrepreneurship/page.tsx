import Link from "next/link";

const futureFeatures = [
  "Founder profiles for Peruvian small businesses and social ventures",
  "Project goals, milestones, and transparent use-of-funds plans",
  "Community updates before a full crowdfunding flow is added",
  "Review signals to reduce risk for supporters",
];

export const metadata = {
  title: "Entrepreneurship Projects | Yanapay",
  description: "A future home for supporting Peruvian entrepreneurship projects.",
};

export default function EntrepreneurshipPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <section className="grid gap-10 rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm lg:grid-cols-[1fr_360px] lg:p-12">
        <div>
          <p className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800">
            Coming next
          </p>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
            Support entrepreneurship projects across Peru.
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Yanapay will eventually include a Kickstarter-inspired space for
            backing entrepreneurs, community businesses, and social ventures. For
            the MVP, this page marks the product direction without adding payments
            or campaign management yet.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/charities"
              className="rounded-full bg-slate-950 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              Explore charities first
            </Link>
            <Link
              href="/"
              className="rounded-full border border-slate-300 px-6 py-3 text-center text-sm font-bold text-slate-950 transition hover:border-slate-950"
            >
              Back home
            </Link>
          </div>
        </div>

        <aside className="rounded-[2rem] bg-slate-50 p-6">
          <h2 className="text-xl font-bold text-slate-950">Future project model</h2>
          <ul className="mt-5 space-y-4">
            {futureFeatures.map((feature) => (
              <li key={feature} className="rounded-2xl bg-white p-4 text-sm leading-6 text-slate-600">
                {feature}
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </div>
  );
}
