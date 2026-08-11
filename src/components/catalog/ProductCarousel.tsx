"use client"
import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { HighlightCard, BadgeIcon } from "@/components/cards/ProductCards"
import { getCategoryConfig } from "@/components/catalog/ProductGrid"
import { useScrollEdges } from "@/lib/use-scroll-edges"
import { TranslationDictionary } from "@/lib/translations"

interface ProductCarouselProps {
  type: "NEW" | "SALE";
  title: string;
  products: any[];
  onSelect: (product: any) => void;
  t: TranslationDictionary;
}

// The cards are a fixed 160px so a phone always shows a sliver of the next one.
// next/image needs that number as `sizes` — the grid's wider default would make
// it fetch a 2× oversized file for every card in the row.
const CARD_SIZES = "160px";

export const ProductCarousel: React.FC<ProductCarouselProps> = ({ type, title, products, onSelect, t }) => {
  // Before the empty-list bail-out: hooks cannot sit behind a conditional return.
  const { ref, mask, edges, scrollByPage } = useScrollEdges(products?.length);

  if (!products || products.length === 0) return null;

  const arrowClass =
    "absolute top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-brand-primary/80 backdrop-blur border border-white/15 text-brand-light shadow-lg transition-all hover:bg-brand-primary hover:border-white/30 active:scale-90";

  return (
    // Shares the content column with the header and the category grid below.
    // Without it the row started at the viewport edge while everything else on
    // the page was centred in max-w-5xl, which read as a broken layout on a
    // desktop screen.
    <section className="max-w-5xl mx-auto space-y-3 relative">
      <div className="flex items-center gap-2 px-1">
        <BadgeIcon type={type} />
        <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-brand-light/80">{title}</h2>
      </div>

      <div className="relative">
        {/* The row keeps the column's edges rather than bleeding past them; the
            "there is more this way" cue is carried by the edge fade instead,
            and on desktop — where a trackpad swipe is not a given — by the
            arrows. Both switch off on the side that has nothing left to show. */}
        <div
          ref={ref}
          className="flex gap-3 overflow-x-auto no-scrollbar pb-1 snap-x"
          style={{ WebkitMaskImage: mask, maskImage: mask }}
        >
          {products.map((p: any, idx: number) => (
            <div key={p?.id || idx} className="w-[160px] shrink-0 snap-start">
              <HighlightCard
                item={p}
                onClick={() => onSelect(p)}
                priority={idx < 4}
                sizes={CARD_SIZES}
                categoryLabel={getCategoryConfig(p?.category, t).title}
              />
            </div>
          ))}
        </div>

        {edges.start && (
          <button
            type="button"
            aria-label={`${title}: previous`}
            onClick={() => scrollByPage(-1)}
            className={`${arrowClass} left-1`}
          >
            <ChevronLeft size={18} />
          </button>
        )}
        {edges.end && (
          <button
            type="button"
            aria-label={`${title}: next`}
            onClick={() => scrollByPage(1)}
            className={`${arrowClass} right-1`}
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </section>
  );
};
