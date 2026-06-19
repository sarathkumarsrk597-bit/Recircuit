"use client";

import Link from "next/link";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { AdminListingTable } from "@/components/AdminListingTable";
import { useAuth } from "@/components/AuthProvider";
import { LoadingState } from "@/components/StatusMessage";

export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <LoadingState label="Checking admin access..." />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-circuit-line bg-white p-8 text-center shadow-sm">
          <ShieldAlert className="mx-auto h-10 w-10 text-red-600" />
          <h1 className="mt-4 text-2xl font-bold text-circuit-ink">
            Admin access only
          </h1>
          <p className="mt-2 text-circuit-muted">
            This dashboard is restricted to the configured admin email.
          </p>
          <Link
            href="/login"
            className="mt-5 inline-flex rounded-lg bg-circuit-blue px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Login as Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-circuit-blue">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          Moderation
        </p>
        <h1 className="mt-2 text-3xl font-bold text-circuit-ink">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-circuit-muted">
          Review pending listings, reject unsuitable posts, or delete spam.
        </p>
      </div>
      <AdminListingTable />
    </div>
  );
}
