"use client"
import * as React from "react"
import { createPortal } from "react-dom"
import { motion } from "framer-motion"
import { X, ShieldCheck } from "lucide-react"
import { TranslationDictionary } from "@/lib/translations"
import { triggerHaptic } from "@/lib/utils"
import { useModalA11y } from "@/lib/use-modal-a11y"
import { ConsultationRequestForm } from "@/components/forms/ConsultationRequestForm"

interface ConsultationProps {
  t: TranslationDictionary;
  onClose: () => void;
}

// "\n" marks a manual line break within the two-line success headline,
// rendered the same way HomeClient renders its own "\n"-joined strings.
function renderLines(text: string): React.ReactNode {
  return text.split("\n").map((line, i) => (
    <React.Fragment key={i}>
      {i > 0 && <br />}
      {line}
    </React.Fragment>
  ));
}

export const Consultation = ({ t, onClose }: ConsultationProps) => {
  const [isClosing, setIsClosing] = React.useState(false);
  // The form calls this instead of actually submitting — there is exactly
  // one instance of this project (see the audit ТЗ this shipped with, item
  // 6: no demoInstance branching), so nothing typed into it is ever sent,
  // logged, or stored, unconditionally. The header/content below swap to
  // the success state. Reset on every open — Consultation is only ever
  // mounted while the modal is showing (see HomeClient), so a fresh mount
  // already starts here, but the reset makes that explicit rather than
  // relying on it.
  const [success, setSuccess] = React.useState(false);
  // Resolved on the first client render, not one render later. Starting at
  // `false` on a desktop viewport mounted the motion element with the mobile
  // sheet's `initial` (y: 100%) and then switched `animate` to the desktop
  // variant, which only names opacity and scale — so nothing ever animated y
  // back to 0 and the dialog sat one full height below centre, half off the
  // bottom of the screen. Only mobile got away with it.
  const [isDesktop, setIsDesktop] = React.useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 640px)").matches
  );
  // True on the very first client render, not one render later. The dialog is
  // only ever mounted from client state (never during hydration), so there is
  // no markup to mismatch — and waiting a render would have the focus trap set
  // up against an element that does not exist yet.
  const [mounted, setMounted] = React.useState(() => typeof document !== "undefined");

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

  // The one dialog on the site that never got this: no Escape, no focus trap,
  // and the page still scrolling behind it. Closing runs through handleClose so
  // the exit animation still plays.
  const dialogRef = useModalA11y({ onClose: handleClose });

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
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={t.consultCta}
          drag={isDesktop ? false : "y"}
          dragConstraints={{ top: 0 }}
          dragElastic={0.2}
          onDragEnd={(_: any, info: any) => {
            if (info.offset.y > 100) handleClose();
          }}
          initial={isDesktop ? { opacity: 0, scale: 0.95 } : { y: "100%" }}
          // The desktop variant names y as well, so a viewport crossing the
          // breakpoint while the dialog is open drops the sheet's offset
          // instead of keeping it as a stuck transform.
          animate={isDesktop ? { opacity: isClosing ? 0 : 1, scale: isClosing ? 0.95 : 1, y: 0 } : { y: isClosing ? "100%" : 0 }}
          transition={isDesktop ? { type: "spring", damping: 28, stiffness: 340 } : { type: "spring", damping: 30, stiffness: 300 }}
          className="relative w-full bg-brand-primary sm:rounded-modal rounded-t-modal max-h-[90dvh] sm:max-h-[85vh] flex flex-col overflow-hidden"
        >
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full sm:hidden" />

          <button
            type="button"
            onClick={handleClose}
            aria-label={t.close}
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
                {success ? t.consultSuccessTitle : t.consultCta}
              </h2>
            </div>

            {success ? (
              <div>
                <p className="text-lg font-black text-brand-light leading-snug">
                  {renderLines(t.consultSuccessHeadline)}
                </p>
                {/* The one line on the whole storefront addressed to the shop
                    owner touring the demo rather than to a customer — kept
                    visually apart (its own border-top, smaller, muted) so it
                    doesn't read as part of the confirmation a real customer
                    would see. */}
                <p className="mt-4 pt-4 border-t border-white/10 text-[11px] font-bold text-brand-light/40 leading-snug">
                  {t.consultSuccessNote}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  {t.certSteps.map((step, i) => {
                    const isLast = i === t.certSteps.length - 1;
                    return (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-7 h-7 rounded-full bg-brand-secondary/15 border border-brand-secondary/50 text-brand-secondary flex items-center justify-center text-[11px] font-black shrink-0">
                            {i + 1}
                          </div>
                          {!isLast && <div className="w-px flex-1 bg-brand-secondary/25 my-1" />}
                        </div>
                        <div className={isLast ? "" : "pb-4"}>
                          <p className="text-[12px] font-black uppercase tracking-wide text-brand-secondary">
                            {step.title}
                          </p>
                          <p className="text-[12px] text-brand-light/50 leading-snug mt-0.5">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <ConsultationRequestForm
                  t={t}
                  onSuccess={() => setSuccess(true)}
                />
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>,
    document.body
  );
};
