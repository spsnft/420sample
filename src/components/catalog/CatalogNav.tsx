"use client"
import * as React from "react"

import { TranslationDictionary } from "@/lib/translations"
import { triggerHaptic } from "@/lib/utils"
import { useScrollEdges } from "@/lib/use-scroll-edges"
import { useStuck } from "@/lib/use-stuck"
import { FOCUS_RING } from "@/components/cards/ProductCards"

interface CatalogNavProps {
  categories: { key: string; title: string }[];
  activeCategory: string | null;
  onSelectCategory: (key: string) => void;
  /** The `type` values present in the active category: strains for flower and
   *  joints, kinds of thing for accessories. Derived from stock rather than
   *  fixed, so a filter never offers a choice that returns nothing. */
  filters: string[];
  activeFilter: string | null;
  onFilter: (filter: string | null) => void;
  t: TranslationDictionary;
}

// The catalogue's controls, sitting directly above the catalogue and below the
// showcase rows. They used to sit above the carousels, which put them a screen
// away from the only thing they changed — and a single strain filter spanned
// every category, including the one where strains do not exist.
//
// Two rows, because the relationship is a hierarchy: the category decides what
// you are looking at, the row under it narrows that category and nothing else.
export const CatalogNav: React.FC<CatalogNavProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  filters,
  activeFilter,
  onFilter,
  t,
}) => {
  const { ref, mask } = useScrollEdges(categories.length);
  const { ref: filterRef, mask: filterMask } = useScrollEdges(filters.join());

  // A sticky bar looks like two different things depending on whether it is
  // stuck. Parked in the flow it is a row of tabs, and the rule and the frosted
  // panel under it draw a line across the full width of the window — wider than
  // the column the tabs belong to — separating the tabs from the very products
  // they switch. Stuck to the top of the window the same rule is doing real
  // work: it marks the edge cards are sliding under. So it appears exactly
  // then.
  const { ref: sentinelRef, stuck } = useStuck();

  const current = activeCategory ?? categories[0]?.key;

  return (
    <>
    <div ref={sentinelRef} aria-hidden className="h-px" />
    <nav
      aria-label={t.menuTitle}
      // Translucent rather than solid: an opaque bar over the page's gradient
      // shows as a band at every scroll position but the top. The border is
      // always declared, transparent until stuck, so switching it on does not
      // move the row by a pixel.
      className={`sticky top-0 z-[95] -mx-4 px-4 py-2 mt-6 mb-6 border-b transition-colors duration-200 ${
        stuck
          ? "bg-brand-primary/80 backdrop-blur-xl border-white/5"
          : "border-transparent"
      }`}
    >
      <div className="max-w-5xl mx-auto space-y-1.5">
        <div
          ref={ref}
          // Pulled left by the tab's own padding so the first tab's *word*
          // starts on the page's left edge, level with the first filter chip
          // below it. Padding stays for the sake of the touch target.
          className="flex items-center gap-2 overflow-x-auto no-scrollbar -ml-3"
          style={{ WebkitMaskImage: mask, maskImage: mask }}
        >
          {categories.map(({ key, title }) => {
            const isActive = current === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => { triggerHaptic('light'); onSelectCategory(key); }}
                aria-current={isActive ? "page" : undefined}
                // The underline is a child, not a bottom border. On a rounded
                // button the border follows the corner radius and curves up at
                // both ends — which read as a smudge under the word rather than
                // as an underline.
                className={`relative shrink-0 px-3 h-9 rounded-badge text-[14px] font-black uppercase tracking-wide transition-colors ${FOCUS_RING} ${
                  isActive ? "text-brand-secondary" : "text-brand-light/50 hover:text-brand-light"
                }`}
              >
                {title}
                {isActive && (
                  <span aria-hidden className="absolute left-3 right-3 bottom-0.5 h-[3px] rounded-full bg-brand-secondary" />
                )}
              </button>
            );
          })}
        </div>

        {/* Hidden entirely when the category has only one kind of thing in it:
            a filter row with a single choice is furniture, not a control. */}
        {filters.length > 1 && (
          <div
            ref={filterRef}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5"
            style={{ WebkitMaskImage: filterMask, maskImage: filterMask }}
          >
            <FilterChip label={t.filterAll} isOn={activeFilter === null} onClick={() => onFilter(null)} />
            {filters.map(filter => (
              <FilterChip
                key={filter}
                label={filter}
                isOn={activeFilter === filter}
                // A pressed chip toggles off as well, so "all" is never the only
                // way back.
                onClick={() => onFilter(activeFilter === filter ? null : filter)}
              />
            ))}
          </div>
        )}
      </div>
    </nav>
    </>
  );
};

const FilterChip: React.FC<{ label: string; isOn: boolean; onClick: () => void }> = ({ label, isOn, onClick }) => (
  <button
    type="button"
    onClick={() => { triggerHaptic('light'); onClick(); }}
    aria-pressed={isOn}
    className={`shrink-0 px-3 h-7 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-wide border transition-colors ${FOCUS_RING} ${
      isOn
        ? "bg-brand-secondary border-brand-secondary text-brand-primary"
        : "border-white/15 text-brand-light/60 hover:text-brand-light hover:border-white/30"
    }`}
  >
    {label}
  </button>
);
