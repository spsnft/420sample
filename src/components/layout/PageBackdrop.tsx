import type { ReactNode } from "react"

// Shared full-bleed chrome for staff surfaces: flat bg-brand-primary fill to
// match the storefront demo and the pitch page (both cover the body's own
// gradient/noise the same way). No corner watermark here (see /staff ТЗ
// Part C): a decorative leaf floating over a counter clerk's data reads as
// a showroom flourish, not a working tool, and the eye discards it as noise
// a hundred times a shift. The brand's leaf motif stays only in the header,
// on the store logo, where it doesn't sit over anything.
// No overflow-hidden: it was only ever clipping the watermarks removed
// above, and left on its own it breaks position:sticky for children like
// DemoBar (a sticky element sticks to its nearest ancestor scroll
// container, and this div — non-scrolling itself — was wrongly claiming
// that role instead of the viewport).
export function PageBackdrop({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-brand-primary text-brand-light font-sans">
      <div className="relative z-10">{children}</div>
    </div>
  );
}
