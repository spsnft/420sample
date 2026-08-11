"use client"
import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { useCart } from "@/lib/cart-store"
import { Language } from "@/lib/translations"
import { SiteNav, SiteNavProps } from "@/components/layout/SiteNav"
import { triggerHaptic } from "@/lib/utils"
import { siteConfig } from "@/config/site"

const LANGUAGES: Language[] = ['en', 'th', 'ru'];

interface HeaderProps {
  safeLang: Language;
  sticky?: boolean;
  // Kiosk tablets get the header without it: the shop's own screen is meant to
  // stay on the menu, and "for business" is not an offer to make to a customer
  // standing at that shop's counter.
  hideNav?: boolean;
  /** Passed through to SiteNav — see its note on the partners host. */
  surface?: SiteNavProps['surface'];
  // Optional sub-line tucked under the wordmark, used by /partners to attribute
  // the build ("by FT.Agency"). It renders *outside* the home Link — it is a
  // link of its own, and an anchor cannot nest inside another anchor — so the
  // wordmark and the logo are two separate links to "/" rather than one.
  byline?: React.ReactNode;
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

export const Header: React.FC<HeaderProps> = ({ safeLang, sticky, byline, hideNav, surface }) => {
  const { setLang } = useCart();

  // The language lives in a persisted client store, so the server cannot render
  // the right `lang` — it always ships "en". Left alone, a Russian or Thai page
  // is announced by a screen reader in an English voice and offered for
  // translation from the wrong language. Kept here because this is where the
  // switcher lives, so every page carrying the header gets it.
  React.useEffect(() => {
    document.documentElement.lang = safeLang;
  }, [safeLang]);

  // On partners.buds.digital "/" is rewritten straight back to the pitch page,
  // so the wordmark was a link that did nothing. Named in full it goes where it
  // says it goes — and in a new tab, like every other route off this page.
  const onPartners = surface === 'partners';
  const homeHref = onPartners ? siteConfig.url : "/";
  const homeLinkProps = onPartners ? { target: "_blank", rel: "noopener" } : {};

  return (
    <header
      className={
        // Fully opaque (not translucent) so decorative background elements —
        // e.g. the hero corner leaf — tuck cleanly under the header instead
        // of showing a blurred, uneven smear at the seam.
        sticky
          ? "sticky top-0 z-[100] -mx-4 px-4 py-3 mb-4 bg-brand-primary border-b border-white/5"
          : "relative z-[100] mb-4"
      }
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0 shrink-0">
          <Link href={homeHref} {...homeLinkProps} className="shrink-0" aria-label={siteConfig.name}>
            <Image src="/images/logo.svg" priority width={64} height={64} className="w-auto h-8 sm:h-9 md:h-10 object-contain shrink-0" alt={siteConfig.name} />
          </Link>
          <div className="min-w-0">
            <Link
              href={homeHref}
              {...homeLinkProps}
              className="block text-[18px] sm:text-[21px] font-black uppercase tracking-wide text-brand-light whitespace-nowrap"
            >
              {siteConfig.name}
            </Link>
            {byline}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <LanguageDropdown safeLang={safeLang} onSelect={setLang} />
          {!hideNav && <SiteNav safeLang={safeLang} surface={surface} />}
        </div>
      </div>
    </header>
  );
};
