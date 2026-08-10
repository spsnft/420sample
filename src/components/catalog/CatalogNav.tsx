"use client"
import * as React from "react"

import { TranslationDictionary } from "@/lib/translations"
import { triggerHaptic } from "@/lib/utils"
import { useScrollEdges } from "@/lib/use-scroll-edges"
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

  const current = activeCategory ?? categories[0]?.key;

  return (
    <nav
      aria-label={t.menuTitle}
      // Translucent rather than solid: an opaque bar over the page's gradient
      // shows as a band at every scroll position but the top.
      className="sticky top-0 z-[95] -mx-4 px-4 py-2 mb-4 bg-brand-primary/80 backdrop-blur-xl border-b border-white/5"
    >
      <div className="max-w-5xl mx-auto space-y-1.5">
        <div
          ref={ref}
          className="flex items-center gap-1 overflow-x-auto no-scrollbar"
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
                className={`shrink-0 px-3 h-9 rounded-badge text-[14px] font-black uppercase tracking-wide transition-colors border-b-2 ${FOCUS_RING} ${
                  isActive
                    ? "text-brand-secondary border-brand-secondary"
                    : "text-brand-light/60 border-transparent hover:text-brand-light"
                }`}
              >
                {title}
              </button>
            );
          })}
        </div>

        {/* Hidden entirely when the category has only one kind of thing in it:
            a filter row with a single choice is furniture, not a control. */}
        {filters.length > 1 && (
          <div
            ref={filterRef}
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5"
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
