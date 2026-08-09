"use client"
import * as React from "react"
import { useFormState, useFormStatus } from "react-dom"
import { signUp } from "@/app/staff/actions"

const inputClass =
  "w-full h-11 mt-1 px-3 rounded-button bg-white/5 border border-white/10 text-[14px] font-bold text-brand-light focus:outline-none focus:border-brand-secondary/50";
const labelClass = "text-[11px] font-black uppercase tracking-wide text-brand-light/40";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full h-12 btn-metal font-black uppercase tracking-widest text-[13px] rounded-button active:scale-95 transition-all disabled:opacity-60"
    >
      {pending ? "Creating account…" : "Create account"}
    </button>
  );
}

export function SignUpForm({ inviteCode }: { inviteCode: string }) {
  const [state, formAction] = useFormState(signUp, null);

  return (
    <form action={formAction} className="space-y-3">
      <div>
        <label className={labelClass}>Invite code</label>
        <input
          name="code"
          type="text"
          required
          defaultValue={inviteCode}
          autoComplete="off"
          className={`${inputClass} font-mono tracking-wide`}
        />
      </div>
      <div>
        <label className={labelClass}>Name</label>
        <input name="name" type="text" required autoFocus={!!inviteCode} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Email</label>
        <input name="email" type="email" required autoComplete="username" className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Password</label>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
      </div>

      {state?.error && <p className="text-[12px] font-bold text-red-400">{state.error}</p>}

      <SubmitButton />
    </form>
  );
}
