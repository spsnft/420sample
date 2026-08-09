"use client"
import * as React from "react"
import { Loader2 } from "lucide-react"
import { getClientsListAction } from "@/app/staff/actions"
import { formatDate, maskPt33Number } from "@/lib/staff/format"
import type { ClientListPage, ClientListSort, ClientListRow } from "@/lib/staff/types"
import { StatusPill } from "./StatusPill"
import { useClientRowNav } from "./useClientRowNav"

const SORT_OPTIONS: { value: ClientListSort; label: string }[] = [
  { value: "last_visit", label: "Last visit" },
  { value: "name", label: "A–Z" },
  { value: "created_at", label: "Date added" },
];

export function ClientDirectoryTable({ initial }: { initial: ClientListPage }) {
  const [sort, setSort] = React.useState<ClientListSort>("last_visit");
  const [rows, setRows] = React.useState<ClientListRow[]>(initial.rows);
  const [hasMore, setHasMore] = React.useState(initial.hasMore);
  const [page, setPage] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const { navigate, isRowPending } = useClientRowNav();

  const handleSortChange = async (nextSort: ClientListSort) => {
    if (nextSort === sort || isLoading) return;
    setSort(nextSort);
    setIsLoading(true);
    const result = await getClientsListAction(nextSort, 0);
    setRows(result.rows);
    setHasMore(result.hasMore);
    setPage(0);
    setIsLoading(false);
  };

  const handleLoadMore = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const nextPage = page + 1;
    const result = await getClientsListAction(sort, nextPage);
    setRows((prev) => [...prev, ...result.rows]);
    setHasMore(result.hasMore);
    setPage(nextPage);
    setIsLoading(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-black uppercase tracking-wide text-brand-light/40">All clients</p>
        <div className="flex gap-1 p-0.5 rounded-button bg-white/5 border border-white/10">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSortChange(opt.value)}
              className={`px-2.5 py-1 rounded-button text-[10px] font-black uppercase tracking-wide transition-colors ${
                sort === opt.value
                  ? "bg-brand-secondary/20 text-brand-secondary"
                  : "text-brand-light/40 hover:text-brand-light/70"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {rows.map((r) => {
          const pending = isRowPending(r.client_id);
          return (
            <button
              key={r.client_id}
              type="button"
              onClick={() => navigate(r.client_id)}
              className={`w-full flex items-center justify-between gap-3 p-4 rounded-card bg-white/5 border border-transparent hover:border-brand-secondary/30 active:scale-[0.98] active:bg-white/10 transition-all text-left ${
                pending ? "opacity-60" : ""
              }`}
            >
              <div className="min-w-0">
                <p className="text-[14px] font-bold text-brand-light truncate">{r.client_name}</p>
                <p className="text-[12px] text-brand-light/40 truncate">
                  {r.pt33_number
                    ? `${maskPt33Number(r.pt33_number)}${r.expiry_date ? ` · Expires ${formatDate(r.expiry_date)}` : ""}`
                    : "No prescription"}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                {pending ? (
                  <Loader2 size={16} className="animate-spin text-brand-secondary/70" />
                ) : (
                  r.status && <StatusPill status={r.status} />
                )}
                <span className="text-[11px] text-brand-light/40">{formatDate(r.last_visit_at)}</span>
              </div>
            </button>
          );
        })}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={handleLoadMore}
          disabled={isLoading}
          className="w-full h-11 rounded-button bg-white/5 border border-white/10 text-[12px] font-black uppercase tracking-wide text-brand-light/60 hover:text-brand-light transition-colors disabled:opacity-50"
        >
          {isLoading ? "Loading…" : "Load more"}
        </button>
      )}
    </div>
  );
}
