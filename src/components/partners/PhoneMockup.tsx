"use client"
import * as React from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"

// Single mockup engine for both pitch blocks (ТЗ-3 rewrite §1/§2): the old
// split — a tilted phone for the storefront, a browser window with
// synthetic chrome for the staff panel — is gone. A phone is honest either
// way, and block 01's own copy already says "from any device behind the
// counter." Desktop and mobile no longer differ in construction either —
// the same corpus, just a bigger scale at `lg` (see desktopWidthPx).
//
// ТЗ-6 §1: fourth rebuild of the mask, and the first one that isn't
// per-block numbers. Three prior passes (ТЗ-3, ТЗ-4, ТЗ-5) each hand-tuned
// a window height, fade start/end and corner radius per mockup, and each
// fix to one broke the other — two devices built by two different
// mechanisms don't read as a pair. Now there is exactly ONE window, ONE
// mask (WINDOW_H_PX / MASK_IMAGE below, both module-level constants, not
// props) shared by both blocks. The only thing that can differ per call
// site is `translateYPx` — where the phone sits inside that shared window.
//
// The mask sits on the window (the div that also clips the corpus's excess
// height via overflow-hidden), not on the frame or the content alone, so
// corpus, border and shadow dissolve together as one object rather than
// the frame staying opaque while only the screen fades. The fade is 42% of
// the window's own height (58%→100%), long enough to read as the phone
// sinking into the background instead of being sliced off — the ~10% fades
// every prior pass used just produced a soft-edged crop, not a vanishing
// point. The stops are deliberately uneven (dense/near-opaque to 70%, then
// falling faster) — a linear ramp over this distance would grey out the
// bottom half of visible content well before anything needs to hide — do
// not replace these stops with an evenly-spaced ramp.
//
// ТЗ-6 §1.5/§1.8 — calibration method, load-bearing for whoever touches
// this next: measure against the LIVE RENDERED page, never the source
// PNGs' own coordinates. The corpus's fixed 8px frame padding and 2.4rem
// (38.4px, likewise fixed — not width-scaled) corner radius are both
// absolute CSS lengths, so their share of the window shifts with render
// width; a position read off the raw PNG at "assume 390-wide" lands
// somewhere else in the browser. Prior passes' bugs (ТЗ-3's PREVIOUS
// PRESCRIPTIONS ghost, ТЗ-5's rounded "sole") both trace back to
// eyeballing source coordinates instead of sampling the rendered DOM.
// The working method (see scratchpad history, reusable next time): load
// the page in Playwright, temporarily strip the mask
// (`el.style.maskImage = 'none'`) to see raw content, screenshot at high
// deviceScaleFactor, and scan actual pixel rows (via pngjs) for where a
// known feature (a button's fill colour, a line of text's brightness)
// starts and ends — not visual eyeballing of a screenshot, and not the
// source PNG's own row numbers.
//
// ТЗ-6 also moved the actual crop line into the source assets themselves
// (staff-view.png, customer-view.png): PREVIOUS PRESCRIPTIONS is no longer
// present in the file at all (cropped 16 reference px below the buttons,
// sampled-colour padding appended below to reach the corpus length the
// window needs) — "not distinguishable at any opacity" is now true because
// there's nothing there to render, not because a fade curve was tuned
// tightly enough to hide it. Both assets are padded to 775 reference px
// (1550px @2x) content height — comfortably past WINDOW_H_PX (below) either
// way, so the corpus's own bottom always hard-clips before it's painted;
// the exact padding number stopped being load-bearing once ТЗ-7 (next
// comment) made WINDOW_H_PX itself the thing sized around real content.
//
// ТЗ-7: WINDOW_H_PX shrunk from 650 to 533, and the stops below moved with
// it — both recomputed from the same live-render pixel sampling as always
// (see the calibration-method comment above), not eyeballed. The 650
// window was sized loosely around panel's own content; it left storefront,
// whose real content (the two cards) ends ~115 reference px higher than
// panel's buttons do, with a long stretch — measured at ~29% of the window,
// ~190px — of plain corpus below the cards before the fade band even
// started, and a further ~42%/273px fade band on top of that. Because that
// whole span is dark corpus fading toward a dark background, none of it
// reads as motion to the eye — the two together read as one long flat dark
// rectangle under the cards, which is the defect this pass fixes.
//
// WINDOW_H_PX is now sized off STOREFRONT's own content-end (measured live:
// ~363 reference px), not panel's: 20px buffer (content must clear the fade
// band, same §1.5 logic as before) + a 150px fade tail (enough to dissolve
// the frame's fixed 2.4rem/38.4px corner radius and its box-shadow blur
// without reading as an abrupt cut — roughly 4× the radius) = 533. Panel's
// own content (buttons, ending ~478 reference px) no longer fits inside
// that fade-free 0–72% band the way it did at the old window height —
// explicit, accepted trade-off, not an oversight: at H=533 panel's button
// bottom sits at ~90% of the window, which the stops below put at roughly
// 45–50% mask opacity (measured live, not assumed — re-check on the live
// render if this constant moves again). The buttons stay legible — gold
// against near-black still reads as gold, muted, rather than vanishing —
// but they are visibly fainter than before. Storefront's own flat zone
// (content-end to fade-start) shrinks from ~190px to ~20px, and its fade
// tail from ~273px to ~150px, which is the actual fix. If a future pass
// needs panel's buttons back at full opacity, the only lever that doesn't
// reopen storefront's flat zone is separating panel back onto its own
// window height — a real reversal of ТЗ-6's "one shared window" premise,
// not a number to nudge here.
const WINDOW_H_PX = 533;

// Same seven stops power both the true CSS mask (unrotated corpus, below)
// and the overlay fallback (rotated corpus, FADE_OVERLAY_BG further down)
// — see that constant's comment for why two implementations exist for
// what should be one gradient. Stops are NOT the old 58/70/80/89/95
// percentages carried over as-is (they were sized for a 650px window) —
// recomputed at the same relative positions within the new, narrower
// 72–100% fade band (28% wide, vs. the old 42%), which is what keeps the
// curve's character (dense/near-opaque until the band starts, then
// accelerating) rather than just compressing the same numbers.
const MASK_IMAGE = [
  "linear-gradient(to bottom,",
  "#000 0%,",
  "#000 72%,",
  "rgba(0,0,0,0.88) 80%,",
  "rgba(0,0,0,0.62) 87%,",
  "rgba(0,0,0,0.32) 93%,",
  "rgba(0,0,0,0.12) 97%,",
  "transparent 100%)",
].join(" ");

// ТЗ-6 §1: the storefront's -5° tilt exposed a genuine Chromium bug, not a
// tuning problem — extensively isolated (see scratchpad history: a dozen+
// minimal repros, prod build, static DOM/CSS re-serves). `mask-image` on an
// element that (a) sits inside a rotated ancestor and (b) itself needs
// overflow-hidden to clip an oversized child renders the gradient's early
// stops but never finishes fading — the corpus stays substantially opaque
// (~50-60 brightness against a ~20-25 background, measured) right up to
// the hard clip edge, on both dev and prod builds, independent of gradient
// complexity, will-change, layer promotion, or the entrance animation.
// Isolated reproductions of the identical DOM+CSS (including a byte-for-
// byte extraction of the live page's own outerHTML/stylesheets) fade
// correctly — so this is specific to some runtime state of the live page
// that a fresh static parse of the same markup doesn't reproduce, not a
// property anyone can just set differently. Panel (rotateDeg=0) never hits
// this: an un-rotated masked element fades perfectly.
//
// Workaround: skip mask-image entirely for a rotated mockup. Instead
// overflow-hidden still hard-clips the corpus at the window's edge (that
// part is unaffected — confirmed by removing the mask and observing the
// clip boundary lands exactly where the geometry predicts), and a second,
// UN-rotated absolutely-positioned layer painted on top fades from
// transparent to the page's own background colour (brand-primary,
// #161819 — see tailwind.config.ts; sampled against the live card and it
// matches the card's own resting tone in the lower, glow-free portion
// where this fade lives). Same stops as MASK_IMAGE, expressed as opaque
// background-color instead of alpha, since this is compositing over the
// content rather than punching a hole in it — hand-duplicated, not
// generated from one source, so it's the one spot in this file where the
// two constants can silently drift apart: whenever MASK_IMAGE's stops
// move (ТЗ-7 moved them from 58/70/80/89/95 to 72/80/87/93/97), copy the
// same percentages here too, alpha-inverted (mask's 1→0.88→0.62→0.32→0.12→0
// becomes this gradient's 0→0.12→0.38→0.68→0.88→1 at each matching stop).
const FADE_OVERLAY_BG = [
  "linear-gradient(to bottom,",
  "rgba(22,24,25,0) 0%,",
  "rgba(22,24,25,0) 72%,",
  "rgba(22,24,25,0.12) 80%,",
  "rgba(22,24,25,0.38) 87%,",
  "rgba(22,24,25,0.68) 93%,",
  "rgba(22,24,25,0.88) 97%,",
  "rgba(22,24,25,1) 100%)",
].join(" ");

interface PhoneMockupProps {
  src: string;
  alt: string;
  imgWidth: number;
  imgHeight: number;
  /** 0 for the staff panel (dense text, read straight-on), -5 for the storefront (two cards, tilt reads as product photography — ТЗ-3 §2.2). */
  rotateDeg?: number;
  /** The ONLY per-block knob (ТЗ-6 §1.2): vertical offset of the phone within the shared window, in the same 390-wide reference frame as everything else. 0 = phone's own top aligns with the window's top. Both mockups currently use 0 — the source-image crop/pad (see file comment) is what does the positioning work now, not this. Kept as a prop rather than deleted since a future asset with different internal proportions may need it. */
  translateYPx?: number;
  /** Rendered corpus width at `lg` and up. */
  desktopWidthPx: number;
  mobileWidthPx?: number;
  sizes?: string;
}

export function PhoneMockup({
  src, alt, imgWidth, imgHeight, rotateDeg = 0,
  translateYPx = 0,
  desktopWidthPx, mobileWidthPx = 300,
  sizes = "(min-width: 1024px) 500px, 300px",
}: PhoneMockupProps) {
  const frameRef = React.useRef<HTMLDivElement>(null);
  const entered = useInView(frameRef, { once: true, amount: 0.4 });

  // Same trick as --mock-mobile-w/--mock-desktop-w below: translateY needs
  // a different actual-px value at each breakpoint (the 390-wide reference
  // frame maps to a different real width at each), computed here in JS
  // rather than CSS calc() so Tailwind's static analysis can still see a
  // literal `translate-y-[var(--ty-...)]` class string at build time.
  const mobileTY = (mobileWidthPx / 390) * translateYPx;
  const desktopTY = (desktopWidthPx / 390) * translateYPx;

  return (
    <div
      className="relative mx-auto w-full max-w-[var(--mock-mobile-w)] lg:max-w-[var(--mock-desktop-w)]"
      style={{
        ["--mock-mobile-w" as string]: `${mobileWidthPx}px`,
        ["--mock-desktop-w" as string]: `${desktopWidthPx}px`,
      }}
    >
      <div className="relative" style={{ transform: rotateDeg ? `rotate(${rotateDeg}deg)` : undefined }}>
        <div
          className="relative overflow-hidden rounded-[2.4rem]"
          style={{
            aspectRatio: `390 / ${WINDOW_H_PX}`,
            // Rotated mockups skip the mask entirely — see FADE_OVERLAY_BG's
            // comment. overflow-hidden above still hard-clips the corpus at
            // the window's edge either way.
            WebkitMaskImage: rotateDeg ? undefined : MASK_IMAGE,
            maskImage: rotateDeg ? undefined : MASK_IMAGE,
          }}
        >
          <div
            ref={frameRef}
            className="absolute inset-x-0 top-0 rounded-[2.4rem] p-2 bg-black border border-white/10 translate-y-[var(--ty-mobile)] lg:translate-y-[var(--ty-desktop)]"
            style={{
              boxShadow: "0 22px 38px rgba(0,0,0,0.55)",
              ["--ty-mobile" as string]: `${mobileTY}px`,
              ["--ty-desktop" as string]: `${desktopTY}px`,
            }}
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
        {rotateDeg !== 0 && (
          // Fade-to-background overlay standing in for the mask that
          // doesn't render correctly on a rotated corpus (see
          // FADE_OVERLAY_BG) — sits INSIDE the same rotated wrapper as the
          // window, sized with `inset-0` to exactly the window's own box,
          // rather than as a sibling of the rotated wrapper sized to its
          // unrotated layout box. That first attempt was the actual bug:
          // an un-rotated rounded rectangle doesn't line up with a
          // rotated one, so where the overlay finished fading to its
          // opaque fill, its own (axis-aligned) rounded corners sat
          // visibly apart from the corpus's (rotated) ones — a second,
          // foreign rounded shape on top of the card rather than the
          // corpus's own edge, exactly the "rounded sole" artifact §1.7
          // prohibits, independent of how well the fade curve or fill
          // colour were tuned. Rotating with the window instead makes the
          // two rigid again, so the overlay's fully-opaque corners land
          // exactly on the corpus's own rotated corners — reads as the
          // corpus's own edge dissolving, not a shape laid over it. Safe
          // to rotate (unlike the window itself): this is a plain
          // `background` paint with no mask-image and no overflow-hidden
          // child to clip, so it never touches the actual Chromium bug
          // (mask-image + rotated ancestor + overflow-hidden-for-clipping,
          // see above) — only mask-image is rotation-hostile here.
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[2.4rem]"
            style={{ background: FADE_OVERLAY_BG }}
          />
        )}
      </div>
    </div>
  );
}
