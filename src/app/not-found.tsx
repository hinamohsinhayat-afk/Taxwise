import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h2 className="text-[48px] font-bold text-[var(--text-primary)] tracking-tight">404</h2>
        <p className="mt-3 text-[18px] text-[var(--text-secondary)]">Page not found</p>
        <p className="mt-2 text-[14px] text-[var(--text-muted)] leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex px-5 py-2.5 text-[14px] font-medium bg-[var(--primary)] text-white rounded-[10px] hover:bg-[var(--primary-hover)] transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
