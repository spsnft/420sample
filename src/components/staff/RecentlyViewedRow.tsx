import Link from "next/link"
import type { ClientDirectoryEntry } from "@/lib/staff/types"
import { StatusPill } from "./StatusPill"

export function RecentlyViewedRow({ clients }: { clients: ClientDirectoryEntry[] }) {
  if (clients.length === 0) return null;

  return (
    <div>
      <p className="text-[11px] font-black uppercase tracking-wide text-brand-light/40 mb-2">Recently Viewed</p>
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
        {clients.map((c) => (
          <Link
            key={c.client_id}
            href={`/staff/clients/${c.client_id}`}
            className="shrink-0 w-36 p-3 rounded-card bg-white/5 border border-transparent hover:border-brand-secondary/30 transition-all"
          >
            <p className="text-[13px] font-bold text-brand-light truncate">{c.client_name}</p>
            <div className="mt-2">
              {c.status ? <StatusPill status={c.status} /> : (
                <span className="text-[10px] text-brand-light/30">No prescription</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
