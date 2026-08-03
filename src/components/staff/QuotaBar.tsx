import { QUOTA_WARNING_RATIO } from "@/lib/staff/constants"

export function QuotaBar({ usedGrams, limitGrams }: { usedGrams: number; limitGrams: number }) {
  const ratio = Math.min(usedGrams / limitGrams, 1);
  const isOver = usedGrams > limitGrams;
  const isWarning = !isOver && ratio >= QUOTA_WARNING_RATIO;

  const barColor = isOver ? "bg-red-500" : isWarning ? "bg-amber-500" : "bg-emerald-500";
  const textColor = isOver ? "text-red-400" : isWarning ? "text-amber-400" : "text-brand-light/70";

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-black uppercase tracking-wide text-brand-light/40">Monthly quota</span>
        <span className={`text-[12px] font-black ${textColor}`}>
          {usedGrams}g / {limitGrams}g used
        </span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${ratio * 100}%` }} />
      </div>
    </div>
  );
}
