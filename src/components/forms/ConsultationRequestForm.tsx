"use client"
import * as React from "react"
import { Loader2, CheckCircle2 } from "lucide-react"
import { TranslationDictionary } from "@/lib/translations"
import { triggerHaptic } from "@/lib/utils"

interface ConsultationRequestFormProps {
  t: TranslationDictionary;
}

type Status = "idle" | "submitting" | "success" | "error";

export const ConsultationRequestForm: React.FC<ConsultationRequestFormProps> = ({ t }) => {
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [consent, setConsent] = React.useState(false);
  const [status, setStatus] = React.useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !consent || status === "submitting") return;

    triggerHaptic('medium');
    setStatus("submitting");
    try {
      const res = await fetch("/api/consultation-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
      });
      if (!res.ok) throw new Error("request failed");
      triggerHaptic('success');
      setStatus("success");
    } catch {
      triggerHaptic('warning');
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-start gap-3 p-4 rounded-button bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
        <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
        <p className="text-[12px] font-bold leading-snug">{t.consultSuccessMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="text-[11px] font-black uppercase tracking-wide text-brand-light/40">
          {t.consultNameLabel}
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
          className="w-full h-11 mt-1 px-3 rounded-button bg-white/5 border border-white/10 text-[14px] font-bold text-brand-light focus:outline-none focus:border-brand-secondary/50"
        />
      </div>
      <div>
        <label className="text-[11px] font-black uppercase tracking-wide text-brand-light/40">
          {t.consultPhoneLabel}
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          autoComplete="tel"
          className="w-full h-11 mt-1 px-3 rounded-button bg-white/5 border border-white/10 text-[14px] font-bold text-brand-light focus:outline-none focus:border-brand-secondary/50"
        />
      </div>

      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
          className="mt-0.5 w-4 h-4 shrink-0 accent-brand-secondary"
        />
        <span className="text-[11px] text-brand-light/60 leading-snug">{t.consultConsentLabel}</span>
      </label>

      {status === "error" && (
        <p className="text-[12px] font-bold text-red-400">{t.consultErrorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full h-12 btn-metal font-black uppercase tracking-widest text-[12px] rounded-button active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {status === "submitting" && <Loader2 size={16} className="animate-spin" />}
        {t.consultSubmitCta}
      </button>
    </form>
  );
};
