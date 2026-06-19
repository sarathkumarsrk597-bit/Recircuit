import type { ListingFormValues } from "./types";

export function validateListingForm(values: ListingFormValues) {
  const errors: Partial<Record<keyof ListingFormValues, string>> = {};
  const price = Number(values.price);
  const quantity = Number(values.quantity);
  const phoneDigits = values.whatsappNumber.replace(/\D/g, "");

  if (values.title.trim().length < 3) {
    errors.title = "Product name should be at least 3 characters.";
  }

  if (!values.category) {
    errors.category = "Select a category.";
  }

  if (!values.condition) {
    errors.condition = "Select a condition.";
  }

  if (!Number.isFinite(price) || price <= 0) {
    errors.price = "Enter a valid price.";
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    errors.quantity = "Enter a valid quantity.";
  }

  if (values.location.trim().length < 2) {
    errors.location = "Enter a city or area.";
  }

  if (values.description.trim().length < 20) {
    errors.description = "Add a description with at least 20 characters.";
  }

  if (phoneDigits.length < 10 || phoneDigits.length > 13) {
    errors.whatsappNumber = "Enter a valid WhatsApp number.";
  }

  if (values.images.length > 5) {
    errors.images = "Upload up to 5 images.";
  }

  return errors;
}
