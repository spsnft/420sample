"use client"
import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { setPrescriptionRevoked } from "@/app/staff/actions"
import { triggerHaptic, Baht } from "@/lib/utils"
import { MONTHLY_QUOTA_GRAMS } from "@/lib/staff/constants"
import { formatDate } from "@/lib/staff/format"
import { StatusPill } from "./StatusPill"
import { QuotaBar } from "./QuotaBar"
import { ClientStats } from "./ClientStats"
import { NewSaleModal } from "./NewSaleModal"
import { NewPrescriptionModal } from "./NewPrescriptionModal"
import { ConfirmDialog } from "./ConfirmDialog"
import type { ClientCardData } from "@/lib/staff/types"

const PURCHASES_COLLAPSED_COUNT = 5;

export function ClientCard({ data }: { data: ClientCardData }) {
  const router = useRouter();
  const [isSaleOpen, setIsSaleOpen] = React.useState(false);
  const [isNewRxOpen, setIsNewRxOpen] = React.useState(false);
  const [isConfirmRevokeOpen, setIsConfirmRevokeOpen] = React.useState(false);
  const [isTogglingRevoke, setIsTogglingRevoke] = React.useState(false);
  const [showAllPurchases, setShowAllPurchases] = React.useState(false);

  const rx = data.prescriptions.find((p) => p.status === "active") ?? data.prescriptions[0];
  const olderPrescriptions = data.prescriptions.filter((p) => p.id !== rx.id);
  const visiblePurchases = showAllPurchases ? data.purchases : data.purchases.slice(0, PURCHASES_COLLAPSED_COUNT);

  const applyRevokeToggle = async (revoked: boolean) => {
    triggerHaptic("medium");
    setIsTogglingRevoke(true);
    await setPrescriptionRevoked(rx.id, revoked);
    setIsTogglingRevoke(false);
    router.refresh();
  };

  // Revoking blocks a sale until a new PT.33 is added, so it gets a
  // confirmation naming that consequence. Restoring is fully reversible on
  // its own — revoking again undoes it — so it fires immediately.
  const handleRevokeClick = () => {
    if (rx.revoked) {
      applyRevokeToggle(false);
    } else {
      setIsConfirmRevokeOpen(true);
    }
  };

  const handleConfirmRevoke = () => {
    setIsConfirmRevokeOpen(false);
    applyRevokeToggle(true);
  };

  return (
    <div className="space-y-4 pb-8">
      <div className="flex items-start gap-2">
        <Link
          href="/staff"
          aria-label="Back to client search"
          onClick={() => triggerHaptic("light")}
          className="shrink-0 mt-0.5 p-2 -ml-2 rounded-full surface-row hover:brightness-110 active:translate-y-px transition-all text-brand-light/70 hover:text-brand-light"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="min-w-0">
          <h1 className="text-xl font-black text-brand-light leading-tight">{data.client.name}</h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[12px] text-brand-light/50">
            {data.client.phone && <span>{data.client.phone}</span>}
            {data.client.line_id && <span>LINE: {data.client.line_id}</span>}
            {data.client.id_number && <span>ID: {data.client.id_number}</span>}
          </div>
        </div>
      </div>

      <ClientStats
        lifetimeSpent={data.stats.lifetimeSpent}
        purchaseCount={data.stats.purchaseCount}
        firstVisitDate={data.client.first_visit_date}
      />

      <div className="p-4 rounded-card surface space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-wide text-brand-light/40">PT.33</p>
            <p className="text-[15px] font-bold text-brand-light truncate">{rx.pt33_number}</p>
          </div>
          <StatusPill status={rx.status} />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-brand-light/50">
          <span>Issued {formatDate(rx.issue_date)}</span>
          <span>Expires {formatDate(rx.expiry_date)}</span>
          {rx.doctor && <span>{rx.doctor}</span>}
        </div>

        <QuotaBar usedGrams={rx.quota_used_g} limitGrams={MONTHLY_QUOTA_GRAMS} />

        {/* Now styled as its own button — red outline, transparent fill,
            width to content — rather than a full-width row that read as
            just another section heading next to Monthly Quota above it.
            Restoring keeps a neutral outline: it's fully reversible on its
            own (revoking again undoes it), so it doesn't need the same
            weight as the action that has a real consequence. Its own top
            border + padding still pulls it out of the quota block above. */}
        <div className="mt-1 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={handleRevokeClick}
            disabled={isTogglingRevoke}
            className={`inline-flex h-9 px-4 items-center rounded-button border text-[11px] font-black uppercase tracking-wide transition-colors disabled:opacity-50 ${
              rx.revoked
                ? "border-white/15 text-brand-light/60 hover:text-brand-light hover:border-white/30"
                : "border-red-500/40 text-red-400 hover:bg-red-500/10"
            }`}
          >
            {rx.revoked ? "Restore PT.33" : "Revoke PT.33"}
          </button>
        </div>
      </div>

      {/* w-3/4 / w-1/4 below sm: on a narrow phone the New PT.33 button's
          own content width ate ~35% of the row, crowding the primary
          action down to ~65%. Above sm the row is wide enough that
          content-based sizing already lands close to correct, so it
          reverts to the original flex-1/auto split there untouched. */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => { triggerHaptic("medium"); setIsSaleOpen(true); }}
          className="w-3/4 sm:w-auto sm:flex-1 h-14 btn-metal font-black uppercase tracking-widest text-[13px] rounded-button active:scale-95 transition-all"
        >
          New Sale
        </button>
        <button
          type="button"
          onClick={() => { triggerHaptic("medium"); setIsNewRxOpen(true); }}
          className="w-1/4 sm:w-auto h-14 px-2 sm:px-4 rounded-button surface-row hover:brightness-110 font-black uppercase tracking-widest text-[11px] sm:text-[12px] text-brand-light/70 hover:text-brand-light active:translate-y-px transition-all whitespace-nowrap overflow-hidden"
        >
          New PT.33
        </button>
      </div>

      <div>
        <p className="text-[11px] font-black uppercase tracking-wide text-brand-light/40 mb-2">Purchase history</p>
        {data.purchases.length === 0 ? (
          <p className="text-[12px] text-brand-light/40">No purchases yet.</p>
        ) : (
          <>
            <div className="p-2 rounded-card surface space-y-2">
              {visiblePurchases.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 p-3 rounded-nested surface-row">
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-brand-light truncate">{p.product}</p>
                    <p className="text-[11px] text-brand-light/40">
                      {formatDate(p.date)} · {p.quantity}g{p.staff?.name ? ` · ${p.staff.name}` : ""}
                    </p>
                  </div>
                  <span className="text-[13px] font-black text-brand-secondary shrink-0">{p.price.toLocaleString("en-US")}<Baht /></span>
                </div>
              ))}
            </div>
            {!showAllPurchases && data.purchases.length > PURCHASES_COLLAPSED_COUNT && (
              <button
                type="button"
                onClick={() => { triggerHaptic("light"); setShowAllPurchases(true); }}
                className="block w-full mt-2 pt-1 text-center text-[11px] font-black uppercase tracking-wide text-brand-light/40 hover:text-brand-light/60 transition-colors"
              >
                Show all purchases
              </button>
            )}
          </>
        )}
      </div>

      {olderPrescriptions.length > 0 && (
        <div>
          <p className="text-[11px] font-black uppercase tracking-wide text-brand-light/40 mb-2">Previous PT.33</p>
          <div className="p-2 rounded-card surface space-y-2">
            {olderPrescriptions.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 p-3 rounded-nested surface-row">
                <span className="text-[12px] font-bold text-brand-light/70 truncate">{p.pt33_number}</span>
                <StatusPill status={p.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {isSaleOpen && (
        <NewSaleModal
          client={data.client}
          prescription={rx}
          onClose={() => setIsSaleOpen(false)}
          onSuccess={() => router.refresh()}
        />
      )}

      {isNewRxOpen && (
        <NewPrescriptionModal
          clientId={data.client.id}
          clientName={data.client.name}
          onClose={() => setIsNewRxOpen(false)}
        />
      )}

      {isConfirmRevokeOpen && (
        <ConfirmDialog
          message={`Revoke PT.33 for ${data.client.name}?`}
          confirmLabel="Revoke"
          isConfirming={isTogglingRevoke}
          onConfirm={handleConfirmRevoke}
          onCancel={() => setIsConfirmRevokeOpen(false)}
        />
      )}
    </div>
  );
}
