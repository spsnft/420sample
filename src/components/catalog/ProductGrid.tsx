"use client"
import * as React from "react"
import { Leaf, Cigarette, Layers, Tag } from "lucide-react"
import { HighlightCard, ProductRow } from "@/components/cards/ProductCards"
import { TranslationDictionary } from "@/lib/translations"

interface CategoryConfig {
  title: string;
  icon: React.ReactNode;
  layout: "list" | "grid2" | "grid4";
}

export function getCategoryConfig(category: string, t: TranslationDictionary): CategoryConfig {
  const configs: Record<string, CategoryConfig> = {
    buds: {
      title: t.buds,
      icon: <Leaf size={20} className="text-brand-secondary" />,
      layout: "list",
    },
    joints: {
      title: t.joints,
      icon: <Cigarette size={20} className="text-brand-secondary" />,
      layout: "list",
    },
    accessories: {
      title: t.accessories,
      icon: <Layers size={20} className="text-brand-secondary" />,
      layout: "grid4",
    },
  };

  return configs[category] || {
    title: category.charAt(0).toUpperCase() + category.slice(1),
    icon: <Tag size={20} className="text-brand-secondary" />,
    layout: "grid2",
  };
}

function gridClass(layout: "grid2" | "grid4"): string {
  return layout === "grid2"
    ? "grid grid-cols-2 md:grid-cols-3 gap-3"
    : "grid grid-cols-2 md:grid-cols-4 gap-3";
}

// Flower first, joints next, accessories last, anything unknown in between
// alphabetically. Exported so the tabs are ordered the way the menu reads.
export function sortCategoryKeys(categories: Record<string, any[]>): string[] {
  const priorityOrder = ["buds", "joints"];
  return Object.keys(categories).sort((a, b) => {
    if (a === "accessories") return 1;
    if (b === "accessories") return -1;
    const aIdx = priorityOrder.indexOf(a);
    const bIdx = priorityOrder.indexOf(b);
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    if (aIdx !== -1) return -1;
    if (bIdx !== -1) return 1;
    return a.localeCompare(b);
  });
}

interface ProductGridProps {
  category: string;
  products: any[];
  t: TranslationDictionary;
  onSelect: (product: any) => void;
}

// One category, the one the tabs have selected. There is no heading and no
// collapse control: the active tab already names what you are looking at, and
// an accordion is a device for a long document, not for three categories.
export const ProductGrid: React.FC<ProductGridProps> = ({ category, products, t, onSelect }) => {
  const config = getCategoryConfig(category, t);

  if (config.layout === "list") {
    return (
      // Same column as everything else on the page. Ten rows stretched across
      // 1024px would leave a name and a price at opposite ends of a very long
      // line, so on a wide screen the list runs in two columns instead of
      // being narrowed — which would have left it concentric with the
      // carousels above but not aligned to them.
      <div className="max-w-5xl mx-auto">
        <div className="surface rounded-card overflow-hidden">
          <div className="rounded-card overflow-hidden md:grid md:grid-cols-2 md:[&>*:nth-child(2)]:border-t-0 md:[&>*:nth-child(even)]:border-l">
            {products.map((p: any) => (
              <ProductRow key={p.id} p={p} onClick={() => onSelect(p)} t={t} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className={gridClass(config.layout)}>
        {products.map((p: any) => (
          <HighlightCard
            key={p.id}
            item={p}
            onClick={() => onSelect(p)}
            statusLabel={p.discountPercent > 0 ? t.tagSale : p.badge === 'NEW' ? t.tagNew : undefined}
          />
        ))}
      </div>
    </div>
  );
};
