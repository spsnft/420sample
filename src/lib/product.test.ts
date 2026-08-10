import { describe, expect, it } from "vitest"

import { byDisplayOrder, formatProduct } from "./product"

// Rows as the sheet's exporter sends them: numbers stay numbers, empty cells
// arrive as empty strings rather than being dropped.
function row(overrides: Record<string, any> = {}) {
  return {
    id: "1",
    name: "Super Boof",
    category: "buds",
    type: "indica",
    unit: "g",
    qty_1: 1,
    price_1: 200,
    qty_2: 5,
    price_2: 900,
    qty_3: "",
    price_3: "",
    qty_4: "",
    price_4: "",
    discount_percent: "",
    sort_order: 10,
    image: "",
    description: "",
    taste: "",
    terpenes: "",
    badge: "",
    ...overrides,
  };
}

function order(rows: Record<string, any>[]) {
  return rows.map((r, i) => formatProduct(r, i)).sort(byDisplayOrder).map(p => p.name);
}

describe("formatProduct", () => {
  it("reads the tiers, unit and discount off the row", () => {
    const product = formatProduct(row({ discount_percent: 20 }), 0);
    expect(product.tiers).toEqual([{ qty: 1, price: 200 }, { qty: 5, price: 900 }]);
    expect(product.unit).toBe("g");
    expect(product.discountPercent).toBe(20);
  });

  it("keeps a blank discount at zero", () => {
    expect(formatProduct(row(), 0).discountPercent).toBe(0);
  });

  it("falls back to the placeholder for a non-http image", () => {
    expect(formatProduct(row({ image: "" }), 0).image).toBe("/images/logo.svg");
  });
});

describe("display order", () => {
  it("sorts by sort_order ascending", () => {
    expect(order([
      row({ name: "Third", sort_order: 30 }),
      row({ name: "First", sort_order: 10 }),
      row({ name: "Second", sort_order: 20 }),
    ])).toEqual(["First", "Second", "Third"]);
  });

  it("sends a blank sort_order to the end, not the front", () => {
    // The exporter sends "" for an empty cell and Number("") is 0, which would
    // otherwise rank an unsorted row ahead of everything deliberately placed.
    expect(order([
      row({ name: "Unsorted", sort_order: "" }),
      row({ name: "Placed", sort_order: 20 }),
    ])).toEqual(["Placed", "Unsorted"]);
  });

  it("treats a missing column the same as a blank cell", () => {
    const noColumn = row();
    delete (noColumn as any).sort_order;
    expect(order([noColumn, row({ name: "Placed", sort_order: 50 })])).toEqual(["Placed", "Super Boof"]);
  });

  it("accepts a number that arrives as text", () => {
    expect(order([
      row({ name: "Second", sort_order: "20" }),
      row({ name: "First", sort_order: "3" }),
    ])).toEqual(["First", "Second"]);
  });

  it("breaks ties by name rather than leaving them to the sheet", () => {
    expect(order([
      row({ name: "Banana", sort_order: 10 }),
      row({ name: "Apple", sort_order: 10 }),
    ])).toEqual(["Apple", "Banana"]);
  });
});
