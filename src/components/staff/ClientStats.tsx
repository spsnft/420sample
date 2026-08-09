import { Baht } from "@/lib/utils"

// Calendar-month diff (not just days/30) so "3 months" lines up with what a
// human means by it regardless of month length.
function monthsSince(dateStr: string): number {
  const start = new Date(dateStr);
  const now = new Date();
  let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  if (now.getDate() < start.getDate()) months -= 1;
  return Math.max(0, months);
}

function StatTile({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="p-3 rounded-card bg-white/5 border border-white/10 text-center">
      <p className="text-[9px] font-black uppercase tracking-wide text-brand-light/40 leading-tight">{label}</p>
      <p className="text-[15px] font-black text-brand-light mt-1 truncate">{value}</p>
    </div>
  );
}

interface ClientStatsProps {
  lifetimeSpent: number;
  purchaseCount: number;
  firstVisitDate: string;
}

export function ClientStats({ lifetimeSpent, purchaseCount, firstVisitDate }: ClientStatsProps) {
  const months = monthsSince(firstVisitDate);
  const avgPerVisit = purchaseCount > 0 ? Math.round(lifetimeSpent / purchaseCount) : null;

  return (
    <div className="grid grid-cols-4 gap-2">
      <StatTile label="Lifetime Spent" value={<>{lifetimeSpent.toLocaleString()}<Baht /></>} />
      <StatTile label="Purchases" value={purchaseCount} />
      <StatTile label="Client Since" value={months === 0 ? "New" : `${months} mo`} />
      <StatTile label="Avg / Visit" value={avgPerVisit !== null ? <>{avgPerVisit.toLocaleString()}<Baht /></> : "—"} />
    </div>
  );
}
