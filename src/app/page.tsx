import type { Metadata } from "next"
import PartnersClient from "@/components/partners/PartnersClient"
import { siteConfig } from "@/config/site"

const TITLE = "buds.digital — Storefront, live menu & PT.33 records"
const DESCRIPTION = "A ready-made storefront, live menu and PT.33 client panel for your dispensary on Phuket. From ฿9,000."

// B2B pitch page for dispensary/vape shop owners, served at buds.digital's
// own apex — the product's main marketing surface, meant to be found by
// search (see robots.ts — this is the one path left fully open, AI
// crawlers included). The storefront demo it links out to (/demo) carries
// the noindex instead (see app/demo/page.tsx).
//
// openGraph and twitter are both spelled out in full here rather than
// relying on the root layout's defaults to carry over: Next.js replaces a
// route's `openGraph`/`twitter` object wholesale rather than deep-merging
// it, so a route that only overrides `title`/`description` silently loses
// the layout's `images` (no og:image at all) while `twitter` keeps
// pointing at the layout's "YOUR STORE" copy untouched. This is the
// product's main shared link — chat previews are the primary distribution
// channel — so it gets its own complete set of both.
export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: siteConfig.partners.url,
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "buds.digital",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/opengraph-image.png"],
  },
}

export default function PitchPage() {
  return (
    <main>
      <PartnersClient />
    </main>
  );
}
