"use client"
import * as React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { useCart } from "@/lib/cart-store"
import type { Language } from "@/lib/translations"
import { partnersTranslations } from "@/lib/partners/translations"
import { Header } from "@/components/layout/Header"
import { WhatsAppIcon } from "@/components/icons/BrandIcons"
import { DemoLoginButton } from "@/components/partners/DemoLoginButton"
import { DeviceMockup } from "@/components/partners/DeviceMockup"
import { DesktopMockup } from "@/components/partners/DesktopMockup"
import { siteConfig } from "@/config/site"
import { triggerHaptic } from "@/lib/utils"

// Blocks 1 and 2 are the page's argument: the same product seen by the two
// audiences a shop owner cares about — their customers, then themselves and
// their staff. They are built from one shell so the pair reads as a matched
// set; only the mockup inside and the CTA's destination differ. The step
// number sits behind the heading as a watermark rather than as a label, since
// the headings already say who each block is for.
function PitchBlock({
  step,
  title,
  children,
}: {
  step: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="gradient-ring rounded-card">
      <section className="relative overflow-hidden p-5 rounded-card bg-white/5">
        <span
          aria-hidden
          className="pointer-events-none select-none absolute -top-5 right-1 text-[76px] leading-none font-black text-brand-secondary/[0.09]"
        >
          {step}
        </span>
        <h2 className="relative text-2xl sm:text-3xl font-black uppercase tracking-tight leading-tight text-brand-light mb-5 whitespace-pre-line">
          {title}
        </h2>
        {children}
      </section>
    </div>
  );
}

export default function PartnersClient() {
  const { lang } = useCart();
  const safeLang = (lang || 'en') as Language;
  const t = partnersTranslations[safeLang] || partnersTranslations.en;

  return (
    <div className="min-h-screen bg-brand-primary text-brand-light p-4 selection:bg-brand-secondary/30 font-sans">
      {/* The attribution belongs to the wordmark, not to the page: as a
          centred line of its own under a left-aligned header it read as an
          orphan and pushed the hero down. Tucked under "420 Store" it becomes
          part of the lockup — "this shop, built by us" — which is the whole
          pitch of the page. */}
      <Header
        safeLang={safeLang}
        surface="partners"
        byline={
          <Link
            href="https://tsvetkov.site"
            target="_blank"
            rel="noopener noreferrer"
            className="block -mt-0.5 text-[9px] font-black uppercase tracking-[0.18em] text-brand-light/30 hover:text-brand-light/60 transition-colors"
          >
            by FT.Agency
          </Link>
        }
      />

      <main className="max-w-xl mx-auto space-y-6 pb-10">
        <section className="text-center py-4">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-tight text-balance text-brand-light">
            {t.heroTitle}
          </h1>
          <ul className="mt-4 flex flex-wrap justify-center gap-1.5">
            {t.heroPills.map((pill) => (
              <li
                key={pill}
                className="inline-flex items-center h-7 px-3 rounded-full bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-wide text-brand-light/70"
              >
                {pill}
              </li>
            ))}
            <li className="inline-flex items-center h-7 px-3 rounded-full btn-metal text-[11px] font-black uppercase tracking-wide">
              {t.heroPillAccent}
            </li>
          </ul>
        </section>

        <PitchBlock step="01" title={t.block1Title}>
          <DeviceMockup />
          <div className="gradient-ring rounded-button mt-6">
            <Link
              href="https://buds.digital"
              target="_blank"
              rel="noopener"
              onClick={() => triggerHaptic('light')}
              className="w-full h-12 bg-white/5 font-black uppercase tracking-widest text-[12px] rounded-button active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {t.ctaLive}
              <ArrowRight size={16} />
            </Link>
          </div>
        </PitchBlock>

        <PitchBlock step="02" title={t.block2Title}>
          <DesktopMockup />
          <div className="mt-6">
            <DemoLoginButton
              label={t.ctaLive}
              pendingLabel={t.ctaLivePending}
              errorNotConfigured={t.ctaLiveErrorNotConfigured}
              errorFailed={t.ctaLiveErrorFailed}
            />
          </div>
        </PitchBlock>

        {/* No card around this one. The two pitch blocks above are cards
            because each holds an argument; the closing line and its button are
            the page speaking in its own voice, and a third bordered box after
            them turned the ask into just another exhibit. */}
        <section className="px-2 pt-4 pb-2 text-center">
          <p className="text-[14px] font-bold text-brand-light/80 leading-relaxed text-balance mb-4">
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
