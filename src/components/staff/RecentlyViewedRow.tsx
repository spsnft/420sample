"use client"
import * as React from "react"
import { Loader2 } from "lucide-react"
import type { ClientDirectoryEntry, PrescriptionStatus } from "@/lib/staff/types"
import { useScrollEdges } from "@/lib/use-scroll-edges"
import { useClientRowNav } from "./useClientRowNav"

// Same active=green / expired=amber / revoked=red mapping as StatusPill,
// just as a card tint instead of a pill — lets staff spot a lapsed client
// without reading the (now-removed) status label on this strip.
const STATUS_TINT: Record<PrescriptionStatus, string> = {
  active: "bg-emerald-500/10 border-emerald-500/25 hover:border-emerald-500/40",
  expired: "bg-brand-secondary/10 border-brand-secondary/25 hover:border-brand-secondary/40",
  revoked: "bg-red-500/10 border-red-500/25 hover:border-red-500/40",
};
const NEUTRAL_TINT = "surface-row hover:brightness-110 border-transparent";

export function RecentlyViewedRow({ clients }: { clients: ClientDirectoryEntry[] }) {
  const { navigate, isRowPending } = useClientRowNav();
  const { ref, mask } = useScrollEdges(clients.length);

  if (clients.length === 0) return null;

  return (
    <div>
      <p className="text-[11px] font-black uppercase tracking-wide text-brand-light/40 mb-2">Recently Viewed</p>
      {/* The scroll row shares the content column's edges rather than bleeding
          past them. The old `-mx-4 px-4` was aimed at a phone, where the
          column's padding is the only thing between it and the screen edge —
          but the column is centred once the viewport passes max-w-2xl, so on
          anything wider the bleed just moved the clip edge 16px to the right
          of every other block on the page and read as a misalignment. The
          affordance the bleed used to carry — chips running off the edge, so
          there is visibly more — is carried by the edge fade instead. */}
      <div
        ref={ref}
        className="flex gap-2 overflow-x-auto no-scrollbar pb-1"
        style={{ WebkitMaskImage: mask, maskImage: mask }}
      >
        {clients.map((c) => {
          const pending = isRowPending(c.client_id);
          const tint = c.status ? STATUS_TINT[c.status] : NEUTRAL_TINT;
          return (
            <button
              key={c.client_id}
              type="button"
              onClick={() => navigate(c.client_id)}
              className={`shrink-0 w-36 h-12 px-3 rounded-card border active:translate-y-px transition-all text-left flex items-center justify-between gap-2 ${tint} ${
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
