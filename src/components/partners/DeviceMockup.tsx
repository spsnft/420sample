"use client"
import * as React from "react"
import Image from "next/image"
import { motion } from "framer-motion"

// Composited screenshot of buds.digital (header + hero cards + the
// "Cannabis. Done properly." tagline, densely packed at the top with a
// natural gap after the tagline — no artificial stretching) assembled
// from the live homepage and padded out to a true iPhone 13/14 screen
// ratio of 390x844. Recapture and swap the PNG in
// public/images/partners/customer-view.png whenever the live design
// changes; the crop points below assume content still ends a little past
// the "Cannabis. Done properly." tagline.
//
// The frame keeps its full, realistic iPhone proportions, but only the
// content-dense top of it is revealed — the empty lower screen and
// bottom bezel bleed off past the block below instead of showing as dead
// space, a standard hero-mockup trick. That reveal window's
// overflow-hidden (the aspect-[390/680] div below) lives *inside* the
// same -rotate-[5deg] box as the phone frame, not on some unrotated
// ancestor — so its clip edge stays parallel to the phone's own tilt
// rather than slicing straight across the rounded, rotated body. A
// mask-image fade on top softens that edge further.
export function DeviceMockup() {
  // Drives the light-sweep off the frame's own viewport entry instead of a
  // second, independently-observed whileInView on the (absolutely
  // positioned, pre-transformed) sweep element — that nested observer never
  // reliably fired its own intersection callback.
  const [entered, setEntered] = React.useState(false);

  return (
    <div className="mx-auto w-full max-w-[300px] -rotate-[5deg]">
      <div
        className="relative overflow-hidden rounded-[2.4rem] aspect-[390/680]"
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 92%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 0%, black 92%, transparent 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12, filter: "drop-shadow(0 0px 0px rgba(0,0,0,0))" }}
          whileInView={{ opacity: 1, y: 0, filter: "drop-shadow(0 22px 38px rgba(0,0,0,0.55))" }}
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
