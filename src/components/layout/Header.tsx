"use client"
import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { useCart } from "@/lib/cart-store"
import { Language } from "@/lib/translations"
import { triggerHaptic } from "@/lib/utils"
import { siteConfig } from "@/config/site"

const LANGUAGES: Language[] = ['en', 'th', 'ru'];

interface HeaderProps {
  safeLang: Language;
  sticky?: boolean;
}

const LanguageDropdown: React.FC<{ safeLang: Language; onSelect: (l: Language) => void }> = ({ safeLang, onSelect }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => { triggerHaptic('light'); setIsOpen(v => !v); }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="h-[26px] pl-3 pr-2 flex items-center gap-1 rounded-full bg-white/5 border border-white/10 font-black text-[10px] uppercase tracking-wide text-brand-light/70 active:scale-90 transition-all"
      >
        {safeLang}
        <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div role="listbox" className="absolute top-full left-0 mt-2 min-w-[64px] rounded-button bg-brand-primary border border-white/10 shadow-2xl overflow-hidden z-20">
          {LANGUAGES.map(l => (
            <button
              key={l}
              role="option"
              aria-selected={safeLang === l}
              onClick={() => { triggerHaptic('light'); onSelect(l); setIsOpen(false); }}
              className={`w-full h-9 px-3 flex items-center justify-center font-black text-[11px] uppercase tracking-wide transition-colors ${
                safeLang === l
                  ? 'bg-brand-secondary text-brand-primary'
                  : 'text-brand-light/70 hover:bg-white/5'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const Header: React.FC<HeaderProps> = ({ safeLang, sticky }) => {
  const { setLang } = useCart();

  return (
    <header
      className={
        sticky
          ? "sticky top-0 z-[100] -mx-4 px-4 py-3 mb-4 bg-brand-primary/90 backdrop-blur-xl border-b border-white/5"
          : "relative z-[100] mb-4"
      }
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image src="/images/logo.svg" priority width={64} height={64} className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0" alt={siteConfig.name} />
            <span className="text-[13px] sm:text-[15px] font-black uppercase tracking-tight text-brand-light whitespace-nowrap">
              {siteConfig.name}
            </span>
          </Link>

          <LanguageDropdown safeLang={safeLang} onSelect={setLang} />
        </div>
      </div>
    </header>
  );
};
