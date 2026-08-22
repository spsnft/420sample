"use client"
import * as React from "react"

import { useCart } from "@/lib/cart-store"
import type { Language } from "@/lib/translations"
import { privacyTranslations } from "@/lib/privacy/translations"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { WhatsAppIcon, LineIcon } from "@/components/icons/BrandIcons"
import { Tooltip } from "@/components/ui/Tooltip"

export default function PrivacyClient() {
  const { lang } = useCart();
  const safeLang = (lang || 'en') as Language;
  const t = privacyTranslations[safeLang] || privacyTranslations.en;

  return (
    <div className="min-h-screen text-brand-light p-4 selection:bg-brand-secondary/30 font-sans">
      <Header safeLang={safeLang} surface="partners" />

      <main className="max-w-xl mx-auto space-y-6 pb-10">
        <section className="pt-2">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-tight text-brand-light">
            {t.title}
          </h1>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-brand-light/40">
            {t.updated}
          </p>
          <p className="mt-4 text-[14px] font-bold text-brand-light/70 leading-relaxed">
            {t.intro}
          </p>
        </section>

        <section className="space-y-5">
          {t.sections.map((section) => (
            <div key={section.title} className="gradient-ring rounded-card">
              <div className="p-4 rounded-card bg-white/5">
                <h2 className="text-[13px] font-black uppercase tracking-wide text-brand-secondary mb-1.5">
                  {section.title}
                </h2>
                <p className="text-[13px] font-bold text-brand-light/70 leading-relaxed">
                  {section.body}
                </p>
              </div>
            </div>
          ))}
        </section>

        <section className="px-2 pt-2 text-center">
          <p className="text-[13px] font-black uppercase tracking-wide text-brand-light/60 mb-1">
            {t.contactTitle}
          </p>
          <p className="text-[13px] font-bold text-brand-light/60 leading-relaxed mb-4">
            {t.contactBody}
          </p>
          {/* Icon-only, unlike the pitch page's WhatsApp/LINE buttons — a
              visually-hidden span backs up aria-label as this control's only
              accessible name (see HomeClient's contacts row).
              Plain buttons, not links — same demo-placeholder situation as
              HomeClient's contacts row (config/site.ts, contacts is blank
              on this instance), same shared Tooltip standing in for a real
              chat. */}
          <Tooltip text={t.contactsTooltip} className="w-full">
            <div className="flex items-center justify-center gap-3">
              <div className="surface rounded-button">
                <button type="button" aria-label="LINE" className="w-[46px] h-[46px] flex items-center justify-center rounded-button active:scale-90 transition-all">
                  <LineIcon size={20} className="opacity-80" />
                  <span className="sr-only">LINE</span>
                </button>
              </div>
              <div className="surface rounded-button">
                <button type="button" aria-label="WhatsApp" className="w-[46px] h-[46px] flex items-center justify-center rounded-button active:scale-90 transition-all">
                  <WhatsAppIcon size={20} className="opacity-80" />
                  <span className="sr-only">WhatsApp</span>
                </button>
              </div>
            </div>
          </Tooltip>
        </section>

        <Footer privacyLabel={t.title} />
      </main>
    </div>
  );
}
