import Link from "next/link";
import { AdminResearchForm } from "@/components/admin/AdminResearchForm";

export const metadata = {
  title: "Investigar ONG | Admin Yanapay",
};

export default function AdminResearchPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/admin/drafts" className="text-sm font-bold text-emerald-700">
        ← Borradores
      </Link>
      <h1 className="mt-6 text-3xl font-black text-slate-950">Investigar nueva ONG</h1>
      <p className="mt-3 text-slate-600">
        La IA crea un borrador con puntuación Yanapay. Nada se publica sin tu aprobación.
      </p>
      <div className="mt-8">
        <AdminResearchForm />
      </div>
    </div>
  );
}
