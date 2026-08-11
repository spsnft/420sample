"use client"
import * as React from "react"

// The page's atmosphere, painted once for the whole site.
//
// It is a fixed element rather than a background on <body> with
// background-attachment: fixed. That property is what the backdrop used to
// rely on, and iOS/iPadOS Safari does not honour it: it lays the background
// out against the document instead of the viewport, so every percentage in
// the gradients was measured against however tall the page happened to be.
// Filtering the menu down to one category shortened the document, the light
// pools rode up to the top edge, and the backdrop visibly changed while the
// user was only changing a tab. A real fixed element is anchored to the
// viewport in every browser, so the light now stays where it was put.
//
// Three layers, in the order light actually arrives: a room (the vertical
// ramp and the floor), light coming into it (the brand's gold and green, and
// the blades that suggest it fell through leaves), and the grain of the film
// it is all recorded on. Every layer is far below the contrast of anything it
// sits behind — the strongest of them lifts the base by about twenty levels at
// its very centre, most of them by under ten — because the job is depth, not
// decoration: a long menu should not read as one flat grey sheet, and nothing
// here should compete with a product photograph.
export function PageBackdrop() {
  const lightRef = React.useRef<HTMLDivElement>(null);

  // The light lags the page. Scrolling a flat backdrop tells the eye the
  // colour is printed on the content; moving it a fraction of the distance
  // tells it there is a room back there and the page is passing in front of
  // it. Capped at 48px: past that it stops reading as depth and starts reading
  // as a second thing moving on screen.
  React.useEffect(() => {
    const el = lightRef.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const apply = () => {
      frame = 0;
      el.style.setProperty("--backdrop-parallax", `${Math.min(window.scrollY * 0.06, 48)}px`);
    };
    const onScroll = () => {
      // One write per frame, never one per scroll event.
      if (!frame) frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="page-backdrop" aria-hidden="true">
      <div className="page-backdrop__room" />
      <div className="page-backdrop__light" ref={lightRef}>
        <div className="page-backdrop__drift">
          {/* Light that has come through leaves, rather than light from a lamp.
              Each blade is one elongated ellipse, rotated — a leaf is close
              enough to that shape at this softness, and a gradient's own
              falloff is free where a blur filter over a full screen is not. */}
          <span className="page-backdrop__blade page-backdrop__blade--1" />
          <span className="page-backdrop__blade page-backdrop__blade--2" />
          <span className="page-backdrop__blade page-backdrop__blade--3" />
          <span className="page-backdrop__blade page-backdrop__blade--4" />
        </div>
      </div>
      <div className="page-backdrop__grain" />
    </div>
  );
}
