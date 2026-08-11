"use client"
import * as React from "react"
import Image from "next/image"
import { Plus, Tag, Zap } from "lucide-react"
import { triggerHaptic, accentFor } from "@/lib/utils"
import { entryPrice } from "@/lib/pricing"

const FALLBACK_IMAGE = "/images/logo.svg";

export const BahtSymbol = React.memo(() => (
  <span className="font-sans text-[0.75em] ml-0.5 opacity-90 align-baseline">฿</span>
));

export const BadgeIcon = React.memo(({ type, isSmall }: { type: string, isSmall?: boolean }) => {
  if (!type) return null;
  const iconSize = isSmall ? 13 : 18;
  const colorClass = {
    NEW: "text-blue-400",
    SALE: "text-brand-secondary",
    HIT: "text-orange-400"
  }[type.toUpperCase()] || "text-brand-light";

  const iconWrapper = (icon: React.ReactNode) => (
    <div className={isSmall ? '' : 'p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/15 shadow-lg'}>
      {icon}
    </div>
  );

  switch (type.toUpperCase()) {
    case "NEW": return iconWrapper(<Plus size={iconSize} className={colorClass} strokeWidth={3} />);
    case "SALE": return iconWrapper(<Tag size={iconSize} className={colorClass} strokeWidth={2.5} />);
    case "HIT": return iconWrapper(<Zap size={iconSize} className={colorClass} strokeWidth={2.5} fill="currentColor" fillOpacity={0.2} />);
    default: return null;
  }
});

// Widest the card gets in the category grids: 4 columns inside max-w-5xl leaves
// ~235px, 3 columns ~330px, and two columns on a phone are about half the
// viewport. The carousel passes its own fixed width instead. Getting this wrong
// is invisible in code and very visible on screen — a `sizes` smaller than the
// rendered box makes next/image serve an upscaled, soft image.
const GRID_SIZES = "(min-width: 768px) 340px, 50vw";

// Shown on the New/Sales rows only. The same strain exists as a bud and as a
// joint at different prices, so a card pulled out of its category and dropped
// into a mixed row is ambiguous without it — inside the category sections the
// heading already says which is which, and the chip would be noise.
const CATEGORY_LABELS: Record<string, string> = {
  buds: "Bud",
  joints: "Joint",
  accessories: "Accessory",
};

// Same ring on every tappable catalogue element, and only for keyboard users —
// `focus-visible` keeps it off during touch and mouse presses.
export const FOCUS_RING =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-primary";

// Status where the customer meets the product, not only in the row that
// gathered it. A discount already shows as a struck price everywhere; a
// percentage says how much at a glance, and "new" had no mark in the catalogue
// at all — which is what made the showcase rows feel like the only place the
// information lived, and therefore like a duplicate.
export const DiscountChip = React.memo(({ percent }: { percent: number }) => (
  <span className="shrink-0 px-1.5 py-0.5 rounded-badge bg-brand-secondary/15 border border-brand-secondary/40 text-[9px] font-black uppercase tracking-wide text-brand-secondary">
    −{Math.round(percent)}%
  </span>
));

// Blue, the colour the New row's own icon already uses, so no new meaning
// enters the palette — and nothing collides with the strain colours.
export const NewTag = React.memo(() => (
  <span className="shrink-0 px-1.5 py-0.5 rounded-badge bg-blue-400/15 border border-blue-400/40 text-[9px] font-black uppercase tracking-wide text-blue-300">
    New
  </span>
));

export const HighlightCard = React.memo(({ item, onClick, priority, sizes = GRID_SIZES, showCategory }: { item: any, onClick: () => void, priority?: boolean, sizes?: string, showCategory?: boolean }) => {
  // Above the empty-item bail-out: a hook behind a conditional return changes
  // the hook order between renders, which is a crash waiting for the first null.
  const [imgSrc, setImgSrc] = React.useState(item?.image || FALLBACK_IMAGE);

  if (!item) return null;

  const accentColor = accentFor(item);

  const { price: currentPrice, listPrice, discounted } = entryPrice(item);

  const categoryLabel = showCategory ? CATEGORY_LABELS[item.category] : null;

  return (
    <button
      type="button"
      onClick={() => { triggerHaptic('light'); onClick(); }}
      className={`relative w-full text-left rounded-card active:scale-[0.98] transition-all cursor-pointer group flex flex-col overflow-hidden h-[200px] bg-brand-primary card-premium ${FOCUS_RING}`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/70 pointer-events-none" />
      <div className="absolute inset-0 opacity-30 pointer-events-none transition-opacity duration-500 group-hover:opacity-50" style={{ background: `radial-gradient(ellipse at 50% 80%, ${accentColor}15, transparent 70%)` }} />

      <div className="relative z-10 px-4 py-3 pb-0 flex-1 flex flex-col min-h-0">
        <div className="min-w-0 pr-6">
          <h3 className="text-[12px] font-black uppercase tracking-tight leading-tight text-brand-light group-hover:text-brand-secondary transition-colors line-clamp-2">
            {item.name}
          </h3>
        </div>
        <div className="relative flex-1 w-full min-h-0 flex items-center justify-center my-1">
          <div
            className="absolute inset-0 rounded-full blur-xl opacity-20 group-hover:opacity-35 transition-opacity duration-500"
            style={{ background: `radial-gradient(circle at 50% 50%, ${accentColor}60, transparent 70%)` }}
          />
          <Image
            src={imgSrc}
            alt={item.name || "Product"}
            fill
            className="object-contain transform group-hover:scale-105 transition-transform duration-300 relative z-10"
            sizes={sizes}
            priority={priority}
            style={{ filter: `drop-shadow(0 0 18px ${accentColor}40)` }}
            onError={() => setImgSrc(FALLBACK_IMAGE)}
          />
        </div>
      </div>

      {/* Category sits above the strain type rather than beside the name: on a
          160px card a chip in the title row cost enough width to truncate
          "Lemon Cherry Bath" to "Lemon Cherr…". */}
      <div className="relative z-10 flex justify-between items-end px-4 pb-3 mt-auto gap-2">
        <span className="min-w-0 flex flex-col items-start gap-1">
          {categoryLabel ? (
            <span className="text-[9px] font-black uppercase tracking-wide text-brand-light/60 leading-none truncate">
              {categoryLabel}
            </span>
          ) : (
            // In a category grid the row heading no longer says what these are,
            // so the slot the category label would occupy carries the status.
            item.badge === 'NEW' ? <NewTag /> : discounted ? <DiscountChip percent={item.discountPercent} /> : null
          )}
          <span className="text-[11px] font-black uppercase tracking-normal brightness-125 leading-none truncate" style={{ color: accentColor }}>
            {item.type}
          </span>
        </span>
        {/* The old price stacks above the new one rather than sitting beside
            it. Side by side, two figures on a 160px card left the labels on
            the left about 48px — enough to cut "Indica" to "Indi…". Stacked,
            the price column is as narrow as an undiscounted card's, and it
            mirrors the category-over-type stack opposite. */}
        <p className="shrink-0 flex flex-col items-end leading-none text-brand-light">
          {discounted && (
            <span className="text-[11px] font-bold text-brand-light/40 line-through mb-1">{listPrice}</span>
          )}
          <span className="text-[16px] font-black tracking-tighter">
            {currentPrice > 0 ? (<>{currentPrice}<BahtSymbol /></>) : '—'}
          </span>
        </p>
      </div>
    </button>
  );
});

export const ProductRow = React.memo(({ p, onClick }: { p: any, onClick: () => void }) => {
  // See HighlightCard: state has to be declared before the bail-out.
  const [imgSrc, setImgSrc] = React.useState(p?.image || FALLBACK_IMAGE);

  if (!p) return null;

  const { price: displayPrice, listPrice: rowListPrice, discounted: rowDiscounted } = entryPrice(p);

  return (
    <button
      type="button"
      onClick={() => { triggerHaptic('light'); onClick(); }}
      // Divider on top rather than bottom: in the desktop two-column list the
      // container can then drop it from the first row of each column with one
      // rule, whatever the product count. A bottom border cannot — "last child"
      // is one cell, so the left column kept a stray line under it.
      className={`w-full text-left flex items-center justify-between gap-3 px-4 py-4 text-brand-light border-t border-white/10 first:border-t-0 active:bg-white/5 hover:bg-white/5 transition-colors cursor-pointer group ${FOCUS_RING} focus-visible:ring-inset focus-visible:ring-offset-0`}
    >
      <div className="flex items-center gap-3 truncate flex-1">
        <div className="w-8 h-8 bg-black/10 rounded-badge overflow-hidden p-0.5 shrink-0 flex items-center justify-center border border-white/5 relative">
          <Image
            src={imgSrc}
            alt={p.name || "Product"}
            fill
            className="object-contain"
            sizes="32px"
            onError={() => setImgSrc(FALLBACK_IMAGE)}
          />
        </div>
        {/* The mark goes under the name, not beside it. On the same line it
            cost about 55px — enough to cut "Super Boof Cherry" short on every
            phone up to 414px, and a menu row exists to carry the name. Only
            marked rows grow; the rest keep the height the taste line used to
            occupy. */}
        <div className="truncate">
          <span className="text-[13px] font-black uppercase tracking-tight text-brand-light/90 truncate leading-tight group-hover:text-brand-secondary transition-colors block">
            {p.name}
          </span>
          {(p.badge === 'NEW' || rowDiscounted) && (
            <span className="flex items-center gap-1.5 mt-1">
              {p.badge === 'NEW' && <NewTag />}
              {rowDiscounted && <DiscountChip percent={p.discountPercent} />}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="text-[11px] font-black uppercase tracking-normal" style={{ color: accentFor(p) }}>
          {p.type}
        </span>
        <span className="text-[14px] font-black text-brand-light flex items-baseline gap-1.5">
          {rowDiscounted && (
            <span className="text-[11px] font-bold text-brand-light/40 line-through">{rowListPrice}</span>
          )}
          {displayPrice > 0 ? (<>{displayPrice}<BahtSymbol /></>) : '—'}
        </span>
      </div>
    </button>
  );
});
