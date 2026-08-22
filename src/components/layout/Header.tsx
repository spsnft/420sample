"use client"
import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/cart-store"
import { Language, translations } from "@/lib/translations"
import { SiteNav, SiteNavProps } from "@/components/layout/SiteNav"
import { triggerHaptic } from "@/lib/utils"
import { useStuck } from "@/lib/use-stuck"
import { siteConfig } from "@/config/site"

// Every language the dictionary actually has, not a hand-maintained list
// that can quietly drift out of sync with it — see LanguageSwitch below.
const LANGUAGES = Object.keys(translations) as Language[];

interface HeaderProps {
  safeLang: Language;
  sticky?: boolean;
  // Kiosk tablets get the header without it: the shop's own screen is meant to
  // stay on the menu, and "for business" is not an offer to make to a customer
  // standing at that shop's counter.
  hideNav?: boolean;
  /** Passed through to SiteNav — see its note on the pitch surface. */
  surface?: SiteNavProps['surface'];
  /** buds.digital's own demo instance only (see lib/demo.ts) — sends the
   *  storefront logo/wordmark back to the pitch page instead of to this
   *  store's own homepage. Never set on a real client instance, where the
   *  logo should stay on the store's own site. */
  demoInstance?: boolean;
  /** Pixels the sticky header should sit below the viewport's top edge —
   *  set when a DemoBar (see components/layout/DemoBar) is pinned above it,
   *  so the two stack instead of both landing on top:0 and overlapping. */
  stickyOffset?: number;
  // Optional sub-line tucked under the wordmark, used by the pitch page ("/")
  // to attribute the build ("by FT.Agency"). It renders *outside* the home Link — it is a
  // link of its own, and an anchor cannot nest inside another anchor — so the
  // wordmark and the logo are two separate links to "/" rather than one.
  byline?: React.ReactNode;
}

// All supported languages sit in the control at once (EN / RU / TH) instead
// of hiding behind a dropdown that only ever shows the current one — a
// visitor who doesn't already know the site has three languages had no way
// to discover that without opening it first. Switching is one tap: no
// open/close state, no listbox, no outside-click or Escape handling to wire
// up, since there's nothing left to open.
const LanguageSwitch: React.FC<{ safeLang: Language; onSelect: (l: Language) => void }> = ({ safeLang, onSelect }) => (
  <div role="group" aria-label="Language" className="h-[26px] flex items-center rounded-full bg-white/5 border border-white/10 overflow-hidden shrink-0">
    {LANGUAGES.map(l => (
      <button
        key={l}
        type="button"
        aria-pressed={safeLang === l}
        onClick={() => { triggerHaptic('light'); onSelect(l); }}
        className={`h-full px-2.5 flex items-center justify-center font-black text-[10px] uppercase tracking-wide transition-colors ${
          safeLang === l
            ? 'bg-brand-secondary text-brand-primary'
            : 'text-brand-light/50 hover:text-brand-light/80'
        }`}
      >
        {l}
      </button>
    ))}
  </div>
);

export const Header: React.FC<HeaderProps> = ({ safeLang, sticky, byline, hideNav, surface, stickyOffset, demoInstance }) => {
  const { setLang } = useCart();

  // The language lives in a persisted client store, so the server cannot render
  // the right `lang` — it always ships "en". Left alone, a Russian or Thai page
  // is announced by a screen reader in an English voice and offered for
  // translation from the wrong language. Kept here because this is where the
  // switcher lives, so every page carrying the header gets it.
  React.useEffect(() => {
    document.documentElement.lang = safeLang;
  }, [safeLang]);

  // Pitch and storefront demo are two routes on the same host now (see
  // middleware.ts), so "home" is just whichever root belongs to the surface
  // the header is rendered on — no more host branching, no new tab. On the
  // buds.digital demo instance the storefront's own "home" is overridden to
  // send visitors back to the pitch instead: that's the one place a demo
  // visitor can otherwise get stuck, since the sticky DemoBar's return link
  // is easy to miss. A real client instance never sets demoInstance, so its
  // logo keeps pointing at its own storefront.
  const onPartners = surface === 'partners';
  const homeHref = onPartners || demoInstance ? "/" : "/demo";
  // The pitch page's own wordmark, not the demo shop's name — "YOUR STORE" is
  // the placeholder the demo and its mockups show, buds.digital is the product.
  const wordmark = onPartners ? "buds.digital" : siteConfig.name;

  // Same rule as the catalogue bar: a sticky bar earns its fill by having
  // something to hide. At the top of the page there is nothing under it, and a
  // fill there is just a dark band ruled across a lit wall — brand-primary is
  // darker than the backdrop it sits on, so the more solid the bar, the more it
  // reads as a hole rather than as a header. It stays clear until the page
  // moves, then frosts over.
  const { ref: sentinelRef, stuck } = useStuck();

  const header = (
    <header
      style={sticky && stickyOffset ? { top: stickyOffset } : undefined}
      className={
        // Both variants carry the same vertical padding. Without it the
        // wordmark sat 12px higher on /menu than on /, and the whole page with
        // it — so moving between the two, which is the main path through the
        // site, nudged the header up and down for no reason a reader could see.
        sticky
          ? `sticky top-0 z-[100] -mx-4 px-4 py-3 mb-4 border-b transition-colors duration-200 ${
              stuck
                ? "bg-brand-primary/80 backdrop-blur-xl border-white/5"
                : "border-transparent"
            }`
          : "relative z-[100] py-3 mb-4"
      }
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0 shrink-0">
          <Link href={homeHref} className="shrink-0" aria-label={wordmark}>
            <Image src="/images/logo.svg" priority width={64} height={64} className="w-auto h-8 sm:h-9 md:h-10 object-contain shrink-0" alt={wordmark} />
          </Link>
          <div className="min-w-0">
            <Link
              href={homeHref}
              className="block text-[18px] sm:text-[21px] font-black uppercase tracking-wide text-brand-light whitespace-nowrap"
            >
              {wordmark}
            </Link>
            {byline}
          </div>
        </div>

        <div className="flex items-center gap-2 min-w-0">
          <LanguageSwitch safeLang={safeLang} onSelect={setLang} />
          {!hideNav && <SiteNav safeLang={safeLang} surface={surface} />}
        </div>
      </div>
    </header>
  );

  // The marker only has a job on the page that sticks its header.
  if (!sticky) return header;

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="h-px" />
      {header}
    </>
  );
};
