"use client";

import { Search } from "lucide-react";
import { categories, conditions } from "@/lib/constants";
import type { ListingFilters as ListingFiltersType } from "@/lib/types";

type Props = {
  filters: ListingFiltersType;
  onChange: (filters: ListingFiltersType) => void;
};

export function ListingFilters({ filters, onChange }: Props) {
  function update<K extends keyof ListingFiltersType>(
    key: K,
    value: ListingFiltersType[K]
  ) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <aside className="rounded-lg border border-circuit-line bg-white p-4 shadow-sm">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-circuit-muted"
          aria-hidden="true"
        />
        <input
          value={filters.search}
          onChange={(event) => update("search", event.target.value)}
          className="field pl-9"
          placeholder="Search product name"
        />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <label className="space-y-1.5">
          <span className="label">Category</span>
          <select
            className="field"
            value={filters.category}
            onChange={(event) => update("category", event.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="label">Condition</span>
          <select
            className="field"
            value={filters.condition}
            onChange={(event) => update("condition", event.target.value)}
          >
            <option value="">Any condition</option>
            {conditions.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="label">Location</span>
          <input
            className="field"
            value={filters.location}
            onChange={(event) => update("location", event.target.value)}
            placeholder="City or area"
          />
        </label>

        <label className="space-y-1.5">
          <span className="label">Sort</span>
          <select
            className="field"
            value={filters.sort}
            onChange={(event) =>
              update("sort", event.target.value as ListingFiltersType["sort"])
            }
          >
            <option value="newest">Newest first</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </label>
      </div>
    </aside>
  );
}
