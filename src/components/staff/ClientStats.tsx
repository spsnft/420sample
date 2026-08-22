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

// Four tiles across means the narrower labels ("Purchases") sit on one line
// while the wider ones ("Lifetime Spent") wrap to two, at every phone width.
// Left to flow, that pushes each tile's number to a different height and the
// row of figures — the part staff actually read across — comes out ragged.
// So the label block reserves two lines' worth of height whether it needs
// them or not, and the value is pushed to the bottom of the tile, which keeps
// the numbers on one line even if a label ever wraps to three.
// Four tiles on a phone leave ~60px of usable width per tile, which a fully
// grouped baht figure outgrows the moment a client is worth more than five
// digits — "124,500" truncated to "124,..." is worse than no number at all.
// Anything from 10k up is shown compact, which is the precision a staff member
// glancing at lifetime value actually needs; the exact figure is still in the
// purchase history below.
//
// Rolled by hand rather than handed to Intl's compact notation, which has no
// way to say "one decimal, but only while it still fits": capping fraction
// digits at 1 gives "124.5K" and capping significant digits at 3 gives
// "2.45M", and both of those overflow the tile just like the raw number did.
// The rule that fits is one decimal only while the mantissa is two digits.
// Locale is pinned so the server and client render the same string.
function formatBaht(amount: number): string {
  if (amount < 10_000) return amount.toLocaleString("en-US");
  // Branch on the rounded value, so 999,999 reads "1M" and never "1000K".
  const [scaled, suffix] = amount < 999_500 ? [amount / 1_000, "K"] : [amount / 1_000_000, "M"];
  // Number() re-parses to drop a trailing ".0" — "12.4K" but "125K", not "125.0K".
  return `${Number(scaled.toFixed(scaled < 100 ? 1 : 0))}${suffix}`;
}

// Four tiles are a reference, not the headline of the screen — the four
// circles used to be the same weight as everything else, so they collected
// attention first simply by being first. Dimming the value down towards the
// label's own weight puts them back below the PT.33 card and its quota.
function StatTile({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="p-3 rounded-card surface text-center flex flex-col">
      <p className="text-[9px] font-black uppercase tracking-wide text-brand-light/40 leading-tight min-h-[2.5em]">
        {label}
      </p>
      <p className="text-[12px] font-bold text-brand-light/60 mt-auto pt-1 truncate">{value}</p>
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
      <StatTile label="Lifetime Spent" value={<>{formatBaht(lifetimeSpent)}<Baht /></>} />
      <StatTile label="Purchases" value={purchaseCount.toLocaleString("en-US")} />
      <StatTile label="Client Since" value={months === 0 ? "New" : `${months} mo`} />
      <StatTile label="Avg / Visit" value={avgPerVisit !== null ? <>{formatBaht(avgPerVisit)}<Baht /></> : "—"} />
    </div>
  );
}
