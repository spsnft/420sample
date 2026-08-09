export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="h-5 w-32 rounded bg-white/10" />
          <div className="h-3 w-44 rounded bg-white/5 mt-2" />
        </div>
        <div className="h-9 w-28 rounded-button bg-white/5 border border-white/10" />
      </div>

      <div className="h-12 w-full rounded-button bg-white/5 border border-white/10" />

      <div className="space-y-2">
        <div className="h-3 w-24 rounded bg-white/5" />
        <div className="flex gap-2 overflow-hidden">
          <div className="w-36 h-16 rounded-card bg-white/5 border border-white/10 shrink-0" />
          <div className="w-36 h-16 rounded-card bg-white/5 border border-white/10 shrink-0" />
          <div className="w-36 h-16 rounded-card bg-white/5 border border-white/10 shrink-0" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-16 w-full rounded-card bg-white/5 border border-white/10" />
        <div className="h-16 w-full rounded-card bg-white/5 border border-white/10" />
        <div className="h-16 w-full rounded-card bg-white/5 border border-white/10" />
      </div>
    </div>
  );
}
