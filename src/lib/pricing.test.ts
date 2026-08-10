import { describe, expect, it } from "vitest"

import {
  entryPrice,
  listPriceFor,
  nextBetterTier,
  parseTiers,
  parseUnit,
  priceFor,
  type Priced,
} from "./pricing"

// The three shapes the demo catalogue actually contains.
const flower: Priced = {
  unit: "g",
  discountPercent: 0,
  tiers: [{ qty: 1, price: 200 }, { qty: 5, price: 900 }, { qty: 10, price: 1700 }, { qty: 20, price: 3000 }],
};

const joint: Priced = {
  unit: "pcs",
  discountPercent: 0,
  tiers: [{ qty: 1, price: 150 }, { qty: 3, price: 420 }, { qty: 5, price: 650 }, { qty: 10, price: 1200 }],
};

const bong: Priced = {
  unit: "pcs",
  discountPercent: 0,
  tiers: [{ qty: 1, price: 600 }],
};

describe("parseTiers", () => {
  it("reads the four qty/price pairs in ascending order", () => {
    expect(parseTiers({ qty_1: 1, price_1: 200, qty_2: 5, price_2: 900 })).toEqual([
      { qty: 1, price: 200 },
      { qty: 5, price: 900 },
    ]);
  });

  it("treats blank and zero cells as tiers that are not offered", () => {
    expect(parseTiers({ qty_1: 1, price_1: 600, qty_2: "", price_2: "", qty_3: 10, price_3: 0 })).toEqual([
      { qty: 1, price: 600 },
    ]);
  });

  it("sorts pairs entered out of order", () => {
    expect(parseTiers({ qty_1: 10, price_1: 1700, qty_2: 1, price_2: 200 })[0].qty).toBe(1);
  });
});

describe("parseUnit", () => {
  it("takes the declared unit", () => {
    expect(parseUnit({ unit: "pcs" }, "buds")).toBe("pcs");
  });

  it("falls back to the category when the cell is blank", () => {
    expect(parseUnit({}, "buds")).toBe("g");
    expect(parseUnit({}, "accessories")).toBe("pcs");
    expect(parseUnit({}, "joints")).toBe("pcs");
  });
});

describe("listPriceFor", () => {
  it("charges a tier exactly at its own quantity", () => {
    expect(listPriceFor(1, flower.tiers)).toBe(200);
    expect(listPriceFor(5, flower.tiers)).toBe(900);
    expect(listPriceFor(20, flower.tiers)).toBe(3000);
    expect(listPriceFor(3, joint.tiers)).toBe(420);
  });

  it("interpolates between two tiers", () => {
    // Between 5g/900฿ and 10g/1700฿: 900 + 800 × 2/5.
    expect(listPriceFor(7, flower.tiers)).toBe(1220);
  });

  it("carries the last tier's rate past the end of the ladder", () => {
    expect(listPriceFor(25, flower.tiers)).toBe(3750);
  });

  it("prices a single-tier product as a plain multiple", () => {
    expect(listPriceFor(3, bong.tiers)).toBe(1800);
  });

  it("returns nothing for a product with no tiers or a nonsense quantity", () => {
    expect(listPriceFor(5, [])).toBe(0);
    expect(listPriceFor(0, flower.tiers)).toBe(0);
    expect(listPriceFor(NaN, flower.tiers)).toBe(0);
  });

  it("never charges less for more", () => {
    let previous = 0;
    for (let qty = 1; qty <= 30; qty++) {
      const price = listPriceFor(qty, flower.tiers);
      expect(price).toBeGreaterThanOrEqual(previous);
      previous = price;
    }
  });
});

describe("priceFor", () => {
  it("leaves an undiscounted product alone", () => {
    expect(priceFor(5, flower)).toEqual({ price: 900, listPrice: 900, discounted: false });
  });

  it("applies the discount and keeps the list price for the strikethrough", () => {
    expect(priceFor(5, { ...flower, discountPercent: 20 })).toEqual({
      price: 720,
      listPrice: 900,
      discounted: true,
    });
  });

  it("caps an implausible discount rather than paying the customer", () => {
    expect(priceFor(1, { ...flower, discountPercent: 150 }).price).toBe(20);
  });

  it("ignores a blank or negative discount", () => {
    expect(priceFor(1, { ...flower, discountPercent: NaN }).price).toBe(200);
    expect(priceFor(1, { ...flower, discountPercent: -10 }).price).toBe(200);
  });
});

describe("entryPrice", () => {
  it("shows what the smallest available quantity costs", () => {
    expect(entryPrice(flower)).toMatchObject({ price: 200, qty: 1 });
    expect(entryPrice(bong)).toMatchObject({ price: 600, qty: 1 });
  });

  it("survives a product with no prices at all", () => {
    expect(entryPrice({ unit: "g", discountPercent: 0, tiers: [] })).toMatchObject({ price: 0, qty: 0 });
  });
});

describe("nextBetterTier", () => {
  it("offers the next rung and what the whole quantity would cost", () => {
    expect(nextBetterTier(1, flower)).toMatchObject({ add: 4, price: 900, tier: { qty: 5 } });
  });

  it("measures the gap from the quantity in hand", () => {
    expect(nextBetterTier(3, flower)).toMatchObject({ add: 2, price: 900 });
  });

  it("says nothing at the top of the ladder", () => {
    expect(nextBetterTier(20, flower)).toBeNull();
    expect(nextBetterTier(1, bong)).toBeNull();
  });

  it("stays quiet when the next rung is no cheaper per unit", () => {
    const flat: Priced = {
      unit: "pcs",
      discountPercent: 0,
      tiers: [{ qty: 1, price: 100 }, { qty: 5, price: 500 }],
    };
    expect(nextBetterTier(1, flat)).toBeNull();
  });

  it("quotes the discounted price of the tier it is selling", () => {
    expect(nextBetterTier(1, { ...flower, discountPercent: 10 })?.price).toBe(810);
  });
});

describe("the receipt adds up however the order was assembled", () => {
  it("charges the same for 5g bought at once as for 3g then 2g", () => {
    const atOnce = priceFor(5, flower).price;

    const firstAdd = priceFor(3, flower).price;
    const secondAdd = priceFor(5, flower).price - priceFor(3, flower).price;

    expect(firstAdd + secondAdd).toBe(atOnce);
    expect(atOnce).toBe(900);
  });
});
