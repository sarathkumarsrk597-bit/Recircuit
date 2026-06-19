import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-circuit-ink">Page not found</h1>
      <p className="mt-2 text-circuit-muted">
        The page you are looking for is not available on ReCircuit.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-lg bg-circuit-blue px-5 py-3 font-semibold text-white hover:bg-blue-700"
      >
        Go home
      </Link>
    </div>
  );
}
