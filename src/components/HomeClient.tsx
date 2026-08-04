"use client"
import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Clock, ShieldCheck, Star, Instagram, ArrowRight, Image as ImageIcon } from "lucide-react"

import { useCart } from "@/lib/cart-store"
import { translations, Language } from "@/lib/translations"
import { Header } from "@/components/layout/Header"
import { LineIcon, WhatsAppIcon } from "@/components/icons/BrandIcons"
import { siteConfig } from "@/config/site"
import { triggerHaptic } from "@/lib/utils"

const rimBorder = "border border-transparent [border-image:linear-gradient(135deg,rgba(200,158,88,0.3),rgba(255,255,255,0.05))_1]";

export default function HomeClient() {
  const { lang } = useCart();
  const safeLang = (lang || 'en') as Language;
  const t = translations[safeLang] || translations.en;

  return (
    <div className="min-h-screen bg-brand-primary text-brand-light p-4 selection:bg-brand-secondary/30 font-sans">
      <Header safeLang={safeLang} />

      <main className="max-w-xl mx-auto space-y-6">
        <section className="flex flex-col items-center text-center py-6">
          <Image src="/images/logo.svg" priority width={96} height={96} className="w-20 h-20 object-contain mb-4" alt={siteConfig.name} />
          <h1 className="text-2xl font-black uppercase tracking-tight text-brand-light leading-tight">
            {siteConfig.name}
          </h1>
          <p className="text-[13px] font-extrabold uppercase tracking-wide text-brand-secondary mt-1">
            {t.heroTagline}
          </p>

          <div className={`mt-4 h-9 px-4 inline-flex items-center gap-1.5 rounded-full bg-white/5 ${rimBorder} shadow-lg`}>
            <Star size={13} className="text-brand-secondary fill-brand-secondary" />
            <span className="text-[12px] font-black text-brand-light">{siteConfig.trustBadge.rating}</span>
            <span className="text-[12px] text-brand-light/40">·</span>
            <span className="text-[12px] font-bold text-brand-light/70">{siteConfig.trustBadge.reviews}</span>
          </div>
        </section>

        <section className={`p-5 rounded-card bg-white/5 ${rimBorder} shadow-xl`}>
          <div className="w-full aspect-[16/9] rounded-card bg-black/20 border border-dashed border-brand-secondary/25 flex flex-col items-center justify-center gap-2 mb-4 text-brand-light/30">
            <ImageIcon size={22} />
            <span className="text-[10px] font-black uppercase tracking-wide">{t.aboutPhotoLabel}</span>
          </div>
          <h2 className="text-base font-black uppercase tracking-tight text-brand-light mb-2">
            {t.aboutTitle}
          </h2>
          <p className="text-[13px] text-brand-light/70 leading-relaxed">
            {t.aboutDesc}
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className={`p-4 rounded-card bg-white/5 ${rimBorder} flex items-start gap-3`}>
            <div className="w-9 h-9 rounded-card bg-brand-secondary/10 border border-brand-secondary/30 flex items-center justify-center text-brand-secondary shrink-0">
              <MapPin size={16} />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-wide text-brand-light/40 mb-0.5">{t.addressLabel}</p>
              <p className="text-[13px] font-bold text-brand-light leading-snug">{siteConfig.address}</p>
            </div>
          </div>

          <div className={`p-4 rounded-card bg-white/5 ${rimBorder} flex items-start gap-3`}>
            <div className="w-9 h-9 rounded-card bg-brand-secondary/10 border border-brand-secondary/30 flex items-center justify-center text-brand-secondary shrink-0">
              <Clock size={16} />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-wide text-brand-light/40 mb-0.5">{t.hoursLabel}</p>
              <p className="text-[13px] font-bold text-brand-light leading-snug tracking-[0.1em]">{siteConfig.workingHours}</p>
            </div>
          </div>
        </section>

        <section className={`rounded-card bg-white/5 ${rimBorder} overflow-hidden shadow-xl`}>
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

        <section className="p-5 rounded-card bg-gradient-to-br from-brand-secondary/20 via-black/40 to-black/80 border border-brand-secondary/40 shadow-2xl">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-card bg-brand-secondary/20 border border-brand-secondary/40 flex items-center justify-center text-brand-secondary shrink-0">
              <ShieldCheck size={18} />
            </div>
            <h2 className="text-base font-black uppercase tracking-tight text-brand-light">
              {t.medTitle}
            </h2>
          </div>
          <p className="text-[12px] font-bold uppercase tracking-wide text-brand-light/40 mb-3">
            {t.medSubtitle}
          </p>
          <p className="text-[13px] text-brand-light/70 leading-relaxed">
            {t.medDesc}
          </p>
        </section>

        <Link
          href="/menu"
          onClick={() => triggerHaptic('medium')}
          className="w-full h-14 btn-metal font-black uppercase tracking-widest text-[13px] rounded-button active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl"
        >
          {t.viewMenuCta}
          <ArrowRight size={18} />
        </Link>

        <section>
          <p className="text-[11px] font-black uppercase tracking-wide text-brand-light/40 mb-3 text-center">
            {t.contactsTitle}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href={siteConfig.contacts.line} target="_blank" aria-label="LINE" className={`w-[46px] h-[46px] flex items-center justify-center rounded-button bg-white/5 ${rimBorder} active:scale-90 transition-all shadow-lg`}>
              <LineIcon size={20} className="opacity-80" />
            </Link>
            <Link href={siteConfig.contacts.whatsapp} target="_blank" aria-label="WhatsApp" className={`w-[46px] h-[46px] flex items-center justify-center rounded-button bg-white/5 ${rimBorder} active:scale-90 transition-all shadow-lg`}>
              <WhatsAppIcon size={20} className="opacity-80" />
            </Link>
            <Link href={siteConfig.contacts.instagram} target="_blank" aria-label="Instagram" className={`w-[46px] h-[46px] flex items-center justify-center rounded-button bg-white/5 ${rimBorder} active:scale-90 transition-all shadow-lg`}>
              <Instagram size={20} className="opacity-80" />
            </Link>
          </div>
        </section>

        <p className="text-[10px] text-brand-light/30 leading-relaxed text-center pb-6">
          {t.footerDisclaimer}
        </p>
      </main>
    </div>
  );
}
