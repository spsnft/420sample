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
import { FaqSection } from "@/components/partners/FaqSection"
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
// No step numbers: these are two parts of one product, not sequential steps.
//
// Below `lg` this is plain block flow, unchanged from before the two-column
// rework: head, then mockup, then cta, each in its own div in that order —
// `lg:grid` doesn't apply yet, so the two wrapper divs just stack. From `lg`
// those same two divs become the grid's two columns (45/55, vertically
// centred against each other via items-center), with the head+cta div now
// reading as one column stacked above itself. `cta` has to be mounted twice
// — once per column — since one React element can't sit in two places in the
// tree at once; only one copy is ever visible at a time (`hidden`/
// `lg:hidden`), so nothing is duplicated for assistive tech.
function PitchBlock({
  title,
  subtitle,
  mockup,
  cta,
}: {
  title: string;
  subtitle?: string;
  mockup: React.ReactNode;
  cta: React.ReactNode;
}) {
  return (
    <div className="gradient-ring rounded-card">
      <section className="relative overflow-hidden p-5 lg:p-8 rounded-card bg-white/5 lg:grid lg:grid-cols-[45fr_55fr] lg:gap-x-10 lg:items-center">
        <div>
          <div className="relative mb-5 lg:mb-6">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-tight text-brand-light whitespace-pre-line">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1.5 text-[13px] font-bold text-brand-light/90 leading-snug">
                {subtitle}
              </p>
            )}
          </div>
          <div className="hidden lg:block">{cta}</div>
        </div>
        <div>
          {mockup}
          <div className="mt-6 lg:hidden">{cta}</div>
        </div>
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

      {/* max-w-xl was the whole page's width at every breakpoint — fine for
          one column of prose, but it's also what kept blocks 01/02 pinned to
          a ~576px column with nearly half the screen empty on either side
          from 1024px+ (see the ТЗ this shipped with, pitch-layout №1). `main`
          now widens from `lg`; the single-column sections (hero, offer, FAQ,
          final CTA) each pin themselves back to max-w-prose (≈65ch, per that
          ТЗ's №2) so their body copy doesn't just stretch to fill the extra
          room — only blocks 01/02 use it, for the two-column layout below. */}
      <main className="max-w-xl lg:max-w-5xl mx-auto space-y-6 pb-10">
        <section className="max-w-prose mx-auto text-center py-4">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-tight text-balance text-brand-light">
            {t.heroTitle}
          </h1>
          <p className="mt-3 text-[14px] sm:text-[15px] font-normal text-brand-light/75 text-balance text-left">
            {t.heroSubtitle}
          </p>
          <ul className="mt-4 flex flex-wrap justify-center gap-1.5">
            {t.heroPills.map((pill, i) => (
              <li
                key={pill}
                className={
                  i === 0
                    ? "inline-flex items-center h-7 px-3 rounded-full btn-metal text-[11px] font-black uppercase tracking-wide"
                    : "inline-flex items-center h-7 px-3 rounded-full bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-wide text-brand-light/70"
                }
              >
                {pill}
              </li>
            ))}
          </ul>
        </section>

        {/* Block 01 — the PT.33 panel: the record-keeping the shop is
            actually buying, so it leads. The mobile crop this block is meant
            to carry (one client card, status + callouts) is blocked on the
            /staff audit (see ТЗ part 3) — DesktopMockup's full search-screen
            capture stands in for it until that lands. The CTA's dark fill
            (see btn-tonal-dark) is what actually contrasts against this
            block's own warm-lit screenshot — a gold wash disappeared into it
            (ТЗ №2 M6). */}
        <PitchBlock
          title={t.blockPt33Title}
          subtitle={t.blockPt33Subtitle}
          mockup={<DesktopMockup />}
          cta={
            <DemoLoginButton
              label={t.ctaLive}
              pendingLabel={t.ctaLivePending}
              errorNotConfigured={t.ctaLiveErrorNotConfigured}
              errorFailed={t.ctaLiveErrorFailed}
            />
          }
        />

        {/* Block 02 — the client storefront the same system ships. Same dark
            fill as block 01's CTA (see ТЗ №2 M12): this card sits under the
            same warm ambient glow, and the gold wash read just as flat here
            as it did there. */}
        <PitchBlock
          title={t.blockStorefrontTitle}
          subtitle={t.blockStorefrontSubtitle}
          mockup={<DeviceMockup />}
          cta={
            <Link
              href="/demo"
              target="_blank"
              rel="noopener"
              onClick={() => triggerHaptic('light')}
              className="w-full h-12 btn-tonal-dark border border-white/15 text-brand-light font-black uppercase tracking-widest text-[12px] rounded-button active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {t.ctaLive}
              <ArrowRight size={16} className="text-brand-secondary" />
            </Link>
          }
        />

        {/* Offer block: one attribution line (not two lines both naming the
            agency — see ТЗ №2 M7), then the launch-price headline as the
            block's dominant element, an abstract, the included scope, an
            add-on price list, payment terms and the subscription rate. No
            photos, no names, no invented experience or project-count
            figures — see ТЗ №1 A9. */}
        <section className="max-w-prose mx-auto px-2 pt-2 text-center">
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

          {/* Same treatment as blocks 01/02's h2 — this heading used to run
              smaller and without the uppercase/tracking-tight pair, which
              read as a lighter weight next to them even at the same
              font-black (see the ТЗ this shipped with, pitch-layout №4). */}
          <p className="mt-4 text-2xl sm:text-3xl font-black uppercase tracking-tight leading-tight text-brand-light text-balance">
            {t.offerTitle}
          </p>

          {/* The one moment on the page where a decision actually gets made,
              so the number gets its own block instead of living as a clause
              inside offerBody's paragraph (ТЗ pitch-layout №4). */}
          <div className="mt-5 text-left">
            <div className="flex items-baseline flex-wrap gap-x-3 gap-y-1">
              <span className="text-4xl sm:text-5xl font-black text-brand-light tabular-nums">
                {t.offerPriceNow}
              </span>
              <span className="text-lg sm:text-xl font-bold text-brand-light/45 line-through tabular-nums">
                {t.offerPriceWas}
              </span>
            </div>
            <p className="mt-1 text-2xl sm:text-[28px] font-black text-brand-light tabular-nums">
              {t.offerPriceMonthly}
            </p>
            <p className="mt-1.5 text-[11px] font-bold text-brand-light/50">
              {t.offerPriceNote}
            </p>
          </div>

          <p className="mt-4 text-[13px] font-medium text-brand-light/70 leading-relaxed text-left">
            {t.offerBody}
          </p>

          <div className="mt-5 text-left">
            <p className="text-[10px] font-black uppercase tracking-wide text-brand-light/35 mb-2">
              {t.includedTitle}
            </p>
            <ul className="space-y-1.5">
              {t.includedItems.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[12px] font-semibold text-brand-light/55">
                  <Check size={13} className="shrink-0 mt-0.5 text-brand-secondary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 text-left">
            <p className="text-[10px] font-black uppercase tracking-wide text-brand-light/35 mb-2">
              {t.addonsTitle}
            </p>
            <ul className="space-y-1.5">
              {t.addonsItems.map(({ label, price }) => (
                <li key={label} className="flex items-baseline justify-between gap-3 text-[12px] font-semibold">
                  <span className="text-brand-light/45">{label}</span>
                  <span className="shrink-0 text-brand-light/70 tabular-nums whitespace-nowrap">{price}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-4 pt-4 border-t border-white/10 text-[13px] font-bold text-brand-light/60 text-left">
            {t.termsLine}
          </p>
          <p className="mt-2 text-[12px] font-bold text-brand-light/50 text-left">
            {t.subscriptionLine}
          </p>
        </section>

        <div className="max-w-prose mx-auto">
          <FaqSection title={t.faqTitle} items={t.faqItems} />
        </div>

        {/* No card around this one. The blocks above are cards because each
            holds an argument; the closing line and its buttons are the page
            speaking in its own voice, and a bordered box around them too
            turned the ask into just another exhibit. */}
        <section className="max-w-prose mx-auto px-2 pt-4 pb-2 text-center">
          <p className="text-[16px] font-black text-brand-light leading-snug text-balance">
            {t.ctaHeadline}
          </p>
          <p className="mt-2 text-[13px] font-bold text-brand-light/70 leading-relaxed text-balance text-left">
            {t.ctaSubtitle}
          </p>
          {/* Moved above the button row (ТЗ pitch-layout №5) — it used to sit
              under both buttons, reading as an afterthought instead of the
              price the buttons are actually asking about. */}
          <p className="mt-4 text-[12px] font-bold text-brand-light/60">{t.pricingLine}</p>
          {/* Always a row, 50/50 — not stacked on mobile (see ТЗ №2 M9).
              Each link carries its own aria-label matching its visible text
              exactly (WCAG 2.5.3) — the authoritative accessible name,
              overriding anything computed from its children. Both icons are
              aria-hidden by default (see BrandIcons) so neither's old
              embedded <title> concatenates onto the visible label and shows
              up doubled in the DOM's own textContent, e.g. in a naive
              audit tool (ТЗ №2 M5: "WhatsAppWhatsApp"/"LINELINE"). */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link
              href={siteConfig.partners.whatsapp}
              target="_blank"
              rel="noopener"
              aria-label={t.ctaButton}
              onClick={() => triggerHaptic('medium')}
              className="h-14 btn-metal font-black uppercase tracking-widest text-[13px] rounded-button active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <WhatsAppIcon size={18} />
              {t.ctaButton}
            </Link>
            {/* TODO(LINE OA): points at the same WhatsApp line until this
                product's own LINE Official Account is set up. */}
            <Link
              href={siteConfig.partners.whatsapp}
              target="_blank"
              rel="noopener"
              aria-label={t.ctaButtonLine}
              onClick={() => triggerHaptic('medium')}
              className="h-14 btn-metal font-black uppercase tracking-widest text-[13px] rounded-button active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <LineIcon size={18} />
              {t.ctaButtonLine}
            </Link>
          </div>
        </section>

        <Footer privacyLabel={t.footerPrivacy} />
      </main>
    </div>
  );
}
