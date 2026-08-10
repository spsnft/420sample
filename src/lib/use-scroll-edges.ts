"use client"
import * as React from "react"

// How far the edge fade reaches in. Wide enough to read as "there's more this
// way" against a card, narrow enough not to grey out a whole name.
const FADE = "28px";

// Which ends of a horizontal strip have content hidden past them. Tracked
// rather than assumed because the fade has to be able to switch off: a row
// only scrolls when it overflows, and a permanent CSS mask would dim the last
// card on a wide screen where there is nothing more to scroll to — turning an
// affordance into a rendering bug. Both ends are tracked so the fade also
// says when you have scrolled past the start, and so an arrow control can hide
// itself on the side that has nothing left to reveal.
export function useScrollEdges(deps: unknown) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [edges, setEdges] = React.useState({ start: false, end: false });

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      // A pixel of slack: fractional layout widths mean scrollLeft never lands
      // exactly on the maximum, which would leave the end fade stuck on at the
      // end of the strip.
      const max = el.scrollWidth - el.clientWidth;
      setEdges({ start: el.scrollLeft > 1, end: el.scrollLeft < max - 1 });
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    // Catches rotation and window resizing, which change whether the row
    // overflows at all without any scrolling happening.
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [deps]);

  // Each side's stop collapses to zero width when that side has nothing hidden
  // behind it, so an unscrollable row is masked with a plain opaque gradient.
  const mask = `linear-gradient(to right, transparent 0, black ${edges.start ? FADE : "0px"}, black calc(100% - ${
    edges.end ? FADE : "0px"
  }), transparent 100%)`;

  // Scrolls most of a viewport-width at a time: enough to feel like a page
  // turn, short enough that the card you were looking at stays on screen as an
  // anchor.
  const scrollByPage = React.useCallback((direction: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  }, []);

  return { ref, mask, edges, scrollByPage };
}
