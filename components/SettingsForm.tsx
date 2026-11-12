"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsForm({ initialThreshold }: { initialThreshold: number }) {
  const router = useRouter();
  const [value, setValue] = useState(String(initialThreshold));
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);

    const nextValue = Number(value);
    if (!Number.isInteger(nextValue) || nextValue < 0) {
      setError("Threshold must be a whole number greater than or equal to 0.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ defaultLowStockThreshold: nextValue }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error);
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-5 rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
      {error && <p className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {saved && <p className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">Settings saved.</p>}

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Default low stock threshold</label>
        <input
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:soft-ring"
          type="number"
          min="0"
          step="1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
        <p className="mt-2 text-xs text-slate-500">
          Used for products that have no threshold of their own.
        </p>
      </div>

      <button
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save settings"}
      </button>
    </form>
  );
}