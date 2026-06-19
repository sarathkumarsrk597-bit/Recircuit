import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-circuit-line bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-circuit-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>ReCircuit helps makers reuse electronics responsibly.</p>
        <div className="flex gap-4">
          <Link href="/listings" className="hover:text-circuit-ink">
            Listings
          </Link>
          <Link href="/add-listing" className="hover:text-circuit-ink">
            Sell
          </Link>
          <span>WhatsApp-first marketplace</span>
        </div>
      </div>
    </footer>
  );
}
