"use client"
import * as React from "react"
import Link from "next/link"
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
import { Reveal } from "@/components/motion/Reveal"
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

export default function HomeClient() {
  const { lang } = useCart();
  const safeLang = (lang || 'en') as Language;
  const t = translations[safeLang] || translations.en;
  const [showConsultModal, setShowConsultModal] = React.useState(false);

  const openConsult = () => {
    triggerHaptic('light');
    setShowConsultModal(true);
  };

  return (
    <div className="relative min-h-screen bg-brand-primary text-brand-light p-4 selection:bg-brand-secondary/30 font-sans overflow-hidden">
      <BotanicalDecor className="absolute -top-10 -right-10 w-40 h-40 sm:w-56 sm:h-56 opacity-[0.14] z-0" />
      <BotanicalDecor className="absolute -bottom-10 -left-10 w-40 h-40 sm:w-56 sm:h-56 opacity-[0.14] rotate-180 z-0" />

      <Header safeLang={safeLang} sticky />

      <main className="max-w-xl lg:max-w-4xl mx-auto space-y-6 relative z-10 pt-3">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
          <Reveal>
            <HeroCard
              onClick={openConsult}
              haptic="light"
              gradient="linear-gradient(135deg, #D4B67F 0%, #A67F3F 100%)"
              watermarkIcon={ShieldCheck}
              watermarkColor={GOLD_DOOR_WATERMARK}
              title={t.heroDoorCertTitle}
              titleClassName="text-brand-primary"
              subtitle={t.heroDoorCertSubtitle}
              subtitleClassName="text-brand-primary/70"
              microCta={t.heroDoorCertMicroCta}
              microCtaClassName="text-brand-primary/60"
              rippleClassName="bg-brand-primary/15"
            />
          </Reveal>

          <Reveal delay={0.08}>
            <HeroCard
              href="/menu"
              haptic="medium"
              gradient="linear-gradient(135deg, #3A543F 0%, #1E3322 100%)"
              watermarkIcon={Leaf}
              watermarkColor={OLIVE_DOOR_WATERMARK}
              title={t.heroDoorMenuTitle}
              titleClassName="text-brand-light"
              subtitle={t.heroDoorMenuSubtitle}
              subtitleClassName="text-brand-light/70"
              microCta={t.heroDoorMenuMicroCta}
              microCtaClassName="text-brand-light/60"
              rippleClassName="bg-white/20"
              nudgeDelay={0.15}
            />
          </Reveal>
        </section>

        <Reveal>
          <section className="py-8 lg:py-14 text-center space-y-3">
            {/* Hardcoded in English across all locales — not translated (see item 7). */}
            <p className="font-serif text-[28px] sm:text-[36px] lg:text-[44px] text-brand-light leading-snug tracking-tight">
              Cannabis. Done properly.
            </p>
            <p className="text-[15px] sm:text-[17px] font-bold text-brand-light/60">
              {t.aboutLead}
            </p>
          </section>
        </Reveal>

        <section className="space-y-4">
          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="gradient-ring rounded-card overflow-hidden">
                <div className="w-full aspect-[16/9] lg:aspect-auto lg:h-full lg:min-h-[224px] rounded-card bg-black/20 border border-dashed border-brand-secondary/25 flex flex-col items-center justify-center gap-2 text-brand-light/30">
                  <ImageIcon size={22} />
                  <span className="text-[10px] font-black uppercase tracking-wide">{t.aboutPhotoLabel}</span>
                </div>
              </div>
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
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-stretch">
            <Reveal delay={0.16}>
              <InfoCard icon={MapPin} label={t.addressLabel} value={siteConfig.address} />
            </Reveal>

            <Reveal delay={0.22}>
              <InfoCard
                icon={Clock}
                label={t.hoursLabel}
                value={<span className="tracking-[0.1em]">{siteConfig.workingHours}</span>}
              />
            </Reveal>

            <Reveal delay={0.28}>
              <InfoCard
                icon={Star}
                label={t.reviewsLabel}
                value={`${siteConfig.trustBadge.rating} · ${siteConfig.trustBadge.reviews}`}
              />
            </Reveal>
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
        <Consultation t={t} onClose={() => setShowConsultModal(false)} />
      )}
    </div>
  );
}
