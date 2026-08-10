import { siteConfig } from "@/config/site"
import { parseTiers, parseUnit, parseDiscount } from "@/lib/pricing"

const FALLBACK_IMAGE = "/images/logo.svg";

// Products with no sort_order fall to the end of their section rather than to
// the front, so a row added in a hurry never displaces a curated order.
const UNSORTED = Number.MAX_SAFE_INTEGER;

function formatProduct(item: any, index: number) {
  let rawImg = item.image || item.photo || item.Image || item.Photo || '';
  let cleanImage = typeof rawImg === 'string' ? rawImg.replace(/^["']|["']$/g, '').trim() : '';

  if (cleanImage.startsWith('http://') || cleanImage.startsWith('https://')) {
    try {
      cleanImage = encodeURI(decodeURI(cleanImage));
    } catch {
      // ignore
    }
  } else {
    cleanImage = FALLBACK_IMAGE;
  }

  const category = String(item.category || "").toLowerCase().trim();

  // A blank cell is "not set", not zero. The sheet's exporter sends empty
  // strings for empty cells, and Number("") is 0 — which would rank every
  // unsorted product first, the exact opposite of the rule.
  const rawSortOrder = item.sort_order;
  const sortOrder = rawSortOrder === "" || rawSortOrder === null || rawSortOrder === undefined
    ? UNSORTED
    : Number(rawSortOrder);

  return {
    id: String(item.id || `product-${index}`),
    name: String(item.name || "Unnamed Product"),
    category,
    // Strain for flower and joints, kind of thing for accessories — the same
    // question asked of whatever the row happens to be, which is why it is one
    // column and one slot on the card.
    type: String(item.type || "").toLowerCase().trim(),
    image: cleanImage,
    description: String(item.description || ""),
    taste: String(item.taste || ""),
    terpenes: String(item.terpenes || ""),
    badge: String(item.badge || "").toUpperCase().trim(),
    sortOrder: Number.isFinite(sortOrder) ? sortOrder : UNSORTED,
    // Everything pricing needs. No consumer of this object looks at `category`
    // to work out a price or a unit ever again.
    unit: parseUnit(item, category),
    tiers: parseTiers(item),
    discountPercent: parseDiscount(item),
  };
}

export type CatalogProduct = ReturnType<typeof formatProduct>;

export { formatProduct };

// sort_order ascending, then name, so two rows sharing a number still land in a
// stable, explainable order instead of whatever the sheet happened to return.
// Ids take no part in this: they identify a product, they do not rank it.
export function byDisplayOrder(a: CatalogProduct, b: CatalogProduct): number {
  if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
  return a.name.localeCompare(b.name);
}

// An empty catalogue and an unreachable one look identical to the page unless
// the difference is carried out of here: one is "we sold out / nothing is
// published", the other is "something is broken and retrying may fix it".
// Callers render a different message for each, so the flag is part of the
// contract rather than a console line nobody sees.
export async function getProducts(): Promise<{
  products: CatalogProduct[];
  categories: Record<string, CatalogProduct[]>;
  stories?: any[];
  descriptions?: any[];
  failed: boolean;
}> {
  const SCRIPT_URL = siteConfig.apiUrl;

  if (!SCRIPT_URL) {
    console.warn("⚠️ API URL не настроен");
    return { products: [], categories: {}, failed: true };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 60 },
      signal: controller.signal,
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();

    // The sheet's exporter cannot answer with an HTTP error code, so it reports
    // failure in the body instead. Without this the page would treat a broken
    // catalogue as an empty one and say "nothing on the menu" — no explanation,
    // no retry — when the truth is that something is wrong and worth retrying.
    if (data?.error) throw new Error(String(data.error));

    // Contract complaints from the exporter — a renamed column, a duplicate id.
    // They do not stop the page, but they belong somewhere visible.
    if (Array.isArray(data?.warnings) && data.warnings.length > 0) {
      console.warn("⚠️ Каталог:", data.warnings.join(" | "));
    }

    const items: any[] = data.products || [];
    const formattedProducts = items.map(formatProduct).sort(byDisplayOrder);

    const categories: Record<string, CatalogProduct[]> = {};
    for (const product of formattedProducts) {
      const cat = product.category || 'other';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(product);
    }

    return {
      products: formattedProducts,
      categories,
      stories: data.stories || [],
      descriptions: data.descriptions || [],
      failed: false,
    };
  } catch (error) {
    console.error("❌ Ошибка загрузки каталога:", error);
    return { products: [], categories: {}, failed: true };
  } finally {
    clearTimeout(timeout);
  }
}
