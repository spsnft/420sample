"use client"
import * as React from "react"
import Image from "next/image"
import { motion } from "framer-motion"

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
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        onViewportEnter={() => setEntered(true)}
        transition={{ duration: 0.4, ease: "easeOut" }}
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
