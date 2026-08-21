"use client"
import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Globe, Leaf, ClipboardCheck, ArrowUpRight } from "lucide-react"

import { translations, Language } from "@/lib/translations"
import { triggerHaptic } from "@/lib/utils"
import { siteConfig } from "@/config/site"

// The product is three surfaces — the shop's public site, the staff panel the
// med-card checks are run from, and the pitch page for other shop owners — and
// until now the only route between any of them was the wordmark, which goes
// home and nowhere else. Land on /menu from the QR code on the counter and that
// was the whole of it.
//
// A row of text links doesn't fit: at 375px the header already carries the
// wordmark and the language chip, and three more words would either wrap or
// squeeze the logo. So the destinations live behind one chip the same size and
// shape as the language one, which is a pattern the header already teaches.
//
// A rule separates what a customer came for — the site and the menu — from the
// two surfaces the shop's operators use. Both halves are full-strength: this
// deployment is a showcase, and the panel is as much a part of what is being
// shown as the menu is.

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  /** Opens in a new tab — every link does once the panel is on another host. */
  external?: boolean;
  /** Draws the rule above this entry: everything below it is for the people
   *  running the shop, not for the person standing in it. */
  dividerAbove?: boolean;
}

export interface SiteNavProps {
  safeLang: Language;
  /** Which host the header is being served on. The pitch page lives at
   *  buds.digital's apex, where a relative "/" is rewritten straight back to
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
    { href: at("/"), label: t.navSite, icon: Globe, external: onPartners },
    { href: at("/menu"), label: t.menuTitle, icon: Leaf, external: onPartners },
    { href: at("/staff"), label: t.navStaff, icon: ClipboardCheck, external: onPartners, dividerAbove: true },
    // Dropped on the pitch page itself — it is the page you are standing on.
    ...(onPartners
      ? []
      : [{ href: siteConfig.partners.url, label: t.navBusiness, icon: ArrowUpRight, external: true }]),
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
          {items.map(({ href, label, icon: Icon, external, dividerAbove }) => {
            const isCurrent = !external && href === pathname;

            return (
              <React.Fragment key={href}>
                {dividerAbove && <span aria-hidden className="block my-1 h-px bg-white/10" />}
                <Link
                  href={href}
                  role="menuitem"
                  aria-current={isCurrent ? "page" : undefined}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  onClick={() => { triggerHaptic('light'); setIsOpen(false); }}
                  className={`flex items-center gap-2.5 px-3 h-10 text-[12px] font-black uppercase tracking-wide transition-colors ${
                    isCurrent
                      ? 'text-brand-secondary bg-brand-secondary/10'
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
