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
    <form onSubmit={onSubmit} className="max-w-sm space-y-4 rounded-lg bg-white p-6 shadow">
      {error && <p className="rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>}
      {saved && <p className="rounded bg-green-50 p-2 text-sm text-green-700">Settings saved.</p>}
      <div>
        <label className="mb-1 block text-sm font-medium">Default low stock threshold</label>
        <input
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          type="number"
          min="0"
          step="1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
        <p className="mt-1 text-xs text-gray-500">
          Used for products that have no threshold of their own.
        </p>
      </div>
      <button disabled={loading} className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50">
        {loading ? "Saving..." : "Save settings"}
      </button>
    </form>
  );
}