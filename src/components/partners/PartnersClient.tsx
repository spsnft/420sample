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
import { PhoneMockup } from "@/components/partners/PhoneMockup"
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
//
// mockupSide (ТЗ-3 §2.1): block 01 (action — type a name, get the card) puts
// its mockup on the left; block 02 (result — what the client sees) puts it
// on the right — a left-to-right zigzag matching the action→result read,
// instead of both blocks mirroring each other. Implemented with `lg:order`
// rather than swapping DOM order: the DOM stays head-then-mockup either way,
// so mobile's stacking (§2.3 — head → body → mockup → button, unchanged)
// falls out for free and only `lg:` reflows the grid tracks. Text keeps the
// 45fr track and mockup the 55fr track regardless of which side either
// lands on.
function PitchBlock({
  title,
  subtitle,
  mockup,
  cta,
  mockupSide = "right",
  mobileCtaGapClassName = "mt-6",
}: {
  title: string;
  subtitle?: string;
  mockup: React.ReactNode;
  cta: React.ReactNode;
  mockupSide?: "left" | "right";
  // ТЗ-4 §3.5 — each mockup's mask leaves a different amount of fully-
  // transparent box below its last visible pixel (more on block 02, whose
  // rotation also grows its own bounding box), so a single shared margin
  // can't put both blocks in the same *visible* gap target at once.
  //
  // ТЗ-7 recomputed both values from the live-rendered bounding box after
  // WINDOW_H_PX shrunk (see PhoneMockup.tsx): `rotate()` doesn't change an
  // element's own LAYOUT size, only where it paints, so the CTA div below
  // (a plain flow sibling) is positioned against the mockup's *unrotated*
  // layout height — block 02's actual (rotated) bottom edge paints lower
  // than that, and a margin sized for the unrotated box lands short. At
  // the old window height block 02's old `mt-0` had just enough accidental
  // slack to cover that gap; the shrink used up that slack and then some —
  // measured live, the rotated corpus's own deepest point (its bounding
  // box's bottom-right corner, since -5° tilts that corner lowest) was
  // landing 12px *below* the CTA button's own top edge, a real overlap,
  // not just a tight gap. Both values below are chosen to clear that
  // (measured, not assumed) bounding box with a ~28px reserve on top —
  // reverify live (strip the mask, read getBoundingClientRect on the
  // window div and the CTA div, see PhoneMockup.tsx's calibration-method
  // comment for the general technique) if WINDOW_H_PX or either corpus's
  // asset changes again.
  mobileCtaGapClassName?: string;
}) {
  const textOrder = mockupSide === "left" ? "lg:order-2" : "";
  const mockupOrder = mockupSide === "left" ? "lg:order-1" : "";
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px 200px 0px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="gradient-ring rounded-card"
    >
      {/* Vertical padding trimmed at `lg` (was `lg:p-8` all round) — the
          phone corpus renders noticeably shorter than the old browser
          window it replaces, and the card should shrink to hug it rather
          than leave dead air top and bottom (ТЗ-3 §2.4). Horizontal stays
          at 2rem. `items-center` (unchanged) is what actually centres the
          text column against the mockup's own height — no extra centring
          needed. */}
      <section className="relative overflow-hidden p-5 lg:px-8 lg:py-6 rounded-card bg-white/5 lg:grid lg:grid-cols-[45fr_55fr] lg:gap-x-10 lg:items-center">
        <div className={textOrder}>
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
        <div className={mockupOrder}>
          {mockup}
          <div className={`${mobileCtaGapClassName} lg:hidden`}>{cta}</div>
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
        {/* Hero and the final CTA are the page's two direct-address moments,
            centred as whole blocks at every width, with everything
            argumentative between them left-aligned (ТЗ-4 §1.2 — previously
            three different axes across four lines here: H1 centred, lead
            left, price line centred again). H1 stays the one thing centred
            on mobile per the earlier ТЗ; §1.2 just adds the lead and price
            line to that same axis rather than carving out an exception. */}
        <section className="max-w-prose mx-auto py-4 text-center">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-tight text-balance text-brand-light">
            {t.heroTitle}
          </h1>
          <p className="mt-3 text-[14px] sm:text-[15px] font-normal text-brand-light/75 text-balance">
            {t.heroSubtitle}
          </p>
          {/* Replaces the old two-pill row: gold there meant "press this",
              and a gold-filled, unclickable pill sitting in the page's most
              visible spot taught the wrong rule (ТЗ rewrite §2.1). Plain
              text, no button — blocks 01/02 already carry the two real CTAs. */}
          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-light/45">
            {t.heroPriceLine}
          </p>
        </section>

        {/* Block 01 — the PT.33 panel: the record-keeping the shop is
            actually buying, so it leads. The CTA's light fill (see
            btn-tonal-light) sits above the card's own warm-lit screenshot —
            gold is reserved for the closing WhatsApp/LINE actions, and a
            dark fill here used to sit darker than the card itself (ТЗ
            rewrite §11). Mockup on the left (ТЗ-3 §2.1): this block is the
            owner's own action, read left-to-right into block 02's result.
            No tilt (§2.2) — dense text, numbers and dates get read, not
            admired.
            Geometry (ТЗ-6 §1): staff-view.png is no longer the raw capture
            — it's cropped 16 reference px below NEW SALE/NEW RX (pixel-
            sampled on the source PNG directly: buttons' last solid-gold row
            is native 989, PREVIOUS PRESCRIPTIONS' first glyph row is native
            1026 — cropped at 1021, i.e. 16 reference px below the buttons,
            inside that 37px/18.5-reference-px native gap) and extended with
            the screen's own sampled background colour down to 1550px (775
            reference px) — the length PhoneMockup's shared WINDOW_H_PX +
            corner buffer needs.
            PREVIOUS PRESCRIPTIONS isn't "faded below visibility" any more,
            it's not in the file, so no mask value here can regress it. See
            PhoneMockup.tsx's own file comment for the window/mask numbers
            and the live-render calibration method. */}
        <PitchBlock
          title={t.blockPt33Title}
          subtitle={t.blockPt33Subtitle}
          mockupSide="left"
          mobileCtaGapClassName="mt-6"
          mockup={
            <PhoneMockup
              src="/images/partners/staff-view.png"
              alt="buds.digital staff panel — client card with PT.33 status and quota"
              imgWidth={390}
              imgHeight={775}
              rotateDeg={0}
              desktopWidthPx={391}
            />
          }
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
            light fill as block 01's CTA (ТЗ rewrite §11). Mockup on the
            right (ТЗ-3 §2.1) — unchanged from before, this is the result
            side of the zigzag. 5° tilt kept (§2.2): two big cards read as
            product photography, not data to parse.
            Geometry (ТЗ-6 §1): customer-view.png's two cards end well
            inside PhoneMockup's shared window (both fully opaque, nowhere
            near the fade), but the file itself was short — the corpus's
            own natural end (with its corner radius restored, ТЗ-5 had
            squared it off as a workaround this rebuild replaces) landed
            inside the still-partly-visible band, the exact "rounded sole"
            defect ТЗ-5/6 both flagged. Extended with the screen's own
            sampled background colour to the same 1550px (775 reference px)
            length as block 01's asset, so its corpus now hard-clips past
            the window's own edge before the radius ever paints, same
            mechanism as block 01 rather than a per-block padding hack.
            Also fixed at the source (ТЗ-6 §1.6): a light-grey scrollbar-
            artifact column at the image's right edge (columns 769-779 of
            780px width, present in the original capture, invisible
            untilted but reading as a stray render seam once rotated) is
            gone, painted over with its own left-neighbour colour for the
            full height of the original capture — separate from, and
            unrelated to, this block's rotated-mask overlay workaround (see
            PhoneMockup.tsx's FADE_OVERLAY_BG comment for why this mockup
            can't use a true CSS mask and needs the extra -inset-x-10
            width on that overlay to cover its rotated corners). */}
        <PitchBlock
          title={t.blockStorefrontTitle}
          subtitle={t.blockStorefrontSubtitle}
          mobileCtaGapClassName="mt-10"
          mockup={
            <PhoneMockup
              src="/images/partners/customer-view.png"
              alt="buds.digital home screen — hero cards"
              imgWidth={390}
              imgHeight={775}
              rotateDeg={-5}
              desktopWidthPx={391}
            />
          }
          cta={
            <Link
              href="/demo"
              target="_blank"
              rel="noopener"
              onClick={() => triggerHaptic('light')}
              className="w-full lg:w-auto h-12 px-6 btn-tonal-light border border-white/25 text-brand-primary font-black uppercase tracking-widest text-[12px] rounded-button active:scale-95 transition-all flex lg:inline-flex items-center justify-center gap-2"
            >
              {t.ctaMenu}
              <ArrowRight size={16} className="text-brand-secondary" />
            </Link>
          }
        />

        {/* Offer block (ТЗ-4 §4 reorder): title → readiness line → price
            (with its eyebrow) → guarantee → subscription terms → included
            scope → add-ons. "Done" leads, then "how much", then "how you
            pay" — the old order argued the price before establishing the
            thing was even finished. The old attribution line above this
            heading ("Built by FT.Agency") is gone — it linked out to the
            portfolio right at the page's hottest point; the agency stays
            credited in the header and footer, both untouched (ТЗ rewrite
            §5.1). No photos, no names, no invented experience or
            project-count figures — see ТЗ №1 A9. Left-aligned at every
            width now (ТЗ rewrite §12, axis rewrite §2.1) — this is a
            content section making an argument, same as blocks 01/02, not
            a direct-address moment like the hero or the final CTA.
            `lg:mx-0 lg:pl-8` walks the section's left edge off its own
            auto-centring and onto blocks 01/02's own content inset
            (gradient-ring's 1px ring + their `lg:p-8`) instead, so the
            page reads one continuous left margin from block 01 straight
            through the price list (ТЗ axis rewrite §2.2). Below `lg` nothing
            here changes — mobile keeps the previous ТЗ's rule untouched. */}
        <section className="max-w-prose mx-auto px-2 pt-2 text-left lg:mx-0 lg:pl-8 lg:pr-2">
          {/* Same treatment as blocks 01/02's h2 — left, not centred; this
              is the section's own content heading, not an address to the
              reader (ТЗ axis rewrite §2.1). */}
          <p className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-tight text-brand-light text-balance">
            {t.offerTitle}
          </p>

          {/* Leads the section now (ТЗ-4 §4.2) — "this is done" before "here's
              how much." Shortened from three sentences to two. */}
          <p className="mt-4 text-[13px] font-medium text-brand-light/70 leading-relaxed">
            {t.offerReadyLine}
          </p>

          {/* SECTION 1 — the one-time purchase. The one moment on the page
              where a decision actually gets made, so the number gets its
              own block instead of living as a clause inside a paragraph.
              The eyebrow (ТЗ-4 §4.3) replaces the old full-sentence "one at
              a time" note — same claim, same size treatment as
              includedTitle below it. Both conditions in it (shop count,
              deadline) apply only to this price, never to the subscription
              in section 2. offerPriceMonthly no longer sits under this
              price (ТЗ-5 §3) — typesetting a standing ฿2,400/month as a
              footnote of the ฿9,000 made it read as a detail of the setup
              purchase rather than a second, separate obligation. */}
          <div className="mt-5">
            <p className="text-[10px] font-black uppercase tracking-wide text-brand-light/35 mb-1.5">
              {t.offerPriceEyebrow}
            </p>
            <div className="flex items-baseline flex-wrap gap-x-3 gap-y-1">
              <span className="text-4xl sm:text-5xl font-black text-brand-light tabular-nums">
                {t.offerPriceNow}
              </span>
              <span className="text-lg sm:text-xl font-bold text-brand-light/45 line-through tabular-nums">
                {t.offerPriceWas}
              </span>
            </div>
          </div>

          {/* The page's one guarantee, right under the price where a reader
              is actually weighing the risk (ТЗ rewrite §5.5). */}
          <p className="mt-4 text-[13px] font-bold text-brand-light">
            {t.guaranteeLine}
          </p>

          {/* Included list stays nested inside section 1 — it's what the
              ฿9,000 above buys, not a section of its own, so it keeps the
              same muted /35 label weight as the eyebrow above it rather
              than the brighter /45 that opens sections 2 and 3 below
              (ТЗ-5 §3.1: the two need to read as different levels, not two
              labels of the same kind back to back). */}
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
          </div>

          {/* SECTION 2 — the standing subscription (ТЗ-5 §3). A visible
              divider (not just extra margin — §3.1) plus a brighter /45
              eyebrow than the nested includedTitle above mark this as a new
              section, not another line in the setup list. subscriptionEyebrow
              ("Then, every month") is what lets offerPriceMonthly sit at
              the same size as offerPriceNow without reading as orphaned —
              "then" is what tells the reader everything in section 1 was
              one-time. */}
          <div className="mt-7 pt-6 border-t border-white/15">
            <p className="text-[10px] font-black uppercase tracking-wide text-brand-light/45 mb-1.5">
              {t.subscriptionEyebrow}
            </p>
            <p className="text-4xl sm:text-5xl font-black text-brand-light tabular-nums">
              {t.offerPriceMonthly}
            </p>
            <p className="mt-3 text-[12px] font-bold text-brand-light/50">
              {t.subscriptionLine}
            </p>
            <p className="mt-2 text-[12px] font-bold text-brand-light/50">
              {t.subscriptionYearlyLine}
            </p>
          </div>

          {/* SECTION 3 — optional extras (ТЗ-5 §3). Same divider treatment
              as section 2's own opening, so setup → subscription → addons
              reads as three obligations of decreasing weight (required,
              required, optional) rather than one list with two gaps in it.
              Prices lifted to the section's primary text colour — these
              are the numbers a reader is here for, and used to run as dim
              as the labels beside them (ТЗ rewrite §5.7). */}
          <div className="mt-7 pt-6 border-t border-white/15">
            <p className="text-[10px] font-black uppercase tracking-wide text-brand-light/45 mb-2">
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
        </section>

        {/* Matched to the price section's own box (ТЗ-2 axis rewrite §2,
            per-conversation follow-up): same max-w-prose cap, same lg:mx-0
            left-flush switch, so the same continuous left margin runs
            through the FAQ too. FaqSection's own `px-2` (0.5rem = 8px) is
            baked into that component already — `lg:pl-6` (1.5rem) tops it
            up to the price section's 32px total (0.5rem base overridden to
            2rem there) rather than doubling a second padding on top of it. */}
        <div className="max-w-prose mx-auto lg:mx-0 lg:pl-6">
          <FaqSection title={t.faqTitle} items={t.faqItems} />
        </div>

        {/* No card around this one. The blocks above are cards because each
            holds an argument; the closing line and its buttons are the page
            speaking in its own voice, and a bordered box around them too
            turned the ask into just another exhibit. This is the page's
            other direct-address moment (with the hero) — centred as one
            block on desktop, headline through price recap, rather than
            the three-axis mix it used to be (headline centred, body left,
            price line centred again — ТЗ axis rewrite §2.3). Mobile is
            unchanged: the section's own default is left, and centring
            only switches on from `sm`. */}
        <section className="max-w-prose mx-auto px-2 pt-4 pb-2 text-left">
          <p className="text-[16px] font-black text-brand-light leading-snug text-balance sm:text-center">
            {t.ctaHeadline}
          </p>
          <p className="mt-2 text-[13px] font-bold text-brand-light/70 leading-relaxed text-balance sm:text-center">
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
