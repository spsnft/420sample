"use client"
import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  MapPin, Clock, ShieldCheck, Star, Instagram,
  Image as ImageIcon, Leaf,
} from "lucide-react"

import { useCart } from "@/lib/cart-store"
import { translations, Language } from "@/lib/translations"
import { Header } from "@/components/layout/Header"
import { LineIcon, WhatsAppIcon } from "@/components/icons/BrandIcons"
import { BotanicalDecor } from "@/components/decor/BotanicalDecor"
import { Consultation } from "@/components/modals"
import { InfoCard } from "@/components/cards/InfoCard"
import { HeroCard } from "@/components/cards/HeroCard"
import { siteConfig } from "@/config/site"
import { triggerHaptic } from "@/lib/utils"

// Darker-than-panel flat tones for the oversized watermark icons — one tone
// down from each door's own gradient, not white/accent-gold.
const GOLD_DOOR_WATERMARK = "#8B6A38";
const OLIVE_DOOR_WATERMARK = "#142117";

// Google's classic maps iframe embed (no API key) takes `hl`, not the
// `language` param used by the newer /maps/embed/v1/ endpoint — same idea,
// different query key. `en`/`th`/`ru` map 1:1 to our Language type.
function localizedMapSrc(src: string, lang: Language) {
  return `${src}&hl=${lang}`;
}

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
    <div className="gradient-ring rounded-card overflow-hidden">
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

export default function HomeClient() {
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
    <>
      {/* Rendered outside the overflow-hidden hero container (and above the
          sticky header's z-[100]) so the corner leaf isn't clipped at the
          header seam; fixed so its on-screen position matches the old
          absolute placement without a containing block to escape. */}
      <BotanicalDecor className="fixed -top-10 -right-10 w-40 h-40 sm:w-56 sm:h-56 opacity-[0.14] z-[105]" />

      {/* No fill of its own: an opaque brand-primary here covered the site's
          backdrop, which is why the atmosphere used to exist on /menu alone. */}
      <div className="relative min-h-screen text-brand-light p-4 selection:bg-brand-secondary/30 font-sans overflow-hidden">
        <BotanicalDecor className="absolute -bottom-10 -left-10 w-40 h-40 sm:w-56 sm:h-56 opacity-[0.14] rotate-180 z-0" />

        <Header safeLang={safeLang} sticky />

        <main className="max-w-xl lg:max-w-4xl mx-auto space-y-6 relative z-10 pt-3">
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
            <HeroCard
              onClick={openConsult}
              haptic="light"
              gradient="linear-gradient(135deg, #D4B67F 0%, #A67F3F 100%)"
              watermarkIcon={ShieldCheck}
              watermarkColor={GOLD_DOOR_WATERMARK}
              title={<>GET MEDICAL<br />CERTIFICATE</>}
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
              title={<>EXPLORE THE<br />TODAY&apos;S MENU</>}
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
              <div className="gradient-ring rounded-card overflow-hidden">
                <iframe
                  src={localizedMapSrc(siteConfig.mapEmbedSrc, safeLang)}
                  className="w-full h-56 lg:h-full lg:min-h-[224px] border-0 block"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t.addressLabel}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-stretch">
              <InfoCard icon={MapPin} label={t.addressLabel} value={siteConfig.address} />

              <InfoCard
                icon={Clock}
                label={t.hoursLabel}
                value={<span className="tracking-[0.1em]">{siteConfig.workingHours}</span>}
              />

              <InfoCard
                icon={Star}
                label={t.reviewsLabel}
                value={`${siteConfig.trustBadge.rating} · ${siteConfig.trustBadge.reviews}`}
              />
            </div>
          </section>

          <section>
            <p className="text-[11px] font-black uppercase tracking-wide text-brand-light/40 mb-3 text-center">
              {t.contactsTitle}
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="gradient-ring rounded-button shadow-lg">
                <Link href={siteConfig.contacts.line} target="_blank" aria-label="LINE" className="w-[46px] h-[46px] flex items-center justify-center rounded-button bg-white/5 active:scale-90 transition-all">
                  <LineIcon size={20} className="opacity-80" />
                </Link>
              </div>
              <div className="gradient-ring rounded-button shadow-lg">
                <Link href={siteConfig.contacts.whatsapp} target="_blank" aria-label="WhatsApp" className="w-[46px] h-[46px] flex items-center justify-center rounded-button bg-white/5 active:scale-90 transition-all">
                  <WhatsAppIcon size={20} className="opacity-80" />
                </Link>
              </div>
              <div className="gradient-ring rounded-button shadow-lg">
                <Link href={siteConfig.contacts.instagram} target="_blank" aria-label="Instagram" className="w-[46px] h-[46px] flex items-center justify-center rounded-button bg-white/5 active:scale-90 transition-all">
                  <Instagram size={20} className="opacity-80" />
                </Link>
              </div>
            </div>
          </section>

          <div className="pb-6 text-center">
            <p className="text-[10px] text-brand-light/30 leading-relaxed">{t.footerDisclaimer[0]}</p>
            <p className="text-[10px] text-brand-light/30 leading-relaxed">{t.footerDisclaimer[1]}</p>
          </div>
        </main>

        {showConsultModal && (
          <Consultation t={t} onClose={closeConsult} />
        )}
      </div>
    </>
  );
}
