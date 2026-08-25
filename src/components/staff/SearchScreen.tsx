"use client"
import * as React from "react"
import { Search, UserPlus, Loader2 } from "lucide-react"
import { searchClientsAction } from "@/app/staff/actions"
import { triggerHaptic } from "@/lib/utils"
import type { ClientDirectoryEntry, ClientListPage, ClientSearchResult } from "@/lib/staff/types"
import { StatusPill } from "./StatusPill"
import { RecentlyViewedRow } from "./RecentlyViewedRow"
import { ClientDirectoryTable } from "./ClientDirectoryTable"
import { EmptyClientState } from "./EmptyClientState"
import { NewClientModal } from "./NewClientModal"
import { useClientRowNav } from "./useClientRowNav"

interface SearchScreenProps {
  recentlyViewed: ClientDirectoryEntry[];
  clientsList: ClientListPage;
}

export function SearchScreen({ recentlyViewed, clientsList }: SearchScreenProps) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<ClientSearchResult[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [isNewClientOpen, setIsNewClientOpen] = React.useState(false);
  const requestId = React.useRef(0);
  const { navigate, isRowPending } = useClientRowNav();
  const top5ClientIds = React.useMemo(
    () => new Set(clientsList.rows.slice(0, 5).map((r) => r.client_id)),
    [clientsList.rows]
  );

  React.useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const id = ++requestId.current;
    const timeout = setTimeout(async () => {
      const rows = await searchClientsAction(trimmed);
      if (id === requestId.current) {
        setResults(rows);
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-black uppercase tracking-tight text-brand-light">Find a client</h1>
        </div>
        <button
          type="button"
          onClick={() => { triggerHaptic("medium"); setIsNewClientOpen(true); }}
          className="shrink-0 h-9 px-3 rounded-button surface-row hover:brightness-110 active:translate-y-px flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wide text-brand-light/70 hover:text-brand-light transition-all"
        >
          <UserPlus size={14} />
          New Client
        </button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-light/40" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Client name or PT.33 number"
          className="w-full h-12 pl-11 pr-4 rounded-button field-recessed border border-white/5 text-[14px] font-bold text-brand-light placeholder:text-brand-light/30 focus:outline-none focus:border-brand-secondary/50"
        />
      </div>

      {query.trim() ? (
        <>
          {isSearching && (
            <p className="text-[12px] text-brand-light/40 text-center py-4">Searching…</p>
          )}

          {!isSearching && results.length === 0 && (
            <p className="text-[12px] text-brand-light/40 text-center py-4">No matches.</p>
          )}

          <div className="space-y-2">
            {results.map((r) => {
              const pending = isRowPending(r.client_id);
              return (
                <button
                  key={`${r.client_id}:${r.pt33_number}`}
                  type="button"
                  onClick={() => navigate(r.client_id)}
                  className={`w-full flex items-center justify-between gap-3 p-4 rounded-card surface-row hover:brightness-110 active:translate-y-px transition-all text-left ${
                    pending ? "opacity-60" : ""
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold text-brand-light truncate">{r.client_name}</p>
                    <p className="text-[12px] text-brand-light/40">{r.pt33_number}</p>
                  </div>
                  {pending ? (
                    <Loader2 size={16} className="animate-spin text-brand-secondary/70 shrink-0" />
                  ) : (
                    <StatusPill status={r.status} />
                  )}
                </button>
              );
            })}
          </div>
        </>
      ) : clientsList.total === 0 ? (
        <EmptyClientState />
      ) : (
        <div className="space-y-6">
          {/* Redundant once every recently-viewed client is already sitting
              in the list's own first 5 rows — hide the whole strip rather
              than show a row that just repeats what's right below it.
              Checked against clientsList's initial top 5 (the default
              "Last visit" order), not whatever ClientDirectoryTable's own
              sort/filter state currently shows — recentlyViewed itself
              doesn't react to those either. */}
          {recentlyViewed.some((c) => !top5ClientIds.has(c.client_id)) && (
            <RecentlyViewedRow clients={recentlyViewed} />
          )}
          <ClientDirectoryTable initial={clientsList} />
        </div>
      )}

      {isNewClientOpen && <NewClientModal onClose={() => setIsNewClientOpen(false)} />}
    </div>
  );
}
