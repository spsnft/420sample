"use client"
import * as React from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"

// Desktop counterpart to DeviceMockup: the /staff panel is the surface the shop
// owner and their staff work on at the counter, so it gets browser chrome
// rather than a phone body — the frame itself is what tells the visitor this
// block is about them, not their customers.
//
// Unlike the phone in block 01, this one is not tilted. A phone reads fine at
// an angle — that is how people hold them — but a browser window is something
// we only ever see square to the screen, so a few degrees of rotation doesn't
// read as "dynamic", it reads as a screenshot pasted in crooked. The tilt also
// forced the window to stay narrower than the block so its rotated corners had
// somewhere to go, which left it floating in the middle of a much wider card.
// Square and full width, it sits *in* the block instead of on top of it, and
// the screenshot renders about a quarter larger, which the client rows need.
//
// Like the phone in block 01, the window is deliberately *not* a closed
// rectangle. A browser frame that starts and ends inside the block reads as a
// second card pasted onto the first one — a hard bottom edge plus a hairline
// border tracing the full outline, sitting on a card that already has its own
// border. Fading the bottom out lets the window continue past the block
// instead of terminating in it, which is what gives the pair its sense of
// depth.
//
// The CTA below this component sits in ordinary flow, clear of the fade —
// it used to be pulled up into it with a negative margin, which put the
// button on top of the last visible row of the screenshot instead of below
// it (see ТЗ №2 M6).
//
// Both screenshots show the client-card screen (name, PT.33 status/quota,
// NEW SALE/NEW RX) rather than the client directory the block used to show —
// blockPt33Subtitle's whole promise ("type a name, get their PT.33, their
// history and everything they've bought") is the *result* of a search, not
// the search screen itself (ТЗ-2 rewrite §1). Both PNGs are hand-assembled
// from screenshots taken manually against the live site and handed off for
// this pass, not captured by scripts/capture-mockups.mjs — that script is
// left intact as the fallback path (ТЗ-2 rewrite §1.3) and still expects the
// client-directory search screen if it's ever run again; whoever recaptures
// next should decide then whether to point it at the client-card screen
// instead, and update the crop math below (mask %, aspect ratios) to match.
//
// staff-view.png (sm and up): the card as it renders in a browser window,
// cropped from a landscape iPad capture down to just the app's own column
// (that app has no persistent client-directory sidebar to also show — it's
// a single full-width route per client — so there is no "path" to keep in
// frame alongside the result) and stopped right under the NEW SALE/NEW RX
// row, before PREVIOUS PRESCRIPTIONS and its red EXPIRED pills.
//
// staff-view-mobile.png (below sm): same card, but the flat chrome-less crop
// this used to be (a directory fragment cropped under its own buttons) read
// as an unrecognisable ~1:1.3 sliver — neither a phone nor a window, just a
// cut piece. It now uses DeviceMockup's own technique instead: the phone
// body in full, real 390×844 proportions (not shrunk to fit the content),
// holding the screenshot at its native aspect with no stretching, inside a
// shorter aspect-[390/495] reveal window whose mask starts fading at 93% —
// tuned tighter than DeviceMockup's own 500/92 because this source is
// denser: at 500/88 (DeviceMockup's numbers) "PREVIOUS PRESCRIPTIONS" still
// ghosted through the fade. Per the ТЗ, that's the one lever to pull here —
// shrink the window, never crop the source to hide a section. No tilt: two
// tilted phones back to back would read as a repeated trick rather than two
// distinct surfaces, and this is the one meant to be read head-on, not
// glanced at an angle.
//
// The frame's own entrance fade/shift is gone — PitchBlock now animates
// heading, body, mockup and CTA in together as one element (ТЗ rewrite §10);
// only the light-sweep overlay still animates, off its own viewport entry.
function LightSweep({ entered }: { entered: boolean }) {
  return (
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
  );
}

export function DesktopMockup() {
  const desktopFrameRef = React.useRef<HTMLDivElement>(null);
  const desktopEntered = useInView(desktopFrameRef, { once: true, amount: 0.4 });
  const mobileFrameRef = React.useRef<HTMLDivElement>(null);
  const mobileEntered = useInView(mobileFrameRef, { once: true, amount: 0.4 });

  return (
    <div className="w-full">
      {/* Mobile: DeviceMockup's own phone-body/reveal-window/mask technique,
          just untilted and fed the staff screenshot instead of the storefront
          one — see the file-level comment for why the numbers differ from
          DeviceMockup's. */}
      <div className="sm:hidden mx-auto w-full max-w-[300px]">
        <div
          className="relative overflow-hidden rounded-[2.4rem] aspect-[390/495]"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 93%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, black 0%, black 93%, transparent 100%)",
          }}
        >
          <div
            ref={mobileFrameRef}
            className="absolute inset-x-0 top-0 rounded-[2.4rem] p-2 bg-black border border-white/10"
            style={{ boxShadow: "0 22px 38px rgba(0,0,0,0.55)" }}
          >
            <div className="relative rounded-[1.8rem] overflow-hidden">
              {/* Source raster is 780x1466, i.e. 390x733 CSS px at 2x. */}
              <Image
                src="/images/partners/staff-view-mobile.png"
                alt="buds.digital staff panel — client card with PT.33 status and quota"
                width={390}
                height={733}
                className="w-full h-auto block"
                sizes="300px"
                priority
              />
              <LightSweep entered={mobileEntered} />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: browser chrome around the same client-card screen. */}
      <div className="hidden sm:block">
        <div
          ref={desktopFrameRef}
          className="rounded-[0.9rem] overflow-hidden bg-black border-x border-t border-white/10"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 88%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, black 0%, black 88%, transparent 100%)",
            // A mask defaults to `repeat`, and the tile is the element's own box:
            // one pixel below the frame the gradient starts over at fully opaque,
            // which is why the drop-shadow this element used to cast reappeared
            // underneath it as a hard-edged, square-cornered slab — landing right
            // on the rounded CTA and reading as a tear. No-repeat is the fix; the
            // shadow itself is gone with it, since a shadow that only shows
            // inside its own box is not a shadow.
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
          }}
        >
          <div className="flex items-center gap-1.5 px-2.5 py-2 bg-white/[0.04] border-b border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span className="ml-1.5 flex-1 h-4 rounded px-2 bg-white/[0.06] text-[7px] font-bold leading-4 text-brand-light/40 truncate">
              buds.digital/staff
            </span>
          </div>

          <div className="relative">
            <Image
              src="/images/partners/staff-view.png"
              alt="buds.digital staff panel — client card with PT.33 status and quota"
              width={1120}
              height={915}
              className="w-full h-auto block"
              sizes="420px"
              priority
            />
            <LightSweep entered={desktopEntered} />
          </div>
        </div>
      </div>
    </div>
  );
}
