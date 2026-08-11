"use client"
import * as React from "react"

/**
 * True once a `sticky top-0` element has left the flow and is holding the top
 * of the window. Attach the returned ref to a 1px marker rendered immediately
 * before the sticky element: the marker is in view exactly while the element
 * is parked, and out of view exactly while it is stuck.
 *
 * Read this way rather than from a scroll offset because the offset that makes
 * a bar stick is not a constant — it is whatever happens to sit above it, and
 * that differs per page and changes with the layout. The marker is always
 * right.
 */
export function useStuck<T extends HTMLElement = HTMLDivElement>() {
  const [stuck, setStuck] = React.useState(false);
  const ref = React.useRef<T>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { threshold: 1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, stuck };
}
