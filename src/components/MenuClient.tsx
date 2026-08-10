"use client"
import * as React from "react"
import { ShoppingBag, Send } from "lucide-react"

import { useCart } from "@/lib/cart-store"
import { translations, Language, TranslationDictionary } from "@/lib/translations"
import { Product, Order, AgeGate, IdlePrompt } from "@/components/modals"
import { Header } from "@/components/layout/Header"
import { ProductCarousel } from "@/components/catalog/ProductCarousel"
import { ProductGrid, sortCategoryKeys, getCategoryConfig } from "@/components/catalog/ProductGrid"
import { CatalogFallback } from "@/components/catalog/CatalogFallback"
import { CatalogNav, TypeFilter } from "@/components/catalog/CatalogNav"
import { BahtSymbol } from "@/components/cards/ProductCards"
import { triggerHaptic, accentFor } from "@/lib/utils"
import { useIdleTimer } from "@/lib/use-idle-timer"
import { siteConfig } from "@/config/site"

const IDLE_TIMEOUT_MS = 4 * 60 * 1000;
// Long enough to notice and answer, short enough that an abandoned tablet is
// clear before the next guest reaches it.
const IDLE_GRACE_SECONDS = 20;

export default function MenuClient({
  initialProducts = [],
  categories = {},
  failed = false,
  kiosk = false,
  ageVerified = false,
}: {
  initialProducts: any[],
  initialDescriptions?: any[],
  categories?: Record<string, any[]>,
  failed?: boolean,
  /** The shop's own tablet, opened once with ?kiosk=1. */
  kiosk?: boolean,
  /** Decided on the server from the age cookie, so the catalogue is never
   *  rendered to someone who has not answered. */
  ageVerified?: boolean,
}) {
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [isOrderOpen, setIsOrderOpen] = React.useState(false);
  const [typeFilter, setTypeFilter] = React.useState<TypeFilter | null>(null);
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const [isIdle, setIsIdle] = React.useState(false);

  const { items, getTotal, lang, setLang, clearCart } = useCart();

  const safeLang = (lang || 'en') as Language;
  const t: TranslationDictionary = translations[safeLang] || translations.en;

  const matchesFilter = React.useCallback(
    (p: any) => !typeFilter || p?.type?.toLowerCase() === typeFilter,
    [typeFilter]
  );

  // The filter narrows the whole page, carousels included — a "Sales" row still
  // offering sativa while the page is filtered to indica reads as a bug.
  const visibleCategories = React.useMemo(() => {
    if (!typeFilter) return categories;
    const filtered: Record<string, any[]> = {};
    for (const [key, list] of Object.entries(categories)) {
      const kept = list.filter(matchesFilter);
      if (kept.length > 0) filtered[key] = kept;
    }
    return filtered;
  }, [categories, typeFilter, matchesFilter]);

  // Products arrive already in sort_order, so both rows keep the order the
  // sheet asked for instead of re-sorting by id — ids identify a product, they
  // do not rank it.
  const recentUpdates = React.useMemo(() => initialProducts.filter((p: any) => p?.badge === 'NEW' && matchesFilter(p)), [initialProducts, matchesFilter]);
  // A sale is a discount, not a label somebody remembered to type: the row and
  // the struck-through price on the card now come from the same number.
  const flashSales = React.useMemo(() => initialProducts.filter((p: any) => p?.discountPercent > 0 && matchesFilter(p)), [initialProducts, matchesFilter]);

  const navSections = React.useMemo(
    () => sortCategoryKeys(visibleCategories).map(key => ({ key, title: getCategoryConfig(key, t).title })),
    [visibleCategories, t]
  );

  // A filter can take the open category off the page entirely — accessories
  // have no strain — so the tab falls back to whatever is still there rather
  // than leaving the customer looking at nothing.
  const currentCategory = React.useMemo(() => {
    if (activeCategory && visibleCategories[activeCategory]?.length) return activeCategory;
    return navSections[0]?.key ?? null;
  }, [activeCategory, visibleCategories, navSections]);

  // Shared kiosk device: wipe the basket and every open screen so the next
  // customer starts clean — including the language and the scroll position,
  // which used to carry over from whoever stood there before.
  const resetSession = React.useCallback(() => {
    setSelectedProduct(null);
    setIsOrderOpen(false);
    setTypeFilter(null);
    setActiveCategory(null);
    setIsIdle(false);
    setLang('en');
    clearCart();
    window.scrollTo({ top: 0 });
  }, [clearCart, setLang]);

  useIdleTimer(IDLE_TIMEOUT_MS, () => setIsIdle(true), kiosk);

  const hasItems = items.length > 0;
  const isEmpty = initialProducts.length === 0;
  const noMatches = !isEmpty && Object.keys(visibleCategories).length === 0;

  return (
    <div className={`min-h-screen text-brand-light p-4 selection:bg-brand-secondary/30 font-sans ${hasItems ? 'pb-44' : 'pb-4'}`}>

      {!ageVerified && <AgeGate />}

      {isIdle && (
        <IdlePrompt
          seconds={IDLE_GRACE_SECONDS}
          t={t}
          onStay={() => setIsIdle(false)}
          onExpire={resetSession}
        />
      )}

      <Header safeLang={safeLang} />

      {/* The page's own heading. Visually the wordmark in the header already
          says where you are, but the document had no h1 at all — headings
          started at the section level, leaving a screen reader without a title
          to announce for the page. */}
      <h1 className="sr-only">{siteConfig.name} — {t.menuTitle}</h1>

      {isEmpty ? (
        <CatalogFallback t={t} failed={failed} />
      ) : (
        <>
          <CatalogNav
            sections={navSections}
            activeSection={currentCategory}
            onSelectCategory={setActiveCategory}
            typeFilter={typeFilter}
            onTypeFilter={setTypeFilter}
            t={t}
          />

          {noMatches ? (
            <div className="max-w-5xl mx-auto py-16 text-center">
              <p className="text-sm font-bold text-brand-light/50 mb-5">{t.filterEmpty}</p>
              <button
                type="button"
                onClick={() => { triggerHaptic('light'); setTypeFilter(null); }}
                className="h-11 px-5 rounded-button border border-white/15 text-[12px] font-black uppercase tracking-widest text-brand-light/80 hover:border-white/30 active:scale-95 transition-all"
              >
                {t.filterReset}
              </button>
            </div>
          ) : (
            <>
              <ProductCarousel type="NEW" title={t.updates} products={recentUpdates} onSelect={setSelectedProduct} />
              <ProductCarousel type="SALE" title={t.sales} products={flashSales} onSelect={setSelectedProduct} />

              {currentCategory && (
                <ProductGrid
                  category={currentCategory}
                  products={visibleCategories[currentCategory]}
                  t={t}
                  onSelect={setSelectedProduct}
                />
              )}
            </>
          )}
        </>
      )}

      {hasItems && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] w-full max-w-sm px-4">
          <button onClick={() => { triggerHaptic('medium'); setIsOrderOpen(true); }} className="w-full bg-white/10 backdrop-blur-2xl text-brand-light py-3.5 px-6 rounded-modal border border-white/20 shadow-2xl flex justify-between items-center active:scale-95 transition-all">
            <div className="flex items-center gap-3 relative z-10">
              <div className="p-2 bg-brand-secondary/20 rounded-badge"><ShoppingBag size={18} className="text-brand-secondary"/></div>
              <div className="text-left">
                <div className="font-black uppercase text-[16px] leading-none mb-0.5">{getTotal()}<BahtSymbol /></div>
                <span className="font-black uppercase text-[11px] text-brand-secondary leading-none">{items.length} {t.items}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-brand-light opacity-80">
              <span className="text-[11px] font-black uppercase tracking-normal">{t.basket}</span>
              <span className="p-1.5 bg-white/10 rounded-full animate-pulse"><Send size={16}/></span>
            </div>
          </button>
        </div>
      )}

      {selectedProduct && (
        <Product
          product={selectedProduct}
          t={t}
          style={{ color: accentFor(selectedProduct) }}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {isOrderOpen && (
        <Order
          items={items}
          total={getTotal()}
          t={t}
          onClose={() => setIsOrderOpen(false)}
        />
      )}
    </div>
  );
}
