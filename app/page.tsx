"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Search, ShieldCheck, Zap } from "lucide-react";
import { CategoryCard } from "@/components/CategoryCard";
import { ListingGrid } from "@/components/ListingGrid";
import { ErrorState, LoadingState } from "@/components/StatusMessage";
import { categories } from "@/lib/constants";
import { getRecentApprovedListings } from "@/lib/listings";
import type { Listing } from "@/lib/types";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getRecentApprovedListings()
      .then(setListings)
      .catch(() => setError("Could not load recent listings. Check Firebase setup."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#f7fbfc]">
      <section className="border-b border-circuit-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-circuit-line bg-circuit-pale px-3 py-1 text-sm font-medium text-circuit-green">
              <Zap className="h-4 w-4" aria-hidden="true" />
              Built for makers, students, labs, and repair shops
            </div>
            <h1 className="max-w-3xl text-4xl font-bold tracking-normal text-circuit-ink sm:text-5xl lg:text-6xl">
              Buy & Sell Electronics Components
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-circuit-muted">
              Find Arduino boards, ESP32 modules, sensors, motors, robotics kits,
              3D printed parts, used components, and fresh stock from nearby sellers.
            </p>
            <form
              action="/listings"
              className="mt-7 flex max-w-2xl flex-col gap-3 rounded-lg border border-circuit-line bg-white p-2 shadow-soft sm:flex-row"
            >
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-circuit-muted"
                  aria-hidden="true"
                />
                <input
                  name="q"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="h-12 w-full rounded-lg border-0 bg-transparent pl-10 pr-3 text-base text-circuit-ink focus:outline-none"
                  placeholder="Search Arduino, sensors, motors..."
                />
              </div>
              <button className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-circuit-blue px-5 font-semibold text-white hover:bg-blue-700">
                Search
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-circuit-muted">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-circuit-green" />
                Listings reviewed before public display
              </span>
              <span>Contact sellers directly on WhatsApp</span>
            </div>
          </div>

          <div className="grid content-end gap-3 sm:grid-cols-2">
            {[
              ["ESP32 DevKit", "Working", "₹280"],
              ["MG996R Servo Motor", "Reused", "₹180"],
              ["IR Sensor Pack", "New Stock", "₹120"],
              ["3D Printed Robot Chassis", "Not Tested", "₹450"]
            ].map(([title, condition, price]) => (
              <div
                key={title}
                className="rounded-lg border border-circuit-line bg-white p-4 shadow-sm"
              >
                <div className="mb-4 h-24 rounded-lg bg-gradient-to-br from-cyan-100 via-emerald-50 to-white" />
                <p className="font-semibold text-circuit-ink">{title}</p>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-circuit-muted">{condition}</span>
                  <span className="font-bold text-circuit-green">{price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-circuit-ink">Categories</h2>
            <p className="mt-1 text-circuit-muted">
              Browse the parts Indian makers ask for most often.
            </p>
          </div>
          <Link
            href="/add-listing"
            className="hidden rounded-lg bg-circuit-green px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 sm:inline-flex"
          >
            Post Your Component
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category} category={category} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-circuit-ink">Recent Listings</h2>
            <p className="mt-1 text-circuit-muted">
              Approved components from sellers on ReCircuit.
            </p>
          </div>
          <Link
            href="/listings"
            className="text-sm font-semibold text-circuit-blue hover:text-blue-700"
          >
            View all
          </Link>
        </div>
        {loading ? <LoadingState label="Loading recent listings..." /> : null}
        {error ? <ErrorState message={error} /> : null}
        {!loading && !error ? <ListingGrid listings={listings} /> : null}
      </section>
    </div>
  );
}
