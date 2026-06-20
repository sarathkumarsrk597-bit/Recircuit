"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  MapPin,
  MessageCircle,
  PackageCheck,
  UserRound
} from "lucide-react";
import { ErrorState, LoadingState } from "@/components/StatusMessage";
import { useAuth } from "@/components/AuthProvider";
import { formatCurrency, formatDate, getWhatsAppUrl } from "@/lib/format";
import { getListingById } from "@/lib/listings";
import type { Listing } from "@/lib/types";

export function ListingDetailClient({ listingId }: { listingId: string }) {
  const [detailState, setDetailState] = useState<{
    listing: Listing | null;
    loading: boolean;
    error: string;
  }>({
    listing: null,
    loading: true,
    error: ""
  });
  const [activeImage, setActiveImage] = useState("");
  const { isAdmin, user } = useAuth();
  const { listing, loading, error } = detailState;

  useEffect(() => {
    let mounted = true;

    getListingById(listingId)
      .then((data) => {
        if (!mounted) return;

        if (!data) {
          setDetailState({
            listing: null,
            loading: false,
            error: "Listing not found."
          });
          return;
        }

        if (
          data.status !== "approved" &&
          !isAdmin &&
          data.sellerId !== user?.uid
        ) {
          setDetailState({
            listing: null,
            loading: false,
            error: "This listing is pending approval and is not public yet."
          });
          return;
        }

        setActiveImage(data.imageUrls[0] || "");
        setDetailState({
          listing: data,
          loading: false,
          error: ""
        });
      })
      .catch((reason) => {
        if (!mounted) return;

        const message =
          reason instanceof Error ? reason.message : "Unknown Firestore error";
        setDetailState({
          listing: null,
          loading: false,
          error: `Could not load this listing: ${message}`
        });
      });

    return () => {
      mounted = false;
    };
  }, [isAdmin, listingId, user?.uid]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <LoadingState label="Loading product details..." />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState message={error || "Listing not found."} />
      </div>
    );
  }

  const whatsappUrl = getWhatsAppUrl(listing.whatsappNumber, listing.title);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/listings"
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-circuit-blue hover:text-blue-700"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to listings
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-3">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-circuit-line bg-white">
            {activeImage ? (
              <Image
                src={activeImage}
                alt={listing.title}
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-circuit-muted">
                No product image uploaded
              </div>
            )}
          </div>
          {listing.imageUrls.length > 1 ? (
            <div className="grid grid-cols-5 gap-2">
              {listing.imageUrls.map((image) => (
                <button
                  type="button"
                  key={image}
                  onClick={() => setActiveImage(image)}
                  className={`relative aspect-square overflow-hidden rounded-lg border ${
                    activeImage === image
                      ? "border-circuit-blue"
                      : "border-circuit-line"
                  }`}
                >
                  <Image src={image} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </section>

        <section className="rounded-lg border border-circuit-line bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-circuit-blue">
            {listing.category}
          </p>
          {listing.status !== "approved" ? (
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-medium text-amber-800">
              This listing is {listing.status}. It will appear publicly after admin approval.
            </div>
          ) : null}
          <h1 className="mt-2 text-3xl font-bold text-circuit-ink">
            {listing.title}
          </h1>
          <p className="mt-3 text-3xl font-bold text-circuit-green">
            {formatCurrency(listing.price)}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Info label="Condition" value={listing.condition} />
            <Info label="Quantity" value={`${listing.quantity}`} />
            <Info
              label="Location"
              value={listing.location}
              icon={<MapPin className="h-4 w-4" />}
            />
            <Info
              label="Posted"
              value={formatDate(listing.createdAt)}
              icon={<PackageCheck className="h-4 w-4" />}
            />
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-circuit-ink">Description</h2>
            <p className="mt-2 whitespace-pre-line leading-7 text-circuit-muted">
              {listing.description}
            </p>
          </div>

          <div className="mt-6 rounded-lg bg-circuit-pale p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-circuit-ink">
              <UserRound className="h-4 w-4" aria-hidden="true" />
              Seller
            </div>
            <p className="mt-1 text-circuit-muted">{listing.sellerName}</p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-circuit-green px-5 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            Contact on WhatsApp
          </a>

          <div className="mt-4 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <AlertTriangle className="h-5 w-5 flex-none" aria-hidden="true" />
            Verify product before payment
          </div>
        </section>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
  icon
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-circuit-line bg-[#f9fcfd] p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-circuit-muted">
        {label}
      </p>
      <p className="mt-1 flex items-center gap-1.5 font-semibold text-circuit-ink">
        {icon}
        {value}
      </p>
    </div>
  );
}
