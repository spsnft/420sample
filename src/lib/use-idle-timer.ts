"use client"
import * as React from "react"

const ACTIVITY_EVENTS = ["pointerdown", "mousemove", "keydown", "touchstart", "wheel", "scroll"] as const;

/**
 * Fires onIdle after `timeoutMs` with no user activity.
 *
 * `enabled` exists because this only ever made sense on the shop's own tablet.
 * Left on for everyone, it wiped the basket of a customer browsing on their own
 * phone who looked away for four minutes — a device nobody else is about to
 * pick up, where there is nothing to protect and a basket worth keeping.
 */
export function useIdleTimer(timeoutMs: number, onIdle: () => void, enabled = true) {
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const onIdleRef = React.useRef(onIdle);
  onIdleRef.current = onIdle;

  React.useEffect(() => {
    if (!enabled) return;

    const reset = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onIdleRef.current(), timeoutMs);
    };

    reset();
    ACTIVITY_EVENTS.forEach((evt) => window.addEventListener(evt, reset, { passive: true }));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, reset));
    };
  }, [timeoutMs, enabled]);
}
