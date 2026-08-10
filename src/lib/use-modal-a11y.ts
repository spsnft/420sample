"use client"
import * as React from "react"

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface ModalA11yOptions {
  onClose: () => void;
  /** Set false for a dialog the user must not dismiss — the order confirmation
   *  keeps its pickup number on screen until "start new order" is pressed. Focus
   *  is still trapped and the page behind still frozen. */
  dismissible?: boolean;
}

// Everything a dialog needs beyond looking like one: Escape closes it, focus
// moves inside and is trapped there, the page behind stops scrolling, and the
// element that opened the dialog gets focus back on close. Returns the ref to
// put on the dialog's own element.
export function useModalA11y({ onClose, dismissible = true }: ModalA11yOptions) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const dialog = ref.current;
    // Restored on unmount so closing a product sheet returns you to the card you
    // opened it from, rather than dumping focus back at the top of the page.
    const previouslyFocused = document.activeElement as HTMLElement | null;

    dialog?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    // The catalogue behind a sheet scrolling under your finger is the single
    // most obvious "this is not a real dialog" tell on a phone.
    const { overflow, paddingRight } = document.body.style;
    // Replacing the scrollbar's width keeps a desktop page from jumping sideways
    // as it disappears.
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && dismissible) {
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key !== "Tab" || !dialog) return;

      // Tab must not reach the catalogue underneath — it is still in the DOM and
      // still focusable, so the trap has to be explicit.
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || !dialog.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      previouslyFocused?.focus?.();
    };
  }, [onClose, dismissible]);

  return ref;
}
