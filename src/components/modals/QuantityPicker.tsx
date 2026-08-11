"use client"
import * as React from "react"
import { Minus, Plus } from "lucide-react"

import { Language, TranslationDictionary } from "@/lib/translations"
import { triggerHaptic } from "@/lib/utils"
import { listPriceFor, nextBetterTier, priceFor, unitLabel } from "@/lib/pricing"
import { FOCUS_RING } from "@/components/cards/ProductCards"

// Half a gram is a real amount to buy; half a joint and half a bong are not.
const GRAM_STEP = 0.5;
// How close a drag has to land before it counts as the tier itself. Without it
// a finger stops at 4.5g, pays the 1g rate for all of it, and never learns that
// half a gram more was cheaper in total.
const SNAP_WINDOW = 0.25;

function formatQty(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

interface QuantityPickerProps {
  product: any;
  value: number;
  onChange: (value: number) => void;
  lang: Language;
  accentColor: string;
  t: TranslationDictionary;
}

// The amount control and the price list, which are the same thing: the presets
// are the product's own tiers, so a customer sees what 5g costs before deciding
// to want 5g, instead of discovering it by turning a counter. Everything here
// talks about the quantity this sheet is adding — the basket's own arithmetic
// stays on the buy button, where the price is worked out against what is
// already in it.
export const QuantityPicker: React.FC<QuantityPickerProps> = ({ product, value, onChange, lang, accentColor, t }) => {
  const unit = unitLabel(product.unit, lang);
  const tiers: { qty: number; price: number }[] = product.tiers ?? [];
  const step = product.unit === "g" ? GRAM_STEP : 1;

  const min = tiers[0]?.qty ?? 1;
  const max = tiers[tiers.length - 1]?.qty ?? min;

  const commit = React.useCallback((next: number) => {
    if (!Number.isFinite(next)) return;
    const bounded = Math.min(max, Math.max(min, next));
    const snapped = tiers.find(tier => Math.abs(tier.qty - bounded) <= SNAP_WINDOW)?.qty ?? bounded;
    onChange(Number(snapped.toFixed(1)));
  }, [max, min, onChange, tiers]);

  // Which preset is worth pointing at: the next rung that actually costs less
  // per unit than what is selected.
  const upsell = nextBetterTier(value, product);

  // What the ladder is actually worth at the amount in hand, and what one more
  // step up would be worth. A "+4" pinned to a preset said neither: it made the
  // buttons different widths and told the customer to add four of something
  // without saying why. This is the same sentence a person behind the counter
  // says — this much works out at X a gram, and the next size down to Y.
  const baseRate = tiers.length > 0 ? tiers[0].price / tiers[0].qty : 0;
  const rate = value > 0 ? listPriceFor(value, tiers) / value : 0;
  const saving = Math.round(baseRate * value - listPriceFor(value, tiers));
  const nextRate = upsell ? upsell.tier.price / upsell.tier.qty : 0;

  const stepper = (
    <div className="gradient-ring rounded-button shrink-0">
      <div className="flex items-center gap-3 bg-black/40 rounded-button p-2 h-14">
        <button
          type="button"
          onClick={() => { triggerHaptic('light'); onChange(Math.max(step, Number((value - step).toFixed(1)))); }}
          aria-label={`−${step} ${unit}`}
          className={`w-10 h-10 flex items-center justify-center bg-white/5 rounded-badge active:bg-white/10 transition-colors text-brand-light/70 ${FOCUS_RING}`}
        >
          <Minus size={16} />
        </button>

        <span className="text-[16px] font-black min-w-[3rem] text-center text-brand-light whitespace-nowrap" aria-live="polite">
          {formatQty(value)}<span className="text-[11px] text-brand-light/50 ml-0.5">{unit}</span>
        </span>

        <button
          type="button"
          onClick={() => { triggerHaptic('light'); onChange(Number((value + step).toFixed(1))); }}
          aria-label={`+${step} ${unit}`}
          className={`w-10 h-10 flex items-center justify-center bg-white/5 rounded-badge active:bg-white/10 transition-colors text-brand-light ${FOCUS_RING}`}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );

  // One tier means one price and nothing to slide between — an accessory is
  // bought by the piece.
  if (tiers.length < 2) return stepper;

  return (
    <div className="w-full space-y-3">
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
        {tiers.map(tier => {
          const isActive = value === tier.qty;
          const isSuggested = upsell?.tier.qty === tier.qty;
          const { price } = priceFor(tier.qty, product);

          return (
            <button
              key={tier.qty}
              type="button"
              onClick={() => { triggerHaptic('light'); commit(tier.qty); }}
              aria-pressed={isActive}
              className={`shrink-0 px-3 py-1.5 rounded-button border text-left transition-all active:scale-95 ${FOCUS_RING} ${
                isActive
                  ? "bg-brand-secondary/15 border-brand-secondary"
                  : isSuggested
                    ? "border-brand-secondary/50 bg-brand-secondary/5"
                    : "border-white/10 bg-white/[0.03] hover:border-white/25"
              }`}
            >
              <span className="block text-[12px] font-black uppercase tracking-tight text-brand-light whitespace-nowrap">
                {formatQty(tier.qty)} {unit}
              </span>
              <span className="block text-[11px] font-bold text-brand-light/50 whitespace-nowrap">{price}฿</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => { triggerHaptic('light'); commit(Number((value - step).toFixed(1))); }}
          aria-label={`−${step} ${unit}`}
          className={`w-9 h-9 shrink-0 flex items-center justify-center bg-white/5 rounded-badge active:bg-white/10 transition-colors text-brand-light/70 ${FOCUS_RING}`}
        >
          <Minus size={15} />
        </button>

        <input
          type="range"
          className="qty-slider flex-1"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => commit(Number(e.target.value))}
          aria-label={unit}
          aria-valuetext={`${formatQty(value)} ${unit} — ${priceFor(value, product).price}฿`}
          style={{ accentColor }}
        />

        <button
          type="button"
          onClick={() => { triggerHaptic('light'); commit(Number((value + step).toFixed(1))); }}
          aria-label={`+${step} ${unit}`}
          className={`w-9 h-9 shrink-0 flex items-center justify-center bg-white/5 rounded-badge active:bg-white/10 transition-colors text-brand-light ${FOCUS_RING}`}
        >
          <Plus size={15} />
        </button>

        <span className="w-14 text-right text-[15px] font-black text-brand-light whitespace-nowrap" aria-hidden>
          {formatQty(value)}<span className="text-[10px] text-brand-light/50 ml-0.5">{unit}</span>
        </span>
      </div>

      {/* One line, always present, that changes as the slider moves: the rate
          being paid, what the ladder has already saved, and what the next step
          up would cost per unit. */}
      <p className="text-[11px] font-bold text-brand-light/50 leading-snug" aria-live="polite">
        <span className="text-brand-light/80">{Math.round(rate)}฿/{unit}</span>
        {saving > 0 && (
          <span className="text-brand-secondary"> · {t.savingLabel} {saving}฿</span>
        )}
        {upsell && (
          <span> · {t.nextTierHint
            .replace('{qty}', formatQty(upsell.tier.qty))
            .replace('{unit}', unit)
            .replace('{rate}', String(Math.round(nextRate)))}</span>
        )}
      </p>
    </div>
  );
};
