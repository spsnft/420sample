"use client"
import * as React from "react"
import Image from "next/image"
import { motion, useDragControls } from "framer-motion"
import { X, ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart-store"
import { Language, TranslationDictionary } from "@/lib/translations"
import { triggerHaptic, Baht, strainAccentFor } from "@/lib/utils"
import { priceFor, savingFor } from "@/lib/pricing"
import { useModalA11y } from "@/lib/use-modal-a11y"
import { QuantityPicker } from "./QuantityPicker"

const FALLBACK_IMAGE = "/images/logo.svg";

// One fact about the product, in the sheet only. These never went on a list
// row: a name, a strain and a price is what a list is scanned for, and "Cherry,
// Earth" under every second row was noise at the moment of scanning.
const Spec: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-button border border-white/10 bg-white/[0.03] px-3 py-2">
    <dt className="text-[9px] font-black uppercase tracking-widest text-brand-light/40 mb-1">{label}</dt>
    <dd className="text-[12px] font-bold text-brand-light/80 leading-snug">{value}</dd>
  </div>
);

interface ProductModalProps {
  isOpen?: boolean;
  product: any;
  t: TranslationDictionary;
  onClose: () => void;
  style?: { color?: string };
  /** Set when the sheet was opened from a basket line: it starts at that
   *  line's quantity and replaces it, rather than adding a second helping of
   *  something the customer was only trying to correct. */
  editingQty?: number;
}

export const Product = ({
  isOpen = true,
  product,
  t,
  onClose,
  style,
  editingQty
}: ProductModalProps) => {
  const isEditing = editingQty !== undefined;
  const [quantity, setQuantity] = React.useState(editingQty ?? 1);
  const [isClosing, setIsClosing] = React.useState(false);
  const [imgSrc, setImgSrc] = React.useState(
    product?.image || FALLBACK_IMAGE
  );

  const { addItem, setQty, items, lang } = useCart();

  const safeLang = (lang || 'en') as Language;
  const accentColor = style?.color || '#10B981';
  // The sheet's lighting stays on the accent; the chip naming the strain drops
  // to the ordinary text colour when there is no strain to name.
  const strainColor = strainAccentFor(product);

  const handleClose = React.useCallback(() => {
    triggerHaptic('light');
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  }, [onClose]);

  const dialogRef = useModalA11y({ onClose: handleClose });

  const dragControls = useDragControls();
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const touchStartY = React.useRef(0);

  // Swipe-to-dismiss from anywhere in the sheet's upper body, not just the
  // 28px handle — reaching for a grab bar with a thumb already on the picture
  // is a chore. The rule is the one every native sheet uses: a downward drag
  // that begins while the content is scrolled to the top belongs to the sheet;
  // anything else belongs to the content. Touch only, so a mouse drag stays a
  // text selection.
  const handleBodyPointerDown = (e: React.PointerEvent) => {
    touchStartY.current = e.clientY;
  };

  const handleBodyPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'touch') return;
    if ((bodyRef.current?.scrollTop ?? 0) > 0) return;
    if (e.clientY - touchStartY.current > 8) dragControls.start(e);
  };

  if (!product || (!isOpen && !isClosing)) return null;

  const cartItem = items.find(i => i.id === product.id);
  // While editing, the sheet stands for the whole line, so the basket's current
  // quantity is what is being replaced rather than something to add on top of.
  const cartQty = isEditing ? 0 : (cartItem ? cartItem.qty : 0);
  // The banner and the button both talk about the basket the customer would
  // leave with, not about this sheet in isolation — otherwise "add 4 more to
  // reach 900฿" contradicts a cart that already holds three.
  const totalQty = cartQty + quantity;

  // What this sheet adds to the bill: the repriced line minus what the line
  // already costs. With an empty cart it is simply the price of the quantity
  // shown; with 3g already in it, adding 2g charges what those 2g change the
  // line by, so the tiers stay honest however the order was assembled.
  const inCart = priceFor(cartQty, product);
  const withAddition = priceFor(totalQty, product);
  const addPrice = withAddition.price - inCart.price;
  const addListPrice = withAddition.listPrice - inCart.listPrice;
  // The buy button had a lot of empty space and the saving had a line to
  // itself; together they say one thing — this is what you pay, and this is
  // what the size earned you.
  const saving = savingFor(quantity, product);

  const handleAdd = () => {
    triggerHaptic('success');
    if (isEditing) setQty(product.id, quantity);
    else addItem(product, quantity);
    handleClose();
  };

  return (
    <div className={`fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 bg-black/80" onClick={handleClose} />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-dialog-title"
        className="gradient-ring w-full max-w-md sm:rounded-modal rounded-t-modal shadow-2xl"
      >
      <motion.div
        drag="y"
        dragListener={false}
        dragControls={dragControls}
        dragConstraints={{ top: 0 }}
        dragElastic={0.2}
        onDragEnd={(_: any, info: any) => {
          if (info.offset.y > 100) handleClose();
        }}
        initial={{ y: "100%" }}
        animate={{ y: isClosing ? "100%" : 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        // Capped and split into a scrolling body with a fixed foot: the sheet
        // was 449px of fixed content, which fitted, and every line of
        // description added to it would have pushed the buy button off a small
        // phone with no way to reach it.
        className="relative w-full bg-brand-primary sm:rounded-modal rounded-t-modal p-6 pt-8 flex flex-col max-h-[88vh]"
      >
        <div
          onPointerDown={(e) => dragControls.start(e)}
          className="absolute top-0 inset-x-0 h-7 flex items-start justify-center pt-3 touch-none sm:hidden z-30"
        >
          <div className="w-12 h-1.5 bg-white/20 rounded-full" />
        </div>

        <div
          className="absolute inset-0 opacity-20 pointer-events-none rounded-t-modal sm:rounded-modal"
          style={{ background: `radial-gradient(circle at 50% 0%, ${accentColor}, transparent 60%)` }}
        />

        <button
          type="button"
          onClick={handleClose}
          aria-label={t.close}
          className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 active:scale-90 rounded-full border border-white/10 transition-all text-brand-light z-20"
        >
          <X size={18} />
        </button>

        <div
          ref={bodyRef}
          onPointerDown={handleBodyPointerDown}
          onPointerMove={handleBodyPointerMove}
          className="relative z-10 flex-1 min-h-0 overflow-y-auto no-scrollbar -mx-6 px-6"
        >
        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 mb-4 relative flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full blur-2xl opacity-40"
              style={{ background: `radial-gradient(circle at 50% 50%, ${accentColor}80, transparent 70%)` }}
            />
            <Image
              src={imgSrc}
              alt={product.name || "Product"}
              fill
              className="object-contain filter drop-shadow-2xl relative z-10"
              sizes="128px"
              onError={() => setImgSrc(FALLBACK_IMAGE)}
            />
          </div>

          <span
            className={`text-[11px] font-black uppercase tracking-wide px-3 py-1 rounded-full border mb-3 ${strainColor ? '' : 'border-white/15 bg-white/[0.04] text-brand-light/70'}`}
            style={strainColor ? { borderColor: `${strainColor}50`, color: strainColor, backgroundColor: `${strainColor}10` } : undefined}
          >
            {product.type || product.category}
          </span>

          <h2 id="product-dialog-title" className="text-2xl font-black uppercase tracking-tighter text-brand-light text-center leading-none mb-1">
            {product.name}
          </h2>

        </div>

        {product.description && (
          <p className="text-[13px] text-brand-light/70 leading-relaxed text-center text-balance mb-5">
            {product.description}
          </p>
        )}

        {(product.taste || product.terpenes) && (
          <dl className="grid grid-cols-2 gap-2 mb-6">
            {product.taste && <Spec label={t.taste} value={product.taste} />}
            {product.terpenes && <Spec label={t.terpenes} value={product.terpenes} />}
          </dl>
        )}

        </div>

        <div className="flex flex-col gap-3 relative z-10 pt-4 shrink-0">
          <QuantityPicker
            product={product}
            value={quantity}
            onChange={setQuantity}
            lang={safeLang}
            accentColor={accentColor}
            t={t}
          />

          <button
            type="button"
            onClick={handleAdd}
            className="w-full h-14 btn-metal font-black uppercase tracking-widest text-[13px] rounded-button active:scale-95 transition-all flex items-center justify-center gap-3 hover:brightness-110 shadow-xl"
          >
            <ShoppingBag size={18} className="shrink-0" />
            <span className="flex flex-col items-center leading-tight">
              <span className="flex items-baseline gap-2">
                {isEditing && <span className="text-[11px] opacity-70">{t.updateCta}</span>}
                {addListPrice > addPrice && (
                  <span className="text-[12px] opacity-50 line-through">{addListPrice}</span>
                )}
                <span>{addPrice}</span>
                <Baht />
              </span>
              {saving > 0 && (
                <span className="text-[10px] font-black tracking-wide opacity-70 normal-case">
                  {t.savingLabel} {saving}฿
                </span>
              )}
            </span>
          </button>
        </div>

      </motion.div>
      </div>
    </div>
  );
};
