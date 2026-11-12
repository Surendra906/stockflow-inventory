import { requireSession } from "@/lib/auth";
import Navbar from "@/components/Navbar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar email={session.email} />
      <div className="mx-auto max-w-5xl p-6">{children}</div>
    </div>
  );
}