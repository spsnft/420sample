"use client"
import * as React from "react"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

import { useCart } from "@/lib/cart-store"
import type { Language } from "@/lib/translations"
import { partnersTranslations } from "@/lib/partners/translations"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { WhatsAppIcon, LineIcon } from "@/components/icons/BrandIcons"
import { DemoLoginButton } from "@/components/partners/DemoLoginButton"
import { DeviceMockup } from "@/components/partners/DeviceMockup"
import { DesktopMockup } from "@/components/partners/DesktopMockup"
import { siteConfig } from "@/config/site"
import { triggerHaptic } from "@/lib/utils"

// The agency's own portfolio link, used both under the wordmark and again in
// the trust block below. The domain itself is never printed as text — only
// ever the FT.Agency name, which is what both links are signed with.
const AGENCY_PORTFOLIO_URL = "https://tsvetkov.site";

// Blocks 01 and 02 are the page's argument: the same product seen by the two
// audiences a shop owner cares about — their own record-keeping, then their
// customers. They are built from one shell so the pair reads as a matched
// set; only the mockup inside, the heading and the CTA's destination differ.
// The step number sits behind the heading as a watermark rather than as a
// label, since the headings already say who each block is for.
function PitchBlock({
  step,
  title,
  subtitle,
  children,
}: {
  step: string;
  title: string;
  subtitle?: string;
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
        <div className="relative mb-5">
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-tight text-brand-light whitespace-pre-line">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1.5 text-[13px] font-bold text-brand-light/50 leading-snug max-w-sm">
              {subtitle}
            </p>
          )}
        </div>
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
    <div className="min-h-screen text-brand-light p-4 selection:bg-brand-secondary/30 font-sans">
      {/* The attribution belongs to the wordmark, not to the page: as a
          centred line of its own under a left-aligned header it read as an
          orphan and pushed the hero down. Tucked under "buds.digital" it
          becomes part of the lockup — "this product, built by us" — which is
          the whole pitch of the page. */}
      <Header
        safeLang={safeLang}
        surface="partners"
        byline={
          <Link
            href={AGENCY_PORTFOLIO_URL}
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
          <p className="mt-3 text-[13px] font-normal text-brand-light/60 text-balance">
            {t.whiteGloveLine}
          </p>
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

        {/* Block 01 — the PT.33 panel: the record-keeping the shop is
            actually buying, so it leads. The mobile crop this block is meant
            to carry (one client card, status + callouts) is blocked on the
            /staff audit (see ТЗ part 3) — DesktopMockup's full search-screen
            capture stands in for it until that lands. The CTA is the dark
            variant: a gold wash disappears against this block's own warm-lit
            screenshot (see ТЗ №2 M6). */}
        <PitchBlock step="01" title={t.blockPt33Title} subtitle={t.blockPt33Subtitle}>
          <DesktopMockup />
          <div className="mt-6">
            <DemoLoginButton
              label={t.ctaLive}
              pendingLabel={t.ctaLivePending}
              errorNotConfigured={t.ctaLiveErrorNotConfigured}
              errorFailed={t.ctaLiveErrorFailed}
              variant="dark"
            />
            <p className="mt-2 text-center text-[10px] font-bold text-brand-light/40">
              {t.demoSampleNote}
            </p>
          </div>
        </PitchBlock>

        {/* Block 02 — the client storefront the same system ships. */}
        <PitchBlock step="02" title={t.blockStorefrontTitle} subtitle={t.blockStorefrontSubtitle}>
          <DeviceMockup />
          <div className="mt-6">
            <Link
              href="/demo"
              target="_blank"
              rel="noopener"
              onClick={() => triggerHaptic('light')}
              className="w-full h-12 btn-tonal-gold text-brand-light font-black uppercase tracking-widest text-[12px] rounded-button active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {t.ctaLive}
              <ArrowRight size={16} className="text-brand-secondary" />
            </Link>
            <p className="mt-2 text-center text-[10px] font-bold text-brand-light/40">
              {t.demoSampleNote}
            </p>
          </div>
        </PitchBlock>

        {/* Trust block: one attribution line (not two lines both naming the
            agency — see ТЗ №2 M7), then the guarantee as the block's
            dominant element with the checklist visually subordinate to it
            (M8), not competing with it for the eye. No photos, no names, no
            invented experience or project-count figures — see ТЗ №1 A9. */}
        <section className="px-2 pt-2 text-center">
          <p className="text-[11px] font-black uppercase tracking-wide text-brand-light/40">
            {t.trustBuiltByBefore}
            <Link
              href={AGENCY_PORTFOLIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-secondary hover:text-brand-light transition-colors"
            >
              {t.trustPortfolioLabel}
            </Link>
            {t.trustBuiltByAfter}
          </p>

          <p className="mt-4 text-[19px] sm:text-[21px] font-black text-brand-light leading-snug text-balance">
            {t.trustGuarantee}
          </p>

          <div className="mt-4 text-left">
            <p className="text-[10px] font-black uppercase tracking-wide text-brand-light/35 mb-2">
              {t.trustChecklistTitle}
            </p>
            <ul className="space-y-1.5">
              {t.trustChecklistItems.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[12px] font-semibold text-brand-light/55">
                  <Check size={13} className="shrink-0 mt-0.5 text-brand-light/35" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* No card around this one. The blocks above are cards because each
            holds an argument; the closing line and its buttons are the page
            speaking in its own voice, and a bordered box around them too
            turned the ask into just another exhibit. */}
        <section className="px-2 pt-4 pb-2 text-center">
          <p className="text-[16px] font-black text-brand-light leading-snug text-balance">
            {t.ctaHeadline}
          </p>
          <p className="mt-2 text-[13px] font-bold text-brand-light/60 leading-relaxed text-balance">
            {t.ctaSubtitle}
          </p>
          {/* Always a row, 50/50 — not stacked on mobile (see ТЗ №2 M9).
              Both icons are aria-hidden: the adjacent label already names
              the same brand ("WhatsApp" next to a WhatsApp icon, "LINE" next
              to a LINE icon), so the icon's own accessible name would just
              have a screen reader announce it twice (see M5). */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link
              href={siteConfig.partners.whatsapp}
              target="_blank"
              rel="noopener"
              onClick={() => triggerHaptic('medium')}
              className="h-14 btn-metal font-black uppercase tracking-widest text-[13px] rounded-button active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl"
            >
              <WhatsAppIcon size={18} aria-hidden="true" />
              {t.ctaButton}
            </Link>
            {/* TODO(LINE OA): points at the same WhatsApp line until this
                product's own LINE Official Account is set up. */}
            <Link
              href={siteConfig.partners.whatsapp}
              target="_blank"
              rel="noopener"
              onClick={() => triggerHaptic('medium')}
              className="h-14 btn-metal font-black uppercase tracking-widest text-[13px] rounded-button active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl"
            >
              <LineIcon size={18} aria-hidden="true" />
              {t.ctaButtonLine}
            </Link>
          </div>
          <p className="mt-4 text-[12px] font-bold text-brand-light/50">{t.pricingLine}</p>
          <p className="mt-0.5 text-[11px] text-brand-light/35">{t.pricingNote}</p>
        </section>

        <Footer privacyLabel={t.footerPrivacy} />
      </main>
    </div>
  );
}
