"use client"
import * as React from "react"
import { useRouter } from "next/navigation"
import { CloudOff, Leaf, RotateCw } from "lucide-react"

import { TranslationDictionary } from "@/lib/translations"
import { triggerHaptic } from "@/lib/utils"
import { FOCUS_RING } from "@/components/cards/ProductCards"

// What the menu shows instead of a bare black screen when the catalogue is
// missing. A five-second fetch timeout on venue wifi makes this a routine
// state, not a corner case — a guest who sees nothing assumes the menu is
// broken and puts the phone away.
export const CatalogFallback: React.FC<{ t: TranslationDictionary; failed: boolean }> = ({ t, failed }) => {
  const router = useRouter();
  const [isRetrying, startRetry] = React.useTransition();

  // The page is server-rendered, so a refresh is the retry: it re-runs the
  // fetch on the server. A failed fetch is never cached, so this really does
  // hit the source again rather than replaying the failure.
  const retry = () => {
    triggerHaptic('medium');
    startRetry(() => router.refresh());
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="gradient-ring rounded-card">
        <div className="rounded-card bg-brand-primary px-6 py-14 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-3xl bg-brand-secondary/15 border border-brand-secondary/40 flex items-center justify-center text-brand-secondary mb-5">
            {failed ? <CloudOff size={30} /> : <Leaf size={30} />}
          </div>

          <h2 className="text-xl font-black uppercase tracking-tight text-brand-light mb-2">
            {failed ? t.catalogErrorTitle : t.catalogEmpty}
          </h2>

          {failed && (
            <>
              <p className="text-xs text-brand-light/60 leading-relaxed max-w-[320px] text-balance mb-6">
                {t.catalogErrorBody}
              </p>

              <button
                type="button"
                onClick={retry}
                disabled={isRetrying}
                className={`h-12 px-6 btn-metal font-black uppercase tracking-widest text-[12px] rounded-button active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-60 ${FOCUS_RING}`}
              >
                <RotateCw size={16} className={isRetrying ? "animate-spin" : undefined} />
                {t.catalogRetry}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
