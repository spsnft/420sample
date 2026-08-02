"use client"
import * as React from "react"
import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { useCart } from "@/lib/cart-store"
import { translations, Language } from "@/lib/translations"
import { siteConfig } from "@/config/site"
import { triggerHaptic } from "@/lib/utils"

const rimButton = "bg-white/5 border border-transparent [border-image:linear-gradient(135deg,rgba(200,158,88,0.3),rgba(255,255,255,0.05))_1]";

interface HeaderProps {
  safeLang: Language;
  isLangMenuOpen: boolean;
  setIsLangMenuOpen: (v: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  safeLang,
  isLangMenuOpen,
  setIsLangMenuOpen,
}) => {
  const { setLang } = useCart();
  const t = translations[safeLang] || translations.en;

  return (
    <header className="max-w-5xl mx-auto relative z-[100] mb-6">
      <div className="flex items-center justify-between gap-3 px-1 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <Image src="/images/logo.svg" priority width={72} height={72} className="w-14 h-14 sm:w-16 sm:h-16 object-contain relative z-10 shrink-0" alt={siteConfig.name} />
          <div className="flex flex-col min-w-0">
            <span className="text-[12px] sm:text-[14px] font-black uppercase tracking-tight text-brand-light leading-tight">
              {siteConfig.name}
            </span>
            <span className="text-[11px] sm:text-[11px] font-extrabold uppercase tracking-wide text-brand-secondary leading-snug">
              {t.heroTagline}
            </span>
          </div>
        </div>

        <div className="relative shrink-0">
          <button
            onClick={() => { triggerHaptic('light'); setIsLangMenuOpen(!isLangMenuOpen); }}
            className={`h-[42px] px-3 flex items-center justify-center rounded-button ${rimButton} font-black text-[11px] text-brand-secondary active:scale-90 transition-all gap-1 shadow-lg`}
          >
            {safeLang.toUpperCase()}
            <ChevronDown size={14} className={`transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isLangMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsLangMenuOpen(false)} />
              <div className="absolute top-[calc(100%+8px)] right-0 w-36 bg-brand-primary border border-white/10 rounded-button shadow-2xl z-50 flex flex-col p-1.5 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                {[
                  { id: 'en', label: 'English', flag: '🇬🇧' },
                  { id: 'ru', label: 'Русский', flag: '🇷🇺' },
                  { id: 'th', label: 'ภาษาไทย', flag: '🇹🇭' }
                ].map(l => (
                  <button
                    key={l.id}
                    onClick={() => {
                      triggerHaptic('success');
                      setLang(l.id as Language);
                      setIsLangMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-3 py-2.5 text-[11px] font-black uppercase rounded-badge transition-all ${safeLang === l.id ? 'bg-brand-secondary/20 text-brand-secondary' : 'text-brand-light/70 hover:bg-white/5 hover:text-brand-light'}`}
                  >
                    <span className="text-[14px]">{l.flag}</span> {l.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
