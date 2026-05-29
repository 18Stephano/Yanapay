"use client";

import { useState } from "react";

type PublishDraftButtonProps = {
  draftCharityId: string;
};

export function PublishDraftButton({ draftCharityId }: PublishDraftButtonProps) {
  const [adminSecret, setAdminSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handlePublish() {
    setLoading(true);
    setMessage(null);

    const response = await fetch("/api/admin/publish-charity-draft", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": adminSecret,
      },
      body: JSON.stringify({ draftCharityId }),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(data.error ?? "Error al publicar");
      return;
    }

    setMessage(`Publicado: /charities/${data.slug}`);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <input
        type="password"
        placeholder="Admin secret"
        value={adminSecret}
        onChange={(e) => setAdminSecret(e.target.value)}
        className="mb-3 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"
      />
      <button
        type="button"
        onClick={handlePublish}
        disabled={loading}
        className="rounded-full bg-slate-950 px-5 py-2 text-sm font-bold text-white disabled:opacity-50"
      >
        {loading ? "Publicando…" : "Aprobar y publicar"}
      </button>
      {message && <p className="mt-2 text-sm text-slate-600">{message}</p>}
    </div>
  );
}
