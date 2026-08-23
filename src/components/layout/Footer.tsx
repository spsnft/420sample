import * as React from "react"
import Link from "next/link"
import { siteConfig } from "@/config/site"

interface FooterProps {
  privacyLabel: string;
}

// Minimal closing chrome for the pitch page: who's behind it, in the legal-
// footer sense, and the one link every page collecting a phone number
// needs. The phone number itself (ТЗ rewrite §8) is the cheapest proof a
// prospect has that anyone is actually on the other end — nothing else on
// the page lets them check the agency is real before they message it.
//
// "FT.Agency" here links out to the same portfolio as the header byline —
// the agency's only two credits on the page now that the standalone trust
// block above the pricing section is gone (ТЗ rewrite §5.1/checklist).
export const Footer: React.FC<FooterProps> = ({ privacyLabel }) => (
  <footer className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] font-bold text-brand-light/40">
    <span>
      &copy; {new Date().getFullYear()}{" "}
      <Link
        href={siteConfig.partners.agencyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-brand-light/70 transition-colors"
      >
        FT.Agency
      </Link>
      {" "}— Wichit, Phuket
    </span>
    <a href="tel:+66650255229" className="hover:text-brand-light/70 transition-colors">
      +66 65 025 5229
    </a>
    <Link href="/privacy" className="hover:text-brand-light/70 transition-colors">
      {privacyLabel}
    </Link>
  </footer>
);
