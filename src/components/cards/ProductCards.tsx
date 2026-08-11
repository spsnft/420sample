"use client"
import * as React from "react"
import Image from "next/image"
import { Plus, Tag, Zap } from "lucide-react"
import { triggerHaptic, accentFor, strainAccentFor } from "@/lib/utils"
import { entryPrice } from "@/lib/pricing"
import { TranslationDictionary } from "@/lib/translations"

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

// Same ring on every tappable catalogue element, and only for keyboard users —
// `focus-visible` keeps it off during touch and mouse presses.
export const FOCUS_RING =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-primary";

// Set in the same type as the strain beside it, not in a pill. A bordered
// badge at the strain's own size would outweigh it — two labels of equal
// importance, one of them boxed, and the eye goes to the box. As plain
// coloured words separated by a dot, the line reads as one strip of
// attributes: "Indica · New".
//
// Blue for new is the colour the New row's icon already uses; gold for sale is
// the brand's own. Neither collides with a strain colour, which green or red
// would.
export const StatusTag = React.memo(({ label, kind }: { label: string; kind: 'new' | 'sale' }) => (
  <span className="flex items-center gap-2 shrink-0">
    <span aria-hidden className="text-brand-light/25 text-[11px] leading-none">·</span>
    <span className={`text-[11px] font-black uppercase tracking-normal ${kind === 'new' ? 'text-blue-300' : 'text-brand-secondary'}`}>
      {label}
    </span>
  </span>
));

// `categoryLabel` is passed in rather than derived here so it is literally the
// tab's own word — "Buds", not "Bud". Two spellings of one category invite the
// reader to look for a difference that does not exist.
export const HighlightCard = React.memo(({ item, onClick, priority, sizes = GRID_SIZES, categoryLabel, statusLabel }: { item: any, onClick: () => void, priority?: boolean, sizes?: string, categoryLabel?: string, statusLabel?: string }) => {
  // Above the empty-item bail-out: a hook behind a conditional return changes
  // the hook order between renders, which is a crash waiting for the first null.
  const [imgSrc, setImgSrc] = React.useState(item?.image || FALLBACK_IMAGE);

  if (!item) return null;

  const accentColor = accentFor(item);
  // The glow keeps the gold fallback — it is the card's lighting. The word
  // under it does not: see strainAccentFor.
  const strainColor = strainAccentFor(item);

  const { price: currentPrice, listPrice, discounted } = entryPrice(item);

  return (
    <button
      type="button"
      onClick={() => { triggerHaptic('light'); onClick(); }}
      className={`relative w-full text-left rounded-card active:scale-[0.98] transition-all cursor-pointer group flex flex-col overflow-hidden h-[200px] bg-brand-primary card-premium ${FOCUS_RING}`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/70 pointer-events-none" />
      <div className="absolute inset-0 opacity-40 pointer-events-none transition-opacity duration-500 group-hover:opacity-60" style={{ background: `radial-gradient(ellipse at 50% 80%, ${accentColor}22, transparent 70%)` }} />

      <div className="relative z-10 px-4 py-3 pb-0 flex-1 flex flex-col min-h-0">
        {/* Two lines are reserved whether the name needs them or not, so a
            short name does not give its card a taller picture than its
            neighbour's and leave the row looking assembled by accident. */}
        <div className="min-w-0 pr-6 min-h-[2.1rem]">
          <h3 className="text-[12px] font-black uppercase tracking-tight leading-tight text-brand-light group-hover:text-brand-secondary transition-colors line-clamp-2">
            {item.name}
          </h3>
        </div>
        <div className="relative flex-1 w-full min-h-0 flex items-center justify-center my-1">
          {/* The lamp behind the jar. It was dim enough to read as a smudge
              rather than as light, which wasted the one place on the card
              where the strain's own colour does any work — so the pool is
              brighter, wider and softer, and the photo carries a matching
              halo of its own below. Kept under half opacity: past that the
              colour starts tinting the product instead of lighting it. */}
          <div
            className="absolute -inset-2 rounded-full blur-2xl opacity-45 group-hover:opacity-70 transition-opacity duration-500"
            style={{ background: `radial-gradient(circle at 50% 50%, ${accentColor}80, transparent 72%)` }}
          />
          <Image
            src={imgSrc}
            alt={item.name || "Product"}
            fill
            className="object-contain transform group-hover:scale-105 transition-transform duration-300 relative z-10"
            sizes={sizes}
            priority={priority}
            style={{ filter: `drop-shadow(0 0 22px ${accentColor}66)` }}
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
          ) : statusLabel ? (
            // In a category grid there is no row heading to say a product is
            // new or reduced, so the slot the category label would occupy
            // carries the status instead.
            <span className={`text-[9px] font-black uppercase tracking-wide leading-none truncate ${item.discountPercent > 0 ? 'text-brand-secondary' : 'text-blue-300'}`}>
              {statusLabel}
            </span>
          ) : null}
          <span
            className={`text-[11px] font-black uppercase tracking-normal brightness-125 leading-none truncate ${strainColor ? '' : 'text-brand-light/70'}`}
            style={strainColor ? { color: strainColor } : undefined}
          >
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

export const ProductRow = React.memo(({ p, onClick, t }: { p: any, onClick: () => void, t: TranslationDictionary }) => {
  // See HighlightCard: state has to be declared before the bail-out.
  const [imgSrc, setImgSrc] = React.useState(p?.image || FALLBACK_IMAGE);

  if (!p) return null;

  const { price: displayPrice, listPrice: rowListPrice, discounted: rowDiscounted } = entryPrice(p);
  const strainColor = strainAccentFor(p);

  return (
    <button
      type="button"
      onClick={() => { triggerHaptic('light'); onClick(); }}
      // Divider on top rather than bottom: in the desktop two-column list the
      // container can then drop it from the first row of each column with one
      // rule, whatever the product count. A bottom border cannot — "last child"
      // is one cell, so the left column kept a stray line under it.
      className={`w-full text-left flex items-center gap-3 px-4 py-3 text-brand-light border-t border-white/10 first:border-t-0 active:bg-white/5 hover:bg-white/5 transition-colors cursor-pointer group ${FOCUS_RING} focus-visible:ring-inset focus-visible:ring-offset-0`}
    >
      <div className="w-9 h-9 bg-black/10 rounded-badge overflow-hidden p-0.5 shrink-0 flex items-center justify-center border border-white/5 relative">
        <Image
          src={imgSrc}
          alt={p.name || "Product"}
          fill
          className="object-contain"
          sizes="36px"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
        />
      </div>

      {/* Name and strain stack on the left, price on the right. Putting the
          strain in a column of its own on the right had it describing the name
          from across the row, with a hole between them — and the hole grew on
          the rows that had no discount to fill the next column along. */}
      <div className="flex-1 min-w-0">
        {/* The name has its line to itself. Sharing it with the tag left about
            195px on a phone, and "Super Boof Cherry" plus a tag needs 200 —
            the tag rides with the strain instead, on a line that has room. */}
        <span className="block text-[13px] font-black uppercase tracking-tight text-brand-light/90 truncate leading-tight group-hover:text-brand-secondary transition-colors">
          {p.name}
        </span>
        <span className="flex items-center gap-2 mt-0.5 min-w-0">
          <span
            className={`text-[11px] font-black uppercase tracking-normal truncate ${strainColor ? '' : 'text-brand-light/70'}`}
            style={strainColor ? { color: strainColor } : undefined}
          >
            {p.type}
          </span>
          {p.badge === 'NEW' && <StatusTag label={t.tagNew} kind="new" />}
          {rowDiscounted && <StatusTag label={t.tagSale} kind="sale" />}
        </span>
      </div>

      {/* The old price sits against the new one rather than in a column of its
          own: an anchor works by being read alongside what it anchors. It is
          also brighter than it was — a figure nobody can read is not doing the
          job it is there for. The block is right-aligned and wide enough for
          both, so the price a customer scans down the list stays in line
          whether or not the row above it was discounted. */}
      <div className="shrink-0 flex items-baseline justify-end gap-1.5 min-w-[5.5rem]">
        {rowDiscounted && (
          <span className="text-[11px] font-bold text-brand-light/55 line-through">{rowListPrice}</span>
        )}
        <span className="text-[15px] font-black text-brand-light whitespace-nowrap">
          {displayPrice > 0 ? (<>{displayPrice}<BahtSymbol /></>) : '—'}
        </span>
      </div>
    </button>
  );
});
