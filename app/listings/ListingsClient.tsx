"use client";

import { useEffect, useMemo, useState } from "react";
import { LayoutGrid, ListFilter } from "lucide-react";
import { ListingFilters } from "@/components/ListingFilters";
import { ListingGrid } from "@/components/ListingGrid";
import { ErrorState, LoadingState } from "@/components/StatusMessage";
import { applyListingFilters, getApprovedListings } from "@/lib/listings";
import type { Listing, ListingFilters as ListingFiltersType } from "@/lib/types";

export function ListingsClient({
  initialSearch,
  initialCategory
}: {
  initialSearch: string;
  initialCategory: string;
}) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<ListingFiltersType>({
    search: initialSearch,
    category: initialCategory,
    condition: "",
    location: "",
    sort: "newest"
  });

  useEffect(() => {
    getApprovedListings()
      .then(setListings)
      .catch((reason) => {
        const message =
          reason instanceof Error
            ? reason.message
            : "Unknown Firestore error";
        setError(`Could not load listings: ${message}`);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => applyListingFilters(listings, filters),
    [filters, listings]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-circuit-blue">
            <LayoutGrid className="h-4 w-4" aria-hidden="true" />
            Marketplace
          </p>
          <h1 className="mt-2 text-3xl font-bold text-circuit-ink">
            Browse Components
          </h1>
          <p className="mt-1 text-circuit-muted">
            Search by product, category, condition, location, and price.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg border border-circuit-line bg-white px-3 py-2 text-sm text-circuit-muted">
          <ListFilter className="h-4 w-4" aria-hidden="true" />
          {filtered.length} result{filtered.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <ListingFilters filters={filters} onChange={setFilters} />
        <div>
          {loading ? <LoadingState label="Loading approved listings..." /> : null}
          {error ? <ErrorState message={error} /> : null}
          {!loading && !error ? (
            <ListingGrid
              listings={filtered}
              emptyMessage="No listings available yet. Be the first to post a component."
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
