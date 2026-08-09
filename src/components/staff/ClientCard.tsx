"use client"
import * as React from "react"
import { useRouter } from "next/navigation"
import { setPrescriptionRevoked } from "@/app/staff/actions"
import { triggerHaptic, Baht } from "@/lib/utils"
import { MONTHLY_QUOTA_GRAMS } from "@/lib/staff/constants"
import { formatDate } from "@/lib/staff/format"
import { StatusPill } from "./StatusPill"
import { QuotaBar } from "./QuotaBar"
import { NewSaleModal } from "./NewSaleModal"
import { NewPrescriptionModal } from "./NewPrescriptionModal"
import type { ClientCardData } from "@/lib/staff/types"

export function ClientCard({ data }: { data: ClientCardData }) {
  const router = useRouter();
  const [isSaleOpen, setIsSaleOpen] = React.useState(false);
  const [isNewRxOpen, setIsNewRxOpen] = React.useState(false);
  const [isTogglingRevoke, setIsTogglingRevoke] = React.useState(false);

  const rx = data.prescriptions.find((p) => p.status === "active") ?? data.prescriptions[0];
  const olderPrescriptions = data.prescriptions.filter((p) => p.id !== rx.id);

  const handleToggleRevoke = async () => {
    triggerHaptic("medium");
    setIsTogglingRevoke(true);
    await setPrescriptionRevoked(rx.id, !rx.revoked);
    setIsTogglingRevoke(false);
    router.refresh();
  };

  return (
    <div className="space-y-4 pb-8">
      <div>
        <h1 className="text-xl font-black text-brand-light leading-tight">{data.client.name}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[12px] text-brand-light/50">
          {data.client.phone && <span>{data.client.phone}</span>}
          {data.client.line_id && <span>LINE: {data.client.line_id}</span>}
          {data.client.id_number && <span>ID: {data.client.id_number}</span>}
          <span>Client since {formatDate(data.client.first_visit_date)}</span>
        </div>
      </div>

      <div className="p-4 rounded-card bg-white/5 border border-white/10 space-y-3">
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
          {rx.doctor && <span>Dr. {rx.doctor}</span>}
        </div>

        <QuotaBar usedGrams={rx.quota_used_g} limitGrams={MONTHLY_QUOTA_GRAMS} />

        <button
          type="button"
          onClick={handleToggleRevoke}
          disabled={isTogglingRevoke}
          className="text-[11px] font-black uppercase tracking-wide text-red-400/70 hover:text-red-400 transition-colors disabled:opacity-50"
        >
          {rx.revoked ? "Restore prescription" : "Revoke prescription"}
        </button>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => { triggerHaptic("medium"); setIsSaleOpen(true); }}
          className="flex-1 h-14 btn-metal font-black uppercase tracking-widest text-[13px] rounded-button active:scale-95 transition-all"
        >
          New Sale
        </button>
        <button
          type="button"
          onClick={() => { triggerHaptic("medium"); setIsNewRxOpen(true); }}
          className="h-14 px-4 rounded-button bg-white/5 border border-white/10 hover:border-brand-secondary/30 font-black uppercase tracking-widest text-[12px] text-brand-light/70 hover:text-brand-light active:scale-95 transition-all whitespace-nowrap"
        >
          New Rx
        </button>
      </div>

      {olderPrescriptions.length > 0 && (
        <div>
          <p className="text-[11px] font-black uppercase tracking-wide text-brand-light/40 mb-2">Previous prescriptions</p>
          <div className="space-y-2">
            {olderPrescriptions.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 p-3 rounded-button bg-white/5 border border-white/10">
                <span className="text-[12px] font-bold text-brand-light/70 truncate">{p.pt33_number}</span>
                <StatusPill status={p.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-[11px] font-black uppercase tracking-wide text-brand-light/40 mb-2">Purchase history</p>
        {data.purchases.length === 0 ? (
          <p className="text-[12px] text-brand-light/40">No purchases yet.</p>
        ) : (
          <div className="space-y-2">
            {data.purchases.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 p-3 rounded-button bg-white/5 border border-white/10">
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-brand-light truncate">{p.product}</p>
                  <p className="text-[11px] text-brand-light/40">
                    {formatDate(p.date)} · {p.quantity}g{p.staff?.name ? ` · ${p.staff.name}` : ""}
                  </p>
                </div>
                <span className="text-[13px] font-black text-brand-secondary shrink-0">{p.price}<Baht /></span>
              </div>
            ))}
          </div>
        )}
      </div>

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
    </div>
  );
}
