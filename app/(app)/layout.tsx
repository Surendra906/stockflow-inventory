import { requireSession } from "@/lib/auth";
import Navbar from "@/components/Navbar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <Navbar email={session.email} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-slate-200/80 bg-white/70 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}