"use client"
import * as React from "react"
import { ShoppingBag, Send } from "lucide-react"

import { useCart } from "@/lib/cart-store"
import { translations, Language, TranslationDictionary } from "@/lib/translations"
import { Product, Order, AgeGate } from "@/components/modals"
import { Header } from "@/components/layout/Header"
import { ProductCarousel } from "@/components/catalog/ProductCarousel"
import { ProductGrid } from "@/components/catalog/ProductGrid"
import { BahtSymbol } from "@/components/cards/ProductCards"
import { triggerHaptic, GOLDEN_COLOR } from "@/lib/utils"
import { useIdleTimer } from "@/lib/use-idle-timer"

const IDLE_TIMEOUT_MS = 4 * 60 * 1000;

export default function MenuClient({
  initialProducts = [],
  categories = {},
}: {
  initialProducts: any[],
  initialDescriptions?: any[],
  categories?: Record<string, any[]>,
}) {
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [isOrderOpen, setIsOrderOpen] = React.useState(false);
  const [openSections, setOpenSections] = React.useState<string[]>([]);

  const { items, getTotal, lang, clearCart } = useCart();

  const safeLang = (lang || 'en') as Language;
  const t: TranslationDictionary = translations[safeLang] || translations.en;

  const recentUpdates = React.useMemo(() => initialProducts.filter((p: any) => p && p.badge?.toUpperCase() === 'NEW').sort((a: any, b: any) => (Number(b.id) || 0) - (Number(a.id) || 0)), [initialProducts]);
  const flashSales = React.useMemo(() => initialProducts.filter((p: any) => p && p.badge?.toUpperCase() === 'SALE').sort((a: any, b: any) => (Number(b.id) || 0) - (Number(a.id) || 0)), [initialProducts]);

  const toggleSection = (id: string) => {
    triggerHaptic('light');
    setOpenSections(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  };

  // Shared kiosk device: wipe cart & any open screens after a period of inactivity
  // so the next customer never sees the previous person's order.
  const resetSession = React.useCallback(() => {
    setSelectedProduct(null);
    setIsOrderOpen(false);
    setOpenSections([]);
    clearCart();
  }, [clearCart]);

  useIdleTimer(IDLE_TIMEOUT_MS, resetSession);

  const hasItems = items.length > 0;

  return (
    <div className={`min-h-screen text-brand-light p-4 selection:bg-brand-secondary/30 font-sans ${hasItems ? 'pb-44' : 'pb-4'}`}>

      <AgeGate />

      <Header safeLang={safeLang} showMenuLink={false} />

      <ProductCarousel type="NEW" title={t.updates} products={recentUpdates} onSelect={setSelectedProduct} />
      <ProductCarousel type="SALE" title={t.sales} products={flashSales} onSelect={setSelectedProduct} />

      <ProductGrid
        categories={categories}
        openSections={openSections}
        toggleSection={toggleSection}
        t={t}
        onSelect={setSelectedProduct}
      />

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
          product={{ ...selectedProduct, unitLabel: selectedProduct.category === 'accessories' ? 'pcs' : 'g' }}
          t={t}
          style={{ color: selectedProduct.category === 'joints' ? GOLDEN_COLOR : '#10B981' }}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {isOrderOpen && (
        <Order
          items={items.map(item => ({ ...item, unitLabel: item.category === 'accessories' ? 'pcs' : 'g' }))}
          total={getTotal()}
          t={t}
          onClose={() => setIsOrderOpen(false)}
        />
      )}
    </div>
  );
}
