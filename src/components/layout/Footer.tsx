import * as React from "react"
import Link from "next/link"

interface FooterProps {
  privacyLabel: string;
}

// Minimal closing chrome for the pitch page: who's behind it, in the legal-
// footer sense (not the trust block above, which is the sales case for it),
// and the one link every page collecting a phone number needs.
export const Footer: React.FC<FooterProps> = ({ privacyLabel }) => (
  <footer className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] font-bold text-brand-light/40">
    <span>&copy; {new Date().getFullYear()} FT Agency</span>
    <Link href="/privacy" className="hover:text-brand-light/70 transition-colors">
      {privacyLabel}
    </Link>
  </footer>
);
