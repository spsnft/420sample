// Recaptures the product screenshots on the buds.digital pitch page ("/"):
//   public/images/partners/staff-view.png    — PhoneMockup, block 01 (all widths)
//   public/images/partners/customer-view.png — PhoneMockup, block 02 (all widths)
//
// NOTE (ТЗ-2/ТЗ-3, mockup rewrites): the two PNGs currently checked in were
// NOT produced by this script. They're hand-assembled (cropped/scaled/
// composited with Playwright, not this file's own capture flow) from
// screenshots taken manually against the live site and handed off for those
// passes — the client-card screen for staff, in particular, which this
// script's own captureStaffView()/captureStaffViewMobile() below still don't
// know how to reach (they search for a client and land on the directory, not
// a specific card). ТЗ-3 also dropped the synthetic browser chrome this
// script's staff capture was built around — both blocks are a phone mockup
// now, at every width, no browser window anywhere on the page — so even
// once this script is taught to reach the card screen, its 860×560
// desktop-viewport capture (see captureStaffView() below) is the wrong
// shape for what DesktopMockup.tsx's successor (PhoneMockup) actually
// consumes; that capture would need to change to a phone-shaped viewport
// like captureStaffViewMobile() already uses. This script is left intact as
// the fallback path, unreached by either ТЗ; bringing it in line with the
// hand-assembled client-card, phone-only versions is unstarted.
//
// Run with:
//   npm run capture:mockups                        # boots its own dev server
//   npm run capture:mockups -- --url=https://preview.vercel.app   # against a deployed preview instead
//   npm run capture:mockups -- --only=staff         # capture just one target
//   npm run capture:mockups -- --only=customer
//
// Against a Vercel preview protected by Deployment Protection, set
// VERCEL_AUTOMATION_BYPASS_SECRET (Project Settings → Deployment Protection →
// Protection Bypass for Automation) — every request then carries the
// x-vercel-protection-bypass header instead of hitting Vercel's own login wall.
// Read src/components/partners/PhoneMockup.tsx and its two call sites in
// PartnersClient.tsx before touching this file — the 860x560 desktop
// viewport captureStaffView() below targets is a leftover from the old
// browser-chrome staff mockup (see the NOTE above) and no longer matches
// what PhoneMockup actually consumes.
//
// SUPABASE: staff-view is a real render of the live /staff search screen,
// which means this script authenticates against whatever project
// NEXT_PUBLIC_SUPABASE_URL points at — that must be a demo project, never a
// real client's. It signs in as the demo staff account and only ever reads
// that screen; it never calls anything that creates a client, prescription,
// or sale.
//
// Playwright is deliberately not a dependency of this project: this is the
// one place that needs a browser, and pinning one would put a browser
// download in everyone's `npm install`. Install it ad hoc once —
//   npx playwright@1.49.0 install chromium
// — or point CHROMIUM_PATH at an existing Chromium if the Playwright-managed
// one isn't where it expects.
import path from "node:path";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { chromium } from "playwright";

const urlArg = process.argv.find((a) => a.startsWith("--url="));
const EXTERNAL_URL = urlArg ? urlArg.slice("--url=".length).replace(/\/$/, "") : null;
const ORIGIN = EXTERNAL_URL || "http://localhost:3000";
const DEV_SERVER_TIMEOUT_MS = 60_000;

const onlyArg = process.argv.find((a) => a.startsWith("--only="));
const ONLY = onlyArg ? onlyArg.slice("--only=".length) : null;
if (ONLY && ONLY !== "staff" && ONLY !== "customer") {
  throw new Error(`--only must be "staff" or "customer", got "${ONLY}"`);
}

// Vercel Deployment Protection sits in front of preview URLs by default and
// answers every unauthenticated request — including Playwright's — with
// Vercel's own login page instead of the app. Protection Bypass for
// Automation issues a secret that, sent as this header, skips that wall.
// Irrelevant (and unset) against a local dev server or an unprotected
// deployment, so it's applied unconditionally rather than gated on EXTERNAL_URL.
const VERCEL_BYPASS_SECRET = process.env.VERCEL_AUTOMATION_BYPASS_SECRET || null;
const EXTRA_HEADERS = VERCEL_BYPASS_SECRET
  ? { "x-vercel-protection-bypass": VERCEL_BYPASS_SECRET }
  : null;

const OUT_DIR = path.join(process.cwd(), "public", "images", "partners");
const STAFF_OUT = path.join(OUT_DIR, "staff-view.png");
const STAFF_MOBILE_OUT = path.join(OUT_DIR, "staff-view-mobile.png");
const CUSTOMER_OUT = path.join(OUT_DIR, "customer-view.png");

// Injected before any page script runs. Neutralizes CSS transitions and
// animations instantly — hover states, the ambient page backdrop's slow
// drift. Framer Motion's own enter animations (the mockup frames' fade-ins,
// the light-sweep overlay) are JS-driven rather than CSS, so this alone
// doesn't freeze them; each capture below also waits out their known
// duration for real before shooting, same as the customer-view capture
// already did before the two scripts were merged into this one.
const FREEZE_CSS = `
  *, *::before, *::after {
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    animation-duration: 0s !important;
    animation-delay: 0s !important;
  }
`;

// Reachable from the top-level signal/rejection handlers below, so an
// interrupted or crashed run still tears down whatever it started instead
// of leaving `next dev` or Chromium running in the background.
let activeBrowser = null;
let devCleanup = null;

async function shutdown(exitCode) {
  if (activeBrowser) {
    await activeBrowser.close().catch(() => {});
  }
  if (devCleanup) devCleanup();
  process.exit(exitCode);
}

process.on("SIGINT", () => shutdown(130));
process.on("SIGTERM", () => shutdown(143));
// Playwright's own APIs reject once a page/context/browser they were called
// against is closed out from under them — if that ever races an in-flight
// call (rather than being awaited and handled where it happens), this is
// the backstop that keeps it from silently orphaning the dev server.
process.on("unhandledRejection", (err) => {
  console.error(err);
  shutdown(1);
});

function requireDemoStaffCreds() {
  const email = process.env.DEMO_STAFF_EMAIL;
  const password = process.env.DEMO_STAFF_PASSWORD;
  if (!email || !password) {
    throw new Error(
      "съёмка /staff требует DEMO_STAFF_EMAIL и DEMO_STAFF_PASSWORD в .env"
    );
  }
  return { email, password };
}

async function isServerUp(url) {
  try {
    await fetch(url);
    return true;
  } catch {
    return false;
  }
}

async function waitForServer(url, timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await isServerUp(url)) return;
    await sleep(300);
  }
  throw new Error(`Timed out waiting for ${url} to respond`);
}

// Runs `fn` against a server at ORIGIN, booting `npm run dev` first if
// nothing is answering there yet (and only then — reusing one already up
// rather than fighting it for the port) and always tearing down whatever
// this call itself started, success or failure.
async function withServer(fn) {
  if (EXTERNAL_URL) return fn();

  if (await isServerUp(ORIGIN)) {
    console.log(`Reusing already-running server at ${ORIGIN}`);
    return fn();
  }

  console.log("Starting npm run dev…");
  // detached so the child gets its own process group — `next dev` forks its
  // own child process, and killing just the `npm` pid leaves that orphaned.
  const devProcess = spawn("npm", ["run", "dev"], {
    cwd: process.cwd(),
    stdio: "inherit",
    detached: true,
  });

  devCleanup = () => {
    if (!devProcess.pid) return;
    try {
      process.kill(-devProcess.pid, "SIGTERM");
    } catch {
      // Already gone.
    }
  };

  try {
    await waitForServer(ORIGIN, DEV_SERVER_TIMEOUT_MS);
    return await fn();
  } finally {
    devCleanup();
    devCleanup = null;
  }
}

// A protected Vercel preview answers every request with Vercel's own login
// wall (HTTP 401, title "Authentication Required", body naming "Vercel
// Authentication") instead of the app. Playwright can't tell that apart from
// a normal page load on its own — page.goto() and waitForURL() both consider
// it a success — so anything shot against a protected deployment would be a
// screenshot of that wall silently written out as if it were /staff. These
// two checks are the only thing standing between that and a loud failure.
async function looksLikeVercelProtectionPage(page) {
  const title = await page.title().catch(() => "");
  if (/authentication required/i.test(title)) return true;
  const body = await page.evaluate(() => document.body?.innerText || "").catch(() => "");
  return /vercel authentication/i.test(body) || /not publicly accessible/i.test(body);
}

async function assertNotVercelProtection(page) {
  if (await looksLikeVercelProtectionPage(page)) {
    throw new Error(
      `${page.url()} закрыт Vercel Deployment Protection — снимок получился бы страницей входа Vercel, а не приложением. ` +
        "Либо задай VERCEL_AUTOMATION_BYPASS_SECRET (Protection Bypass for Automation), либо сними защиту с этого превью в настройках проекта."
    );
  }
}

// Wraps page.goto() so a bad/unreachable --url produces one clear error
// instead of Playwright's own timeout/DNS stack trace, and so a Vercel
// protection wall is caught right at the first navigation rather than only
// surfacing later as a failed login.
async function gotoOrThrow(page, url) {
  let response;
  try {
    response = await page.goto(url, { waitUntil: "networkidle" });
  } catch (err) {
    throw new Error(`Не удалось открыть ${url} — адрес недоступен (${err.message})`);
  }
  if (response && response.status() >= 400 && !(await looksLikeVercelProtectionPage(page))) {
    throw new Error(`Не удалось открыть ${url} — сервер ответил ${response.status()}, проверь адрес`);
  }
  return response;
}

async function freezeMotion(context) {
  await context.addInitScript((css) => {
    const style = document.createElement("style");
    style.textContent = css;
    document.documentElement.appendChild(style);
  }, FREEZE_CSS);
}

// Races the redirect to /staff against the form's own inline error — plain
// Promise.race leaves whichever side loses still pending, and Playwright
// rejects that dangling call the moment the page/context it was waiting on
// gets closed later, as an *unhandled* rejection outside this function's own
// try/catch (see the top-level `unhandledRejection` handler). Every branch
// here gets its own .catch, so nothing is left dangling once one side wins.
function waitForLoginOutcome(page) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (fn) => (arg) => {
      if (settled) return;
      settled = true;
      fn(arg);
    };

    page
      .waitForURL((url) => url.pathname === "/staff", { timeout: 15_000 })
      .then(finish(resolve))
      .catch(finish(reject));

    page
      .getByText(/invalid email or password/i)
      .waitFor({ state: "visible", timeout: 15_000 })
      .then(
        finish(() =>
          reject(
            new Error(
              "Demo staff login failed — check DEMO_STAFF_EMAIL/DEMO_STAFF_PASSWORD and that the account exists in this Supabase project."
            )
          )
        )
      )
      .catch(() => {}); // Never appeared (login succeeded) — the URL branch already settled this.
  });
}

async function captureStaffView(browser) {
  const { email, password } = requireDemoStaffCreds();

  const context = await browser.newContext({
    viewport: { width: 860, height: 560 },
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
  });
  await freezeMotion(context);
  if (EXTRA_HEADERS) await context.setExtraHTTPHeaders(EXTRA_HEADERS);

  const page = await context.newPage();
  await gotoOrThrow(page, `${ORIGIN}/staff/login`);
  await assertNotVercelProtection(page);

  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);

  await page.click('button[type="submit"]');
  await waitForLoginOutcome(page);
  await page.waitForLoadState("networkidle");
  await assertNotVercelProtection(page);
  await page.evaluate(() => document.fonts.ready);

  // The search screen itself carries no Framer Motion of its own, but give
  // any hover/press state the click above left behind a moment to settle.
  await sleep(300);

  await page.screenshot({ path: STAFF_OUT });
  await context.close();
  console.log(`Wrote ${STAFF_OUT}`);
}

// The full staff-view capture above collapses into an unreadable grey
// texture once scaled down to a 390pt phone — statuses and dates disappear.
// This is a separate, dedicated login and capture at phone width instead of
// a crop of the desktop shot: cropping would still be scaling 860px-wide
// content down, the exact problem this exists to avoid. Content kept: the
// search bar and the first three client rows (name, status, last-visit
// date). Dropped: the "Find a client"/"New client" header row, the
// "Recently viewed" chip row, and the "All clients" filter/sort chip row —
// none of it reads at this size, and none of it is the point (ТЗ rewrite
// §9.2). Selectors below walk DOM structure rather than test ids, same as
// captureCustomerView's own section-index approach — brittle against a
// SearchScreen/ClientDirectoryTable markup change, but there's nothing
// stable to hook here today.
async function captureStaffViewMobile(browser) {
  const { email, password } = requireDemoStaffCreds();

  const context = await browser.newContext({
    viewport: { width: 390, height: 700 },
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
  });
  await freezeMotion(context);
  if (EXTRA_HEADERS) await context.setExtraHTTPHeaders(EXTRA_HEADERS);

  const page = await context.newPage();
  await gotoOrThrow(page, `${ORIGIN}/staff/login`);
  await assertNotVercelProtection(page);

  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);

  await page.click('button[type="submit"]');
  await waitForLoginOutcome(page);
  await page.waitForLoadState("networkidle");
  await assertNotVercelProtection(page);
  await page.evaluate(() => document.fonts.ready);
  await sleep(300);

  const clipHeight = await page.evaluate(() => {
    // layout.tsx: <main class="max-w-2xl mx-auto p-4">{children}</main>,
    // children === SearchScreen's own root (space-y-4: header row, search
    // box, then — with no query typed and at least one client — a
    // space-y-6 wrapping RecentlyViewedRow and ClientDirectoryTable).
    // .remove() rather than display:none — Tailwind's space-y-* applies
    // margin-top by a `:not([hidden]) ~ :not([hidden])` sibling selector,
    // which still matches a display:none sibling (only the `hidden`
    // attribute is excluded) and would leave a phantom gap where the
    // removed row used to be.
    const main = document.querySelector("main");
    const root = main.children[0];
    const [headerRow, , content] = root.children;
    headerRow.remove();

    // ClientDirectoryTable's own root (space-y-3: the "All clients" label +
    // filter/sort row, then the row list).
    const [recentlyViewed, directory] = content.children;
    recentlyViewed.remove();
    const [filterSortRow, rowList] = directory.children;
    filterSortRow.remove();
    [...rowList.children].slice(3).forEach((el) => el.remove());

    return rowList.getBoundingClientRect().bottom;
  });

  await page.screenshot({
    path: STAFF_MOBILE_OUT,
    clip: { x: 0, y: 0, width: 390, height: Math.round(clipHeight) },
  });
  await context.close();
  console.log(`Wrote ${STAFF_MOBILE_OUT}`);
}

async function captureCustomerView(browser) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
  });
  await freezeMotion(context);
  if (EXTRA_HEADERS) await context.setExtraHTTPHeaders(EXTRA_HEADERS);

  // Past the age gate, and in English: the mockup sits on a page read by shop
  // owners in three languages, and the screen inside it stays one of them.
  // Staging below is unchanged from before this script existed.
  await context.addCookies([{ name: "age_verified_20", value: "1", url: ORIGIN }]);
  await context.addInitScript(() => {
    localStorage.setItem(
      "buds-digital-cart-v2",
      JSON.stringify({ state: { items: [], lang: "en" }, version: 0 })
    );
  });

  const page = await context.newPage();
  await gotoOrThrow(page, `${ORIGIN}/demo`);
  await assertNotVercelProtection(page);
  await page.evaluate(() => document.fonts.ready);

  await page.evaluate(() => {
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

    // DemoBar (the "DEMO STORE — sample data" strip) sits two siblings above
    // header — real, useful context on the live demo site, but debris inside
    // a mockup meant to read as a generic storefront. The sibling directly
    // above header is Header's own scroll sentinel (a 1px div it renders
    // for its sticky logic, see layout/Header.tsx), not DemoBar itself.
    // Hiding it also frees the header's own stickyOffset gap above it (see
    // HomeClient.tsx, DEMO_BAR_HEIGHT), so header's inline `top` needs
    // resetting too or it leaves that gap empty at the frame's very top.
    const demoBar = header.previousElementSibling?.previousElementSibling;
    if (demoBar) demoBar.style.display = "none";
    header.style.top = "0px";

    // sections[0] is the hero-cards grid; everything from sections[1] on —
    // starting with the "Flowers. Done properly." tagline section — is
    // dropped. That tagline used to be pulled up under the cards and kept
    // in the composite, but at mockup scale it renders at ~9-10px tilted
    // and unreadable while still eating room in an already dense block, so
    // the composite now ends right under the second card (ТЗ rewrite
    // §9.1).
    sections.slice(1).forEach((el) => { el.style.display = "none"; });
    sections[0].style.paddingBottom = "0px";
  });

  // The hero cards animate in on scroll; give them their moment before shooting.
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(600);

  // Crop tight to just below the second card, plus a short tail of the
  // page's own dark background — DeviceMockup's own mask-image fades that
  // tail out over the crop's last ~8%, the same "uh into darkness" it
  // already does today, just starting right after the cards instead of
  // after the (now-hidden) tagline.
  const cardsBottom = await page.evaluate(() => {
    const mains = document.querySelectorAll("main");
    const main = mains[mains.length - 1];
    return main.children[0].getBoundingClientRect().bottom;
  });
  const CROP_TAIL = 50;
  await page.screenshot({
    path: CUSTOMER_OUT,
    clip: { x: 0, y: 0, width: 390, height: Math.round(cardsBottom + CROP_TAIL) },
  });
  await context.close();
  console.log(`Wrote ${CUSTOMER_OUT}`);
}

// Fails on missing creds before booting anything, per the ТЗ: no silent
// fallback to a screenshot of the login screen. Only required when staff is
// actually being captured — --only=customer never touches /staff.
if (ONLY !== "customer") requireDemoStaffCreds();

await withServer(async () => {
  const browser = await chromium.launch(
    process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}
  );
  activeBrowser = browser;
  try {
    if (ONLY !== "customer") {
      await captureStaffView(browser);
      await captureStaffViewMobile(browser);
    }
    if (ONLY !== "staff") await captureCustomerView(browser);
  } finally {
    await browser.close();
    activeBrowser = null;
  }
});
