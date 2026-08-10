"use client"
import * as React from "react"
import { Leaf, Cigarette, Layers, ChevronDown, Tag } from "lucide-react"
import { HighlightCard, ProductRow, FOCUS_RING } from "@/components/cards/ProductCards"
import { TranslationDictionary } from "@/lib/translations"

interface CategoryConfig {
  title: string;
  icon: React.ReactNode;
  layout: "list" | "grid2" | "grid4";
  collapsible?: boolean;
}

export function getCategoryConfig(category: string, t: TranslationDictionary): CategoryConfig {
  const configs: Record<string, CategoryConfig> = {
    buds: {
      title: "Buds",
      icon: <Leaf size={20} className="text-brand-secondary" />,
      layout: "list",
      // Collapsible like the rest: ten rows of flower filled a phone screen on
      // their own, pushing Joints and Accessories — both collapsed — below the
      // fold, so two thirds of the menu were invisible until you scrolled past
      // the part you could already see.
      collapsible: true,
    },
    joints: {
      title: "Joints",
      icon: <Cigarette size={20} className="text-brand-secondary" />,
      layout: "list",
      collapsible: true,
    },
    accessories: {
      title: t.accessories,
      icon: <Layers size={20} className="text-brand-secondary" />,
      layout: "grid4",
      collapsible: true,
    },
  };

  return configs[category] || {
    title: category.charAt(0).toUpperCase() + category.slice(1),
    icon: <Tag size={20} className="text-brand-secondary" />,
    layout: "grid2",
    collapsible: true,
  };
}

function gridClass(layout: "list" | "grid2" | "grid4"): string {
  switch (layout) {
    case "list": return "grid grid-cols-1";
    case "grid2": return "grid grid-cols-2 md:grid-cols-3 gap-3";
    case "grid4": return "grid grid-cols-2 md:grid-cols-4 gap-3";
  }
}

function isList(layout: "list" | "grid2" | "grid4"): boolean {
  return layout === "list";
}

// Flower first, joints next to it, accessories last, anything unknown in
// between alphabetically. Exported so the sticky nav lists the categories in
// the order the page actually renders them.
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
  categories: Record<string, any[]>;
  openSections: string[];
  toggleSection: (id: string) => void;
  t: TranslationDictionary;
  onSelect: (product: any) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  categories,
  openSections,
  toggleSection,
  t,
  onSelect,
}) => {
  const priorityOrder = ["buds", "joints"];

  const sortedKeys = sortCategoryKeys(categories);

  const specialListKeys = priorityOrder.filter(k => categories[k]?.length > 0);
  const restKeys = sortedKeys.filter(k => !priorityOrder.includes(k));

  return (
    // A section, not a <main>: the page already provides the single main
    // landmark, and a second one leaves a screen reader with two "main
    // content" targets and no way to tell which is the real one.
    <div className="max-w-5xl mx-auto space-y-8 relative z-10">
      {specialListKeys.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {specialListKeys.map(cat => {
            const config = getCategoryConfig(cat, t);
            const products = categories[cat];
            const isOpen = openSections.includes(cat);

            return (
              // scroll-mt clears the sticky nav, so jumping to a category does
              // not park its heading underneath the bar you tapped it from.
              <section key={cat} id={`cat-${cat}`} data-category={cat} className="flex flex-col h-full space-y-3 scroll-mt-20">
                {config.collapsible ? (
                  <button
                    type="button"
                    onClick={() => toggleSection(cat)}
                    aria-expanded={isOpen}
                    aria-controls={`section-${cat}`}
                    className={`w-full flex items-center justify-between px-1 active:bg-white/5 transition-colors md:cursor-default rounded-badge ${FOCUS_RING}`}
                  >
                    <div className="flex items-center gap-2">
                      {config.icon}
                      <h2 className="text-[16px] font-black uppercase tracking-tight text-brand-light">{config.title}</h2>
                    </div>
                    <div className="flex items-center gap-2 md:hidden">
                      <span className="text-[11px] font-black uppercase tracking-wide text-brand-light/60">
                        {isOpen ? t.close : t.open}
                      </span>
                      <ChevronDown size={18} className={`text-brand-light/60 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 px-1">
                    {config.icon}
                    <h2 className="text-[16px] font-black uppercase tracking-tight text-brand-light">{config.title}</h2>
                  </div>
                )}

                {/* `invisible` alongside `max-h-0` is what keeps a collapsed
                    section out of the tab order — clipping by itself leaves
                    every row inside still focusable, so Tab would wander
                    through products nobody can see. `transition-all` carries
                    visibility too, and CSS holds it at `visible` for the whole
                    duration, so the collapse still animates. Joints stay open
                    on desktop, hence the md: overrides on both. */}
                <div
                  id={`section-${cat}`}
                  className={`overflow-hidden transition-all duration-500 ${config.collapsible && !isOpen ? 'max-h-0 invisible md:max-h-[3000px] md:visible' : 'max-h-[3000px] visible'}`}
                >
                  <div className="gradient-ring rounded-card overflow-hidden h-full">
                    <div className={`rounded-card overflow-hidden bg-brand-primary h-full ${!isList(config.layout) ? 'p-3 ' + gridClass(config.layout) : ''}`}>
                      {products.map((p: any) => (
                        isList(config.layout)
                          ? <ProductRow key={p.id} p={p} onClick={() => onSelect(p)} />
                          : <HighlightCard key={p.id} item={p} onClick={() => onSelect(p)} />
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      )}

      {restKeys.map(cat => {
        const config = getCategoryConfig(cat, t);
        const products = categories[cat];
        const isOpen = openSections.includes(cat);

        return (
          <section key={cat} id={`cat-${cat}`} data-category={cat} className="w-full space-y-3 scroll-mt-20">
            <button
              type="button"
              onClick={() => toggleSection(cat)}
              aria-expanded={isOpen}
              aria-controls={`section-${cat}`}
              className={`w-full flex items-center justify-between px-1 active:bg-white/5 transition-colors rounded-badge ${FOCUS_RING}`}
            >
              <div className="flex items-center gap-2">
                {config.icon}
                <h2 className="text-[16px] font-black uppercase tracking-tight text-brand-light">{config.title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wide text-brand-light/60">
                  {isOpen ? t.close : t.open}
                </span>
                <ChevronDown size={18} className={`text-brand-light/60 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>
            <div
              id={`section-${cat}`}
              className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-[3000px] opacity-100 visible' : 'max-h-0 opacity-0 invisible'}`}
            >
              <div className={gridClass(config.layout)}>
                {products.map((p: any) => (
                  <HighlightCard key={p.id} item={p} onClick={() => onSelect(p)} />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};
