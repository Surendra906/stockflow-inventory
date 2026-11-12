import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(20,184,166,0.16),transparent_28%),#f8fafc] p-4">
      <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white/85 p-8 text-center shadow-[0_25px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-2xl font-black text-white shadow-lg shadow-blue-500/20">
          !
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Page not found</h1>
        <p className="mt-3 text-sm text-slate-600">The page you are looking for doesn’t exist or may have moved.</p>
        <Link href="/dashboard" className="mt-6 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:opacity-95">
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
