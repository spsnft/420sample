export const siteConfig = {
  name: "MPS Phuket",
  tagline: "Marijuana Premium Grade",
  description: "Digital menu & on-site medical consultation — MPS Phuket",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://buds.digital",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "",
  currencySymbol: "฿",
  themeColor: "#161819",
  locale: "en_US",

  // TODO: confirm exact address before going live
  address: "Patong, Phuket, Thailand",
  workingHours: "12:00 — 00:00",

  contacts: {
    line: "https://line.me/R/ti/p/@mpsphuket",
    // TODO: replace with the real WhatsApp number — this is a placeholder
    whatsapp: "https://wa.me/66612345678",
    instagram: "https://www.instagram.com/mpsphuket",
  },
};
