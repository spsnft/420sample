"use client"
import * as React from "react"
import { useFormState, useFormStatus } from "react-dom"
import { signIn } from "@/app/staff/actions"

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full h-12 btn-metal font-black uppercase tracking-widest text-[13px] rounded-button active:scale-95 transition-all disabled:opacity-60"
    >
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useFormState(signIn, null);

  return (
    <form action={formAction} className="space-y-3">
      <div>
        <label className="text-[11px] font-black uppercase tracking-wide text-brand-light/40">Email</label>
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          autoFocus
          className="w-full h-11 mt-1 px-3 rounded-button bg-white/5 border border-white/10 text-[14px] font-bold text-brand-light focus:outline-none focus:border-brand-secondary/50"
        />
      </div>
      <div>
        <label className="text-[11px] font-black uppercase tracking-wide text-brand-light/40">Password</label>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full h-11 mt-1 px-3 rounded-button bg-white/5 border border-white/10 text-[14px] font-bold text-brand-light focus:outline-none focus:border-brand-secondary/50"
        />
      </div>

      {state?.error && (
        <p className="text-[12px] font-bold text-red-400">{state.error}</p>
      )}

      <SubmitButton />
    </form>
  );
}
