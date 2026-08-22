// Recaptures both product screenshots on the buds.digital pitch page ("/"):
//   public/images/partners/staff-view.png    — DesktopMockup, block 01
//   public/images/partners/customer-view.png — DeviceMockup, block 02
//
// Run with:
//   npm run capture:mockups                        # boots its own dev server
//   npm run capture:mockups -- --url=https://preview.vercel.app   # against a deployed preview instead
//
// Read src/components/partners/DesktopMockup.tsx and DeviceMockup.tsx before
// touching this file — they explain why the staff shot is 860x560 rather
// than a full desktop width (client rows turn to mush once scaled down from
// wider), and exactly what the customer-view composite drops and why.
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

const OUT_DIR = path.join(process.cwd(), "public", "images", "partners");
const STAFF_OUT = path.join(OUT_DIR, "staff-view.png");
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

  const page = await context.newPage();
  await page.goto(`${ORIGIN}/staff/login`, { waitUntil: "networkidle" });

  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);

  await page.click('button[type="submit"]');
  await waitForLoginOutcome(page);
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);

  // The search screen itself carries no Framer Motion of its own, but give
  // any hover/press state the click above left behind a moment to settle.
  await sleep(300);

  await page.screenshot({ path: STAFF_OUT });
  await context.close();
  console.log(`Wrote ${STAFF_OUT}`);
}

async function captureCustomerView(browser) {
  // Air above the tagline block, replacing the page's own section padding.
  const TAGLINE_PAD = 40;

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
  });
  await freezeMotion(context);

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
  await page.goto(`${ORIGIN}/demo`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

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

    sections.slice(2).forEach((el) => { el.style.display = "none"; });
    sections[1].style.paddingTop = `${pad}px`;
    sections[1].style.paddingBottom = "0px";
  }, TAGLINE_PAD);

  // The hero cards animate in on scroll; give them their moment before shooting.
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(600);

  await page.screenshot({ path: CUSTOMER_OUT });
  await context.close();
  console.log(`Wrote ${CUSTOMER_OUT}`);
}

// Fails on missing creds before booting anything, per the ТЗ: no silent
// fallback to a screenshot of the login screen.
requireDemoStaffCreds();

await withServer(async () => {
  const browser = await chromium.launch(
    process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}
  );
  activeBrowser = browser;
  try {
    await captureStaffView(browser);
    await captureCustomerView(browser);
  } finally {
    await browser.close();
    activeBrowser = null;
  }
});
