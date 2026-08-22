"use client"
import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  MapPin, Clock, ShieldCheck, Star, Instagram, ArrowUpRight,
  Image as ImageIcon, Leaf, type LucideIcon,
} from "lucide-react"

import { useCart } from "@/lib/cart-store"
import { translations, Language } from "@/lib/translations"
import { Header } from "@/components/layout/Header"
import { DemoBar } from "@/components/layout/DemoBar"
import { LineIcon, WhatsAppIcon } from "@/components/icons/BrandIcons"
import { Consultation } from "@/components/modals"
import { HeroCard } from "@/components/cards/HeroCard"
import { Tooltip } from "@/components/ui/Tooltip"
import { siteConfig } from "@/config/site"
import { triggerHaptic } from "@/lib/utils"

// DemoBar's fixed height (h-9, 36px) — passed to Header so the two sticky
// bars stack instead of both landing on top:0 and overlapping.
const DEMO_BAR_HEIGHT = 36;

// "\n" in a translation string marks the line break a card title renders as
// a <br/> (see lib/translations.ts).
function renderLines(text: string): React.ReactNode {
  return text.split("\n").map((line, i) => (
    <React.Fragment key={i}>
      {i > 0 && <br />}
      {line}
    </React.Fragment>
  ));
}

// Darker-than-panel flat tones for the oversized watermark icons — one tone
// down from each door's own gradient, not white/accent-gold.
const GOLD_DOOR_WATERMARK = "#8B6A38";
const OLIVE_DOOR_WATERMARK = "#142117";

// The shop's own photograph, beside the map — the two together are the whole
// answer to "is this a real place, and where".
//
// It falls back to the dashed placeholder if the file is not there, which is
// deliberate rather than defensive: it means the photo can be dropped into
// public/images/about/ at any time, by anyone, with no code change and no
// deploy of ours — the page picks it up on its own. Same pattern the product
// cards use for a missing product image. Shoot it roughly 16:9 and at least
// 1400px wide; next/image takes care of the format and the sizes it serves.
//
// Either extension works, tried in order. A photograph naturally saves as
// either, and "drop the file in and it appears" is not much of a promise if it
// only holds for one of the two names — this cost one line and removes the
// only way left to get it wrong.
const STOREFRONT_PHOTOS = [
  "/images/about/storefront.png",
  "/images/about/storefront.jpg",
];

const StorefrontPhoto: React.FC<{ label: string; alt: string }> = ({ label, alt }) => {
  const [attempt, setAttempt] = React.useState(0);
  const src = STOREFRONT_PHOTOS[attempt];

  return (
    <div className="relative surface rounded-card overflow-hidden">
      <div className="relative w-full aspect-[16/9] lg:aspect-auto lg:h-full lg:min-h-[224px] rounded-card overflow-hidden bg-black/20">
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 512px, 100vw"
            onError={() => setAttempt(a => a + 1)}
          />
        ) : (
          <div className="absolute inset-0 border border-dashed border-brand-secondary/25 rounded-card flex flex-col items-center justify-center gap-2 text-brand-light/30">
            <ImageIcon size={22} />
            <span className="text-[10px] font-black uppercase tracking-wide">{label}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Stands in for the live Google Maps embed the map block used to be. That
// embed was the one white rectangle on an otherwise dark page — on mobile it
// weighed visually more than the storefront photo beside it, the wrong way
// round for a page selling "look at our shop" (audit ТЗ pitch-layout №6).
//
// The classic no-API-key iframe embed (`maps.google.com/maps?...&output=
// embed`, what this used to be) doesn't take a `styles` param — dark-theme
// Maps embeds need either the JS Maps API or the Static Maps API, and this
// project has no Google Maps API key or billing set up for either. Rather
// than guess at standing that up, this swaps the live embed for a static,
// palette-matched graphic (schematic streets, a pin) with a real "Open in
// Maps" link over it — the option the ТЗ itself names as the fallback.
const StorefrontMap: React.FC<{ addressLabel: string; openLabel: string; href: string }> = ({ addressLabel, openLabel, href }) => (
  <div className="relative surface rounded-card overflow-hidden">
    <div className="relative w-full aspect-[16/9] lg:aspect-auto lg:h-full lg:min-h-[224px] rounded-card overflow-hidden bg-[#14171a]">
      <svg
        aria-hidden
        viewBox="0 0 400 225"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full opacity-[0.35]"
      >
        <line x1="0" y1="55" x2="400" y2="55" stroke="#C89E58" strokeWidth="1" />
        <line x1="0" y1="140" x2="400" y2="140" stroke="#C89E58" strokeWidth="1" />
        <line x1="90" y1="0" x2="90" y2="225" stroke="#C89E58" strokeWidth="1" />
        <line x1="260" y1="0" x2="260" y2="225" stroke="#C89E58" strokeWidth="1" />
        <line x1="0" y1="0" x2="400" y2="225" stroke="#3A543F" strokeWidth="1" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-6">
        <div className="w-9 h-9 rounded-full bg-brand-secondary/20 border border-brand-secondary/50 flex items-center justify-center text-brand-secondary">
          <MapPin size={18} />
        </div>
        <p className="text-[11px] font-bold text-brand-light/50 leading-snug">{addressLabel}</p>
      </div>
      <Link
        href={href}
        target="_blank"
        rel="noopener"
        onClick={() => triggerHaptic('light')}
        className="absolute bottom-3 right-3 inline-flex items-center gap-1 h-8 pl-3 pr-2.5 rounded-full bg-brand-dark/85 border border-white/10 text-[11px] font-black uppercase tracking-wide text-brand-light/80 hover:text-brand-light active:scale-95 transition-all"
      >
        {openLabel}
        <ArrowUpRight size={12} />
      </Link>
    </div>
  </div>
);

// One row of the collapsed info strip below — icon, then label, then value,
// all on one line at a fixed 56px height (h-14) rather than the label
// stacked over the value the old, much taller InfoCard used. The icon
// circle shrinks to match (28px, was 36px).
const InfoRow: React.FC<{ icon: LucideIcon; label: string; value: React.ReactNode }> = ({ icon: Icon, label, value }) => (
  <div className="h-14 px-2.5 flex items-center gap-1.5">
    <div className="w-6 h-6 rounded-full border border-brand-secondary/30 bg-brand-secondary/15 flex items-center justify-center text-brand-secondary shrink-0">
      <Icon size={12} />
    </div>
    <span className="text-[10px] font-black uppercase text-brand-light/40 shrink-0">{label}</span>
    <span className="text-[13px] font-bold text-brand-light truncate">{value}</span>
  </div>
);

export default function HomeClient({ demoInstance = false }: { demoInstance?: boolean }) {
  const { lang } = useCart();
  const safeLang = (lang || 'en') as Language;
  const t = translations[safeLang] || translations.en;
  const [showConsultModal, setShowConsultModal] = React.useState(false);

  const openConsult = () => {
    triggerHaptic('light');
    setShowConsultModal(true);
  };

  // Stable identity: the dialog's focus trap keys off this callback, and a new
  // function on every render would re-run it — pulling focus back to the top of
  // the form mid-sentence.
  const closeConsult = React.useCallback(() => setShowConsultModal(false), []);

  return (
    // No fill of its own: an opaque brand-primary here covered the site's
    // backdrop, which is why the atmosphere used to exist on /menu alone.
    // The corner leaf watermarks this page used to carry here (top-right,
    // bottom-left) are gone — the same "cheap cannabis site" stamp /staff
    // already dropped its own copies of, for the same reason (audit ТЗ
    // pitch-layout №8). The backdrop's own ambient gradient is untouched.
    <div className="relative min-h-screen text-brand-light p-4 selection:bg-brand-secondary/30 font-sans">
      <DemoBar label={t.demoBarLabel} cta={t.demoBarCta} />
      <Header safeLang={safeLang} sticky stickyOffset={DEMO_BAR_HEIGHT} demoInstance={demoInstance} />

      <main className="max-w-xl lg:max-w-4xl mx-auto space-y-6 relative z-10 pt-3">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
          <HeroCard
            onClick={openConsult}
            haptic="light"
            gradient="linear-gradient(135deg, #D4B67F 0%, #A67F3F 100%)"
            watermarkIcon={ShieldCheck}
            watermarkColor={GOLD_DOOR_WATERMARK}
            title={renderLines(t.heroDoorCertTitle)}
            titleClassName="text-brand-primary"
            tagline={t.heroDoorCertLine}
            taglineClassName="text-brand-primary/60"
            rippleClassName="bg-brand-primary/15"
          />

          <HeroCard
            href="/menu"
            haptic="medium"
            gradient="linear-gradient(135deg, #3A543F 0%, #1E3322 100%)"
            watermarkIcon={Leaf}
            watermarkColor={OLIVE_DOOR_WATERMARK}
            title={renderLines(t.heroDoorMenuTitle)}
            titleClassName="text-brand-light"
            tagline={t.heroDoorMenuLine}
            taglineClassName="text-brand-light/60"
            rippleClassName="bg-white/20"
            nudgeDelay={0.15}
          />
        </section>

        <section className="py-8 lg:py-14 text-center space-y-3">
          {/* Hardcoded in English across all locales — not translated (see item 7). */}
          <p className="font-serif text-[28px] sm:text-[36px] lg:text-[44px] text-brand-light leading-snug tracking-tight">
            Flowers. Done properly.
          </p>
          <p className="text-[15px] sm:text-[17px] font-bold text-brand-light/60">
            {t.aboutLead}
          </p>
        </section>

        <section className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <StorefrontPhoto label={t.aboutPhotoLabel} alt={siteConfig.name} />
            <StorefrontMap addressLabel={siteConfig.address} openLabel={t.mapOpenCta} href={siteConfig.mapOpenUrl} />
          </div>

          {/* One collapsed strip instead of three ~150px cards — each used
              to carry a single line of text in that much height, which on
              mobile stacked into ~450px of mostly empty screen (audit ТЗ
              pitch-layout №7). Reviews keeps the same tap-for-tooltip
              treatment as the contacts row below (ТЗ №2.2) since it's still
              not wired to a real Google listing on this demo. */}
          <div className="surface rounded-card divide-y divide-white/10">
            <InfoRow
              icon={MapPin}
              label={t.addressLabel}
              value={
                <>
                  <span className="sm:hidden">{siteConfig.addressShort}</span>
                  <span className="hidden sm:inline">{siteConfig.address}</span>
                </>
              }
            />
            <InfoRow
              icon={Clock}
              label={t.hoursLabel}
              value={<span className="tracking-[0.1em]">{siteConfig.workingHours}</span>}
            />
            <Tooltip text={t.reviewsTooltip} className="w-full">
              <button type="button" className="w-full text-left">
                <InfoRow icon={Star} label={t.reviewsLabel} value={`${siteConfig.trustBadge.rating} · ${siteConfig.trustBadge.reviews}`} />
              </button>
            </Tooltip>
          </div>
        </section>

        <section>
          <p className="text-[11px] font-black uppercase tracking-wide text-brand-light/40 mb-3 text-center">
            {t.contactsTitle}
          </p>
          {/* Icon-only, unlike the pitch page's WhatsApp/LINE buttons —
              these carry no visible label of their own, so aria-label is
              their only accessible name, not a dedup of one that's also
              visible. A visually-hidden span backs it up in case
              aria-label ever gets dropped in a future edit (ТЗ №2,
              "Вернуть aria-label иконкам контактов" — this must stay
              scoped to icon-only links; the pitch page's icon+text
              buttons keep the dedup from M5).

              Plain buttons, not links — there's no real destination on this
              demo instance (see config/site.ts, contacts) — wrapped in one
              shared Tooltip so a tap anywhere in the row answers once for
              the whole group instead of needing its own popup per icon
              (audit ТЗ pitch-layout №2.1). */}
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
              <div className="surface rounded-button">
                <button type="button" aria-label="Instagram" className="w-[46px] h-[46px] flex items-center justify-center rounded-button active:scale-90 transition-all">
                  <Instagram size={20} className="opacity-80" />
                  <span className="sr-only">Instagram</span>
                </button>
              </div>
            </div>
          </Tooltip>
        </section>

        <div className="pb-6 text-center">
          <p className="text-[10px] text-brand-light/30 leading-relaxed">{t.footerDisclaimer[0]}</p>
          <p className="text-[10px] text-brand-light/30 leading-relaxed">{t.footerDisclaimer[1]}</p>
        </div>
      </main>

      {showConsultModal && (
        <Consultation t={t} onClose={closeConsult} demoInstance={demoInstance} />
      )}
    </div>
  );
}
