import type { PrescriptionStatus } from "@/lib/staff/types"

const STYLES: Record<PrescriptionStatus, string> = {
  active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  expired: "bg-brand-secondary/15 text-brand-secondary border-brand-secondary/30",
  revoked: "bg-red-500/15 text-red-400 border-red-500/30",
};

const LABELS: Record<PrescriptionStatus, string> = {
  active: "Active",
  expired: "Expired",
  revoked: "Revoked",
};

export function StatusPill({ status }: { status: PrescriptionStatus }) {
  return (
    <span className={`shrink-0 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wide ${STYLES[status]}`}>
      {LABELS[status]}
    </span>
  );
}
