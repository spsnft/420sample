// The site's own domain, apex only — buds.digital now serves the B2B pitch
// at "/" and the storefront demo at "/demo" from the same host (see
// middleware.ts), so one origin backs both `url` and `partners.url` below.
//
// No production domain is hardcoded here: NEXT_PUBLIC_APP_URL (this bare
// origin, no path) must be set explicitly in the production environment.
//
// On a Vercel *preview* deployment this is deliberately not checked first,
// even when it is set. NEXT_PUBLIC_APP_URL is normally added once in the
// Vercel dashboard scoped to every environment (Production, Preview and
// Development all get the same value) — that is exactly what you want in
// production, and exactly wrong on a preview, where it pins every preview's
// metadata/QR/invite links to one fixed address: production, or whichever
// deployment happened to be selected when someone last set it. A preview
// build's own NEXT_PUBLIC_VERCEL_URL is unique per-deployment and always
// correct for it, so that wins on preview regardless of what
// NEXT_PUBLIC_APP_URL says. Both VERCEL_* vars require "Automatically
// expose System Environment Variables" to be on for the project.
function resolveAppOrigin(): string {
  const isPreview = process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";
  const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
  if (isPreview && vercelUrl) return `https://${vercelUrl}`;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (vercelUrl) return `https://${vercelUrl}`;
  return "http://localhost:3000";
}
const APP_ORIGIN = resolveAppOrigin();

export const siteConfig = {
  // Placeholder shop name shown throughout the storefront demo (header,
  // metadata, staff panel) — deliberately not a made-up brand: a prospect
  // clicking in should read it as "this is where your own name goes", not
  // as some other dispensary's storefront.
  name: "YOUR STORE",
  tagline: "Presence, Compliance, Ordering — One Platform",
  description: "Digital menu & on-site medical consultation — YOUR STORE",
  // The consumer storefront demo's own address, one path off the apex.
  url: `${APP_ORIGIN}/demo`,
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "",
  currencySymbol: "฿",
  themeColor: "#161819",
  locale: "en_US",

  address: "Bang Tao Beach, Thalang, Phuket 83110, Thailand",
  // Same address, short enough not to wrap onto a second line in the
  // storefront's collapsed info strip on a narrow phone.
  addressShort: "Bang Tao Beach, Thalang, Phuket",
  workingHours: "12:00 — 00:00",

  // Deliberately blank on the demo instance: these used to be a real, live
  // dispensary's handles ("mpsphuket") — anyone tapping LINE/WhatsApp/
  // Instagram on the storefront demo landed in that shop's real inbox
  // instead of anywhere related to this product. The icons that read these
  // values (on both the storefront and /privacy) no longer treat them as
  // hrefs at all — they show an explanatory tooltip instead — so an empty
  // string here is simply unused rather than a broken link.
  contacts: {
    line: "",
    whatsapp: "",
    instagram: "",
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

  // Neutral public landmark for the homepage map — not the exact coordinates
  // of any specific dispensary. Used only as the target of "Open in Maps"
  // now: the homepage itself shows a static, palette-matched map graphic
  // rather than a live Google embed (see HomeClient's StorefrontMap — the
  // classic no-API-key iframe embed this used to be doesn't accept a styles
  // param, and this project has no Google Maps API key to switch to the
  // JS/Static Maps APIs that do).
  mapOpenUrl: "https://www.google.com/maps/search/?api=1&query=Boat+Avenue,+Bang+Tao,+Phuket",
};
