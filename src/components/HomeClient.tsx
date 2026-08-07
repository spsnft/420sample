"use client"
import * as React from "react"
import Link from "next/link"
import {
  MapPin, Clock, ShieldCheck, Star, Instagram, ArrowRight,
  Image as ImageIcon, Leaf, Cigarette, Flame,
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

  const openConsult = () => { triggerHaptic('light'); setShowConsultModal(true); };

  const MENU_CATEGORIES = [
    { icon: Leaf, label: "Flowers" },
    { icon: Cigarette, label: "Joints" },
    { icon: Flame, label: t.accessories },
  ];

  return (
    <div className="relative min-h-screen bg-brand-primary text-brand-light p-4 selection:bg-brand-secondary/30 font-sans overflow-hidden">
      <BotanicalDecor className="absolute -top-8 -right-10 w-40 h-40 sm:w-56 sm:h-56 opacity-[0.14] z-0" />
      <BotanicalDecor className="absolute -bottom-10 -left-10 w-40 h-40 sm:w-56 sm:h-56 opacity-[0.14] rotate-180 z-0" />

      <Header safeLang={safeLang} onConsultClick={() => setShowConsultModal(true)} />

      <main className="max-w-xl lg:max-w-4xl mx-auto space-y-6 relative z-10">
        <section className="text-center py-3">
          <p className="text-[12px] font-extrabold uppercase tracking-wide text-brand-secondary">
            {t.heroTagline}
          </p>
        </section>

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
            <Link
              href="/menu"
              onClick={() => triggerHaptic('medium')}
              className="w-full h-[170px] lg:h-64 rounded-card overflow-hidden text-left p-5 lg:p-6 flex flex-col justify-end transition-transform duration-200 lg:hover:-translate-y-1 lg:hover:scale-[1.02] active:scale-[0.98] shadow-2xl"
              style={{ background: "linear-gradient(135deg, #3A543F 0%, #1E3322 100%)" }}
            >
              <Leaf size={26} className="text-brand-light/60 mb-2" />
              <h2 className="text-brand-light font-black uppercase tracking-tight text-xl lg:text-2xl leading-tight">
                {t.heroDoorMenuTitle}
              </h2>
              <p className="text-brand-light/70 text-[12px] font-bold mt-1">
                {t.heroDoorMenuSubtitle}
              </p>
            </Link>
          </Reveal>
        </section>

        <section className="p-5 lg:p-6 rounded-card bg-gradient-to-br from-brand-secondary/20 via-black/40 to-black/80 border border-brand-secondary/40 shadow-2xl">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-card bg-brand-secondary/20 border border-brand-secondary/40 flex items-center justify-center text-brand-secondary shrink-0">
              <ShieldCheck size={18} />
            </div>
            <h2 className="text-base font-black uppercase tracking-tight text-brand-light">
              {t.medTitle}
            </h2>
          </div>

          <div className="mt-5 mb-4">
            {/* Desktop: horizontal stepper, connecting line spans circle centers */}
            <div className="hidden lg:block relative">
              <div className="absolute top-5 left-[16.6%] right-[16.6%] h-px bg-brand-secondary/40" />
              <div className="relative flex">
                {t.medSteps.map((step, i) => (
                  <Reveal key={i} delay={i * 0.12} className="flex-1 flex flex-col items-center text-center gap-2 px-2">
                    <div className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-black text-[13px] bg-brand-secondary text-brand-primary shadow-lg shadow-brand-secondary/20 shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-[12px] font-bold text-brand-light/80 leading-snug">{step}</p>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Mobile: vertical stepper, self-sizing connector */}
            <div className="lg:hidden flex flex-col">
              {t.medSteps.map((step, i) => (
                <Reveal key={i} delay={i * 0.12} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-black text-[13px] bg-brand-secondary text-brand-primary shadow-lg shadow-brand-secondary/20">
                      {i + 1}
                    </div>
                    {i < t.medSteps.length - 1 && (
                      <div className="w-px flex-1 my-1 bg-brand-secondary/30" />
                    )}
                  </div>
                  <p className="text-[12px] font-bold text-brand-light/80 leading-snug pb-5">{step}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-5">
            {t.medPills.map((pill, i) => (
              <span key={i} className="h-7 px-3 inline-flex items-center rounded-full bg-brand-secondary/15 border border-brand-secondary/30 text-[11px] font-black uppercase tracking-wide text-brand-secondary">
                {pill}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={openConsult}
            className="w-full h-14 rounded-button border border-brand-secondary/30 text-brand-secondary font-bold uppercase tracking-wide text-[11px] active:scale-95 transition-all hover:bg-brand-secondary/10"
          >
            {t.consultCta}
          </button>
        </section>

        <div className="gradient-ring rounded-card">
          <section className="p-5 lg:p-6 rounded-card bg-white/5">
            <h2 className="text-base font-black uppercase tracking-tight text-brand-light mb-4 text-center lg:text-left">
              {t.menuTeaserTitle}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-5">
              {MENU_CATEGORIES.map((cat, i) => (
                <Reveal key={cat.label} delay={i * 0.08} className="gradient-ring rounded-button">
                  <div className="p-4 rounded-button bg-black/20 flex flex-col items-center gap-2 text-center transition-transform duration-200 lg:hover:-translate-y-1 lg:hover:scale-[1.03]">
                    <div className="w-10 h-10 rounded-full bg-brand-secondary/15 border border-brand-secondary/30 flex items-center justify-center text-brand-secondary">
                      <cat.icon size={18} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-wide text-brand-light/80">{cat.label}</span>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="gradient-ring rounded-button">
              <Link
                href="/menu"
                onClick={() => triggerHaptic('medium')}
                className="w-full h-12 rounded-button bg-white/5 font-black uppercase tracking-widest text-[12px] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {t.menuTeaserCta}
                <ArrowRight size={16} />
              </Link>
            </div>
          </section>
        </div>

        <Reveal>
          <section className="py-8 lg:py-14 text-center">
            <p className="font-serif text-[28px] sm:text-[36px] lg:text-[44px] text-brand-light leading-snug tracking-tight">
              {t.pullQuote}
            </p>
          </section>
        </Reveal>

        <div className="gradient-ring rounded-card">
          <section className="p-5 rounded-card bg-white/5 shadow-xl">
            <div className="w-full aspect-[16/9] rounded-card bg-black/20 border border-dashed border-brand-secondary/25 flex flex-col items-center justify-center gap-2 mb-4 text-brand-light/30">
              <ImageIcon size={22} />
              <span className="text-[10px] font-black uppercase tracking-wide">{t.aboutPhotoLabel}</span>
            </div>
            <h2 className="text-base font-black uppercase tracking-tight text-brand-light mb-2">
              {t.aboutTitle}
            </h2>
            <div className="space-y-3">
              {t.aboutDesc.map((paragraph, i) => (
                <p key={i} className="text-[13px] text-brand-light/70 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <Reveal className="gradient-ring rounded-card">
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

          <Reveal delay={0.08} className="gradient-ring rounded-card">
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

          <Reveal delay={0.16} className="gradient-ring rounded-card">
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
        </section>

        <div className="gradient-ring rounded-card overflow-hidden shadow-xl">
          <section className="rounded-card bg-white/5 overflow-hidden">
            <div className="w-full aspect-[16/9] bg-black/20 border-b border-dashed border-brand-secondary/25 flex flex-col items-center justify-center gap-2 text-brand-light/30">
              <ImageIcon size={22} />
              <span className="text-[10px] font-black uppercase tracking-wide">{t.facadePhotoLabel}</span>
            </div>
            <iframe
              src={siteConfig.mapEmbedSrc}
              className="w-full h-56 border-0 block"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={t.addressLabel}
            />
          </section>
        </div>

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
