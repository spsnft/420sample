"use client"
import * as React from "react"

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  className?: string;
}

// Tap-driven info bubble for controls that look interactive but currently
// have nowhere real to go (demo contact icons, the Reviews tile) — the
// element stays fully active and clickable, it just answers with an
// explanation instead of navigating. Hover isn't the trigger: a phone,
// the primary way this demo gets browsed, has no hover to fire it.
//
// One instance covers everything inside `children` — a click anywhere in
// there (including on more than one nested trigger, e.g. three contact
// icons) bubbles up to the wrapping div below and opens the same bubble,
// which is what lets a single Tooltip stand in for a whole icon row
// instead of one per icon.
export function Tooltip({ text, children, className = "" }: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const show = () => {
    setOpen(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setOpen(false), 4000);
  };

  React.useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  React.useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div onClick={show}>{children}</div>
      {open && (
        <div
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30 w-56 max-w-[80vw] px-3 py-2 rounded-button bg-brand-dark/95 border border-white/10 shadow-2xl text-[11px] font-bold text-brand-light/70 text-center leading-snug pointer-events-none"
        >
          {text}
        </div>
      )}
    </div>
  );
}
