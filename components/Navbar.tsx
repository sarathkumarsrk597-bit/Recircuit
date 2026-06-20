"use client";

import Link from "next/link";
import { Cpu, LogOut, Plus, ShieldCheck, UserRound } from "lucide-react";
import { useAuth } from "./AuthProvider";

export function Navbar() {
  const { user, loading, isAdmin, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-circuit-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-circuit-ink text-white">
            <Cpu className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-lg font-bold tracking-normal text-circuit-ink">
              ReCircuit
            </span>
            <span className="hidden text-xs text-circuit-muted sm:block">
              Components marketplace
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-2 text-sm font-medium">
          <Link
            href="/listings"
            className="hidden rounded-lg px-3 py-2 text-circuit-muted hover:bg-circuit-pale hover:text-circuit-ink sm:inline-flex"
          >
            Browse
          </Link>
          <Link
            href="/admin"
            className={`hidden items-center gap-2 rounded-lg px-3 py-2 hover:bg-circuit-pale hover:text-circuit-ink sm:inline-flex ${
              isAdmin ? "text-circuit-green" : "text-circuit-muted"
            }`}
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Admin
          </Link>
          <Link
            href="/add-listing"
            className="inline-flex items-center gap-2 rounded-lg bg-circuit-green px-3 py-2 text-white shadow-sm hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Post Component</span>
            <span className="sm:hidden">Post</span>
          </Link>
          {loading ? (
            <span className="h-9 w-9 animate-pulse rounded-full bg-slate-100" />
          ) : user ? (
            <button
              type="button"
              onClick={logout}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-circuit-line bg-white text-circuit-muted hover:text-circuit-ink"
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-circuit-line bg-white text-circuit-muted hover:text-circuit-ink"
              aria-label="Log in"
            >
              <UserRound className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
