import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function Navbar({ email }: { email: string }) {
  return (
    <nav className="flex items-center justify-between border-b bg-white px-6 py-3">
      <div className="flex items-center gap-6">
        <span className="text-lg font-bold">StockFlow</span>
        <Link href="/dashboard" className="text-sm hover:text-blue-600">Dashboard</Link>
        <Link href="/products" className="text-sm hover:text-blue-600">Products</Link>
        <Link href="/settings" className="text-sm hover:text-blue-600">Settings</Link>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <span className="text-gray-500">{email}</span>
        <LogoutButton />
      </div>
    </nav>
  );
}