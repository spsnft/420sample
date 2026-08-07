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
import { siteConfig } from "@/config/site"
import { triggerHaptic } from "@/lib/utils"

// Darker-than-panel flat tones for the oversized watermark icons — one tone
// down from each door's own gradient, not white/accent-gold.
const GOLD_DOOR_WATERMARK = "#8B6A38";
const OLIVE_DOOR_WATERMARK = "#142117";

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
      <BotanicalDecor className="absolute -top-8 -right-10 w-40 h-40 sm:w-56 sm:h-56 opacity-[0.14] z-0" />
      <BotanicalDecor className="absolute -bottom-10 -left-10 w-40 h-40 sm:w-56 sm:h-56 opacity-[0.14] rotate-180 z-0" />

      <Header safeLang={safeLang} sticky />

      <main className="max-w-xl lg:max-w-4xl mx-auto space-y-6 relative z-10 pt-3">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
          <Reveal>
            <button
              type="button"
              onClick={openConsult}
              className="relative w-full h-[170px] lg:h-64 rounded-card overflow-hidden text-left p-5 lg:p-6 flex flex-col justify-end transition-transform duration-200 lg:hover:-translate-y-1 lg:hover:scale-[1.02] active:scale-[0.98] shadow-2xl"
              style={{ background: "linear-gradient(135deg, #D4B67F 0%, #A67F3F 100%)" }}
            >
              <ShieldCheck
                aria-hidden
                className="absolute -bottom-8 -right-8 lg:-bottom-10 lg:-right-10 pointer-events-none"
                style={{ width: 220, height: 220, color: GOLD_DOOR_WATERMARK, opacity: 0.08, transform: "rotate(-8deg)" }}
              />
              <div className="absolute inset-0 grain-overlay opacity-[0.04] pointer-events-none" />

              <div className="relative w-[52px] h-[52px] rounded-full bg-brand-primary/10 border border-brand-primary/25 flex items-center justify-center text-brand-primary/70 mb-3 shrink-0">
                <ShieldCheck size={24} />
              </div>
              <h2 className="relative text-brand-primary font-black uppercase tracking-tight text-xl lg:text-2xl leading-tight">
                {t.heroDoorCertTitle}
              </h2>
              <p className="relative text-brand-primary/70 text-[12px] font-bold mt-1">
                {t.heroDoorCertSubtitle}
              </p>
            </button>
          </Reveal>

          <Reveal delay={0.08}>
            <Link
              href="/menu"
              onClick={() => triggerHaptic('medium')}
              className="relative w-full h-[170px] lg:h-64 rounded-card overflow-hidden text-left p-5 lg:p-6 flex flex-col justify-end transition-transform duration-200 lg:hover:-translate-y-1 lg:hover:scale-[1.02] active:scale-[0.98] shadow-2xl"
              style={{ background: "linear-gradient(135deg, #3A543F 0%, #1E3322 100%)" }}
            >
              <Leaf
                aria-hidden
                className="absolute -bottom-8 -right-8 lg:-bottom-10 lg:-right-10 pointer-events-none"
                style={{ width: 220, height: 220, color: OLIVE_DOOR_WATERMARK, opacity: 0.08, transform: "rotate(-8deg)" }}
              />
              <div className="absolute inset-0 grain-overlay opacity-[0.04] pointer-events-none" />

              <div className="relative w-[52px] h-[52px] rounded-full bg-brand-light/10 border border-brand-light/25 flex items-center justify-center text-brand-light/80 mb-3 shrink-0">
                <Leaf size={24} />
              </div>
              <h2 className="relative text-brand-light font-black uppercase tracking-tight text-xl lg:text-2xl leading-tight">
                {t.heroDoorMenuTitle}
              </h2>
              <p className="relative text-brand-light/70 text-[12px] font-bold mt-1">
                {t.heroDoorMenuSubtitle}
              </p>
            </Link>
          </Reveal>
        </section>

        <Reveal>
          <section className="py-8 lg:py-14 text-center space-y-3">
            <p className="font-serif text-[28px] sm:text-[36px] lg:text-[44px] text-brand-light leading-snug tracking-tight">
              {t.pullQuote}
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
                  src={siteConfig.mapEmbedSrc}
                  className="w-full h-56 lg:h-full lg:min-h-[224px] border-0 block"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t.addressLabel}
                />
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
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
