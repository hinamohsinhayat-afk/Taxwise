"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h2 className="text-[28px] font-semibold text-[var(--text-primary)] tracking-tight">
          Something went wrong
        </h2>
        <p className="mt-3 text-[15px] text-[var(--text-secondary)] leading-relaxed">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="mt-6 px-5 py-2.5 text-[14px] font-medium bg-[var(--primary)] text-white rounded-[10px] hover:bg-[var(--primary-hover)] transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
