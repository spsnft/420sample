"use client"
import * as React from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"

// Composited screenshot of buds.digital (header + the two hero cards only),
// captured at a true iPhone 13/14 screen width (390 CSS px) at 2x and cropped
// to 780x930 raster. Recapture and swap the PNG in
// public/images/partners/customer-view.png whenever the homepage's top
// changes — scripts/capture-mockups.mjs does it, and says there what it
// stages before it shoots. The composite is a poster of the page rather than
// a plain capture of it: everything below the second (green) card is dropped
// — the "Flowers. Done properly." tagline included, which used to run at
// ~9-10px once tilted and shrunk inside the mockup, unreadable and just
// taking up room in an already dense block (ТЗ rewrite §9.1) — and the
// header's hairline and nav button are taken out, since those read as stray
// hard edges once tilted and vignetted inside the small rotated mockup, so
// they are kept out of the composite rather than papered over with CSS.
//
// The frame keeps its full, realistic iPhone proportions, but only the
// content-dense top of it is revealed — the empty lower screen and
// bottom bezel bleed off past the block below instead of showing as dead
// space, a standard hero-mockup trick. That reveal window's
// overflow-hidden (the aspect-[390/500] div below) lives *inside* the
// same -rotate-[5deg] box as the phone frame, not on some unrotated
// ancestor — so its clip edge stays parallel to the phone's own tilt
// rather than slicing straight across the rounded, rotated body. A
// mask-image fade on top softens that edge further. Its height is sized
// to the composite's tightened content, with just enough bottom margin
// for the fade to run its course before the cut.
//
// The frame's own entrance fade/shift is gone — PitchBlock now animates
// heading, body, mockup and CTA in together as one element, so a second,
// independently-timed fade on just this piece would put it out of step
// with the rest of the block again (ТЗ rewrite §10). The frame is a plain
// static div now; only the light-sweep overlay still animates, off its own
// viewport entry.
export function DeviceMockup() {
  const frameRef = React.useRef<HTMLDivElement>(null);
  const entered = useInView(frameRef, { once: true, amount: 0.4 });

  return (
    <div className="mx-auto w-full max-w-[300px] -rotate-[5deg]">
      <div
        className="relative overflow-hidden rounded-[2.4rem] aspect-[390/500]"
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 92%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 0%, black 92%, transparent 100%)",
        }}
      >
        <div
          ref={frameRef}
          className="absolute inset-x-0 top-0 rounded-[2.4rem] p-2 bg-black border border-white/10"
          style={{ boxShadow: "0 22px 38px rgba(0,0,0,0.55)" }}
        >
          <div className="relative rounded-[1.8rem] overflow-hidden">
            <Image
              src="/images/partners/customer-view.png"
              alt="buds.digital home screen — hero cards"
              width={390}
              height={465}
              className="w-full h-auto block"
              sizes="300px"
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
