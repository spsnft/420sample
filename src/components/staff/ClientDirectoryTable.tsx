"use client"
import * as React from "react"
import { Loader2 } from "lucide-react"
import { getClientsListAction } from "@/app/staff/actions"
import { formatDate } from "@/lib/staff/format"
import type { ClientListPage, ClientListSort, ClientListStatusFilter, ClientListRow } from "@/lib/staff/types"
import { StatusPill } from "./StatusPill"
import { useClientRowNav } from "./useClientRowNav"

const SORT_OPTIONS: { value: ClientListSort; label: string }[] = [
  { value: "last_visit", label: "Last visit" },
  { value: "name", label: "A–Z" },
  { value: "created_at", label: "Date added" },
];

const STATUS_FILTER_OPTIONS: { value: ClientListStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "expired", label: "Expired" },
  { value: "revoked", label: "Revoked" },
  { value: "none", label: "No Rx" },
];

export function ClientDirectoryTable({ initial }: { initial: ClientListPage }) {
  const [sort, setSort] = React.useState<ClientListSort>("last_visit");
  const [status, setStatus] = React.useState<ClientListStatusFilter>("all");
  const [rows, setRows] = React.useState<ClientListRow[]>(initial.rows);
  const [hasMore, setHasMore] = React.useState(initial.hasMore);
  const [page, setPage] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const { navigate, isRowPending } = useClientRowNav();

  const reload = async (nextSort: ClientListSort, nextStatus: ClientListStatusFilter) => {
    setIsLoading(true);
    const result = await getClientsListAction(nextSort, 0, nextStatus);
    setRows(result.rows);
    setHasMore(result.hasMore);
    setPage(0);
    setIsLoading(false);
  };

  const handleSortChange = (nextSort: ClientListSort) => {
    if (nextSort === sort || isLoading) return;
    setSort(nextSort);
    reload(nextSort, status);
  };

  const handleStatusChange = (nextStatus: ClientListStatusFilter) => {
    if (nextStatus === status || isLoading) return;
    setStatus(nextStatus);
    reload(sort, nextStatus);
  };

  const handleLoadMore = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const nextPage = page + 1;
    const result = await getClientsListAction(sort, nextPage, status);
    setRows((prev) => [...prev, ...result.rows]);
    setHasMore(result.hasMore);
    setPage(nextPage);
    setIsLoading(false);
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <p className="text-[11px] font-black uppercase tracking-wide text-brand-light/40">All clients</p>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex gap-1.5 flex-wrap">
            {STATUS_FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleStatusChange(opt.value)}
                className={`shrink-0 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wide transition-colors ${
                  status === opt.value
                    ? "bg-brand-secondary/20 border-brand-secondary/40 text-brand-secondary"
                    : "border-white/10 text-brand-light/40 hover:text-brand-light/70"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex gap-1 p-0.5 rounded-button bg-white/5 border border-white/10 shrink-0">
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
      </div>

      <div className="space-y-2">
        {rows.length === 0 && !isLoading && (
          <p className="text-[12px] text-brand-light/40 text-center py-8">No clients match this filter.</p>
        )}

        {rows.map((r) => {
          const pending = isRowPending(r.client_id);
          return (
            <button
              key={r.client_id}
              type="button"
              onClick={() => navigate(r.client_id)}
              className={`w-full grid grid-cols-[minmax(0,1fr)_92px_100px] items-center gap-3 p-4 rounded-card bg-white/5 border border-transparent hover:border-brand-secondary/30 active:scale-[0.98] active:bg-white/10 transition-all text-left ${
                pending ? "opacity-60" : ""
              }`}
            >
              <p className="text-[14px] font-bold text-brand-light truncate">{r.client_name}</p>
              <div className="flex justify-center">
                {pending ? (
                  <Loader2 size={16} className="animate-spin text-brand-secondary/70" />
                ) : (
                  r.status && <StatusPill status={r.status} />
                )}
              </div>
              <span className="text-[11px] text-brand-light/40 text-right">{formatDate(r.last_visit_at)}</span>
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
