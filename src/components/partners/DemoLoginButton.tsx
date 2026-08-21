"use client"
import * as React from "react"
import { useFormState, useFormStatus } from "react-dom"
import { ArrowRight } from "lucide-react"
import { demoSignIn } from "@/app/actions"
import { triggerHaptic } from "@/lib/utils"

interface DemoLoginButtonProps {
  label: string;
  pendingLabel: string;
  errorNotConfigured: string;
  errorFailed: string;
  /** "dark" is the block 01 treatment (btn-tonal-dark) — a light gold wash
   *  disappears against that block's warm-toned screenshot. Defaults to the
   *  gold wash the storefront block's own CTA uses. */
  variant?: "gold" | "dark";
}

// Both blocks' CTAs open a real live surface, so neither outranks the
// other — same shape and weight either way, just a different fill (see
// btn-tonal-gold / btn-tonal-dark). The solid btn-metal treatment stays
// reserved for the page's single closing WhatsApp/LINE actions.
function SubmitButton({ label, pendingLabel, variant }: { label: string; pendingLabel: string; variant: "gold" | "dark" }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={() => triggerHaptic('medium')}
      className={`w-full h-12 ${variant === "dark" ? "btn-tonal-dark" : "btn-tonal-gold"} text-brand-light font-black uppercase tracking-widest text-[12px] rounded-button active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60`}
    >
      {pending ? pendingLabel : label}
      {!pending && <ArrowRight size={16} className="text-brand-secondary" />}
    </button>
  );
}

export function DemoLoginButton({ label, pendingLabel, errorNotConfigured, errorFailed, variant = "gold" }: DemoLoginButtonProps) {
  const [state, formAction] = useFormState(demoSignIn, null);

  return (
    <form action={formAction} className="space-y-2">
      <SubmitButton label={label} pendingLabel={pendingLabel} variant={variant} />
      {state?.error && (
        <p className="text-[12px] font-bold text-red-400 text-center">
          {state.error === "not_configured" ? errorNotConfigured : errorFailed}
        </p>
      )}
    </form>
  );
}
