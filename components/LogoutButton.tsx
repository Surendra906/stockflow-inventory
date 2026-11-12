"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function logout() {
    setError("");

    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) {
        setError("Could not log out. Please try again.");
        return;
      }

      router.push("/login");
      router.refresh();
    } catch {
      setError("Could not log out. Please try again.");
    }
  }

  return (
    <>
      <button
        onClick={logout}
        className="rounded bg-gray-800 px-3 py-1 text-white"
      >
        Log out
      </button>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </>
  );
}
