import { CharityDirectory } from "@/components/CharityDirectory";
import { categories, charities } from "@/data/charities";

export const metadata = {
  title: "Charity Directory | Yanapay",
  description: "Search and compare Peruvian charity profiles.",
};

export default function CharitiesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold text-emerald-700">Charity directory</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
          Find Peruvian charities by mission, region, and trust signals.
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Browse early sample profiles with transparent ratings. Future versions can
          replace this seed data with verified submissions and admin review tools.
        </p>
      </div>
      <CharityDirectory charities={charities} categories={categories} />
    </div>
  );
}
