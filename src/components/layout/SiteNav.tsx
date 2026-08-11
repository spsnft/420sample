"use client"
import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Home, Leaf, ShieldCheck, ArrowUpRight } from "lucide-react"

import { translations, Language } from "@/lib/translations"
import { triggerHaptic } from "@/lib/utils"
import { siteConfig } from "@/config/site"
import { CONSULT_EVENT, CONSULT_HREF } from "@/lib/consult-link"

// The site is three surfaces — the home page, the menu, and the B2B pitch —
// and until now the only route between them was the wordmark, which goes home
// and nowhere else. A customer who opened /menu from a QR code on the counter
// had no way to reach the medical certificate form at all: it lives in a modal
// behind one of the home page's hero cards, a scroll and a page away.
//
// A row of text links doesn't fit: at 375px the header already carries the
// wordmark and the language chip, and three more words would either wrap or
// squeeze the logo. So the destinations live behind one chip the same size and
// shape as the language one, which is a pattern the header already teaches.
//
// The certificate is a modal on the home page rather than a route; how it is
// linked, and why it takes both a hash and an event, is written up in
// lib/consult-link.

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  /** Opens in a new tab — every link does once the panel is on another host. */
  external?: boolean;
  /** The B2B entry: under a rule and dimmer than the rest. It is addressed to
   *  one visitor in a hundred, and a customer looking for the menu should not
   *  have to read past an offer to sell them a website. */
  aside?: boolean;
}

export interface SiteNavProps {
  safeLang: Language;
  /** Which host the header is being served on. The pitch page lives at
   *  partners.buds.digital, where a relative "/" is rewritten straight back to
   *  itself (see middleware) — so from there every consumer destination has to
   *  be named by its full address, and "for business" is dropped: it is the
   *  page you are standing on. */
  surface?: 'site' | 'partners';
}

export const SiteNav: React.FC<SiteNavProps> = ({ safeLang, surface = 'site' }) => {
  const t = translations[safeLang] || translations.en;
  const pathname = usePathname();
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

  // A tap on the destination you are already on still closes the panel, and on
  // /#consult there is no route change to close it for us.
  React.useEffect(() => { setIsOpen(false); }, [pathname]);

  const onPartners = surface === 'partners';
  const at = (path: string) => (onPartners ? `${siteConfig.url}${path}` : path);

  const items: NavItem[] = [
    { href: at("/"), label: t.navHome, icon: Home, external: onPartners },
    { href: at("/menu"), label: t.menuTitle, icon: Leaf, external: onPartners },
    { href: at(CONSULT_HREF), label: t.navCertificate, icon: ShieldCheck, external: onPartners },
    ...(onPartners
      ? []
      : [{ href: siteConfig.partners.url, label: t.navBusiness, icon: ArrowUpRight, external: true, aside: true }]),
  ];

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => { triggerHaptic('light'); setIsOpen(v => !v); }}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={t.navLabel}
        className="h-[26px] w-[26px] flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-brand-light/70 active:scale-90 transition-all"
      >
        {isOpen ? <X size={13} /> : <Menu size={13} />}
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label={t.navLabel}
          className="absolute top-full right-0 mt-2 w-60 rounded-button bg-brand-primary border border-white/10 shadow-2xl overflow-hidden z-20 py-1"
        >
          {items.map(({ href, label, icon: Icon, external, aside }) => {
            // "/#consult" is the home page too, but it is a different errand
            // from "take me home" — only the plain route claims the mark.
            const isCurrent = !external && href === pathname;

            return (
              <React.Fragment key={href}>
                {aside && <span aria-hidden className="block my-1 h-px bg-white/10" />}
                <Link
                  href={href}
                  role="menuitem"
                  aria-current={isCurrent ? "page" : undefined}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  onClick={() => {
                    triggerHaptic('light');
                    setIsOpen(false);
                    // Harmless from another page — nothing is listening there,
                    // and the hash takes over once the home page mounts.
                    if (href === CONSULT_HREF) window.dispatchEvent(new Event(CONSULT_EVENT));
                  }}
                  className={`flex items-center gap-2.5 px-3 h-10 text-[12px] font-black uppercase tracking-wide transition-colors ${
                    isCurrent
                      ? 'text-brand-secondary bg-brand-secondary/10'
                      : aside
                        ? 'text-brand-light/40 hover:text-brand-light/70 hover:bg-white/5'
                        : 'text-brand-light/70 hover:text-brand-light hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} className="shrink-0" />
                  {label}
                </Link>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};
