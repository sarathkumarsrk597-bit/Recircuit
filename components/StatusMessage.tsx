import { AlertCircle, Loader2 } from "lucide-react";

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-circuit-line bg-white p-8 text-circuit-muted">
      <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
      {label}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex min-h-32 items-center rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
      <AlertCircle className="mr-2 h-5 w-5 flex-none" aria-hidden="true" />
      {message}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-circuit-line bg-white p-8 text-center text-circuit-muted">
      {message}
    </div>
  );
}
