"use client"
import * as React from "react"
import { createPortal } from "react-dom"
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
  const [isDesktop, setIsDesktop] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(min-width: 640px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const handleClose = React.useCallback(() => {
    triggerHaptic('light');
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  }, [onClose]);

  // Portal straight to <body> so this overlay never inherits a stacking
  // context or clipping box from an ancestor (e.g. an overflow-hidden
  // section) — it is always positioned relative to the viewport, centered,
  // and above everything else on the page.
  if (!mounted) return null;

  return createPortal(
    <div className={`fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 bg-black/80" onClick={handleClose} />

      <div className="gradient-ring w-full max-w-md sm:rounded-modal rounded-t-modal shadow-2xl">
        <motion.div
          drag={isDesktop ? false : "y"}
          dragConstraints={{ top: 0 }}
          dragElastic={0.2}
          onDragEnd={(_: any, info: any) => {
            if (info.offset.y > 100) handleClose();
          }}
          initial={isDesktop ? { opacity: 0, scale: 0.95 } : { y: "100%" }}
          animate={isDesktop ? { opacity: isClosing ? 0 : 1, scale: isClosing ? 0.95 : 1 } : { y: isClosing ? "100%" : 0 }}
          transition={isDesktop ? { type: "spring", damping: 28, stiffness: 340 } : { type: "spring", damping: 30, stiffness: 300 }}
          className="relative w-full bg-brand-primary sm:rounded-modal rounded-t-modal max-h-[90dvh] sm:max-h-[85vh] flex flex-col overflow-hidden"
        >
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full sm:hidden" />

          <button
            type="button"
            onClick={handleClose}
            className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 active:scale-90 rounded-full border border-white/10 transition-all text-brand-light z-20"
          >
            <X size={18} />
          </button>

          <div className="overflow-y-auto p-6 pt-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-button bg-brand-secondary/20 border border-brand-secondary/40 flex items-center justify-center text-brand-secondary shrink-0">
                <ShieldCheck size={20} />
              </div>
              <h2 className="text-lg font-black uppercase tracking-tight text-brand-light leading-tight pr-10">
                {t.consultCta}
              </h2>
            </div>

            <div className="mb-5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[10px] font-bold uppercase tracking-wide text-brand-light/50">
              {t.certSteps.map((step, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span className="text-brand-secondary/60">→</span>}
                  <span>{step}</span>
                </React.Fragment>
              ))}
            </div>

            <ConsultationRequestForm t={t} />
          </div>
        </motion.div>
      </div>
    </div>,
    document.body
  );
};
