import Image from "next/image";
import Link from "next/link";
import { MapPin, PackageCheck } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Listing } from "@/lib/types";

export function ListingCard({ listing }: { listing: Listing }) {
  const image = listing.imageUrls[0];

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group overflow-hidden rounded-lg border border-circuit-line bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
    >
      <div className="relative aspect-[4/3] bg-slate-100">
        {image ? (
          <Image
            src={image}
            alt={listing.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-circuit-muted">
            No image
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-circuit-green shadow-sm">
          {listing.condition}
        </span>
      </div>
      <div className="space-y-3 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-circuit-blue">
            {listing.category}
          </p>
          <h3 className="mt-1 line-clamp-2 text-base font-semibold text-circuit-ink group-hover:text-circuit-blue">
            {listing.title}
          </h3>
        </div>
        <p className="text-xl font-bold text-circuit-ink">
          {formatCurrency(listing.price)}
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-circuit-muted">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {listing.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <PackageCheck className="h-4 w-4" aria-hidden="true" />
            Qty {listing.quantity}
          </span>
        </div>
        <p className="text-xs text-circuit-muted">{formatDate(listing.createdAt)}</p>
      </div>
    </Link>
  );
}
