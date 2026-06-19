"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "./firebase";
import type { Listing, ListingFilters, ListingFormValues, ListingStatus } from "./types";

const listingsRef = collection(db, "listings");

export async function uploadListingImages(files: File[], sellerId: string) {
  const uploads = files.map(async (file) => {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const imageRef = ref(
      storage,
      `listings/${sellerId}/${crypto.randomUUID()}-${safeName}`
    );

    await uploadBytes(imageRef, file, {
      contentType: file.type
    });

    return getDownloadURL(imageRef);
  });

  return Promise.all(uploads);
}

export async function createListing(
  values: ListingFormValues,
  seller: { uid: string; name: string }
) {
  const imageUrls = await uploadListingImages(values.images, seller.uid);

  await addDoc(listingsRef, {
    title: values.title.trim(),
    category: values.category,
    condition: values.condition,
    price: Number(values.price),
    quantity: Number(values.quantity),
    location: values.location.trim(),
    description: values.description.trim(),
    whatsappNumber: values.whatsappNumber.trim(),
    imageUrls,
    sellerId: seller.uid,
    sellerName: seller.name,
    status: "pending",
    createdAt: serverTimestamp()
  });
}

export async function getRecentApprovedListings(count = 8) {
  const snapshot = await getDocs(
    query(
      listingsRef,
      where("status", "==", "approved"),
      orderBy("createdAt", "desc"),
      limit(count)
    )
  );

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data()
  })) as Listing[];
}

export async function getApprovedListings() {
  const snapshot = await getDocs(
    query(
      listingsRef,
      where("status", "==", "approved"),
      orderBy("createdAt", "desc")
    )
  );

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data()
  })) as Listing[];
}

export async function getAllListings() {
  const snapshot = await getDocs(query(listingsRef, orderBy("createdAt", "desc")));

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data()
  })) as Listing[];
}

export async function getListingById(id: string) {
  const snapshot = await getDoc(doc(db, "listings", id));

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data()
  } as Listing;
}

export async function updateListingStatus(id: string, status: ListingStatus) {
  await updateDoc(doc(db, "listings", id), { status });
}

export async function deleteListing(id: string) {
  await deleteDoc(doc(db, "listings", id));
}

export function applyListingFilters(listings: Listing[], filters: ListingFilters) {
  const search = filters.search.trim().toLowerCase();
  const location = filters.location.trim().toLowerCase();

  return listings
    .filter((listing) => {
      const matchesSearch = search
        ? listing.title.toLowerCase().includes(search)
        : true;
      const matchesCategory = filters.category
        ? listing.category === filters.category
        : true;
      const matchesCondition = filters.condition
        ? listing.condition === filters.condition
        : true;
      const matchesLocation = location
        ? listing.location.toLowerCase().includes(location)
        : true;

      return matchesSearch && matchesCategory && matchesCondition && matchesLocation;
    })
    .sort((a, b) => {
      if (filters.sort === "price-low") {
        return a.price - b.price;
      }

      if (filters.sort === "price-high") {
        return b.price - a.price;
      }

      return (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0);
    });
}
