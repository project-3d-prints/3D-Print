"use client";

import Link from "next/link";
import { useAuthStore } from "../lib/store";

export default function ClientNav() {
  const { isAuthenticated, user, clearAuth } = useAuthStore();

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="space-x-4">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          {isAuthenticated && (
            <>
              <Link href="/jobs" className="hover:underline">
                Jobs
              </Link>
              <Link href="/printers" className="hover:underline">
                Printers
              </Link>
              <Link href="/materials" className="hover:underline">
                Materials
              </Link>
            </>
          )}
        </div>
        <div>
          {isAuthenticated ? (
            <button
              onClick={() => {
                clearAuth();
                window.location.href = "/login";
              }}
              className="hover:underline"
            >
              Logout ({user?.username})
            </button>
          ) : (
            <Link href="/login" className="hover:underline">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
