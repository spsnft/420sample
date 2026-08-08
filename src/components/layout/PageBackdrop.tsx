import type { ReactNode } from "react"
import { BotanicalDecor } from "@/components/decor/BotanicalDecor"

// Shared full-bleed chrome for staff surfaces: the body's own gradient/noise
// (see globals.css) supplies the base fill, this layers the corner watermark
// accents consistently so pages under /staff don't each re-declare them.
export function PageBackdrop({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen text-brand-light font-sans overflow-hidden">
      <BotanicalDecor className="pointer-events-none fixed -top-10 -right-10 w-40 h-40 sm:w-56 sm:h-56 opacity-[0.14] z-[105]" />
      <BotanicalDecor className="pointer-events-none fixed -bottom-10 -left-10 w-40 h-40 sm:w-56 sm:h-56 opacity-[0.14] rotate-180 z-0" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
