import { Loader2 } from "lucide-react"

// Only shown for a direct/refresh navigation to /staff, not for in-app
// row clicks — same reasoning as clients/[clientId]/loading.tsx.
export default function Loading() {
  return (
    <div className="flex items-center justify-center py-24">
      <Loader2 size={22} className="animate-spin text-brand-secondary/70" />
    </div>
  );
}
