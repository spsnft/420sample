"use client"
import * as React from "react"
import Image from "next/image"
import { motion } from "framer-motion"

// Desktop counterpart to DeviceMockup: the /staff panel is the surface the shop
// owner and their staff work on at the counter, so it gets browser chrome
// rather than a phone body — the frame itself is what tells the visitor this
// block is about them, not their customers.
//
// The screenshot is a real render of the live /staff search screen carrying the
// demo data supabase/seed.sql seeds. Recapture and swap
// public/images/partners/staff-view.png whenever that screen's design changes.
// Capture it at 860x560, not at a full desktop width: /staff is a max-w-2xl
// (672px) column centred in the viewport, so a narrow window still reads as a
// real desktop browser while keeping the column — and its status pills —
// legible once the shot is scaled down into this block. A 1280px-wide capture
// scales to roughly a quarter here and turns the rows to mush.
export function DesktopMockup() {
  // Same pattern as DeviceMockup: the sweep is driven off the frame's viewport
  // entry rather than its own whileInView, which never fires reliably on an
  // absolutely positioned, pre-transformed child.
  const [entered, setEntered] = React.useState(false);

  return (
    <div className="mx-auto w-full max-w-[420px] rotate-[3deg]">
      <motion.div
        initial={{ opacity: 0, y: 12, filter: "drop-shadow(0 0px 0px rgba(0,0,0,0))" }}
        whileInView={{ opacity: 1, y: 0, filter: "drop-shadow(0 22px 38px rgba(0,0,0,0.55))" }}
        viewport={{ once: true, amount: 0.4 }}
        onViewportEnter={() => setEntered(true)}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="rounded-[0.9rem] overflow-hidden bg-black border border-white/10"
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
            alt="buds.digital staff panel — client directory with pass status and quota"
            width={860}
            height={560}
            className="w-full h-auto block"
            sizes="420px"
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
