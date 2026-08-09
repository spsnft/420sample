import { Loader2 } from "lucide-react"

// Only ever shown for a navigation that isn't wrapped in useClientRowNav's
// transition — a direct link, a refresh, browser back/forward. Row clicks
// from the client list keep the previous page mounted (see
// useClientRowNav.ts) and never hit this fallback at all.
export default function Loading() {
  return (
    <div className="flex items-center justify-center py-24">
      <Loader2 size={22} className="animate-spin text-brand-secondary/70" />
    </div>
  );
}
