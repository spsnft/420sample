"use client"
import { Loader2 } from "lucide-react"
import type { ClientDirectoryEntry } from "@/lib/staff/types"
import { StatusPill } from "./StatusPill"
import { useClientRowNav } from "./useClientRowNav"

export function RecentlyViewedRow({ clients }: { clients: ClientDirectoryEntry[] }) {
  const { navigate, isRowPending } = useClientRowNav();

  if (clients.length === 0) return null;

  return (
    <div>
      <p className="text-[11px] font-black uppercase tracking-wide text-brand-light/40 mb-2">Recently Viewed</p>
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
        {clients.map((c) => {
          const pending = isRowPending(c.client_id);
          return (
            <button
              key={c.client_id}
              type="button"
              onClick={() => navigate(c.client_id)}
              className={`shrink-0 w-36 p-3 rounded-card bg-white/5 border border-transparent hover:border-brand-secondary/30 active:scale-[0.98] active:bg-white/10 transition-all text-left ${
                pending ? "opacity-60" : ""
              }`}
            >
              <p className="text-[13px] font-bold text-brand-light truncate">{c.client_name}</p>
              <div className="mt-2">
                {pending ? (
                  <Loader2 size={14} className="animate-spin text-brand-secondary/70" />
                ) : c.status ? (
                  <StatusPill status={c.status} />
                ) : (
                  <span className="text-[10px] text-brand-light/30">No prescription</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
