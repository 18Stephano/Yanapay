import Link from "next/link";
import { listDrafts } from "@/lib/admin-drafts";

export const metadata = {
  title: "Borradores | Admin Yanapay",
};

export default async function AdminDraftsPage() {
  const drafts = await listDrafts();

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-black text-slate-950">Borradores</h1>
        <Link
          href="/admin/research"
          className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-bold text-white"
        >
          Nueva investigación
        </Link>
      </div>

      {drafts.length === 0 ? (
        <p className="mt-8 text-slate-600">
          No hay borradores. Configura SUPABASE_SERVICE_ROLE_KEY y crea uno desde investigación.
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {drafts.map((draft) => (
            <li key={draft.id}>
              <Link
                href={`/admin/drafts/${draft.id}`}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 transition hover:shadow-md"
              >
                <div>
                  <p className="font-bold text-slate-950">{draft.name}</p>
                  <p className="text-sm text-slate-500">{draft.slug}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-semibold text-emerald-700">
                    {draft.overallScore != null ? `${draft.overallScore}/100` : "Sin puntuación"}
                  </p>
                  <p className="text-slate-500">{draft.status}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
