import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import * as React from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://buds.digital"
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
  const type = String(product?.type || "").toLowerCase().trim();
  return TYPE_COLORS[type] || GOLDEN_COLOR;
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
