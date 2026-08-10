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
  INDICA: "#8A5A96",
  SATIVA: "#B65C3A",
  HYBRID: "#3A6B58"
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
