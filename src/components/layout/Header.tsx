"use client"
import * as React from "react"
import Image from "next/image"
import { useCart } from "@/lib/cart-store"
import { Language } from "@/lib/translations"
import { triggerHaptic } from "@/lib/utils"
import { siteConfig } from "@/config/site"

const LANGUAGES: Language[] = ['en', 'th', 'ru'];

interface HeaderProps {
  safeLang: Language;
}

export const Header: React.FC<HeaderProps> = ({ safeLang }) => {
  const { setLang } = useCart();

  return (
    <header className="max-w-5xl mx-auto relative z-[100] mb-4">
      <div className="flex items-center justify-between gap-3 px-1">
        <Image src="/images/logo.svg" priority width={64} height={64} className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0" alt={siteConfig.name} />

        <div className="flex items-center gap-0.5 p-1 rounded-full bg-white/5 border border-white/10 shrink-0">
          {LANGUAGES.map(l => (
            <button
              key={l}
              onClick={() => { triggerHaptic('light'); setLang(l); }}
              className={`h-[26px] px-3 flex items-center justify-center rounded-full font-black text-[10px] uppercase tracking-wide transition-all active:scale-90 ${
                safeLang === l
                  ? 'bg-brand-secondary text-brand-primary'
                  : 'text-brand-light/50'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
