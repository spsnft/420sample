"use client"
import * as React from "react"
import Image from "next/image"
import { motion } from "framer-motion"

// Composited screenshot of buds.digital (header + hero cards + the
// "Cannabis. Done properly." tagline, padded out to a true iPhone 13/14
// screen ratio of 390x844) assembled from the live homepage and wrapped in
// a minimal device frame. The header stays pinned to the top; the cards
// and tagline blocks are then spaced evenly (space-evenly) down to the
// bottom edge instead of packing everything under the header. Recapture
// and swap the PNG in public/images/partners/customer-view.png whenever
// the live design changes, keeping that same even distribution.
export function DeviceMockup() {
  // Drives the light-sweep off the frame's own viewport entry instead of a
  // second, independently-observed whileInView on the (absolutely
  // positioned, pre-transformed) sweep element — that nested observer never
  // reliably fired its own intersection callback.
  const [entered, setEntered] = React.useState(false);

  return (
    <div className="mx-auto w-full max-w-[300px] -rotate-[5deg]">
      <motion.div
        initial={{ opacity: 0, y: 12, filter: "drop-shadow(0 0px 0px rgba(0,0,0,0))" }}
        whileInView={{ opacity: 1, y: 0, filter: "drop-shadow(0 22px 38px rgba(0,0,0,0.55))" }}
        viewport={{ once: true, amount: 0.4 }}
        onViewportEnter={() => setEntered(true)}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="rounded-[2.4rem] p-2 bg-black border border-white/10"
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
  );
}
