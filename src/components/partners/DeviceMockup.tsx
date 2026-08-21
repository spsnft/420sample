"use client"
import * as React from "react"
import Image from "next/image"
import { motion } from "framer-motion"

// Composited screenshot of buds.digital (header + hero cards + the homepage
// tagline), captured at a true iPhone 13/14 screen ratio of 390x844 at 2x.
// Recapture and swap the PNG in public/images/partners/customer-view.png
// whenever the homepage's top changes — scripts/capture-customer-view.mjs
// does it, and says there what it stages before it shoots. The composite is
// a poster of the page rather than a plain capture of it: the sections below
// the tagline are dropped, the tagline is pulled up under the cards, and the
// header's hairline and nav button are taken out — those read as stray hard
// edges once tilted and vignetted inside the small rotated mockup, so they
// are kept out of the composite rather than papered over with CSS.
//
// The frame keeps its full, realistic iPhone proportions, but only the
// content-dense top of it is revealed — the empty lower screen and
// bottom bezel bleed off past the block below instead of showing as dead
// space, a standard hero-mockup trick. That reveal window's
// overflow-hidden (the aspect-[390/600] div below) lives *inside* the
// same -rotate-[5deg] box as the phone frame, not on some unrotated
// ancestor — so its clip edge stays parallel to the phone's own tilt
// rather than slicing straight across the rounded, rotated body. A
// mask-image fade on top softens that edge further. Its height is sized
// to the composite's tightened content, with just enough bottom margin
// for the fade to run its course before the cut.
export function DeviceMockup() {
  // Drives the light-sweep off the frame's own viewport entry instead of a
  // second, independently-observed whileInView on the (absolutely
  // positioned, pre-transformed) sweep element — that nested observer never
  // reliably fired its own intersection callback.
  const [entered, setEntered] = React.useState(false);

  return (
    <div className="mx-auto w-full max-w-[300px] -rotate-[5deg]">
      <div
        className="relative overflow-hidden rounded-[2.4rem] aspect-[390/600]"
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 92%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 0%, black 92%, transparent 100%)",
        }}
      >
        <motion.div
          // boxShadow, not a `filter: drop-shadow` — the frame sits inside a
          // masked, overflow-hidden ancestor (the reveal window above), and a
          // filter's own compositing pass clips against that mask harder than
          // its blur fades, leaving a visible straight seam right at the mask's
          // cutoff instead of a soft edge (see ТЗ №2 M11). box-shadow clips
          // cleanly against overflow-hidden with no such artifact, and reads
          // the same here since the frame is a plain rounded rectangle.
          initial={{ opacity: 0, y: 12, boxShadow: "0 0px 0px rgba(0,0,0,0)" }}
          whileInView={{ opacity: 1, y: 0, boxShadow: "0 22px 38px rgba(0,0,0,0.55)" }}
          viewport={{ once: true, amount: 0.4 }}
          onViewportEnter={() => setEntered(true)}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute inset-x-0 top-0 rounded-[2.4rem] p-2 bg-black border border-white/10"
        >
          <div className="relative rounded-[1.8rem] overflow-hidden">
            <Image
              src="/images/partners/customer-view.png"
              alt="buds.digital home screen — hero cards and tagline"
              width={390}
              height={844}
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
        </motion.div>
      </div>
    </div>
  );
}
