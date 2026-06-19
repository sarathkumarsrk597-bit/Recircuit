"use client";

import Link from "next/link";
import { LockKeyhole, PackagePlus } from "lucide-react";
import { AddListingForm } from "@/components/AddListingForm";
import { useAuth } from "@/components/AuthProvider";
import { LoadingState } from "@/components/StatusMessage";

export default function AddListingPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <LoadingState label="Checking login..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-circuit-line bg-white p-8 text-center shadow-sm">
          <LockKeyhole className="mx-auto h-10 w-10 text-circuit-blue" />
          <h1 className="mt-4 text-2xl font-bold text-circuit-ink">
            Login required
          </h1>
          <p className="mt-2 text-circuit-muted">
            Sign in with Google before posting components on ReCircuit.
          </p>
          <Link
            href="/login"
            className="mt-5 inline-flex rounded-lg bg-circuit-blue px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-circuit-blue">
          <PackagePlus className="h-4 w-4" aria-hidden="true" />
          Seller form
        </p>
        <h1 className="mt-2 text-3xl font-bold text-circuit-ink">
          Post Your Component
        </h1>
        <p className="mt-1 text-circuit-muted">
          Listings are reviewed by an admin before appearing publicly.
        </p>
      </div>

      <div className="rounded-lg border border-circuit-line bg-white p-5 shadow-sm sm:p-6">
        <AddListingForm
          seller={{
            uid: user.uid,
            name: user.displayName || user.email || "ReCircuit seller"
          }}
        />
      </div>
    </div>
  );
}
