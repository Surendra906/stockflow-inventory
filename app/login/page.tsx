"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error);
    router.push("/dashboard");
    router.refresh();
  }

  const input = "w-full rounded border border-gray-300 px-3 py-2 text-sm";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(20,184,166,0.16),transparent_28%),#f8fafc] p-4">
      <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white/85 p-7 shadow-[0_25px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl">
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-lg font-black text-white shadow-lg shadow-blue-500/25">
            S
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Inventory OS</p>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">StockFlow</h1>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {error && <p className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <input className={`${input} border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white focus:soft-ring`} type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className={`${input} border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white focus:soft-ring`} type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <button disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          New here? <Link href="/signup" className="font-semibold text-blue-600">Create an account</Link>
        </p>
      </div>
    </main>
  );
}