import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function Navbar({ email }: { email: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-sm font-bold text-white shadow-lg shadow-blue-500/25">
              S
            </div>
            <div>
              <span className="block text-base font-black tracking-tight text-slate-900">StockFlow</span>
              <span className="block text-[10px] font-medium uppercase tracking-[0.22em] text-slate-500">Inventory OS</span>
            </div>
          </div>

          <div className="hidden items-center gap-1 rounded-full border border-slate-200 bg-slate-50/80 p-1 md:flex">
            <Link href="/dashboard" className="rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-blue-600">
              Dashboard
            </Link>
            <Link href="/products" className="rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-blue-600">
              Products
            </Link>
            <Link href="/settings" className="rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-blue-600">
              Settings
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-600 sm:block">
            {email}
          </div>
          <LogoutButton />
        </div>
      </nav>
    </header>
  );
}