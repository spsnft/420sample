"use client"
import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, LucideIcon } from "lucide-react"
import { triggerHaptic } from "@/lib/utils"

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface HeroCardProps {
  href?: string;
  onClick?: () => void;
  haptic?: "light" | "medium";
  gradient: string;
  /** Optional future-proofing: a real interior/storefront photo. When set, it
   *  renders behind the card with `gradient` as a tinted overlay instead of
   *  being the flat fill — swap this in later without touching the card shell. */
  backgroundImage?: string;
  watermarkIcon: LucideIcon;
  watermarkColor: string;
  /** Small line-art anchor icon, top-left of the card (32-40px, thin stroke). */
  icon: LucideIcon;
  iconClassName: string;
  title: string;
  titleClassName: string;
  subtitle: string;
  subtitleClassName: string;
  microCta: string;
  microCtaClassName: string;
  rippleClassName: string;
  /** Stagger for the one-shot arrow nudge, so both cards don't nudge in lockstep. */
  nudgeDelay?: number;
}

let rippleId = 0;

// Shared shell for the two hero "door" cards — owns the tap-to-click
// affordances (hover brighten, one-shot arrow nudge, mobile ripple) so both
// cards behave identically without duplicating the interaction logic.
export const HeroCard: React.FC<HeroCardProps> = ({
  href,
  onClick,
  haptic = "light",
  gradient,
  backgroundImage,
  watermarkIcon: Watermark,
  watermarkColor,
  icon: Icon,
  iconClassName,
  title,
  titleClassName,
  subtitle,
  subtitleClassName,
  microCta,
  microCtaClassName,
  rippleClassName,
  nudgeDelay = 0,
}) => {
  const [ripples, setRipples] = React.useState<Ripple[]>([]);

  const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const id = rippleId++;
    setRipples((prev) => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
  };

  const removeRipple = (id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  };

  const handleClick = () => {
    triggerHaptic(haptic);
    onClick?.();
  };

  const content = (
    <>
      {backgroundImage && (
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      {/* Tinted fill: the flat gradient when there's no photo yet, or a
          colored overlay on top of `backgroundImage` once one is set. */}
      <div className="absolute inset-0" style={{ background: gradient, opacity: backgroundImage ? 0.82 : 1 }} />

      <Watermark
        aria-hidden
        className="absolute -bottom-12 -right-12 lg:-bottom-14 lg:-right-14 pointer-events-none"
        style={{ width: 260, height: 260, color: watermarkColor, opacity: 0.12, transform: "rotate(-8deg)" }}
      />
      <div className="absolute inset-0 grain-overlay opacity-[0.04] pointer-events-none" />

      {ripples.map((r) => (
        <motion.span
          key={r.id}
          className={`absolute rounded-full pointer-events-none ${rippleClassName}`}
          style={{ left: r.x, top: r.y, width: 12, height: 12, marginLeft: -6, marginTop: -6 }}
          initial={{ scale: 0, opacity: 0.4 }}
          animate={{ scale: 18, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onAnimationComplete={() => removeRipple(r.id)}
        />
      ))}

      <div className="relative h-full flex flex-col p-5 lg:p-6">
        <Icon aria-hidden className={iconClassName} size={36} strokeWidth={1.5} />

        <div className="flex-1 flex flex-col justify-center gap-1 lg:gap-1.5">
          <h2 className={`font-black uppercase tracking-tight text-2xl lg:text-3xl leading-tight ${titleClassName}`}>
            {title}
          </h2>
          <p className={`text-[12px] font-bold ${subtitleClassName}`}>
            {subtitle}
          </p>
        </div>

        <p className={`flex items-center justify-end gap-1 text-[11px] italic font-semibold ${microCtaClassName}`}>
          {microCta}
          <motion.span
            initial={{ x: 0 }}
            animate={{ x: [0, 3, 0, 3, 0] }}
            transition={{ duration: 1, delay: 0.7 + nudgeDelay, ease: "easeInOut" }}
            className="inline-flex"
          >
            <ChevronRight size={13} strokeWidth={3} />
          </motion.span>
        </p>
      </div>
    </>
  );

  const className =
    "relative w-full h-[170px] lg:h-64 rounded-card overflow-hidden text-left cursor-pointer transition-all duration-200 lg:hover:-translate-y-1 lg:hover:scale-[1.02] lg:hover:brightness-105 active:scale-[0.98] shadow-2xl";

  if (href) {
    return (
      <Link href={href} onClick={handleClick} onPointerDown={handlePointerDown} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={handleClick} onPointerDown={handlePointerDown} className={className}>
      {content}
    </button>
  );
};
