"use client"
import * as React from "react"

const ACTIVITY_EVENTS = ["pointerdown", "mousemove", "keydown", "touchstart", "wheel", "scroll"] as const;

/**
 * Fires onIdle after `timeoutMs` with no user activity.
 * Used to reset a shared kiosk device so the next customer never sees the previous order.
 */
export function useIdleTimer(timeoutMs: number, onIdle: () => void) {
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const onIdleRef = React.useRef(onIdle);
  onIdleRef.current = onIdle;

  React.useEffect(() => {
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
  }, [timeoutMs]);
}
