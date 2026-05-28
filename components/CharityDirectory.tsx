"use client";

import { useMemo, useState } from "react";
import { CharityCard } from "@/components/CharityCard";
import type { Charity } from "@/lib/types";

type CharityDirectoryProps = {
  charities: Charity[];
  categories: string[];
};

export function CharityDirectory({ charities, categories }: CharityDirectoryProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filteredCharities = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return charities.filter((charity) => {
      const matchesCategory =
        category === "All" || charity.categories.includes(category);
      const searchableText = [
        charity.name,
        charity.tagline,
        charity.mission,
        charity.region,
        charity.location,
        ...charity.categories,
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && searchableText.includes(normalizedQuery);
    });
  }, [charities, category, query]);

  return (
    <section>
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_240px]">
          <label className="block">
            <span className="sr-only">Search charities</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, region, mission, or category"
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </label>
          <label className="block">
            <span className="sr-only">Filter by category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              <option>All</option>
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {filteredCharities.map((charity) => (
          <CharityCard key={charity.slug} charity={charity} />
        ))}
      </div>

      {filteredCharities.length === 0 && (
        <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <h2 className="text-xl font-bold text-slate-950">No charities found</h2>
          <p className="mt-2 text-slate-600">
            Try a different search term or choose another category.
          </p>
        </div>
      )}
    </section>
  );
}
