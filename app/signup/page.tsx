"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "", organizationName: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/signup", {
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
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 rounded-lg bg-white p-6 shadow">
        <h1 className="text-2xl font-bold">Create your StockFlow account</h1>
        {error && <p className="rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>}
        <input className={input} placeholder="Organization name" value={form.organizationName} onChange={update("organizationName")} required />
        <input className={input} type="email" placeholder="Email" value={form.email} onChange={update("email")} required />
        <input className={input} type="password" placeholder="Password (min 8 characters)" value={form.password} onChange={update("password")} required />
        <input className={input} type="password" placeholder="Confirm password" value={form.confirmPassword} onChange={update("confirmPassword")} required />
        <button disabled={loading} className="w-full rounded bg-blue-600 py-2 text-white disabled:opacity-50">
          {loading ? "Creating..." : "Sign up"}
        </button>
        <p className="text-center text-sm">
          Already have an account? <Link href="/login" className="text-blue-600">Log in</Link>
        </p>
      </form>
    </main>
  );
}