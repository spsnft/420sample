"use client"
import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ShoppingBag, Send } from "lucide-react"

import { useCart } from "@/lib/cart-store"
import { translations, Language, TranslationDictionary } from "@/lib/translations"
import { Product, Order, AgeGate, IdlePrompt } from "@/components/modals"
import { Header } from "@/components/layout/Header"
import { ProductCarousel } from "@/components/catalog/ProductCarousel"
import { ProductGrid, sortCategoryKeys, getCategoryConfig } from "@/components/catalog/ProductGrid"
import { CatalogFallback } from "@/components/catalog/CatalogFallback"
import { CatalogNav } from "@/components/catalog/CatalogNav"
import { BahtSymbol } from "@/components/cards/ProductCards"
import { triggerHaptic, accentFor } from "@/lib/utils"
import { useIdleTimer } from "@/lib/use-idle-timer"
import { siteConfig } from "@/config/site"

const IDLE_TIMEOUT_MS = 4 * 60 * 1000;
// Long enough to notice and answer, short enough that an abandoned tablet is
// clear before the next guest reaches it.
const IDLE_GRACE_SECONDS = 20;
// Strains read in the order a customer is used to seeing them, not
// alphabetically; anything else — accessory kinds — falls in after, A to Z.
const STRAIN_ORDER = ["indica", "sativa", "hybrid"];

// Keeps a strain's variants side by side in a showcase row. The same name as a
// bud and as a joint is two products at two prices, but four cards apart it
// reads as the same card printed twice; adjacent, with their BUD and JOINT
// labels, it reads as what it is. Order is otherwise untouched — the first
// appearance of a name keeps its sort_order place.
function groupVariants(products: any[]): any[] {
  const byName = new Map<string, any[]>();
  const order: string[] = [];
  for (const product of products) {
    if (!byName.has(product.name)) {
      byName.set(product.name, []);
      order.push(product.name);
    }
    byName.get(product.name)!.push(product);
  }
  return order.flatMap(name => byName.get(name)!);
}

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
  // Set when the sheet was opened from a basket line: the same sheet, but it
  // replaces that line's quantity instead of adding to it.
  const [editingLine, setEditingLine] = React.useState<any>(null);
  const [isOrderOpen, setIsOrderOpen] = React.useState(false);
  const [typeFilter, setTypeFilter] = React.useState<string | null>(null);
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const [isIdle, setIsIdle] = React.useState(false);
  const [isVerified, setIsVerified] = React.useState(ageVerified);

  const { items, getTotal, lang, setLang, clearCart } = useCart();

  const safeLang = (lang || 'en') as Language;
  const t: TranslationDictionary = translations[safeLang] || translations.en;

  // Products arrive already in sort_order, so both rows keep the order the
  // sheet asked for instead of re-sorting by id — ids identify a product, they
  // do not rank it. Neither row is touched by the category filter: they are the
  // showcase, above and outside the catalogue's own controls.
  const recentUpdates = React.useMemo(() => groupVariants(initialProducts.filter((p: any) => p?.badge === 'NEW')), [initialProducts]);
  // A sale is a discount, not a label somebody remembered to type: the row and
  // the struck-through price on the card come from the same number.
  const flashSales = React.useMemo(() => groupVariants(initialProducts.filter((p: any) => p?.discountPercent > 0)), [initialProducts]);

  const navCategories = React.useMemo(
    () => sortCategoryKeys(categories).map(key => ({ key, title: getCategoryConfig(key, t).title })),
    [categories, t]
  );

  const currentCategory = React.useMemo(
    () => (activeCategory && categories[activeCategory]?.length ? activeCategory : navCategories[0]?.key ?? null),
    [activeCategory, categories, navCategories]
  );

  const categoryProducts = React.useMemo(
    () => (currentCategory ? categories[currentCategory] ?? [] : []),
    [categories, currentCategory]
  );

  // The chips are whatever this category actually stocks — strains for flower
  // and joints, kinds for accessories. Offering a fixed indica/sativa/hybrid row
  // everywhere meant accessories were filtered by a property they do not have,
  // and the whole section vanished when anyone touched it.
  const filters = React.useMemo(() => {
    const present = Array.from(new Set(categoryProducts.map((p: any) => p?.type).filter(Boolean)));
    return present.sort((a: string, b: string) => {
      const ai = STRAIN_ORDER.indexOf(a);
      const bi = STRAIN_ORDER.indexOf(b);
      if (ai !== -1 || bi !== -1) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      return a.localeCompare(b);
    });
  }, [categoryProducts]);

  const visibleProducts = React.useMemo(
    () => (typeFilter ? categoryProducts.filter((p: any) => p?.type === typeFilter) : categoryProducts),
    [categoryProducts, typeFilter]
  );

  // Switching category drops the filter: "bong" means nothing under Buds, and a
  // filter carried across would silently empty the section you just opened.
  const selectCategory = (key: string) => {
    setActiveCategory(key);
    setTypeFilter(null);
    // Tapping a tab while the bar is stuck to the top would otherwise leave you
    // wherever you were in the old, possibly longer list.
    requestAnimationFrame(() => {
      const anchor = document.getElementById('catalog');
      if (anchor && anchor.getBoundingClientRect().top < 0) {
        window.scrollTo({ top: anchor.offsetTop, behavior: 'smooth' });
      }
    });
  };

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

  return (
    <div className={`min-h-screen text-brand-light p-4 selection:bg-brand-secondary/30 font-sans ${hasItems ? 'pb-44' : 'pb-4'}`}>

      {!isVerified && <AgeGate onVerified={() => setIsVerified(true)} />}

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
          <ProductCarousel type="NEW" title={t.updates} products={recentUpdates} onSelect={setSelectedProduct} t={t} />
          <ProductCarousel type="SALE" title={t.sales} products={flashSales} onSelect={setSelectedProduct} t={t} />

          {/* The catalogue and its controls, in that order: the tabs sit
              directly above the products they switch, not a screen away
              above the showcase rows. */}
          <div id="catalog" className="scroll-mt-0">
            <CatalogNav
              categories={navCategories}
              activeCategory={currentCategory}
              onSelectCategory={selectCategory}
              filters={filters}
              activeFilter={typeFilter}
              onFilter={setTypeFilter}
              t={t}
            />

            {currentCategory && (
              <ProductGrid
                category={currentCategory}
                products={visibleProducts}
                t={t}
                onSelect={setSelectedProduct}
              />
            )}
          </div>
        </>
      )}

      {/* Adding something used to close the sheet and leave the page looking
          exactly as it did — the only evidence was a bar that appeared without
          ceremony. It springs in now, and the total flips whenever it changes,
          so a tap has a visible consequence. */}
      <AnimatePresence>
      {hasItems && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: "spring", damping: 22, stiffness: 300 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] w-full max-w-sm px-4"
        >
          <button onClick={() => { triggerHaptic('medium'); setIsOrderOpen(true); }} className="w-full bg-white/10 backdrop-blur-2xl text-brand-light py-3.5 px-6 rounded-modal border border-white/20 shadow-2xl flex justify-between items-center active:scale-95 transition-all">
            <div className="flex items-center gap-3 relative z-10">
              <div className="p-2 bg-brand-secondary/20 rounded-badge"><ShoppingBag size={18} className="text-brand-secondary"/></div>
              <div className="text-left">
                <motion.div
                  key={getTotal()}
                  initial={{ y: -8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="font-black uppercase text-[16px] leading-none mb-0.5"
                >
                  {getTotal()}<BahtSymbol />
                </motion.div>
                <span className="font-black uppercase text-[11px] text-brand-secondary leading-none">{items.length} {t.items}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-brand-light opacity-80">
              <span className="text-[11px] font-black uppercase tracking-normal">{t.basket}</span>
              <span className="p-1.5 bg-white/10 rounded-full animate-pulse"><Send size={16}/></span>
            </div>
          </button>
        </motion.div>
      )}
      </AnimatePresence>

      {selectedProduct && (
        <Product
          product={selectedProduct}
          t={t}
          style={{ color: accentFor(selectedProduct) }}
          editingQty={editingLine?.id === selectedProduct.id ? editingLine.qty : undefined}
          onClose={() => { setSelectedProduct(null); setEditingLine(null); }}
        />
      )}

      {isOrderOpen && (
        <Order
          items={items}
          total={getTotal()}
          t={t}
          onEdit={(item: any) => {
            setIsOrderOpen(false);
            setEditingLine(item);
            setSelectedProduct(item);
          }}
          onClose={() => setIsOrderOpen(false)}
        />
      )}
    </div>
  );
}
