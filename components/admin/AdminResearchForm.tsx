"use client";

import { useState } from "react";

export function AdminResearchForm() {
  const [charityName, setCharityName] = useState("");
  const [website, setWebsite] = useState("");
  const [ruc, setRuc] = useState("");
  const [notes, setNotes] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/admin/research-charity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify({ charityName, website, ruc, notes }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Research failed");
      }

      setResult(
        `Borrador creado: ${data.draftCharityId}. Puntuación propuesta: ${data.draft.rating.overallScore}/100. Revisa en /admin/drafts/${data.draftCharityId}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6">
      <label className="block">
        <span className="text-sm font-semibold text-slate-700">Admin secret</span>
        <input
          type="password"
          value={adminSecret}
          onChange={(e) => setAdminSecret(e.target.value)}
          className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"
          placeholder="ADMIN_SECRET"
        />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-slate-700">Nombre de la ONG</span>
        <input
          required
          value={charityName}
          onChange={(e) => setCharityName(e.target.value)}
          className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"
        />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-slate-700">Sitio web (opcional)</span>
        <input
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"
        />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-slate-700">RUC (opcional)</span>
        <input
          value={ruc}
          onChange={(e) => setRuc(e.target.value)}
          className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"
        />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-slate-700">Notas</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
      >
        {loading ? "Investigando…" : "Investigar y crear borrador"}
      </button>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      {result && <p className="text-sm text-emerald-700">{result}</p>}
    </form>
  );
}
