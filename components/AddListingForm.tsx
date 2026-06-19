"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2, ImagePlus, Loader2 } from "lucide-react";
import { categories, conditions } from "@/lib/constants";
import { createListing } from "@/lib/listings";
import type { ListingFormValues } from "@/lib/types";
import { validateListingForm } from "@/lib/validation";

const initialValues: ListingFormValues = {
  title: "",
  category: "",
  condition: "",
  price: "",
  quantity: "1",
  location: "",
  description: "",
  whatsappNumber: "",
  images: []
};

export function AddListingForm({
  seller
}: {
  seller: { uid: string; name: string };
}) {
  const [values, setValues] = useState<ListingFormValues>(initialValues);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ListingFormValues, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const previews = useMemo(
    () => values.images.map((file) => URL.createObjectURL(file)),
    [values.images]
  );

  function update<K extends keyof ListingFormValues>(
    key: K,
    value: ListingFormValues[K]
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setSubmitted(false);

    const nextErrors = validateListingForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      await createListing(values, seller);
      setValues(initialValues);
      setSubmitted(true);
    } catch {
      setFormError("Could not submit listing. Check Firebase rules and config.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {submitted ? (
        <div className="flex gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CheckCircle2 className="h-5 w-5 flex-none" aria-hidden="true" />
          Listing submitted for admin approval.
        </div>
      ) : null}

      {formError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {formError}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Product name" error={errors.title}>
          <input
            className="field"
            value={values.title}
            onChange={(event) => update("title", event.target.value)}
            placeholder="ESP32 DevKit V1"
          />
        </Field>

        <Field label="Category" error={errors.category}>
          <select
            className="field"
            value={values.category}
            onChange={(event) =>
              update("category", event.target.value as ListingFormValues["category"])
            }
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Condition" error={errors.condition}>
          <select
            className="field"
            value={values.condition}
            onChange={(event) =>
              update(
                "condition",
                event.target.value as ListingFormValues["condition"]
              )
            }
          >
            <option value="">Select condition</option>
            {conditions.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Price" error={errors.price}>
          <input
            className="field"
            inputMode="numeric"
            value={values.price}
            onChange={(event) => update("price", event.target.value)}
            placeholder="499"
          />
        </Field>

        <Field label="Quantity" error={errors.quantity}>
          <input
            className="field"
            inputMode="numeric"
            value={values.quantity}
            onChange={(event) => update("quantity", event.target.value)}
            placeholder="1"
          />
        </Field>

        <Field label="Location" error={errors.location}>
          <input
            className="field"
            value={values.location}
            onChange={(event) => update("location", event.target.value)}
            placeholder="Pune, Maharashtra"
          />
        </Field>

        <Field label="WhatsApp number" error={errors.whatsappNumber}>
          <input
            className="field"
            inputMode="tel"
            value={values.whatsappNumber}
            onChange={(event) => update("whatsappNumber", event.target.value)}
            placeholder="9876543210"
          />
        </Field>
      </div>

      <Field label="Description" error={errors.description}>
        <textarea
          className="field min-h-32 resize-y"
          value={values.description}
          onChange={(event) => update("description", event.target.value)}
          placeholder="Mention specs, usage history, included accessories, and pickup details."
        />
      </Field>

      <Field label="Upload images" error={errors.images}>
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-circuit-line bg-white p-6 text-center text-circuit-muted hover:border-circuit-blue hover:bg-circuit-pale">
          <ImagePlus className="mb-2 h-7 w-7" aria-hidden="true" />
          <span className="font-medium text-circuit-ink">Add product photos</span>
          <span className="mt-1 text-sm">Up to 5 images</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(event) => {
              const files = Array.from(event.target.files || []).slice(0, 5);
              update("images", files);
            }}
          />
        </label>
      </Field>

      {previews.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {previews.map((preview) => (
            <div
              key={preview}
              className="relative aspect-square overflow-hidden rounded-lg border border-circuit-line"
            >
              <Image src={preview} alt="" fill className="object-cover" />
            </div>
          ))}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-circuit-green px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {submitting ? (
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        ) : null}
        {submitting ? "Submitting..." : "Submit for Approval"}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="label">{label}</span>
      {children}
      {error ? <span className="error-text">{error}</span> : null}
    </label>
  );
}
