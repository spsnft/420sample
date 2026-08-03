export const siteConfig = {
  name: "420 Store",
  tagline: "Presence, Compliance, Ordering — One Platform",
  description: "Digital menu & on-site medical consultation — 420 Store",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://buds.digital",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "",
  currencySymbol: "฿",
  themeColor: "#161819",
  locale: "en_US",

  address: "Bang Tao Beach, Thalang, Phuket 83110, Thailand",
  workingHours: "12:00 — 00:00",

  contacts: {
    line: "https://line.me/R/ti/p/@mpsphuket",
    // TODO: replace with the real WhatsApp number — this is a placeholder
    whatsapp: "https://wa.me/66612345678",
    instagram: "https://www.instagram.com/mpsphuket",
  },

  // Demo shop used to power the social-proof rating badge on the homepage.
  // Chillium — Bang Tao Beach, Phuket. 5.0 rating, 1173+ reviews.
  place: {
    id: "ChIJaYrynqo5UDARuwUnDHOzFRg",
    reviewsUrl: "https://search.google.com/local/reviews?placeid=ChIJaYrynqo5UDARuwUnDHOzFRg",
    // Fallback shown when the Google Places API key is unset or the fetch fails/is stale.
    fallbackRating: 5.0,
    fallbackReviewCount: 1173,
  },
};
