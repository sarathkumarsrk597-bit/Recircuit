"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Check, Loader2, Trash2, X } from "lucide-react";
import {
  deleteListing,
  getAllListings,
  updateListingStatus
} from "@/lib/listings";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Listing, ListingStatus } from "@/lib/types";
import { EmptyState, ErrorState, LoadingState } from "./StatusMessage";

export function AdminListingTable() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  async function loadListings() {
    setError("");

    try {
      const data = await getAllListings();
      setListings(data);
    } catch {
      setError("Could not load admin listings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;

    getAllListings()
      .then((data) => {
        if (mounted) {
          setListings(data);
        }
      })
      .catch(() => {
        if (mounted) {
          setError("Could not load admin listings.");
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  async function changeStatus(id: string, status: ListingStatus) {
    setBusyId(id);
    try {
      await updateListingStatus(id, status);
      await loadListings();
    } catch {
      setError("Could not update listing status.");
    } finally {
      setBusyId("");
    }
  }

  async function removeListing(id: string) {
    const confirmed = window.confirm("Delete this spam listing?");
    if (!confirmed) return;

    setBusyId(id);
    try {
      await deleteListing(id);
      await loadListings();
    } catch {
      setError("Could not delete listing.");
    } finally {
      setBusyId("");
    }
  }

  if (loading) {
    return <LoadingState label="Loading all listings..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (listings.length === 0) {
    return <EmptyState message="No listings submitted yet." />;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-circuit-line bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full text-left text-sm">
          <thead className="border-b border-circuit-line bg-[#f9fcfd] text-xs uppercase tracking-wide text-circuit-muted">
            <tr>
              <th className="px-4 py-3">Listing</th>
              <th className="px-4 py-3">Seller</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-circuit-line">
            {listings.map((listing) => {
              const busy = busyId === listing.id;

              return (
                <tr key={listing.id} className="align-middle">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-slate-100">
                        {listing.imageUrls[0] ? (
                          <Image
                            src={listing.imageUrls[0]}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                      <div>
                        <p className="font-semibold text-circuit-ink">
                          {listing.title}
                        </p>
                        <p className="text-circuit-muted">
                          {listing.category} / {listing.condition} /{" "}
                          {listing.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-circuit-muted">
                    <p className="font-medium text-circuit-ink">
                      {listing.sellerName}
                    </p>
                    <p>{listing.whatsappNumber}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-circuit-ink">
                    {formatCurrency(listing.price)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        listing.status === "approved"
                          ? "bg-emerald-50 text-emerald-700"
                          : listing.status === "rejected"
                            ? "bg-red-50 text-red-700"
                            : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-circuit-muted">
                    {formatDate(listing.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <ActionButton
                        label="Approve"
                        disabled={busy}
                        onClick={() => changeStatus(listing.id, "approved")}
                      >
                        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      </ActionButton>
                      <ActionButton
                        label="Reject"
                        disabled={busy}
                        onClick={() => changeStatus(listing.id, "rejected")}
                      >
                        <X className="h-4 w-4" />
                      </ActionButton>
                      <ActionButton
                        label="Delete"
                        disabled={busy}
                        danger
                        onClick={() => removeListing(listing.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActionButton({
  label,
  danger,
  disabled,
  onClick,
  children
}: {
  label: string;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border disabled:cursor-not-allowed disabled:opacity-60 ${
        danger
          ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
          : "border-circuit-line bg-white text-circuit-muted hover:bg-circuit-pale hover:text-circuit-ink"
      }`}
    >
      {children}
    </button>
  );
}
