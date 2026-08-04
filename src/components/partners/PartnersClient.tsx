"use client"
import * as React from "react"
import Link from "next/link"
import { MapPin, Clock, ShieldCheck, Star, ArrowRight, Search } from "lucide-react"

import { useCart } from "@/lib/cart-store"
import type { Language } from "@/lib/translations"
import { partnersTranslations } from "@/lib/partners/translations"
import { Header } from "@/components/layout/Header"
import { WhatsAppIcon } from "@/components/icons/BrandIcons"
import { StatusPill } from "@/components/staff/StatusPill"
import { QuotaBar } from "@/components/staff/QuotaBar"
import { DemoLoginButton } from "@/components/partners/DemoLoginButton"
import { siteConfig } from "@/config/site"
import { triggerHaptic } from "@/lib/utils"

// Stylized recreations of the public homepage and the staff panel, built
// from the same components/tokens as the real screens — not real captures.
// Swap for the real screen recordings from ТЗ §4 when they're shot.
function MockClientScreen() {
  return (
    <div className="gradient-ring rounded-card mb-4">
      <div className="p-4 rounded-card bg-black/30 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wide text-brand-light/40">buds.digital</span>
          <span className="h-6 px-2.5 inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/10">
            <Star size={11} className="text-brand-secondary fill-brand-secondary" />
            <span className="text-[11px] font-black text-brand-light">5.0</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-brand-light/60">
          <MapPin size={13} className="text-brand-secondary shrink-0" />
          <span className="text-[11px] font-bold truncate">{siteConfig.address}</span>
        </div>
        <div className="flex items-center gap-2 text-brand-light/60">
          <Clock size={13} className="text-brand-secondary shrink-0" />
          <span className="text-[11px] font-bold">{siteConfig.workingHours}</span>
        </div>
        <div className="p-2.5 rounded-button bg-brand-secondary/10 border border-brand-secondary/30 flex items-center gap-2">
          <ShieldCheck size={14} className="text-brand-secondary shrink-0" />
          <span className="text-[11px] font-bold text-brand-light">Medical Pass PT.33 — on site</span>
        </div>
      </div>
    </div>
  );
}

function MockStaffScreen() {
  return (
    <div className="gradient-ring rounded-card mb-4">
      <div className="p-4 rounded-card bg-black/30 space-y-3">
        <div className="h-9 px-3 rounded-button bg-white/5 border border-white/10 flex items-center gap-2 text-brand-light/40">
          <Search size={13} />
          <span className="text-[12px] font-bold">Somchai Boonmee</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-black text-brand-light">Somchai Boonmee</span>
          <StatusPill status="active" />
        </div>
        <QuotaBar usedGrams={25} limitGrams={30} />
      </div>
    </div>
  );
}

export default function PartnersClient() {
  const { lang } = useCart();
  const safeLang = (lang || 'en') as Language;
  const t = partnersTranslations[safeLang] || partnersTranslations.en;

  return (
    <div className="min-h-screen bg-brand-primary text-brand-light p-4 selection:bg-brand-secondary/30 font-sans">
      <Header safeLang={safeLang} />
      <p className="max-w-xl mx-auto text-center text-[10px] font-black uppercase tracking-[0.2em] text-brand-light/30 -mt-2 mb-4">
        by buds.digital
      </p>

      <main className="max-w-xl mx-auto space-y-6 pb-10">
        <section className="text-center py-4">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-tight text-brand-light">
            {t.heroTitle}
          </h1>
          <p className="text-[14px] text-brand-light/60 mt-3 leading-relaxed">
            {t.heroSubtitle}
          </p>
        </section>

        <div className="gradient-ring rounded-card">
        <section className="p-5 rounded-card bg-white/5">
          <MockClientScreen />
          <h2 className="text-base font-black uppercase tracking-tight text-brand-light mb-2">
            {t.block1Title}
          </h2>
          <p className="text-[13px] text-brand-light/70 leading-relaxed mb-4">
            {t.block1Desc}
          </p>
          <div className="gradient-ring rounded-button">
            <Link
              href="https://buds.digital"
              target="_blank"
              rel="noopener"
              onClick={() => triggerHaptic('light')}
              className="w-full h-12 bg-white/5 font-black uppercase tracking-widest text-[12px] rounded-button active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {t.block1Cta}
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
        </div>

        <section className="p-5 rounded-card bg-gradient-to-br from-brand-secondary/20 via-black/40 to-black/80 border border-brand-secondary/40 shadow-2xl">
          <MockStaffScreen />
          <h2 className="text-base font-black uppercase tracking-tight text-brand-light mb-2">
            {t.block2Title}
          </h2>
          <p className="text-[13px] text-brand-light/70 leading-relaxed mb-4">
            {t.block2Desc}
          </p>
          <DemoLoginButton
            label={t.block2Cta}
            pendingLabel={t.block2CtaPending}
            errorNotConfigured={t.block2ErrorNotConfigured}
            errorFailed={t.block2ErrorFailed}
          />
        </section>

        <section className="p-6 rounded-card card-premium text-center">
          <p className="text-[14px] font-bold text-brand-light/80 leading-relaxed mb-4">
            {t.ctaTitle}
          </p>
          <Link
            href={siteConfig.partners.whatsapp}
            target="_blank"
            rel="noopener"
            onClick={() => triggerHaptic('medium')}
            className="w-full h-14 btn-metal font-black uppercase tracking-widest text-[13px] rounded-button active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl"
          >
            <WhatsAppIcon size={18} />
            {t.ctaButton}
          </Link>
        </section>
      </main>
    </div>
  );
}
