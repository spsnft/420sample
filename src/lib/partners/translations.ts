import type { Language } from "@/lib/translations"

// Copy for the B2B pitch page, served at buds.digital's own apex ("/" — see
// middleware.ts and app/page.tsx). Kept separate from the public-site
// dictionary in @/lib/translations since none of these keys are shared with
// the storefront demo it links out to (at /demo).
export interface PartnersDictionary {
  // Says what the system is, not what it does for the shop — "already
  // built" is the argument, not a promise of speed. No turnaround time
  // appears on the page at all: it's mentioned exactly once, in the FAQ,
  // as an observation rather than a commitment.
  heroTitle: string;
  // Subtitle: sits between the H1 and the pills, quieter than both. The H1
  // says the system is ready; this line names the three parts of it and
  // sends the reader into the demo.
  heroSubtitle: string;
  // The pills under the subtitle carry deal terms, not features — price and
  // payment order. The first renders as an accent, the second as a neutral
  // chip. Exactly two: a third used to break to its own centred line on
  // mobile (ТЗ pitch-layout №6).
  heroPills: [string, string];

  // Block 01 — the PT.33 panel, the compliance record the shop is actually
  // buying, so it leads. Headings are the client's approved "set A" — see
  // ТЗ №2 M1. The mobile card-crop mockup this block is meant to eventually
  // carry (one client card, status + callouts) is still blocked on the
  // /staff audit (ТЗ №1 part 3); the headings above are not.
  blockPt33Title: string;
  blockPt33Subtitle: string;

  // Block 02 — the client-facing storefront the same system also ships.
  blockStorefrontTitle: string;
  blockStorefrontSubtitle: string;

  // Both blocks share one CTA label: each opens a real, live surface.
  ctaLive: string;
  ctaLivePending: string;
  ctaLiveErrorNotConfigured: string;
  ctaLiveErrorFailed: string;

  // Offer block, just above the FAQ: one attribution line (who built this,
  // linking "FT.Agency" — never the bare domain — to the portfolio), a
  // headline naming the launch-price deadline, a paragraph, the included
  // scope, an add-on price list, the payment terms and the subscription
  // rate. Deliberately no photos, names, or invented experience/project-
  // count figures.
  //
  // trustBuiltByBefore/After sandwich trustPortfolioLabel (the link text)
  // into one line — "Built by FT.Agency — Phuket" — rather than two
  // separate lines that both named the agency.
  trustBuiltByBefore: string;
  trustPortfolioLabel: string;
  trustBuiltByAfter: string;

  offerTitle: string;
  // Standalone price block between offerTitle and offerBody — the page's
  // one moment of decision gets its own typographic weight instead of
  // living as a clause inside the paragraph. offerPriceNow is the number
  // the whole block exists to show; offerPriceWas is struck through beside
  // it, offerPriceMonthly sits under both, offerPriceNote is the fine print.
  offerPriceNow: string;
  offerPriceWas: string;
  offerPriceMonthly: string;
  offerPriceNote: string;
  offerBody: string;

  includedTitle: string;
  includedItems: string[];

  // Add-on price list. A separate shape from includedItems because the
  // price is right-aligned and is not part of the label string.
  addonsTitle: string;
  addonsItems: { label: string; price: string }[];

  // Payment terms — 50/50, replacing the old turnaround guarantee.
  termsLine: string;

  // Subscription price, with the first-year rate lock. Kept apart from
  // offerBody: "will you raise it later" is the question that occurs right
  // when someone reads a recurring price, so the answer sits right there.
  subscriptionLine: string;

  // FAQ. Order goes from deal mechanics to risk: the first question
  // answers "what happens if I message you", the last is "who are you".
  faqTitle: string;
  faqItems: { q: string; a: string }[];

  // Final CTA. ctaHeadline + ctaSubtitle are the ask; ctaButton (WhatsApp)
  // and ctaButtonLine (LINE) are how to answer it — deliberately just the
  // brand name on both, equal weight (see ТЗ №2 M5/M9). pricingLine is the
  // page's own closing price recap.
  ctaHeadline: string;
  ctaSubtitle: string;
  ctaButton: string;
  ctaButtonLine: string;
  pricingLine: string;

  footerPrivacy: string;
}

const en: PartnersDictionary = {
  heroTitle: "Already built. Just needs your name on it.",
  heroSubtitle: "A customer storefront, a live menu and a PT.33 client panel, running as one system. Have a click through it yourself.",
  heroPills: [
    "From ฿9,000",
    "Half when it's live",
  ],

  blockPt33Title: "Your paperwork,\nalready done.",
  blockPt33Subtitle: "Type a name, get their PT.33, their history and everything they've bought. About five seconds, from any device behind the counter.",

  blockStorefrontTitle: "Change the price once.\nIt's changed everywhere.",
  blockStorefrontSubtitle: "Add a strain, set a sale, mark something sold out — a few taps. Your customers see it wherever they're looking: the screen in the shop, the site, the link your staff send on WhatsApp.",

  ctaLive: "Open the live system",
  ctaLivePending: "Signing in to demo…",
  ctaLiveErrorNotConfigured: "The demo isn't set up yet. Message us and we'll show you the panel directly.",
  ctaLiveErrorFailed: "Couldn't open the demo. Try again or message us.",

  trustBuiltByBefore: "Built by ",
  trustPortfolioLabel: "FT.Agency",
  trustBuiltByAfter: " — Phuket",

  offerTitle: "What it costs.",
  offerPriceNow: "฿9,000",
  offerPriceWas: "฿12,000",
  offerPriceMonthly: "฿1,900/month",
  offerPriceNote: "until 30 September · then ฿12,000",
  offerBody: "What you just clicked through is finished. It's not a prototype and you wouldn't be testing anything — the only new thing here is that it's for sale. Nobody on your street is running this yet. That won't stay true for long.",

  includedTitle: "Included at ฿9,000",
  includedItems: [
    "A storefront under your name and branding",
    "A live menu",
    "The PT.33 client and sales panel",
    "Your product list loaded — prices, categories and images",
  ],

  addonsTitle: "Add if you need it",
  addonsItems: [
    { label: "Branding and design in your own style", price: "฿6,000" },
    { label: "We type up your menu", price: "฿3,500" },
    { label: "Your existing PT.33 cards entered", price: "฿2,500 per 300" },
    { label: "A second shop", price: "฿4,000" },
    { label: "We keep the menu updated for you", price: "฿1,200/month" },
  ],

  termsLine: "Half up front, half when it's running and you've seen it working. Nothing switches off on your side while we build.",

  subscriptionLine: "฿1,900/month — hosting, domain, backups, updates and support. That rate is locked for your first year.",

  faqTitle: "Questions",
  faqItems: [
    {
      q: "What happens after I message you?",
      a: "You tell us what you already have and we quote it. You pay half, send the logo and the product list, and we build. Most shops are running within a few days — it depends on how much of it we're typing up for you.",
    },
    {
      q: "My staff don't read English.",
      a: "The panel and the menu both run in Thai, English and Russian. Your staff use Thai, your customers pick their own.",
    },
    {
      q: "Who updates the menu?",
      a: "You do — a minute on your phone. If you'd rather not, ฿1,200/month and you send the change on WhatsApp instead; it's live the same day.",
    },
    {
      q: "What if I stop paying?",
      a: "The storefront and menu go offline. Your client records don't go anywhere — ask and we send you the lot as a file, any day.",
    },
    {
      q: "Who actually builds this?",
      a: "FT.Agency, on Phuket. Small team, and you'll be dealing with the person doing the work rather than a manager.",
    },
  ],

  ctaHeadline: "Tell us what you have. We'll tell you the final price.",
  ctaSubtitle: "Most shops have a logo and a menu somewhere — a photo, a spreadsheet, a board on the wall. Send whatever you've got and we'll say what it costs and how long it takes. If you'd rather we did the lot, we can do that too, and we'll price it.",
  ctaButton: "WhatsApp",
  ctaButtonLine: "LINE",
  pricingLine: "From ฿9,000 setup + ฿1,900/month",

  footerPrivacy: "Privacy",
};

export const partnersTranslations: Record<Language, PartnersDictionary> = {
  en,
  // TODO(i18n): RU and TH get their own pass separately. Until then both
  // serve the English dictionary in full — that's more honest than leaving
  // the old RU/TH copy up, which described a guarantee and a price that no
  // longer exist.
  ru: en,
  th: en,
};
