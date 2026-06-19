import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CategoryCard({ category }: { category: string }) {
  return (
    <Link
      href={`/listings?category=${encodeURIComponent(category)}`}
      className="group flex min-h-24 flex-col justify-between rounded-lg border border-circuit-line bg-white p-4 shadow-sm transition hover:border-circuit-blue hover:shadow-soft"
    >
      <span className="text-sm font-semibold text-circuit-ink">{category}</span>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-circuit-blue">
        Browse
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
