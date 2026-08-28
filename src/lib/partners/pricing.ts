// Every number printed on the pitch page ("/") lives here, once, so a price
// change is a one-line edit instead of a hunt through three locales' worth
// of JSX-embedded strings. translations.ts interpolates these into each
// locale's copy rather than hardcoding them again.
// Raw numbers behind the formatted subscription strings below, kept only so
// annualSavings can be computed rather than hardcoded (ТЗ-4 §4.6: 12 ×
// monthly − yearly must stay derived, since either input can move). Not
// exported — everything else on the page reads the formatted strings.
const SUBSCRIPTION_MONTHLY_VALUE = 2400;
const SUBSCRIPTION_YEARLY_VALUE = 24000;

// ฿-prefixed, comma-grouped — matches every other price string on the page
// (see setupPrice etc. below) rather than reaching for Intl.NumberFormat's
// own currency formatting, which doesn't know ฿ and would need a locale
// override per call site anyway.
function formatThb(n: number): string {
  return `฿${n.toLocaleString("en-US")}`;
}

export const partnersPricing = {
  setupPrice: "฿15,000",
  setupPriceWas: "฿20,000",
  subscriptionMonthly: "฿2,400",
  subscriptionYearly: "฿24,000",
  // ТЗ-4 §4.6 — "two months off" made concrete: 12 months at the monthly
  // rate minus the annual price. Derived so it can't drift out of sync with
  // subscriptionMonthly/subscriptionYearly above if either changes.
  annualSavings: formatThb(SUBSCRIPTION_MONTHLY_VALUE * 12 - SUBSCRIPTION_YEARLY_VALUE),
  addonLogo: "฿6,000",
  addonPt33Cards: "฿2,500 per 300 cards",
  addonSecondShopSetup: "฿4,000",
  addonSecondShopMonthly: "฿1,200",
  addonMenuUpkeepMonthly: "฿1,200",
};
