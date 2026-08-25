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
}

// Both pitch blocks' CTAs open a real live surface, so neither outranks the
// other — same shape, weight and light tonal fill as block 02's plain Link
// (see btn-tonal-light). A dark fill here used to sit darker than the card
// itself, reading weaker than the neutral elements around it (ТЗ rewrite
// §11); it's lighter than the plate now, still short of the solid
// btn-metal gold reserved for the page's single closing WhatsApp/LINE
// actions.
//
// Full width on mobile, content width from `lg` (ТЗ-4 §3.4): a button
// stretched across the whole text column reads as a form field, not an
// invitation. `inline-flex` is what actually makes `lg:w-auto` shrink to
// content — a plain `flex` block still fills its container's width
// regardless of the width utility, since block-level `width:auto` means
// "fill available width," not "shrink-to-fit."
function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={() => triggerHaptic('medium')}
      className="w-full lg:w-auto h-12 px-6 btn-tonal-light border border-white/25 text-brand-primary font-black uppercase tracking-widest text-[12px] rounded-button active:scale-95 transition-all flex lg:inline-flex items-center justify-center gap-2 disabled:opacity-60"
    >
      {pending ? pendingLabel : label}
      {!pending && <ArrowRight size={16} className="text-brand-secondary" />}
    </button>
  );
}

export function DemoLoginButton({ label, pendingLabel, errorNotConfigured, errorFailed }: DemoLoginButtonProps) {
  const [state, formAction] = useFormState(demoSignIn, null);

  return (
    <form action={formAction} className="space-y-2">
      <SubmitButton label={label} pendingLabel={pendingLabel} />
      {state?.error && (
        <p className="text-[12px] font-bold text-red-400 text-center">
          {state.error === "not_configured" ? errorNotConfigured : errorFailed}
        </p>
      )}
    </form>
  );
}
