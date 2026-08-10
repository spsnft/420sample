"use client"
import * as React from "react"
import { SlidersHorizontal } from "lucide-react"

import { TranslationDictionary } from "@/lib/translations"
import { triggerHaptic } from "@/lib/utils"
import { useScrollEdges } from "@/lib/use-scroll-edges"
import { FOCUS_RING } from "@/components/cards/ProductCards"

// The strain types a customer actually chooses between. Kept as literals rather
// than derived from the catalogue so the order is stable — a filter row whose
// buttons move when stock changes is a filter row nobody learns.
export const TYPE_FILTERS = ["indica", "sativa", "hybrid"] as const;
export type TypeFilter = (typeof TYPE_FILTERS)[number];

interface CatalogNavProps {
  sections: { key: string; title: string }[];
  activeSection: string | null;
  onJump: (key: string) => void;
  typeFilter: TypeFilter | null;
  onTypeFilter: (type: TypeFilter | null) => void;
  t: TranslationDictionary;
}

// Sticky strip carrying both ways of getting around a long menu: jump to a
// category, or narrow the whole page to one strain type. They share a row —
// two stacked rows would eat 90px of a phone screen — and are told apart by
// shape: category chips are bare text with an underline, filters are outlined
// pills behind a filter icon.
export const CatalogNav: React.FC<CatalogNavProps> = ({
  sections,
  activeSection,
  onJump,
  typeFilter,
  onTypeFilter,
  t,
}) => {
  const { ref, mask } = useScrollEdges(sections.length);

  // Nothing is "current" until the reader reaches a section, but a nav with no
  // active tab at the top of the page looks broken — so the first category
  // holds the highlight until scrolling says otherwise.
  const current = activeSection ?? sections[0]?.key;

  return (
    <nav
      aria-label={t.menuTitle}
      className="sticky top-0 z-[95] -mx-4 px-4 py-2 mb-4 bg-brand-primary border-b border-white/5"
    >
      {/* One row on a desktop screen, two on a phone: all six controls in a
          single 390px row left the filters off-screen behind a horizontal
          scroll, which is where nobody looks for them. */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
        <div
          ref={ref}
          className="flex items-center gap-1 overflow-x-auto no-scrollbar"
          style={{ WebkitMaskImage: mask, maskImage: mask }}
        >
          {sections.map(({ key, title }) => {
            const isActive = current === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => { triggerHaptic('light'); onJump(key); }}
                aria-current={isActive ? "true" : undefined}
                className={`shrink-0 px-2.5 h-8 rounded-badge text-[12px] font-black uppercase tracking-wide transition-colors border-b-2 ${FOCUS_RING} ${
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

        <span aria-hidden className="hidden md:block shrink-0 w-px h-5 bg-white/10" />

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <SlidersHorizontal aria-hidden size={14} className="shrink-0 text-brand-light/40 mr-0.5" />

          {TYPE_FILTERS.map(type => {
            const isOn = typeFilter === type;
            return (
              <button
                key={type}
                type="button"
                // A pressed filter toggles itself off, so there is always a way
                // back to the full menu without hunting for a reset control.
                onClick={() => { triggerHaptic('light'); onTypeFilter(isOn ? null : type); }}
                aria-pressed={isOn}
                className={`shrink-0 px-3 h-7 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-wide border transition-colors ${FOCUS_RING} ${
                  isOn
                    ? "bg-brand-secondary border-brand-secondary text-brand-primary"
                    : "border-white/15 text-brand-light/60 hover:text-brand-light hover:border-white/30"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
