"use client"
import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
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

// The agency's own portfolio link, credited under the wordmark here and
// again in the footer (see siteConfig.partners.agencyUrl) — exactly two
// places on the page now that the standalone trust block above the pricing
// section is gone (ТЗ rewrite §5.1/checklist). The domain itself is never
// printed as text — only ever the FT.Agency name, which both links sign.
const AGENCY_PORTFOLIO_URL = siteConfig.partners.agencyUrl;

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
// The whole block — heading, body, mockup and CTA — animates in as one
// element instead of the heading landing first and the mockup catching up
// seconds later, which on mobile left up to half a screen of empty card
// sitting under settled text (reads as a stalled load, not an entrance —
// see ТЗ rewrite §10). The `margin` below is a positive *bottom* rootMargin,
// so the observer considers the block "in view" while it's still ~200px
// below the viewport's own bottom edge — the animation is done well before
// the block is actually scrolled into sight.
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
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px 200px 0px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="gradient-ring rounded-card"
    >
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
    </motion.div>
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
        {/* H1 is the one thing centred on mobile (ТЗ rewrite §12) — every
            other block below runs left-aligned there, including this
            section's own lead and price line. */}
        <section className="max-w-prose mx-auto py-4">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-tight text-balance text-brand-light text-center">
            {t.heroTitle}
          </h1>
          <p className="mt-3 text-[14px] sm:text-[15px] font-normal text-brand-light/75 text-balance text-left">
            {t.heroSubtitle}
          </p>
          {/* Replaces the old two-pill row: gold there meant "press this",
              and a gold-filled, unclickable pill sitting in the page's most
              visible spot taught the wrong rule (ТЗ rewrite §2.1). Plain
              text, no button — blocks 01/02 already carry the two real CTAs. */}
          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-light/45 text-left sm:text-center">
            {t.heroPriceLine}
          </p>
        </section>

        {/* Block 01 — the PT.33 panel: the record-keeping the shop is
            actually buying, so it leads. The CTA's light fill (see
            btn-tonal-light) sits above the card's own warm-lit screenshot —
            gold is reserved for the closing WhatsApp/LINE actions, and a
            dark fill here used to sit darker than the card itself (ТЗ
            rewrite §11). */}
        <PitchBlock
          title={t.blockPt33Title}
          subtitle={t.blockPt33Subtitle}
          mockup={<DesktopMockup />}
          cta={
            <DemoLoginButton
              label={t.ctaStaff}
              pendingLabel={t.ctaStaffPending}
              errorNotConfigured={t.ctaStaffErrorNotConfigured}
              errorFailed={t.ctaStaffErrorFailed}
            />
          }
        />

        {/* Block 02 — the client storefront the same system ships. Same
            light fill as block 01's CTA (ТЗ rewrite §11). */}
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
              className="w-full h-12 btn-tonal-light border border-white/25 text-brand-primary font-black uppercase tracking-widest text-[12px] rounded-button active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {t.ctaMenu}
              <ArrowRight size={16} className="text-brand-secondary" />
            </Link>
          }
        />

        {/* Offer block: the launch-price headline as the block's dominant
            element, the price itself, the reason-and-deadline line, an
            abstract, the guarantee, the included scope, an add-on price
            list and the subscription rate. The old attribution line above
            this heading ("Built by FT.Agency") is gone — it linked out to
            the portfolio right at the page's hottest point; the agency
            stays credited in the header and footer, both untouched (ТЗ
            rewrite §5.1). No photos, no names, no invented experience or
            project-count figures — see ТЗ №1 A9. Left-aligned by default
            (mobile); only the heading recentres from `sm` — everything
            below it was already left at every width (ТЗ rewrite §12). */}
        <section className="max-w-prose mx-auto px-2 pt-2 text-left">
          {/* Same treatment as blocks 01/02's h2. */}
          <p className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-tight text-brand-light text-balance sm:text-center">
            {t.offerTitle}
          </p>

          {/* The one moment on the page where a decision actually gets made,
              so the number gets its own block instead of living as a clause
              inside offerBody's paragraph. */}
          <div className="mt-5">
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
            {/* Raised to body-text size — this is the block's only argument
                for acting now, and it used to run as the smallest line in
                the section (ТЗ rewrite §5.3). */}
            <p className="mt-2 text-[13px] font-bold text-brand-light/70 leading-relaxed">
              {t.offerPriceNote}
            </p>
          </div>

          <p className="mt-4 text-[13px] font-medium text-brand-light/70 leading-relaxed">
            {t.offerBody}
          </p>

          {/* NEW: the page's one guarantee, promoted from small print under
              the add-ons list up to where a reader is actually weighing the
              risk (ТЗ rewrite §5.5). */}
          <p className="mt-4 text-[13px] font-bold text-brand-light">
            {t.guaranteeLine}
          </p>

          <div className="mt-5">
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
            <p className="mt-2.5 text-[12px] font-medium text-brand-light/45">
              {t.includedNote}
            </p>
          </div>

          {/* Prices lifted to the section's primary text colour — these are
              the numbers a reader is here for, and used to run as dim as
              the labels beside them (ТЗ rewrite §5.7). */}
          <div className="mt-5">
            <p className="text-[10px] font-black uppercase tracking-wide text-brand-light/35 mb-2">
              {t.addonsTitle}
            </p>
            <ul className="space-y-1.5">
              {t.addonsItems.map(({ label, price }) => (
                <li key={label} className="flex items-baseline justify-between gap-3 text-[12px] font-semibold">
                  <span className="text-brand-light/45">{label}</span>
                  <span className="shrink-0 text-brand-light tabular-nums whitespace-nowrap">{price}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-4 pt-4 border-t border-white/10 text-[12px] font-bold text-brand-light/50">
            {t.subscriptionLine}
          </p>
          <p className="mt-2 text-[12px] font-bold text-brand-light/50">
            {t.subscriptionYearlyLine}
          </p>
        </section>

        <div className="max-w-prose mx-auto">
          <FaqSection title={t.faqTitle} items={t.faqItems} />
        </div>

        {/* No card around this one. The blocks above are cards because each
            holds an argument; the closing line and its buttons are the page
            speaking in its own voice, and a bordered box around them too
            turned the ask into just another exhibit. */}
        <section className="max-w-prose mx-auto px-2 pt-4 pb-2 text-left">
          <p className="text-[16px] font-black text-brand-light leading-snug text-balance sm:text-center">
            {t.ctaHeadline}
          </p>
          <p className="mt-2 text-[13px] font-bold text-brand-light/70 leading-relaxed text-balance">
            {t.ctaSubtitle}
          </p>
          {/* Moved above the button row (ТЗ pitch-layout №5) — it used to sit
              under both buttons, reading as an afterthought instead of the
              price the buttons are actually asking about. */}
          <p className="mt-4 text-[12px] font-bold text-brand-light/60 sm:text-center">{t.pricingLine}</p>
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
