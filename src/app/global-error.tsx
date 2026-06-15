"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          backgroundColor: "#040810",
          color: "#f8fafc",
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: 0,
          padding: "24px",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 480 }}>
          <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 12 }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.6 }}>
            A critical error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: 24,
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 500,
              backgroundColor: "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
