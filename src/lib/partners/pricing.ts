// Every number and date printed on the pitch page ("/") lives here, once,
// so a price or deadline change is a one-line edit instead of a hunt through
// three locales' worth of JSX-embedded strings. translations.ts interpolates
// these into each locale's copy rather than hardcoding them again.
export const partnersPricing = {
  setupPrice: "฿9,000",
  setupPriceWas: "฿12,000",
  deposit: "฿4,500",
  subscriptionMonthly: "฿2,400",
  subscriptionYearly: "฿24,000",
  // Just the day-of-month — the number that actually moves. The month name
  // stays written out per locale in translations.ts rather than run through
  // Intl.DateTimeFormat: three languages' worth of month names is a small,
  // stable set, and it sidesteps Intl's own quirks (Thai's Buddhist-era
  // year, English's day/month order varying by region) for one number that
  // rarely changes independently of the day anyway.
  launchDeadlineDay: 6,
  addonLogo: "฿6,000",
  addonPt33Cards: "฿2,500 per 300",
  addonSecondShopSetup: "฿4,000",
  addonSecondShopMonthly: "฿1,200",
  addonMenuUpkeepMonthly: "฿1,200",
};
