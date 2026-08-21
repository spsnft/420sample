import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import * as React from "react"
import { siteConfig } from "@/config/site"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// For QR codes and metadata only — every in-app link is relative (see
// Header, SiteNav). siteConfig.partners.url is the one place the app's own
// origin is resolved (env-driven, no hardcoded domain — see config/site.ts),
// so nothing here needs its own fallback.
export function absoluteUrl(path: string) {
  // The site's bare origin — /staff and /menu both live at the apex, not
  // under the storefront demo's own "/demo", so this must not carry that
  // path segment the way siteConfig.url does.
  const baseUrl = siteConfig.partners.url
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`
}

export const GOLDEN_COLOR = "#A88444";

export const TYPE_COLORS: Record<string, string> = {
  indica: "#8A5A96",
  sativa: "#B65C3A",
  hybrid: "#3A6B58",
};

// The one place a product's accent colour is decided, so a strain is the same
// colour wherever it appears. It used to be worked out three times: the row
// coloured by strain, the card coloured every joint gold whatever its strain,
// and the sheet coloured everything emerald — so one indica could be purple in
// the list, gold on its card and green in its own modal.
// Anything with no strain — accessories — takes the brand gold.
export const accentFor = (product: any): string => {
  return strainAccentFor(product) || GOLDEN_COLOR;
};

// The same decision for text rather than light: null when the product has no
// strain, so an accessory's kind ("Grinder", "Papers") is set in the ordinary
// body colour instead of the brand gold. Gold on that line was doing no work —
// it names no strain — and it is the colour the Sale tag beside it uses, so two
// unrelated words came out the same colour on one row.
export const strainAccentFor = (product: any): string | null => {
  const type = String(product?.type || "").toLowerCase().trim();
  return TYPE_COLORS[type] || null;
};

export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' = 'light') => {
  if (typeof window !== 'undefined') {
    try {
      const tgHaptic = (window as any).Telegram?.WebApp?.HapticFeedback;
      if (tgHaptic) {
        if (type === 'success' || type === 'warning') tgHaptic.notificationOccurred(type);
        else tgHaptic.impactOccurred(type);
      } else if ('vibrate' in navigator) {
        navigator.vibrate(type === 'success' ? [10, 30, 10] : 10);
      }
    } catch {
      // Игнорируем ошибки виброотклика
    }
  }
};

export const Baht = ({ className = "" }: { className?: string }) => (
  <span className={`inline-block text-[0.85em] -translate-y-[0.05em] ml-0.5 font-sans ${className}`}>฿</span>
);

export function generateOrderNumber() {
  return String(Math.floor(100 + Math.random() * 900));
}
