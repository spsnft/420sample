"use client"
import * as React from "react"
import Link from "next/link"
import {
  MapPin, Clock, ShieldCheck, Star, Instagram,
  Image as ImageIcon, Leaf, Cigarette, Package,
} from "lucide-react"

import { useCart } from "@/lib/cart-store"
import { translations, Language } from "@/lib/translations"
import { Header } from "@/components/layout/Header"
import { LineIcon, WhatsAppIcon } from "@/components/icons/BrandIcons"
import { BotanicalDecor } from "@/components/decor/BotanicalDecor"
import { Consultation } from "@/components/modals"
import { Reveal } from "@/components/motion/Reveal"
import { siteConfig } from "@/config/site"
import { triggerHaptic } from "@/lib/utils"

export default function HomeClient() {
  const { lang } = useCart();
  const safeLang = (lang || 'en') as Language;
  const t = translations[safeLang] || translations.en;
  const [showConsultModal, setShowConsultModal] = React.useState(false);
  const [consultOrigin, setConsultOrigin] = React.useState<{ x: number; y: number } | null>(null);

  const openConsult = (e: React.MouseEvent) => {
    triggerHaptic('light');
    setConsultOrigin({ x: e.clientX, y: e.clientY });
    setShowConsultModal(true);
  };

  const MENU_CATEGORIES = [
    { icon: Leaf, label: "Flowers" },
    { icon: Cigarette, label: "Joints" },
    { icon: Package, label: t.accessories },
  ];

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
              className="w-full h-[170px] lg:h-64 rounded-card overflow-hidden text-left p-5 lg:p-6 flex flex-col justify-end transition-transform duration-200 lg:hover:-translate-y-1 lg:hover:scale-[1.02] active:scale-[0.98] shadow-2xl"
              style={{ background: "linear-gradient(135deg, #D4B67F 0%, #A67F3F 100%)" }}
            >
              <ShieldCheck size={26} className="text-brand-primary/60 mb-2" />
              <h2 className="text-brand-primary font-black uppercase tracking-tight text-xl lg:text-2xl leading-tight">
                {t.heroDoorCertTitle}
              </h2>
              <p className="text-brand-primary/70 text-[12px] font-bold mt-1">
                {t.heroDoorCertSubtitle}
              </p>
            </button>
          </Reveal>

          <Reveal delay={0.08}>
            <div
              className="w-full h-[170px] lg:h-64 rounded-card overflow-hidden shadow-2xl flex flex-col"
              style={{ background: "linear-gradient(135deg, #3A543F 0%, #1E3322 100%)" }}
            >
              <Link
                href="/menu"
                onClick={() => triggerHaptic('medium')}
                className="flex-1 min-h-0 text-left p-5 lg:p-6 pb-2 flex flex-col justify-end"
              >
                <Leaf size={26} className="text-brand-light/60 mb-2" />
                <h2 className="text-brand-light font-black uppercase tracking-tight text-xl lg:text-2xl leading-tight">
                  {t.heroDoorMenuTitle}
                </h2>
                <p className="text-brand-light/70 text-[12px] font-bold mt-1">
                  {t.heroDoorMenuSubtitle}
                </p>
              </Link>

              <div className="flex gap-2 px-5 lg:px-6 pb-5 lg:pb-6 pt-1">
                {MENU_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.label}
                    href="/menu"
                    onClick={() => triggerHaptic('light')}
                    className="h-7 px-3 inline-flex items-center gap-1.5 rounded-full bg-black/25 border border-brand-light/20 text-[10px] font-black uppercase tracking-wide text-brand-light/80 active:scale-90 transition-all hover:bg-black/40"
                  >
                    <cat.icon size={12} />
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        <Reveal>
          <section className="py-8 lg:py-14 text-center">
            <p className="font-serif text-[28px] sm:text-[36px] lg:text-[44px] text-brand-light leading-snug tracking-tight">
              {t.pullQuote}
            </p>
          </section>
        </Reveal>

        <section className="space-y-4">
          <Reveal>
            <p className="text-center lg:text-left text-[15px] sm:text-[17px] font-bold text-brand-light/80 leading-snug px-1">
              {t.aboutLead}
            </p>
          </Reveal>

          <Reveal delay={0.08}>
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
            <Reveal delay={0.16} className="gradient-ring rounded-card">
              <div className="p-4 rounded-card bg-white/5 flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-secondary/15 border border-brand-secondary/30 flex items-center justify-center text-brand-secondary shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-wide text-brand-light/40 mb-0.5">{t.addressLabel}</p>
                  <p className="text-[13px] font-bold text-brand-light leading-snug">{siteConfig.address}</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.22} className="gradient-ring rounded-card">
              <div className="p-4 rounded-card bg-white/5 flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-secondary/15 border border-brand-secondary/30 flex items-center justify-center text-brand-secondary shrink-0">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-wide text-brand-light/40 mb-0.5">{t.hoursLabel}</p>
                  <p className="text-[13px] font-bold text-brand-light leading-snug tracking-[0.1em]">{siteConfig.workingHours}</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.28} className="gradient-ring rounded-card">
              <div className="p-4 rounded-card bg-white/5 flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-secondary/15 border border-brand-secondary/30 flex items-center justify-center text-brand-secondary shrink-0">
                  <Star size={16} />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-wide text-brand-light/40 mb-0.5">{t.reviewsLabel}</p>
                  <p className="text-[13px] font-bold text-brand-light leading-snug">
                    {siteConfig.trustBadge.rating} · {siteConfig.trustBadge.reviews}
                  </p>
                </div>
              </div>
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
        <Consultation t={t} origin={consultOrigin} onClose={() => setShowConsultModal(false)} />
      )}
    </div>
  );
}
