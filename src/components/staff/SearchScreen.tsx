"use client"
import * as React from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { searchClientsAction } from "@/app/staff/actions"
import type { ClientDirectoryEntry, ClientListPage, ClientSearchResult } from "@/lib/staff/types"
import { StatusPill } from "./StatusPill"
import { RecentlyViewedRow } from "./RecentlyViewedRow"
import { ClientDirectoryTable } from "./ClientDirectoryTable"
import { EmptyClientState } from "./EmptyClientState"

interface SearchScreenProps {
  recentlyViewed: ClientDirectoryEntry[];
  clientsList: ClientListPage;
}

export function SearchScreen({ recentlyViewed, clientsList }: SearchScreenProps) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<ClientSearchResult[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const requestId = React.useRef(0);

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
      <div>
        <h1 className="text-lg font-black uppercase tracking-tight text-brand-light">Find a client</h1>
        <p className="text-[12px] text-brand-light/40 mt-0.5">Search by name or PT.33 number</p>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-light/40" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Client name or PT.33 number"
          className="w-full h-12 pl-11 pr-4 rounded-button bg-white/5 border border-white/10 text-[14px] font-bold text-brand-light placeholder:text-brand-light/30 focus:outline-none focus:border-brand-secondary/50"
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
            {results.map((r) => (
              <Link
                key={`${r.client_id}:${r.pt33_number}`}
                href={`/staff/clients/${r.client_id}`}
                className="flex items-center justify-between gap-3 p-4 rounded-card bg-white/5 border border-transparent hover:border-brand-secondary/30 transition-all"
              >
                <div className="min-w-0">
                  <p className="text-[14px] font-bold text-brand-light truncate">{r.client_name}</p>
                  <p className="text-[12px] text-brand-light/40">{r.pt33_number}</p>
                </div>
                <StatusPill status={r.status} />
              </Link>
            ))}
          </div>
        </>
      ) : clientsList.total === 0 ? (
        <EmptyClientState />
      ) : (
        <div className="space-y-6">
          <RecentlyViewedRow clients={recentlyViewed} />
          <ClientDirectoryTable initial={clientsList} />
        </div>
      )}
    </div>
  );
}
