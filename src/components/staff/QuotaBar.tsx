import { QUOTA_WARNING_RATIO } from "@/lib/staff/constants"

// Strips a float artefact (26.999999999996) without adding a trailing ".0"
// to a whole number — same trick as formatBaht in ClientStats.
function formatGrams(value: number): string {
  return Number(value.toFixed(2)).toString();
}

// The quota is the one number on the card that actually limits a sale —
// status answers "can I sell at all" (asked once), this answers "how much
// is left" (asked on every sale), so it leads with the remainder rather
// than the amount already used: reading "3g" and subtracting from 30 in
// your head is work the card should be doing, not the person behind the
// counter. The colour scale (green/amber at QUOTA_WARNING_RATIO/red at the
// limit) means both this and the bar read at a glance, no arithmetic
// required — used as-is inside NewSaleModal's post-sale forecast too.
export function QuotaBar({ usedGrams, limitGrams }: { usedGrams: number; limitGrams: number }) {
  const ratio = Math.min(usedGrams / limitGrams, 1);
  const isOver = usedGrams > limitGrams;
  const isWarning = !isOver && ratio >= QUOTA_WARNING_RATIO;
  const remaining = Math.max(limitGrams - usedGrams, 0);

  const barColor = isOver ? "bg-red-500" : isWarning ? "bg-amber-500" : "bg-emerald-500";
  const textColor = isOver ? "text-red-400" : isWarning ? "text-amber-400" : "text-brand-light";

  return (
    <div>
      <span className="text-[11px] font-black uppercase tracking-wide text-brand-light/40">Monthly quota</span>
      <div className="flex items-baseline gap-1.5 mt-1 mb-1.5">
        <span className={`text-[15px] font-black ${textColor}`}>{formatGrams(remaining)}g left</span>
        <span className="text-[11px] font-bold text-brand-light/40">of {limitGrams}g</span>
      </div>
      <div className="h-4 rounded-full bg-black/25 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${ratio * 100}%` }} />
      </div>
    </div>
  );
}
