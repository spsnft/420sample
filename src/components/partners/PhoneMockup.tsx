"use client"
import * as React from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"

// Single mockup engine for both pitch blocks (ТЗ-3 rewrite §1/§2): the old
// split — a tilted phone for the storefront, a browser window with
// synthetic chrome for the staff panel — is gone. /staff has no real wide
// layout of its own; a browser frame around a narrow column of content
// proved the opposite of "this works on a big screen." A phone is honest
// either way, and block 01's own copy already says "from any device behind
// the counter." Desktop and mobile no longer differ in construction either
// — the same corpus, just a bigger scale at `lg` (see desktopWidthPx).
//
// Mask, not crop: the corpus is real iPhone proportions (390×844) at every
// size, screen content inserted at its own native aspect with no
// stretching, and only the *top* of that 844-tall body is ever revealed —
// the rest bleeds off past the block, standard hero-mockup trick. Two
// numbers control what's actually visible: fadeStartPx (crisp above this)
// and transparentPx (invisible below this), both expressed in the same
// 390-wide reference frame as the corpus itself.
//
// The mask sits on the OUTER window — the div that also clips the corpus's
// excess height — not on the frame or the content alone, so corpus, border
// and shadow all dissolve together as one object instead of the frame
// staying opaque while only the screen fades (the bug this replaces: the
// content faded on schedule, the black frame kept going at full opacity
// and then hard-stopped at its own edge, reading as a hole rather than a
// vanishing point). Critically, `containerHPx` — the window's own total
// height — runs past `transparentPx` with real margin (see each call
// site's own comment for the numbers): if the window's own bottom edge
// were the same point where the gradient hits zero, antialiasing at that
// coincidence reintroduces a thin visible seam. The buffer is the fix, not
// the percentages.
interface PhoneMockupProps {
  src: string;
  alt: string;
  imgWidth: number;
  imgHeight: number;
  /** 0 for the staff panel (dense text, read straight-on), -5 for the storefront (two cards, tilt reads as product photography — ТЗ-3 §2.2). */
  rotateDeg?: number;
  /** Content above this (390-wide reference px) renders fully opaque. */
  fadeStartPx: number;
  /** Content below this is fully invisible — must clear anything that must never surface (ТЗ-3 §4: PREVIOUS PRESCRIPTIONS / EXPIRED). */
  transparentPx: number;
  /** Total masked window height — must exceed transparentPx with buffer room; see file comment. */
  containerHPx: number;
  /** Rendered corpus width at `lg` and up — sized so containerHPx maps to ~520–560px on screen (ТЗ-3 §2.4). Different per mockup since the two have very different containerHPx. */
  desktopWidthPx: number;
  mobileWidthPx?: number;
  sizes?: string;
}

export function PhoneMockup({
  src, alt, imgWidth, imgHeight, rotateDeg = 0,
  fadeStartPx, transparentPx, containerHPx,
  desktopWidthPx, mobileWidthPx = 300,
  sizes = "(min-width: 1024px) 500px, 300px",
}: PhoneMockupProps) {
  const frameRef = React.useRef<HTMLDivElement>(null);
  const entered = useInView(frameRef, { once: true, amount: 0.4 });

  const startPct = (fadeStartPx / containerHPx) * 100;
  const transparentPct = (transparentPx / containerHPx) * 100;
  const maskImage = `linear-gradient(to bottom, black 0%, black ${startPct}%, transparent ${transparentPct}%)`;

  return (
    <div
      className="mx-auto w-full max-w-[var(--mock-mobile-w)] lg:max-w-[var(--mock-desktop-w)]"
      style={{
        ["--mock-mobile-w" as string]: `${mobileWidthPx}px`,
        ["--mock-desktop-w" as string]: `${desktopWidthPx}px`,
        transform: rotateDeg ? `rotate(${rotateDeg}deg)` : undefined,
      }}
    >
      <div
        className="relative overflow-hidden rounded-[2.4rem]"
        style={{
          aspectRatio: `390 / ${containerHPx}`,
          WebkitMaskImage: maskImage,
          maskImage,
        }}
      >
        <div
          ref={frameRef}
          className="absolute inset-x-0 top-0 rounded-[2.4rem] p-2 bg-black border border-white/10"
          style={{ boxShadow: "0 22px 38px rgba(0,0,0,0.55)" }}
        >
          <div className="relative rounded-[1.8rem] overflow-hidden">
            <Image
              src={src}
              alt={alt}
              width={imgWidth}
              height={imgHeight}
              className="w-full h-auto block"
              sizes={sizes}
              priority
            />
            <motion.div
              aria-hidden
              initial={{ x: "-220%" }}
              animate={entered ? { x: "220%" } : { x: "-220%" }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeInOut" }}
              className="pointer-events-none absolute left-1/2 h-[220%] w-1/3"
              style={{
                top: "-20%",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
                rotate: 20,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
