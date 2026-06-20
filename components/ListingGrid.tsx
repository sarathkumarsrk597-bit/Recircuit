import { ListingCard } from "@/components/ListingCard";
import { EmptyState } from "@/components/StatusMessage";
import type { Listing } from "@/lib/types";

export function ListingGrid({
  listings,
  emptyMessage = "No listings available yet. Be the first to post a component."
}: {
  listings: Listing[];
  emptyMessage?: string;
}) {
  if (listings.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
