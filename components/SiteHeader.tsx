import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-black tracking-tight text-slate-950">
          Yanapay
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-slate-600">
          <Link href="/charities" className="transition hover:text-slate-950">
            Charities
          </Link>
          <Link href="/entrepreneurship" className="transition hover:text-slate-950">
            Entrepreneurship
          </Link>
        </nav>
      </div>
    </header>
  );
}
