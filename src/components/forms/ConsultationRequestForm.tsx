"use client"
import * as React from "react"
import Link from "next/link"
import { Loader2, CheckCircle2 } from "lucide-react"
import { TranslationDictionary } from "@/lib/translations"
import { triggerHaptic } from "@/lib/utils"

// consultConsentLabel names PDPA literally, once, in every locale — split on
// it so the word itself becomes the link to /privacy instead of duplicating
// the sentence per-language just to wrap one word.
function renderConsentLabel(text: string): React.ReactNode {
  const [before, after] = text.split("PDPA");
  if (after === undefined) return text;
  return (
    <>
      {before}
      <Link href="/privacy" className="underline underline-offset-2 hover:text-brand-light/80">
        PDPA
      </Link>
      {after}
    </>
  );
}

// Minimal set for a Phuket shop's actual customer mix (Thai locals, Russian
// and Western tourists/expats) rather than a full country list — "Other…"
// covers everyone else without pulling in a country-picker dependency for a
// single form field. Defaults to +66: most submissions are still local, and
// a phone number with no code at all is a lead nobody can call back on.
const PHONE_COUNTRY_CODES = [
  { code: "+66", country: "TH" },
  { code: "+7", country: "RU" },
  { code: "+44", country: "GB" },
  { code: "+1", country: "US" },
  { code: "+61", country: "AU" },
  { code: "+49", country: "DE" },
  { code: "+33", country: "FR" },
  { code: "+972", country: "IL" },
];
const OTHER_CODE = "other";

interface ConsultationRequestFormProps {
  t: TranslationDictionary;
  /** buds.digital's own demo instance only (see lib/demo.ts). When set,
   *  submitting never calls the real backend — nothing typed in is sent,
   *  logged, or stored — it just calls onDemoSuccess so the parent can
   *  swap the whole modal to its success state. */
  demoInstance?: boolean;
  onDemoSuccess?: () => void;
}

type Status = "idle" | "submitting" | "success" | "error";

export const ConsultationRequestForm: React.FC<ConsultationRequestFormProps> = ({ t, demoInstance, onDemoSuccess }) => {
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [countryCode, setCountryCode] = React.useState("+66");
  const [customCode, setCustomCode] = React.useState("");
  const [consent, setConsent] = React.useState(false);
  const [status, setStatus] = React.useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !consent || status === "submitting") return;

    triggerHaptic('medium');

    if (demoInstance) {
      // No fetch at all on the demo — see the prop doc above. The brief
      // "submitting" flash is only there so the tap reads as having done
      // something before the modal swaps to the success state.
      setStatus("submitting");
      setTimeout(() => {
        triggerHaptic('success');
        onDemoSuccess?.();
      }, 400);
      return;
    }

    const dialCode = countryCode === OTHER_CODE ? customCode.trim() : countryCode;
    const fullPhone = `${dialCode} ${phone.trim()}`.trim();

    setStatus("submitting");
    try {
      const res = await fetch("/api/consultation-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: fullPhone }),
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
        <div className="flex gap-2 mt-1">
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            aria-label={t.consultPhoneLabel}
            className="h-11 pl-2.5 pr-1 rounded-button bg-white/5 border border-white/10 text-[13px] font-bold text-brand-light shrink-0 w-[92px] focus:outline-none focus:border-brand-secondary/50"
          >
            {PHONE_COUNTRY_CODES.map(({ code, country }) => (
              <option key={code} value={code}>{code} {country}</option>
            ))}
            <option value={OTHER_CODE}>{t.consultPhoneCodeOther}</option>
          </select>
          {countryCode === OTHER_CODE && (
            <input
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              placeholder="+"
              inputMode="tel"
              aria-label={t.consultPhoneCodeOther}
              className="h-11 w-16 px-2 rounded-button bg-white/5 border border-white/10 text-[13px] font-bold text-brand-light shrink-0 focus:outline-none focus:border-brand-secondary/50"
            />
          )}
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            autoComplete="tel"
            className="flex-1 min-w-0 h-11 px-3 rounded-button bg-white/5 border border-white/10 text-[14px] font-bold text-brand-light focus:outline-none focus:border-brand-secondary/50"
          />
        </div>
      </div>

      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
          className="mt-0.5 w-4 h-4 shrink-0 accent-brand-secondary"
        />
        <span className="text-[11px] text-brand-light/60 leading-snug">{renderConsentLabel(t.consultConsentLabel)}</span>
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
