"use client";

import Link from "next/link";
import { Chrome, Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, login } = useAuth();
  const [error, setError] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  async function handleLogin() {
    setError("");
    setSigningIn(true);

    try {
      await login();
      router.push("/add-listing");
    } catch {
      setError("Google login failed. Please try again.");
    } finally {
      setSigningIn(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-circuit-line bg-white p-8 shadow-sm">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-circuit-pale text-circuit-green">
          <ShieldCheck className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="mt-5 text-center">
          <h1 className="text-3xl font-bold text-circuit-ink">
            Login to ReCircuit
          </h1>
          <p className="mt-2 text-circuit-muted">
            Use Google login to post components and manage your seller profile.
          </p>
        </div>

        {error ? (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {user && !loading ? (
          <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-center text-sm text-emerald-800">
            You are signed in as {user.email}.{" "}
            <Link href="/add-listing" className="font-semibold underline">
              Post a component
            </Link>
            .
          </div>
        ) : (
          <button
            type="button"
            onClick={handleLogin}
            disabled={signingIn || loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-circuit-blue px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {signingIn ? (
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            ) : (
              <Chrome className="h-5 w-5" aria-hidden="true" />
            )}
            {signingIn ? "Signing in..." : "Continue with Google"}
          </button>
        )}
      </div>
    </div>
  );
}
