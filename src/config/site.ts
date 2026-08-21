export const siteConfig = {
  name: "420 Store",
  tagline: "Presence, Compliance, Ordering — One Platform",
  description: "Digital menu & on-site medical consultation — 420 Store",
  // The consumer storefront's own address, post domain-swap: buds.digital
  // (the apex) now serves the B2B pitch, so the demo storefront customers
  // see lives at partners.buds.digital instead. See middleware.ts.
  url: process.env.NEXT_PUBLIC_APP_URL || "https://partners.buds.digital",
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
    // Absolute, and its own host: the pitch page is a rewrite of /partners on
    // the apex domain (see middleware.ts), so a relative "/partners" link
    // would keep a visitor on partners.buds.digital and show them a page
    // that believes it is somewhere else.
    url: "https://buds.digital",
  },

  // Static, non-clickable trust badge shown on the homepage. Demo instance —
  // not wired to any real business's Google listing.
  trustBadge: {
    rating: "5.0",
    reviews: "200+ Google reviews",
  },

  // Neutral public landmark used for the homepage map embed — not the exact
  // coordinates of any specific dispensary.
  mapEmbedSrc: "https://maps.google.com/maps?q=Boat+Avenue,+Bang+Tao,+Phuket&z=15&output=embed",
};
