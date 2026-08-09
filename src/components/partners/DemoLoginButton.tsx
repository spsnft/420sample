"use client"
import * as React from "react"
import { useFormState, useFormStatus } from "react-dom"
import { ArrowRight } from "lucide-react"
import { demoSignIn } from "@/app/partners/actions"
import { triggerHaptic } from "@/lib/utils"

interface DemoLoginButtonProps {
  label: string;
  pendingLabel: string;
  errorNotConfigured: string;
  errorFailed: string;
}

// Styled to match the block 1 CTA exactly: both blocks open a real live
// surface, so neither outranks the other. The solid btn-metal treatment stays
// reserved for the page's single closing WhatsApp action.
function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <div className="gradient-ring rounded-button">
      <button
        type="submit"
        disabled={pending}
        onClick={() => triggerHaptic('medium')}
        className="w-full h-12 bg-white/5 font-black uppercase tracking-widest text-[12px] rounded-button active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {pending ? pendingLabel : label}
        {!pending && <ArrowRight size={16} />}
      </button>
    </div>
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
