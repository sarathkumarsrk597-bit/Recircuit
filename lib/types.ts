import type { Timestamp } from "firebase/firestore";
import type { categories, conditions, listingStatuses } from "./constants";

export type Category = (typeof categories)[number];
export type Condition = (typeof conditions)[number];
export type ListingStatus = (typeof listingStatuses)[number];

export type AppUser = {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  createdAt: Timestamp;
};

export type Listing = {
  id: string;
  title: string;
  category: Category;
  condition: Condition;
  price: number;
  quantity: number;
  location: string;
  description: string;
  whatsappNumber: string;
  imageUrls: string[];
  sellerId: string;
  sellerName: string;
  status: ListingStatus;
  createdAt: Timestamp;
};

export type ListingFormValues = {
  title: string;
  category: Category | "";
  condition: Condition | "";
  price: string;
  quantity: string;
  location: string;
  description: string;
  whatsappNumber: string;
  images: File[];
};

export type ListingFilters = {
  search: string;
  category: string;
  condition: string;
  location: string;
  sort: "newest" | "price-low" | "price-high";
};
