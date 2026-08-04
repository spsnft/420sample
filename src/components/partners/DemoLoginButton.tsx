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

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={() => triggerHaptic('medium')}
      className="w-full h-14 btn-metal font-black uppercase tracking-widest text-[13px] rounded-button active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-60"
    >
      {pending ? pendingLabel : label}
      {!pending && <ArrowRight size={18} />}
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
