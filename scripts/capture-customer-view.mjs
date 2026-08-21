// Recaptures public/images/partners/customer-view.png — the phone screen inside
// the device mockup on the pitch page ("/").
//
// Run with a dev server already up on the port below:
//   npm run dev
//   npx playwright@1.49.0 install chromium   # once, if you have no browser
//   node scripts/capture-customer-view.mjs
//
// Playwright is deliberately not a dependency of this project: this is the one
// place that needs a browser, and pinning one would put a browser download in
// everyone's `npm install`. Pass a Chromium path in CHROMIUM_PATH if the
// Playwright-managed one is not where it expects.
//
// What the capture stages, and why — the composite is a poster of the page,
// not a plain screenshot of it:
//   · the sections below the tagline are dropped, so the screen does not end
//     mid-photograph a third of the way down the frame;
//   · the tagline is pulled up under the hero cards, so the mockup's reveal
//     window (the top ~600 of 844) holds the whole pitch;
//   · the header's hairline and nav button are hidden — small hard edges that
//     read as debris once the shot is shrunk, tilted and vignetted.
// Everything else is the live page at a true iPhone 13/14 ratio, 390x844 at 2x.
import path from "node:path";
import { chromium } from "playwright";

const ORIGIN = process.env.CAPTURE_ORIGIN || "http://localhost:3000";
const OUT = path.join(process.cwd(), "public", "images", "partners", "customer-view.png");
// Air above the tagline block, replacing the page's own section padding.
const TAGLINE_PAD = 40;

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}
);
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});

// Past the age gate, and in English: the mockup sits on a page read by shop
// owners in three languages, and the screen inside it stays one of them.
await context.addCookies([{ name: "age_verified_20", value: "1", url: ORIGIN }]);
await context.addInitScript(() => {
  localStorage.setItem(
    "buds-digital-cart-v2",
    JSON.stringify({ state: { items: [], lang: "en" }, version: 0 })
  );
});

const page = await context.newPage();
await page.goto(`${ORIGIN}/demo`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);

await page.evaluate((pad) => {
  // The page's own <main> is the inner one — the layout wraps the app in a
  // <main> of its own.
  const mains = document.querySelectorAll("main");
  const main = mains[mains.length - 1];
  const sections = [...main.children];

  const header = document.querySelector("header");
  header.style.borderBottom = "0";
  const navChip = header.querySelector(
    "button[aria-expanded][aria-label]:not([aria-haspopup='listbox'])"
  );
  if (navChip) navChip.style.display = "none";

  sections.slice(2).forEach((el) => { el.style.display = "none"; });
  sections[1].style.paddingTop = `${pad}px`;
  sections[1].style.paddingBottom = "0px";
}, TAGLINE_PAD);

// The hero cards animate in on scroll; give them their moment before shooting.
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(600);
await page.screenshot({ path: OUT });
await browser.close();

console.log(`Wrote ${OUT}`);
