"use client"
import * as React from "react"
import Link from "next/link"
import {
  MapPin, Clock, ShieldCheck, Star, Instagram, ArrowRight,
  Image as ImageIcon, Stethoscope, BadgeCheck, Leaf, Droplet, Cookie, Package,
} from "lucide-react"

import { useCart } from "@/lib/cart-store"
import { translations, Language } from "@/lib/translations"
import { Header } from "@/components/layout/Header"
import { LineIcon, WhatsAppIcon } from "@/components/icons/BrandIcons"
import { BotanicalDecor } from "@/components/decor/BotanicalDecor"
import { ConsultationRequestForm } from "@/components/forms/ConsultationRequestForm"
import { siteConfig } from "@/config/site"
import { triggerHaptic } from "@/lib/utils"

const MENU_CATEGORIES = [
  { icon: Leaf, label: "Buds" },
  { icon: Droplet, label: "Extracts" },
  { icon: Cookie, label: "Edibles" },
  { icon: Package, label: "Joints" },
];

export default function HomeClient() {
  const { lang } = useCart();
  const safeLang = (lang || 'en') as Language;
  const t = translations[safeLang] || translations.en;
  const [showConsultForm, setShowConsultForm] = React.useState(false);

  return (
    <div className="relative min-h-screen bg-brand-primary text-brand-light p-4 selection:bg-brand-secondary/30 font-sans overflow-hidden">
      <BotanicalDecor className="absolute -top-8 -right-10 w-40 h-40 sm:w-56 sm:h-56 opacity-[0.14] z-0" />
      <BotanicalDecor className="absolute -bottom-10 -left-10 w-40 h-40 sm:w-56 sm:h-56 opacity-[0.14] rotate-180 z-0" />

      <Header safeLang={safeLang} />

      <main className="max-w-xl lg:max-w-4xl mx-auto space-y-6 relative z-10">
        <section className="text-center py-3">
          <p className="text-[12px] font-extrabold uppercase tracking-wide text-brand-secondary">
            {t.heroTagline}
          </p>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-4 mb-4">
            {[
              { icon: MapPin, text: t.medSteps[0] },
              { icon: Stethoscope, text: t.medSteps[1] },
              { icon: BadgeCheck, text: t.medSteps[2] },
            ].map((step, i) => (
              <div key={i} className="gradient-ring rounded-button">
                <div className="p-3 rounded-button bg-black/20 h-full flex items-center gap-3 lg:flex-col lg:text-center lg:gap-2">
                  <div className="w-9 h-9 rounded-full bg-brand-secondary/15 border border-brand-secondary/30 flex items-center justify-center text-brand-secondary shrink-0">
                    <step.icon size={16} />
                  </div>
                  <p className="text-[12px] font-bold text-brand-light/80 leading-snug">{step.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-5">
            {t.medPills.map((pill, i) => (
              <span key={i} className="h-7 px-3 inline-flex items-center rounded-full bg-brand-secondary/15 border border-brand-secondary/30 text-[11px] font-black uppercase tracking-wide text-brand-secondary">
                {pill}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Link
              href="/menu"
              onClick={() => triggerHaptic('medium')}
              className="flex-1 h-14 btn-metal font-black uppercase tracking-widest text-[13px] rounded-button active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl"
            >
              {t.viewMenuCta}
              <ArrowRight size={18} />
            </Link>
            <button
              type="button"
              onClick={() => { triggerHaptic('light'); setShowConsultForm(v => !v); }}
              className="h-14 px-4 rounded-button border border-brand-secondary/30 text-brand-secondary font-bold uppercase tracking-wide text-[11px] active:scale-95 transition-all hover:bg-brand-secondary/10"
            >
              {t.consultCta}
            </button>
          </div>

          {showConsultForm && (
            <div className="mt-5 pt-5 border-t border-white/10">
              <ConsultationRequestForm t={t} />
            </div>
          )}
        </section>

        <div className="gradient-ring rounded-card">
          <section className="p-5 lg:p-6 rounded-card bg-white/5">
            <h2 className="text-base font-black uppercase tracking-tight text-brand-light mb-4 text-center lg:text-left">
              {t.menuTeaserTitle}
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
              {MENU_CATEGORIES.map((cat) => (
                <div key={cat.label} className="gradient-ring rounded-button">
                  <div className="p-4 rounded-button bg-black/20 flex flex-col items-center gap-2 text-center">
                    <div className="w-10 h-10 rounded-full bg-brand-secondary/15 border border-brand-secondary/30 flex items-center justify-center text-brand-secondary">
                      <cat.icon size={18} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-wide text-brand-light/80">{cat.label}</span>
                  </div>
                </div>
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
          <div className="gradient-ring rounded-card">
            <div className="p-4 rounded-card bg-white/5 flex items-start gap-3">
              <div className="w-9 h-9 rounded-card bg-brand-secondary/10 border border-brand-secondary/30 flex items-center justify-center text-brand-secondary shrink-0">
                <MapPin size={16} />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-wide text-brand-light/40 mb-0.5">{t.addressLabel}</p>
                <p className="text-[13px] font-bold text-brand-light leading-snug">{siteConfig.address}</p>
              </div>
            </div>
          </div>

          <div className="gradient-ring rounded-card">
            <div className="p-4 rounded-card bg-white/5 flex items-start gap-3">
              <div className="w-9 h-9 rounded-card bg-brand-secondary/10 border border-brand-secondary/30 flex items-center justify-center text-brand-secondary shrink-0">
                <Clock size={16} />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-wide text-brand-light/40 mb-0.5">{t.hoursLabel}</p>
                <p className="text-[13px] font-bold text-brand-light leading-snug tracking-[0.1em]">{siteConfig.workingHours}</p>
              </div>
            </div>
          </div>

          <div className="gradient-ring rounded-card">
            <div className="p-4 rounded-card bg-white/5 flex items-start gap-3">
              <div className="w-9 h-9 rounded-card bg-brand-secondary/10 border border-brand-secondary/30 flex items-center justify-center text-brand-secondary shrink-0">
                <Star size={16} />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-wide text-brand-light/40 mb-0.5">{t.reviewsLabel}</p>
                <p className="text-[13px] font-bold text-brand-light leading-snug">
                  {siteConfig.trustBadge.rating} · {siteConfig.trustBadge.reviews}
                </p>
              </div>
            </div>
          </div>
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
    </div>
  );
}
