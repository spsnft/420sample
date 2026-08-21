"use client"
import * as React from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { triggerHaptic } from "@/lib/utils"

interface DemoBarProps {
  label: string;
  cta: string;
}

// Marks every storefront-demo page reached from the pitch page's links as
// what it is — sample data on a real product, not a real shop's storefront.
// Sticky so the disclaimer survives a scroll, using the same -mx-4 px-4
// trick the header itself uses to bleed edge-to-edge from inside the page's
// own p-4 gutter. Kept out of kiosk mode (see MenuClient): that view is
// standing in for the real in-store tablet, not for a prospect's preview.
export const DemoBar: React.FC<DemoBarProps> = ({ label, cta }) => (
  <div className="sticky top-0 z-[110] -mx-4 px-4 h-9 flex items-center justify-between gap-3 bg-brand-dark text-brand-light text-[11px] font-bold">
    <p className="truncate">{label}</p>
    <Link
      href="/"
      onClick={() => triggerHaptic('light')}
      className="shrink-0 inline-flex items-center gap-1 uppercase tracking-wide text-brand-secondary hover:text-brand-light transition-colors"
    >
      {cta}
      <ArrowUpRight size={12} />
    </Link>
  </div>
);
