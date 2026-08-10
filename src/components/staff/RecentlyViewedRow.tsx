"use client"
import * as React from "react"
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

// How far the edge fade reaches in. Wide enough to read as "there's more this
// way" against a 144px chip, narrow enough not to grey out a whole name.
const FADE = "28px";

// Which ends of the strip have chips hidden past them. Tracked rather than
// assumed because the fade has to be able to switch off: the row only scrolls
// on narrow viewports, and a permanent CSS mask would dim the last chip on a
// wide screen where there is nothing more to scroll to — turning an affordance
// into a rendering bug. Both ends are tracked so the fade also tells staff
// they have scrolled past the start.
function useScrollEdges(deps: unknown) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [edges, setEdges] = React.useState({ start: false, end: false });

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      // A pixel of slack: fractional layout widths mean scrollLeft never lands
      // exactly on the maximum, which would leave the end fade stuck on at the
      // end of the strip.
      const max = el.scrollWidth - el.clientWidth;
      setEdges({ start: el.scrollLeft > 1, end: el.scrollLeft < max - 1 });
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    // Catches rotation and window resizing, which change whether the row
    // overflows at all without any scrolling happening.
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [deps]);

  // Each side's stop collapses to zero width when that side has nothing hidden
  // behind it, so an unscrollable row is masked with a plain opaque gradient.
  const mask = `linear-gradient(to right, transparent 0, black ${edges.start ? FADE : "0px"}, black calc(100% - ${
    edges.end ? FADE : "0px"
  }), transparent 100%)`;

  return { ref, mask };
}

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
