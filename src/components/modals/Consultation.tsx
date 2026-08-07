"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { X, ShieldCheck } from "lucide-react"
import { TranslationDictionary } from "@/lib/translations"
import { triggerHaptic } from "@/lib/utils"
import { ConsultationRequestForm } from "@/components/forms/ConsultationRequestForm"

interface ConsultationProps {
  t: TranslationDictionary;
  onClose: () => void;
}

export const Consultation = ({ t, onClose }: ConsultationProps) => {
  const [isClosing, setIsClosing] = React.useState(false);

  const handleClose = React.useCallback(() => {
    triggerHaptic('light');
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  }, [onClose]);

  return (
    <div className={`fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 bg-black/80" onClick={handleClose} />

      <div className="gradient-ring w-full max-w-md sm:rounded-modal rounded-t-modal shadow-2xl">
        <motion.div
          drag="y"
          dragConstraints={{ top: 0 }}
          dragElastic={0.2}
          onDragEnd={(_: any, info: any) => {
            if (info.offset.y > 100) handleClose();
          }}
          initial={{ y: "100%" }}
          animate={{ y: isClosing ? "100%" : 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="relative w-full bg-brand-primary sm:rounded-modal rounded-t-modal p-6 pt-8"
        >
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full sm:hidden" />

          <button
            type="button"
            onClick={handleClose}
            className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 active:scale-90 rounded-full border border-white/10 transition-all text-brand-light z-20"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-button bg-brand-secondary/20 border border-brand-secondary/40 flex items-center justify-center text-brand-secondary shrink-0">
              <ShieldCheck size={20} />
            </div>
            <h2 className="text-lg font-black uppercase tracking-tight text-brand-light leading-tight pr-10">
              {t.consultCta}
            </h2>
          </div>

          <ConsultationRequestForm t={t} />
        </motion.div>
      </div>
    </div>
  );
};
