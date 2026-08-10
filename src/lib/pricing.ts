import type { Language } from "./translations"

// The one place a price is decided. Card, product sheet, cart and receipt all
// call in here, because the previous arrangement — each of them working it out
// again — is what let a 5g flower show 1000฿ on the button, 900฿ in the banner
// promising it, and 200฿ in the cart.

export type Unit = "g" | "pcs";

/** One rung of a product's price ladder: a quantity and what that quantity costs
 *  in total (not per unit). Comes straight from the qty_N / price_N columns. */
export interface Tier {
  qty: number;
  price: number;
}

/** Everything pricing needs from a product, and nothing else — no category. A
 *  bong, a gram of flower and a pre-roll are priced by the same code; only the
 *  numbers in these three fields differ. */
export interface Priced {
  tiers: Tier[];
  unit: Unit;
  discountPercent: number;
}

const TIER_COLUMNS = 4;
const MAX_DISCOUNT = 90;

function clampDiscount(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.min(n, MAX_DISCOUNT);
}

/** Reads the qty_1..qty_4 / price_1..price_4 pairs off a catalogue row. A pair
 *  is a tier only if both cells hold a positive number: an empty cell means
 *  "this product doesn't offer that step", and so does a stray 0 — nothing in
 *  the menu is free, so treating 0 as a real price only ever surfaces a typo as
 *  a giveaway. */
export function parseTiers(raw: Record<string, any>): Tier[] {
  const tiers: Tier[] = [];

  for (let i = 1; i <= TIER_COLUMNS; i++) {
    const qty = Number(raw[`qty_${i}`]);
    const price = Number(raw[`price_${i}`]);
    if (!Number.isFinite(qty) || !Number.isFinite(price)) continue;
    if (qty <= 0 || price <= 0) continue;
    if (tiers.some(t => t.qty === qty)) continue;
    tiers.push({ qty, price });
  }

  return tiers.sort((a, b) => a.qty - b.qty);
}

export function parseUnit(raw: Record<string, any>, category: string): Unit {
  const declared = String(raw.unit || "").trim().toLowerCase();
  if (declared === "g" || declared === "pcs") return declared;
  // A forgotten cell falls back to what the category almost certainly means,
  // rather than to a guess that would silently sell bongs by the gram.
  return category === "buds" ? "g" : "pcs";
}

export function parseDiscount(raw: Record<string, any>): number {
  return clampDiscount(raw.discount_percent);
}

/** Price before any discount, for any quantity — including ones with no tier of
 *  their own. Between two tiers the price moves in a straight line from one to
 *  the other; past either end the nearest tier's per-unit rate carries on, so a
 *  single-tier product (an accessory) is simply price × quantity. */
export function listPriceFor(qty: number, tiers: Tier[]): number {
  if (!Number.isFinite(qty) || qty <= 0 || tiers.length === 0) return 0;

  const first = tiers[0];
  const last = tiers[tiers.length - 1];

  if (qty <= first.qty) return (first.price / first.qty) * qty;
  if (qty >= last.qty) return (last.price / last.qty) * qty;

  for (let i = 0; i < tiers.length - 1; i++) {
    const lower = tiers[i];
    const upper = tiers[i + 1];
    if (qty < lower.qty || qty > upper.qty) continue;

    const span = upper.qty - lower.qty;
    if (span <= 0) return lower.price;
    return lower.price + (upper.price - lower.price) * ((qty - lower.qty) / span);
  }

  return last.price;
}

export interface PriceResult {
  /** What the customer pays for this quantity, discount included. */
  price: number;
  /** What it would cost without the discount — the struck-through figure. Equal
   *  to `price` when the product is not discounted. */
  listPrice: number;
  discounted: boolean;
}

export function priceFor(qty: number, product: Priced): PriceResult {
  const raw = listPriceFor(qty, product.tiers);
  const discount = clampDiscount(product.discountPercent);
  // Rounded once, at the end, from the unrounded figure — rounding the list
  // price first and then discounting it drifts by a baht or two.
  const listPrice = Math.round(raw);
  const price = discount > 0 ? Math.round(raw * (1 - discount / 100)) : listPrice;
  return { price, listPrice, discounted: discount > 0 && price < listPrice };
}

/** The figure on a catalogue card: what the smallest available quantity costs. */
export function entryPrice(product: Priced): PriceResult & { qty: number } {
  const first = product.tiers[0];
  if (!first) return { price: 0, listPrice: 0, discounted: false, qty: 0 };
  return { ...priceFor(first.qty, product), qty: first.qty };
}

export interface TierUpsell {
  tier: Tier;
  /** Extra quantity needed to reach it. */
  add: number;
  /** What the whole basket of that quantity would cost, discount included. */
  price: number;
}

/** The next rung up, but only when climbing it actually earns a better rate —
 *  a ladder whose steps are all the same price per unit has nothing to sell,
 *  and saying otherwise is the kind of nudge customers stop trusting. */
export function nextBetterTier(qty: number, product: Priced): TierUpsell | null {
  if (!Number.isFinite(qty) || qty <= 0) return null;

  const tier = product.tiers.find(t => t.qty > qty);
  if (!tier) return null;

  const currentRate = listPriceFor(qty, product.tiers) / qty;
  const tierRate = tier.price / tier.qty;
  // A hair of tolerance: floating point makes equal rates differ in the
  // fifteenth decimal, which would show an upsell that saves nothing.
  if (tierRate >= currentRate - 0.0001) return null;

  return { tier, add: tier.qty - qty, price: priceFor(tier.qty, product).price };
}

const UNIT_LABELS: Record<Language, Record<Unit, string>> = {
  en: { g: "g", pcs: "pcs" },
  ru: { g: "г", pcs: "шт" },
  th: { g: "กรัม", pcs: "ชิ้น" },
};

export function unitLabel(unit: Unit, lang: Language): string {
  return (UNIT_LABELS[lang] || UNIT_LABELS.en)[unit];
}
