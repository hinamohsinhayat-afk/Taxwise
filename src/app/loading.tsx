export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Top progress bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden">
        <div
          className="h-full bg-[var(--primary)]"
          style={{
            animation: "progressBar 1.2s ease-in-out infinite",
          }}
        />
      </div>
      <style>{`
        @keyframes progressBar {
          0% {
            width: 0%;
            margin-left: 0%;
          }
          50% {
            width: 60%;
            margin-left: 20%;
          }
          100% {
            width: 0%;
            margin-left: 100%;
          }
        }
      `}</style>
    </div>
  );
}
