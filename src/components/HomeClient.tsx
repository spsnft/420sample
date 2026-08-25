"use client"
import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  MapPin, Clock, ShieldCheck, Star, Instagram, ArrowUpRight,
  Image as ImageIcon, Leaf, Phone, type LucideIcon,
} from "lucide-react"

import { useCart } from "@/lib/cart-store"
import { translations, Language } from "@/lib/translations"
import { Header } from "@/components/layout/Header"
import { DemoBar } from "@/components/layout/DemoBar"
import { LineIcon, WhatsAppIcon } from "@/components/icons/BrandIcons"
import { Consultation } from "@/components/modals"
import { HeroCard } from "@/components/cards/HeroCard"
import { Tooltip } from "@/components/ui/Tooltip"
import { siteConfig } from "@/config/site"
import { triggerHaptic } from "@/lib/utils"

// DemoBar's fixed height (h-9, 36px) — passed to Header so the two sticky
// bars stack instead of both landing on top:0 and overlapping.
const DEMO_BAR_HEIGHT = 36;

// "\n" in a translation string marks the line break a card title renders as
// a <br/> (see lib/translations.ts).
function renderLines(text: string): React.ReactNode {
  return text.split("\n").map((line, i) => (
    <React.Fragment key={i}>
      {i > 0 && <br />}
      {line}
    </React.Fragment>
  ));
}

// Darker-than-panel flat tones for the oversized watermark icons — one tone
// down from each door's own gradient, not white/accent-gold.
const GOLD_DOOR_WATERMARK = "#8B6A38";
const OLIVE_DOOR_WATERMARK = "#142117";

// The shop's own photograph, beside the map — the two together are the whole
// answer to "is this a real place, and where".
//
// It falls back to the dashed placeholder if the file is not there, which is
// deliberate rather than defensive: it means the photo can be dropped into
// public/images/about/ at any time, by anyone, with no code change and no
// deploy of ours — the page picks it up on its own. Same pattern the product
// cards use for a missing product image. Shoot it roughly 16:9 and at least
// 1400px wide; next/image takes care of the format and the sizes it serves.
//
// Either extension works, tried in order. A photograph naturally saves as
// either, and "drop the file in and it appears" is not much of a promise if it
// only holds for one of the two names — this cost one line and removes the
// only way left to get it wrong.
const STOREFRONT_PHOTOS = [
  "/images/about/storefront.png",
  "/images/about/storefront.jpg",
];

const StorefrontPhoto: React.FC<{ label: string; alt: string; className?: string }> = ({ label, alt, className = "" }) => {
  const [attempt, setAttempt] = React.useState(0);
  const src = STOREFRONT_PHOTOS[attempt];

  return (
    <div className={`relative surface rounded-card overflow-hidden ${className}`}>
      <div className="relative w-full aspect-[16/9] lg:aspect-auto lg:h-full lg:min-h-[224px] rounded-card overflow-hidden bg-black/20">
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 512px, 100vw"
            onError={() => setAttempt(a => a + 1)}
          />
        ) : (
          <div className="absolute inset-0 border border-dashed border-brand-secondary/25 rounded-card flex flex-col items-center justify-center gap-2 text-brand-light/30">
            <ImageIcon size={22} />
            <span className="text-[10px] font-black uppercase tracking-wide">{label}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Boat Avenue, Cherngtalay/Bang Tao, Phuket — the neutral public landmark
// siteConfig.address and mapOpenUrl already point at (not any specific
// dispensary's real coordinates). Looked up once via Google's own redirect
// for that place (goo.gl/maps/LxVaLsSyr2f5821Z6 → .../@7.9935695,98.3049359
// .../3d7.9935586/4d98.3049313) rather than estimated from the address text.
const MAP_LAT = 7.9935586;
const MAP_LON = 98.3049313;
// 15 is the level a "how do I get there" glance needs — road names and the
// coastline both read at this zoom without the tile grid needing to be
// large enough to feel wasteful.
const MAP_ZOOM = 15;
const TILE_SIZE = 256;
// 5x5 tiles centered on MAP_LAT/LON — 1280x1280px, comfortably larger than
// this block gets on any real layout (its widest point is well under
// 1280px, from the 45/55 split... a two-column grid at most a few hundred
// px), so the grid always fully covers the visible area after centering,
// with no edge ever showing through.
const MAP_GRID_RADIUS = 2;

// Standard Web Mercator slippy-map projection (the same math every tile
// provider's {x}/{y}/{z} scheme is built on) — converts a lat/lon into a
// fractional "world pixel" position at a given zoom, which is what lets the
// grid below be centered on the *exact* coordinate rather than just
// snapped to whichever tile contains it.
function projectToTilePixels(lat: number, lon: number, zoom: number) {
  const latRad = (lat * Math.PI) / 180;
  const scale = 2 ** zoom;
  const x = ((lon + 180) / 360) * scale;
  const y = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * scale;
  return { x, y };
}

const mapCenterPx = projectToTilePixels(MAP_LAT, MAP_LON, MAP_ZOOM);
const mapCenterTileX = Math.floor(mapCenterPx.x);
const mapCenterTileY = Math.floor(mapCenterPx.y);
// Where MAP_LAT/LON actually falls within its own tile (0-256, not
// necessarily the tile's center) — the grid gets shifted by exactly this
// much off its own geometric middle so the real coordinate, not just the
// tile boundary, lands under the pin.
const mapOffsetX = (mapCenterPx.x - mapCenterTileX) * TILE_SIZE;
const mapOffsetY = (mapCenterPx.y - mapCenterTileY) * TILE_SIZE;
const mapShiftX = TILE_SIZE / 2 - mapOffsetX;
const mapShiftY = TILE_SIZE / 2 - mapOffsetY;
const MAP_GRID_PX = (MAP_GRID_RADIUS * 2 + 1) * TILE_SIZE;

// CARTO's Dark Matter basemap — free, no API key, no account (the fair-use
// key CARTO's docs mention is for their hosted analytics/Maps APIs; the
// public basemap CDN itself has served unauthenticated {z}/{x}/{y} tile
// requests this way for years, confirmed live at the URL below rather than
// assumed). Subdomains a-d spread requests across the CDN, which is why
// tile position (not something arbitrary) picks which one each uses.
const MAP_TILE_SUBDOMAINS = ["a", "b", "c", "d"];
// url is built per-render now, not baked in here — CARTO serves the same
// {z}/{x}/{y} tile at higher pixel density behind a "@2x"/"@3x" suffix, and
// which one to ask for depends on the visitor's own devicePixelRatio (see
// tileUrl + StorefrontMap's tileScale state below), not anything known at
// module load.
const mapTiles: { key: string; left: number; top: number; tileX: number; tileY: number; subdomain: string }[] = [];
for (let dy = -MAP_GRID_RADIUS; dy <= MAP_GRID_RADIUS; dy++) {
  for (let dx = -MAP_GRID_RADIUS; dx <= MAP_GRID_RADIUS; dx++) {
    const tileX = mapCenterTileX + dx;
    const tileY = mapCenterTileY + dy;
    const subdomain = MAP_TILE_SUBDOMAINS[(tileX + tileY) % MAP_TILE_SUBDOMAINS.length];
    mapTiles.push({
      key: `${tileX}-${tileY}`,
      left: (dx + MAP_GRID_RADIUS) * TILE_SIZE,
      top: (dy + MAP_GRID_RADIUS) * TILE_SIZE,
      tileX,
      tileY,
      subdomain,
    });
  }
}

// scale 1 requests the plain tile; 2 or 3 appends CARTO's own "@2x"/"@3x"
// suffix for a higher pixel-density image rendered into the same
// TILE_SIZE box, so it looks sharp on retina screens instead of the 1x
// raster being upscaled by the browser. Confirmed live: CARTO serves a
// genuinely larger PNG behind each suffix (256², 512², 768² for 1x/2x/3x on
// the same tile), not just the 1x image re-served.
function tileUrl(subdomain: string, tileX: number, tileY: number, scale: number): string {
  const suffix = scale >= 2 ? `@${scale}x` : "";
  return `https://${subdomain}.basemaps.cartocdn.com/dark_all/${MAP_ZOOM}/${tileX}/${tileY}${suffix}.png`;
}

// Real geography, not a schematic placeholder: a grid of CARTO Dark Matter
// tiles (audit ТЗ pitch-layout-2 №1 — a blank abstract grid read as "the
// map failed to load," worse than no map at all) — actual coastline, roads
// and place names, in a basemap that's already dark by design rather than
// a light tile with a dark filter over it. No address text inside the
// block any more; the info strip below is now the address's only home
// (пп. №2 — it used to appear in both places, ~200px apart on desktop).
//
// Google's Maps Embed still can't go dark without an API key this project
// doesn't have (see the previous attempt's note, kept for context: the
// classic no-key `maps.google.com/maps?...&output=embed` iframe doesn't
// accept a `styles` param at all) — this route sidesteps that entirely by
// not going through Google for the visible tiles, while "Open in Maps"
// still opens the real Google Maps listing.
const StorefrontMap: React.FC<{ openLabel: string; href: string; className?: string }> = ({ openLabel, href, className = "" }) => {
  // Starts unset — devicePixelRatio doesn't exist during SSR, and guessing
  // 1 here would mean every retina visitor fetches the low-res tile first
  // and the correct one right behind it, paying for 25 requests twice. The
  // tiles below don't render until this resolves, right after mount, so
  // each one is only ever fetched once, at the resolution it needed all
  // along. No hydration mismatch either: server and first client paint
  // both show the plain dark background + pin, same as a slow tile load
  // already looks while `loading="lazy"` catches up.
  const [tileScale, setTileScale] = React.useState<number | null>(null);

  React.useEffect(() => {
    const dpr = window.devicePixelRatio || 1;
    setTileScale(dpr >= 3 ? 3 : dpr >= 2 ? 2 : 1);
  }, []);

  return (
  <div className={`relative surface rounded-card overflow-hidden ${className}`}>
    <div className="relative w-full aspect-[16/9] lg:aspect-auto lg:h-full lg:min-h-[224px] rounded-card overflow-hidden bg-[#0c0e0f]">
      <div
        aria-hidden
        className="absolute"
        style={{
          width: MAP_GRID_PX,
          height: MAP_GRID_PX,
          top: "50%",
          left: "50%",
          transform: `translate(calc(-50% + ${mapShiftX}px), calc(-50% + ${mapShiftY}px))`,
        }}
      >
        {tileScale !== null && mapTiles.map((tile) => (
          // eslint-disable-next-line @next/next/no-img-element -- fixed-size
          // external tiles at exact pixel coordinates; next/image's own
          // optimizer has nothing to add here and would need the CARTO CDN
          // allow-listed in next.config for no benefit.
          <img
            key={tile.key}
            src={tileUrl(tile.subdomain, tile.tileX, tile.tileY, tileScale)}
            alt=""
            width={TILE_SIZE}
            height={TILE_SIZE}
            loading="lazy"
            style={{ position: "absolute", left: tile.left, top: tile.top, width: TILE_SIZE, height: TILE_SIZE }}
            // A tile failing to load (offline, CDN hiccup) disappears
            // instead of showing a broken-image glyph — the dark
            // background underneath reads as fine either way.
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-9 h-9 rounded-full bg-brand-secondary/20 border border-brand-secondary/50 flex items-center justify-center text-brand-secondary shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
          <MapPin size={18} />
        </div>
      </div>

      {/* Small and in the corner, per the provider's terms — legible on
          request, not competing with the map itself. */}
      <p className="absolute bottom-1.5 left-2 text-[8px] leading-none text-brand-light/30">
        ©{" "}
        <a href="https://carto.com/attributions" target="_blank" rel="noopener" className="hover:text-brand-light/50">
          CARTO
        </a>
        , ©{" "}
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener" className="hover:text-brand-light/50">
          OpenStreetMap
        </a>
      </p>

      <Link
        href={href}
        target="_blank"
        rel="noopener"
        onClick={() => triggerHaptic('light')}
        className="absolute bottom-3 right-3 inline-flex items-center gap-1 h-8 pl-3 pr-2.5 rounded-full bg-brand-dark/85 border border-white/10 text-[11px] font-black uppercase tracking-wide text-brand-light/80 hover:text-brand-light active:scale-95 transition-all"
      >
        {openLabel}
        <ArrowUpRight size={12} />
      </Link>
    </div>
  </div>
  );
};

// siteConfig.workingHours prints as "12:00 — 00:00" — open at noon, closed
// at the *end* of the day, not reopening at midnight. So the live status
// below only ever needs a lower bound: any hour from SHOP_OPEN_HOUR through
// 23:00 counts as open, and the printed "00:00" close time is never treated
// as literal hour 0 (that bug would make the shop look permanently closed).
const SHOP_OPEN_HOUR = 12;
// The opening time shown in "Closed · opens {time}" — read from
// siteConfig.workingHours itself so it can't drift out of sync with the
// hours actually printed next to it.
const SHOP_OPEN_TIME_LABEL = siteConfig.workingHours.split("—")[0].trim();

// Bangkok's current hour, independent of the visitor's own timezone —
// Intl's timeZone option does the conversion, no manual UTC-offset math.
function getBangkokHour(): number {
  const hourStr = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Bangkok",
    hour: "numeric",
    hour12: false,
  }).format(new Date());
  // hour12: false prints the midnight hour as "24" in some runtimes.
  return Number(hourStr) % 24;
}

// One cell of the collapsed info strip below. Label sits above value,
// not beside it — three labels of different lengths (ADDRESS, WORKING
// HOURS, REVIEWS) starting their values at three different x-positions
// read as the text jittering line to line (audit ТЗ pitch-layout-2 №3).
// Stacked, both edges land on the same left edge regardless of label
// length, and the label (small, muted, uppercase) reads clearly lighter
// than the value (larger, full-strength) it sits above — before, at
// similar size and weight, WORKING HOURS nearly matched 12:00 — 00:00.
// Row height (h-14, 56px) is unchanged from the single-line layout it
// replaces, so the strip's total height doesn't grow.
const InfoRow: React.FC<{ icon: LucideIcon; label: string; value: React.ReactNode }> = ({ icon: Icon, label, value }) => (
  <div className="h-14 px-3 lg:flex-1 flex items-center gap-2.5">
    <div className="w-7 h-7 rounded-full border border-brand-secondary/30 bg-brand-secondary/15 flex items-center justify-center text-brand-secondary shrink-0">
      <Icon size={13} />
    </div>
    <div className="min-w-0 text-left">
      <p className="text-[9px] font-bold uppercase tracking-wide text-brand-light/35 leading-none">{label}</p>
      <p className="mt-1 text-[13px] font-bold text-brand-light leading-none truncate">{value}</p>
    </div>
  </div>
);

export default function HomeClient({ demoInstance = false }: { demoInstance?: boolean }) {
  const { lang } = useCart();
  const safeLang = (lang || 'en') as Language;
  const t = translations[safeLang] || translations.en;
  const [showConsultModal, setShowConsultModal] = React.useState(false);
  // null until the first client-side check — Bangkok's current hour isn't
  // knowable at SSR time, so this starts unset rather than guessing and
  // risking a hydration mismatch against the real value.
  const [isShopOpen, setIsShopOpen] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const check = () => setIsShopOpen(getBangkokHour() >= SHOP_OPEN_HOUR);
    check();
    // Re-checks once a minute so the badge flips live at 12:00 Bangkok time
    // for anyone who leaves the tab open across it, not just on next load.
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []);

  const openConsult = () => {
    triggerHaptic('light');
    setShowConsultModal(true);
  };

  // Stable identity: the dialog's focus trap keys off this callback, and a new
  // function on every render would re-run it — pulling focus back to the top of
  // the form mid-sentence.
  const closeConsult = React.useCallback(() => setShowConsultModal(false), []);

  return (
    // No fill of its own: an opaque brand-primary here covered the site's
    // backdrop, which is why the atmosphere used to exist on /menu alone.
    // The corner leaf watermarks this page used to carry here (top-right,
    // bottom-left) are gone — the same "cheap cannabis site" stamp /staff
    // already dropped its own copies of, for the same reason (audit ТЗ
    // pitch-layout №8). The backdrop's own ambient gradient is untouched.
    <div className="relative min-h-screen text-brand-light p-4 selection:bg-brand-secondary/30 font-sans">
      <DemoBar label={t.demoBarLabel} cta={t.demoBarCta} />
      <Header safeLang={safeLang} sticky stickyOffset={DEMO_BAR_HEIGHT} demoInstance={demoInstance} />

      <main className="max-w-xl lg:max-w-4xl mx-auto space-y-6 relative z-10 pt-3">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
          <HeroCard
            onClick={openConsult}
            haptic="light"
            gradient="linear-gradient(135deg, #D4B67F 0%, #A67F3F 100%)"
            watermarkIcon={ShieldCheck}
            watermarkColor={GOLD_DOOR_WATERMARK}
            title={renderLines(t.heroDoorCertTitle)}
            titleClassName="text-brand-primary"
            tagline={t.heroDoorCertLine}
            taglineClassName="text-brand-primary/60"
            rippleClassName="bg-brand-primary/15"
          />

          <HeroCard
            href="/menu"
            haptic="medium"
            gradient="linear-gradient(135deg, #3A543F 0%, #1E3322 100%)"
            watermarkIcon={Leaf}
            watermarkColor={OLIVE_DOOR_WATERMARK}
            title={renderLines(t.heroDoorMenuTitle)}
            titleClassName="text-brand-light"
            tagline={t.heroDoorMenuLine}
            taglineClassName="text-brand-light/60"
            rippleClassName="bg-white/20"
            nudgeDelay={0.15}
          />
        </section>

        <section className="py-8 lg:py-14 text-center space-y-3">
          {/* Hardcoded in English across all locales — not translated (see item 7).
              Sans now, matching every other page (was the one serif moment on
              the site) — font-semibold in place of the serif's own unset
              (regular) weight is what keeps the line's visual weight from
              dropping: a grotesque sans at regular weight reads noticeably
              lighter than a serif at the same size, with none of the serif's
              stroke contrast to lean on. Checked against a side-by-side
              screenshot of the old serif line — semibold was the closest
              match; font-bold alone read visibly heavier than the original. */}
          <p className="font-semibold text-[28px] sm:text-[36px] lg:text-[44px] text-brand-light leading-snug tracking-tight">
            Flowers. Done properly.
          </p>
          <p className="text-[15px] sm:text-[17px] font-bold text-brand-light/60">
            {t.aboutLead}
          </p>
        </section>

        <section className="space-y-4">
          {/* Map before photo on mobile, photo before map on desktop — DOM
              order carries the mobile stack (map first), lg:order-* swaps
              them back for the two-column grid so the desktop pairing is
              unchanged. className lives on each component's own root (the
              actual grid item) rather than on a wrapping div, so the
              lg:h-full/min-h that keeps both columns equal height still
              resolves against a real grid-stretched box. */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <StorefrontMap openLabel={t.mapOpenCta} href={siteConfig.mapOpenUrl} className="lg:order-2" />
            <StorefrontPhoto label={t.aboutPhotoLabel} alt={siteConfig.name} className="lg:order-1" />
          </div>

          {/* One collapsed strip instead of three ~150px cards — each used
              to carry a single line of text in that much height, which on
              mobile stacked into ~450px of mostly empty screen (audit ТЗ
              pitch-layout №7). Reviews keeps the same tap-for-tooltip
              treatment as the contacts row below (ТЗ №2.2) since it's still
              not wired to a real Google listing on this demo. Three equal
              thirds in a row at lg (a vertical hairline between them
              instead of the mobile stack's horizontal one). */}
          <div className="surface rounded-card divide-y divide-white/10 lg:flex lg:divide-y-0 lg:divide-x">
            <InfoRow icon={MapPin} label={t.addressLabel} value={siteConfig.address} />
            <InfoRow
              icon={Clock}
              label={t.hoursLabel}
              value={
                <span className="inline-flex items-baseline gap-1.5">
                  <span className="tracking-[0.1em]">{siteConfig.workingHours}</span>
                  {isShopOpen !== null && (
                    <span className={`tracking-normal font-bold ${isShopOpen ? "text-emerald-400" : "text-brand-light/40"}`}>
                      · {isShopOpen ? t.hoursOpenNow : t.hoursClosedOpensAt.replace("{time}", SHOP_OPEN_TIME_LABEL)}
                    </span>
                  )}
                </span>
              }
            />
            <Tooltip text={t.reviewsTooltip} className="w-full lg:flex-1">
              <button type="button" className="w-full h-full text-left">
                <InfoRow icon={Star} label={t.reviewsLabel} value={`${siteConfig.trustBadge.rating} · ${siteConfig.trustBadge.reviews}`} />
              </button>
            </Tooltip>
          </div>
        </section>

        <section>
          <p className="text-[11px] font-black uppercase tracking-wide text-brand-light/40 mb-3 text-center">
            {t.contactsTitle}
          </p>
          {/* Icon-only, unlike the pitch page's WhatsApp/LINE buttons —
              these carry no visible label of their own, so aria-label is
              their only accessible name, not a dedup of one that's also
              visible. A visually-hidden span backs it up in case
              aria-label ever gets dropped in a future edit (ТЗ №2,
              "Вернуть aria-label иконкам контактов" — this must stay
              scoped to icon-only links; the pitch page's icon+text
              buttons keep the dedup from M5).

              Plain buttons, not links — there's no real destination on this
              demo instance (see config/site.ts, contacts) — wrapped in one
              shared Tooltip so a tap anywhere in the row answers once for
              the whole group instead of needing its own popup per icon
              (audit ТЗ pitch-layout №2.1). Phone is the one exception: it's
              a real tel: link (the demo number below), but still lives
              inside the same Tooltip — a tap shows the same explanatory
              bubble as the others, on top of whatever the OS does with the
              tel: link itself. */}
          <Tooltip text={t.contactsTooltip} className="w-full">
            <div className="flex items-center justify-center gap-3">
              <div className="surface rounded-button">
                <a href="tel:+6676123456" aria-label="Phone" className="w-[46px] h-[46px] flex items-center justify-center rounded-button active:scale-90 transition-all">
                  <Phone size={20} className="opacity-80" />
                  <span className="sr-only">Phone</span>
                </a>
              </div>
              <div className="surface rounded-button">
                <button type="button" aria-label="LINE" className="w-[46px] h-[46px] flex items-center justify-center rounded-button active:scale-90 transition-all">
                  <LineIcon size={20} className="opacity-80" />
                  <span className="sr-only">LINE</span>
                </button>
              </div>
              <div className="surface rounded-button">
                <button type="button" aria-label="WhatsApp" className="w-[46px] h-[46px] flex items-center justify-center rounded-button active:scale-90 transition-all">
                  <WhatsAppIcon size={20} className="opacity-80" />
                  <span className="sr-only">WhatsApp</span>
                </button>
              </div>
              <div className="surface rounded-button">
                <button type="button" aria-label="Instagram" className="w-[46px] h-[46px] flex items-center justify-center rounded-button active:scale-90 transition-all">
                  <Instagram size={20} className="opacity-80" />
                  <span className="sr-only">Instagram</span>
                </button>
              </div>
            </div>
          </Tooltip>
        </section>

        <div className="pb-6 text-center">
          <p className="text-[10px] text-brand-light/30 leading-relaxed">{t.footerDisclaimer}</p>
        </div>
      </main>

      {showConsultModal && (
        <Consultation t={t} onClose={closeConsult} />
      )}
    </div>
  );
}
