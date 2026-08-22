"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { triggerHaptic } from "@/lib/utils"

// Deliberately not a warning dialog: no icon, no red plaque, same panel
// treatment as every other modal on /staff. The action it confirms is
// reversible (a revoked prescription can be restored with no confirmation
// at all — see ClientCard), and the interface should say so by not dressing
// this up as a hazard.
export function ConfirmDialog({
  message,
  confirmLabel,
  onConfirm,
  onCancel,
  isConfirming,
}: {
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  isConfirming?: boolean;
}) {
  const handleCancel = () => {
    triggerHaptic("light");
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/80" onClick={handleCancel} />

      <div className="gradient-ring w-full max-w-sm sm:rounded-modal rounded-t-modal shadow-2xl">
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="relative w-full bg-brand-primary surface sm:rounded-modal rounded-t-modal p-6"
        >
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full sm:hidden" />

          <p className="mt-2 sm:mt-0 text-[14px] font-bold text-brand-light leading-relaxed">{message}</p>

          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 h-11 rounded-button surface-row font-black uppercase tracking-wide text-[12px] text-brand-light/70 hover:text-brand-light active:translate-y-px transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isConfirming}
              onClick={() => { triggerHaptic("medium"); onConfirm(); }}
              className="flex-1 h-11 rounded-button btn-metal font-black uppercase tracking-wide text-[12px] active:translate-y-px transition-all disabled:opacity-60"
            >
              {confirmLabel}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
