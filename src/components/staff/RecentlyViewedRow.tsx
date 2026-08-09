"use client"
import { Loader2 } from "lucide-react"
import type { ClientDirectoryEntry, PrescriptionStatus } from "@/lib/staff/types"
import { useClientRowNav } from "./useClientRowNav"

// Same active=green / expired,revoked=red mapping as StatusPill, just as a
// card tint instead of a pill — lets staff spot a lapsed client without
// reading the (now-removed) status label on this strip.
const STATUS_TINT: Record<PrescriptionStatus, string> = {
  active: "bg-emerald-500/10 border-emerald-500/25 hover:border-emerald-500/40",
  expired: "bg-red-500/10 border-red-500/25 hover:border-red-500/40",
  revoked: "bg-red-500/10 border-red-500/25 hover:border-red-500/40",
};
const NEUTRAL_TINT = "bg-white/5 border-transparent hover:border-brand-secondary/30";

export function RecentlyViewedRow({ clients }: { clients: ClientDirectoryEntry[] }) {
  const { navigate, isRowPending } = useClientRowNav();

  if (clients.length === 0) return null;

  return (
    <div>
      <p className="text-[11px] font-black uppercase tracking-wide text-brand-light/40 mb-2">Recently Viewed</p>
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
        {clients.map((c) => {
          const pending = isRowPending(c.client_id);
          const tint = c.status ? STATUS_TINT[c.status] : NEUTRAL_TINT;
          return (
            <button
              key={c.client_id}
              type="button"
              onClick={() => navigate(c.client_id)}
              className={`shrink-0 w-36 h-12 px-3 rounded-card border active:scale-[0.98] active:bg-white/10 transition-all text-left flex items-center justify-between gap-2 ${tint} ${
                pending ? "opacity-60" : ""
              }`}
            >
              <p className="text-[13px] font-bold text-brand-light truncate">{c.client_name}</p>
              {pending && <Loader2 size={14} className="animate-spin text-brand-secondary/70 shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
