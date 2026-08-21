// The site's own domain, apex only — buds.digital now serves the B2B pitch
// at "/" and the storefront demo at "/demo" from the same host (see
// middleware.ts), so one origin backs both `url` and `partners.url` below.
//
// No production domain is hardcoded here: NEXT_PUBLIC_APP_URL (this bare
// origin, no path) must be set explicitly in the production environment.
// Anywhere it isn't — a Vercel preview deployment, a local checkout — this
// falls back to that deployment's own address instead, so a preview build's
// metadata and QR/invite links point at itself rather than at production or
// at some other preview.
function resolveAppOrigin(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  // Vercel exposes the current deployment's own host this way when "Automatically
  // expose System Environment Variables" is on for the project — no protocol.
  if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  return "http://localhost:3000";
}
const APP_ORIGIN = resolveAppOrigin();

export const siteConfig = {
  name: "420 Store",
  tagline: "Presence, Compliance, Ordering — One Platform",
  description: "Digital menu & on-site medical consultation — 420 Store",
  // The consumer storefront demo's own address, one path off the apex.
  url: `${APP_ORIGIN}/demo`,
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "",
  currencySymbol: "฿",
  themeColor: "#161819",
  locale: "en_US",

  address: "Bang Tao Beach, Thalang, Phuket 83110, Thailand",
  workingHours: "12:00 — 00:00",

  contacts: {
    line: "https://line.me/R/ti/p/@mpsphuket",
    whatsapp: "https://wa.me/66650255229",
    instagram: "https://www.instagram.com/mpsphuket",
  },

  // buds.digital (B2B pitch page, apex domain) — deliberately separate from
  // the consumer contacts above: a WhatsApp Business line for dispensary
  // owners, not the personal LINE/WhatsApp used on the storefront demo.
  partners: {
    whatsapp: "https://wa.me/66650255229",
    // The site's own bare origin — pitch and demo now share it, one path
    // apart. Used for canonical metadata, the sitemap and robots.txt; in-app
    // links between the two are relative paths, not built from this.
    url: APP_ORIGIN,
  },

  // Static, non-clickable trust badge shown on the homepage. Demo instance —
  // not wired to any real business's Google listing (in a real deployment
  // it would link out to that shop's own Google listing).
  trustBadge: {
    rating: "4.8",
    reviews: "130+ Google reviews",
  },

  // Neutral public landmark used for the homepage map embed — not the exact
  // coordinates of any specific dispensary.
  mapEmbedSrc: "https://maps.google.com/maps?q=Boat+Avenue,+Bang+Tao,+Phuket&z=15&output=embed",
};
