"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { X, Trash2, ShoppingBag, CheckCircle2 } from "lucide-react"
import { useCart } from "@/lib/cart-store"
import { TranslationDictionary } from "@/lib/translations"
import { triggerHaptic, Baht, generateOrderNumber } from "@/lib/utils"
import { useModalA11y } from "@/lib/use-modal-a11y"

interface OrderProps {
  items: any[];
  total: number;
  t: TranslationDictionary;
  onClose: () => void;
}

export const Order = ({ items, total, t, onClose }: OrderProps) => {
  const { removeItem, clearCart } = useCart();

  const [orderId, setOrderId] = React.useState<string | null>(null);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleClose = React.useCallback(() => {
    triggerHaptic('light');
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  }, [onClose]);

  // Once the order number is on screen the sheet stops being dismissible — it is
  // what the customer shows the staff — so Escape and the backdrop are disabled
  // together, and only "start new order" clears it.
  const dialogRef = useModalA11y({ onClose: handleClose, dismissible: !orderId });

  const handlePlaceOrder = () => {
    if (items.length === 0) return;
    triggerHaptic('success');
    setOrderId(generateOrderNumber());
  };

  const handleNewOrder = () => {
    triggerHaptic('light');
    clearCart();
    setOrderId(null);
    handleClose();
  };

  return (
    <div className={`fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 bg-black/80" onClick={orderId ? undefined : handleClose} />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-dialog-title"
        className="gradient-ring w-full max-w-lg sm:rounded-modal rounded-t-modal shadow-2xl max-h-[90vh]"
      >
      <motion.div
        drag={orderId ? false : "y"}
        dragConstraints={{ top: 0 }}
        dragElastic={0.2}
        onDragEnd={(_: any, info: any) => {
          if (info.offset.y > 100) handleClose();
        }}
        initial={{ y: "100%" }}
        animate={{ y: isClosing ? "100%" : 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative w-full bg-brand-primary sm:rounded-modal rounded-t-modal p-6 pt-8 flex flex-col max-h-[90vh]"
      >
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full sm:hidden" />

        {!orderId && (
          <button
            type="button"
            onClick={handleClose}
            aria-label={t.close}
            className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 active:scale-90 rounded-full border border-white/10 transition-all text-brand-light z-20"
          >
            <X size={18} />
          </button>
        )}

        {orderId ? (
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-5 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
              <CheckCircle2 size={32} />
            </div>

            <span className="text-[11px] font-black uppercase tracking-widest text-brand-light/50 mb-2">
              {t.orderTitle}
            </span>

            <h2 id="order-dialog-title" className="text-4xl font-black uppercase tracking-tighter text-brand-secondary leading-none mb-4">
              {t.orderPlacedTitle.replace('{id}', orderId)}
            </h2>

            <p className="text-sm text-brand-light/70 leading-relaxed mb-6 max-w-xs">
              {t.showStaffLine}
            </p>

            <div className="w-full space-y-2 mb-6 text-left">
              {items.map((item) => (
                <div key={`${item.id}-${item.weight}`} className="gradient-ring rounded-button">
                  <div className="p-3 bg-white/5 rounded-button flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="text-xs font-black uppercase text-brand-light truncate">{item.name}</h4>
                      <span className="text-[11px] font-bold text-brand-secondary">{item.weight}{item.unitLabel}</span>
                    </div>
                    <span className="text-xs font-black text-brand-light shrink-0">{item.price}<Baht /></span>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full flex items-center justify-between pt-4 border-t border-white/10 mb-6">
              <span className="text-[11px] font-black uppercase tracking-wide text-brand-light/40">{t.total}</span>
              <span className="text-xl font-black text-brand-light">{total}<Baht /></span>
            </div>

            <button
              type="button"
              onClick={handleNewOrder}
              className="w-full h-14 btn-metal font-black uppercase tracking-widest text-[12px] rounded-button active:scale-95 transition-all shadow-xl"
            >
              {t.newOrderCta}
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-brand-secondary/20 rounded-button text-brand-secondary">
                <ShoppingBag size={22} />
              </div>
              <div>
                <h2 id="order-dialog-title" className="text-xl font-black uppercase tracking-tight text-brand-light">{t.orderTitle}</h2>
                <p className="text-xs text-brand-light/50">{items.length} {t.items}</p>
              </div>
            </div>

            <div className="overflow-y-auto space-y-2 pr-1 no-scrollbar flex-1">
              {items.length === 0 ? (
                <div className="py-12 text-center text-brand-light/40 font-bold uppercase tracking-wider text-xs">
                  {t.emptyCart}
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.id}-${item.weight}`} className="gradient-ring rounded-button">
                    <div className="p-3 bg-white/5 rounded-button flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-black uppercase text-brand-light truncate">{item.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-bold text-brand-secondary px-2 py-0.5 bg-brand-secondary/10 rounded-md">{item.weight}{item.unitLabel}</span>
                          <span className="text-xs font-black text-brand-light">{item.price}<Baht /></span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => { triggerHaptic('warning'); removeItem(item.id, item.weight); }}
                        aria-label={`${t.remove}: ${item.name}`}
                        className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-badge transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between gap-4 shrink-0">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wide text-brand-light/40 block">{t.total}</span>
                  <span className="text-xl font-black text-brand-light">{total}<Baht /></span>
                </div>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="flex-1 h-14 btn-metal font-black uppercase tracking-widest text-[11px] rounded-button active:scale-95 transition-all flex items-center justify-center gap-2 hover:brightness-110 shadow-xl"
                >
                  {t.placeOrder}
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>
      </div>
    </div>
  );
};
