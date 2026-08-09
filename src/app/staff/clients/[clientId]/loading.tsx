// Shown instantly on navigation while the server component below fetches the
// client card + records the view — without this, a tap has no visible effect
// until that round-trip finishes, which reads as an unresponsive click.
export default function Loading() {
  return (
    <div className="space-y-4 pb-8 animate-pulse">
      <div>
        <div className="h-6 w-40 rounded bg-white/10" />
        <div className="h-3 w-56 rounded bg-white/5 mt-2" />
      </div>

      <div className="p-4 rounded-card bg-white/5 border border-white/10 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="h-4 w-24 rounded bg-white/10" />
          <div className="h-5 w-16 rounded-full bg-white/10" />
        </div>
        <div className="h-2 w-full rounded-full bg-white/10" />
      </div>

      <div className="h-14 w-full rounded-button bg-white/5 border border-white/10" />

      <div className="space-y-2">
        <div className="h-3 w-32 rounded bg-white/5" />
        <div className="h-12 w-full rounded-button bg-white/5 border border-white/10" />
        <div className="h-12 w-full rounded-button bg-white/5 border border-white/10" />
      </div>
    </div>
  );
}
