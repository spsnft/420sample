"use client"
import * as React from "react"
import { Timer } from "lucide-react"

import { TranslationDictionary } from "@/lib/translations"
import { triggerHaptic } from "@/lib/utils"
import { useModalA11y } from "@/lib/use-modal-a11y"

// Kiosk only. The device used to wipe the basket silently after four idle
// minutes, which is fine for an abandoned session and rude to a customer who
// was reading a description. This asks first, and only clears if nobody
// answers — the standard bargain for a screen shared by strangers.
export const IdlePrompt: React.FC<{
  seconds: number;
  t: TranslationDictionary;
  onStay: () => void;
  onExpire: () => void;
}> = ({ seconds, t, onStay, onExpire }) => {
  const [remaining, setRemaining] = React.useState(seconds);

  // Escape counts as "I'm here" — it is the one key a passer-by will not press.
  const dialogRef = useModalA11y({ onClose: onStay });

  const onExpireRef = React.useRef(onExpire);
  onExpireRef.current = onExpire;

  React.useEffect(() => {
    const tick = setInterval(() => {
      setRemaining(value => {
        if (value <= 1) {
          clearInterval(tick);
          onExpireRef.current();
          return 0;
        }
        return value - 1;
      });
    }, 1000);

    return () => clearInterval(tick);
  }, []);

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 bg-black/90">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="idle-prompt-title"
        className="relative w-full max-w-sm bg-brand-primary border border-white/10 rounded-modal p-6 pt-8 shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300"
      >
        <div className="w-16 h-16 rounded-3xl bg-brand-secondary/15 border border-brand-secondary/40 flex items-center justify-center text-brand-secondary mb-4">
          <Timer size={30} />
        </div>

        <h2 id="idle-prompt-title" className="text-xl font-black uppercase tracking-tight text-brand-light leading-tight mb-2">
          {t.idleTitle}
        </h2>

        <p className="text-xs text-brand-light/60 leading-relaxed mb-6 max-w-[280px] text-balance">
          {t.idleBody.replace('{seconds}', String(remaining))}
        </p>

        <button
          type="button"
          onClick={() => { triggerHaptic('medium'); onStay(); }}
          className="w-full h-14 bg-brand-secondary text-brand-primary font-black uppercase tracking-widest text-[12px] rounded-button active:scale-95 transition-all shadow-xl hover:bg-brand-secondary/90"
        >
          {t.idleStay}
        </button>
      </div>
    </div>
  );
};
