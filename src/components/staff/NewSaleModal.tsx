"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { X, ShoppingBag } from "lucide-react"
import { createPurchase } from "@/app/staff/actions"
import { triggerHaptic, Baht } from "@/lib/utils"
import { MONTHLY_QUOTA_GRAMS } from "@/lib/staff/constants"
import { QuotaBar } from "./QuotaBar"
import { StatusPill } from "./StatusPill"
import type { PrescriptionCard } from "@/lib/staff/types"

const PRODUCT_SUGGESTIONS = [
  "Flower — Sativa",
  "Flower — Indica",
  "Flower — Hybrid",
  "Pre-roll",
  "Vape",
  "Edible",
  "Concentrate",
  "Accessory",
];

interface NewSaleModalProps {
  client: { id: string; name: string };
  prescription: PrescriptionCard;
  onClose: () => void;
  onSuccess: () => void;
}

export function NewSaleModal({ client, prescription, onClose, onSuccess }: NewSaleModalProps) {
  const [product, setProduct] = React.useState("");
  const [quantity, setQuantity] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const isBlocked = prescription.status !== "active";
  const quantityNum = parseFloat(quantity) || 0;
  const projectedUsed = prescription.quota_used_g + quantityNum;
  const willExceed = quantityNum > 0 && projectedUsed > MONTHLY_QUOTA_GRAMS;

  const handleClose = () => {
    triggerHaptic("light");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBlocked || isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    const result = await createPurchase({
      clientId: client.id,
      prescriptionId: prescription.id,
      product,
      quantity: quantityNum,
      price: parseFloat(price) || 0,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    triggerHaptic("success");
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/80" onClick={handleClose} />

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative w-full max-w-md bg-brand-primary rim-border sm:rounded-modal rounded-t-modal p-6 pt-8 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full sm:hidden" />

        <button
          type="button"
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 active:scale-90 rounded-full border border-white/10 transition-all text-brand-light z-20"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-black uppercase tracking-tight text-brand-light mb-1">New Sale</h2>
        <p className="text-[12px] text-brand-light/50 mb-4">{client.name} · {prescription.pt33_number}</p>

        <div className="mb-4">
          <StatusPill status={prescription.status} />
        </div>

        {isBlocked ? (
          <div className="p-4 rounded-button bg-red-500/10 border border-red-500/30 text-red-400 text-[13px] font-bold">
            {prescription.status === "revoked"
              ? "This prescription is revoked. Sale blocked."
              : "This prescription has expired. Sale blocked."}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-black uppercase tracking-wide text-brand-light/40">Product</label>
              <input
                required
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                list="staff-product-suggestions"
                placeholder="e.g. Flower — Hybrid"
                className="w-full h-11 mt-1 px-3 rounded-button bg-white/5 border border-white/10 text-[14px] font-bold text-brand-light focus:outline-none focus:border-brand-secondary/50"
              />
              <datalist id="staff-product-suggestions">
                {PRODUCT_SUGGESTIONS.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-black uppercase tracking-wide text-brand-light/40">Quantity (g)</label>
                <input
                  required
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full h-11 mt-1 px-3 rounded-button bg-white/5 border border-white/10 text-[14px] font-bold text-brand-light focus:outline-none focus:border-brand-secondary/50"
                />
              </div>
              <div>
                <label className="text-[11px] font-black uppercase tracking-wide text-brand-light/40">Price (฿)</label>
                <input
                  required
                  type="number"
                  min="0"
                  step="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full h-11 mt-1 px-3 rounded-button bg-white/5 border border-white/10 text-[14px] font-bold text-brand-light focus:outline-none focus:border-brand-secondary/50"
                />
              </div>
            </div>

            <QuotaBar usedGrams={Math.round(projectedUsed * 100) / 100} limitGrams={MONTHLY_QUOTA_GRAMS} />

            {willExceed && (
              <div className="p-3 rounded-button bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[12px] font-bold leading-relaxed">
                This sale puts {client.name} {(projectedUsed - MONTHLY_QUOTA_GRAMS).toFixed(1)}g over the {MONTHLY_QUOTA_GRAMS}g monthly quota.
              </div>
            )}

            {error && <p className="text-[12px] font-bold text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 btn-metal font-black uppercase tracking-widest text-[13px] rounded-button active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <ShoppingBag size={18} />
              {isSubmitting ? "Recording…" : (
                <>
                  Record Sale{price ? <> · {price}<Baht /></> : null}
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
