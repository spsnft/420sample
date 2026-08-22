import { ChevronDown } from "lucide-react"

// Native <details>/<summary> accordion: no state, no client JS, works before
// hydration. Every item starts closed — the point of this section is that
// the questions themselves are visible ("What if I stop paying?") and do the
// reassuring before anyone taps one open. No card, no gradient-ring: this is
// a reference, not an argument the way the blocks above it are.
export function FaqSection({
  title,
  items,
}: {
  title: string;
  items: { q: string; a: string }[];
}) {
  return (
    <section className="px-2 pt-2">
      <p className="text-[10px] font-black uppercase tracking-wide text-brand-light/35 mb-2">
        {title}
      </p>
      <div className="divide-y divide-white/10 border-t border-white/10">
        {items.map(({ q, a }) => (
          <details key={q} className="group py-3">
            <summary
              className="flex items-center justify-between gap-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden text-[14px] font-black text-brand-light"
            >
              {q}
              <ChevronDown
                size={16}
                className="shrink-0 text-brand-light/40 transition-transform group-open:rotate-180"
              />
            </summary>
            <p className="mt-2 text-[13px] font-medium text-brand-light/70 leading-relaxed">
              {a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
