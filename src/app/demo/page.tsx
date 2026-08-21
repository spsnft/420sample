import type { Metadata } from "next"
import HomeClient from "@/components/HomeClient"
import { siteConfig } from "@/config/site"

// The storefront demo, one path off buds.digital's apex (see middleware.ts —
// the apex "/" itself now serves the B2B pitch page). Shown to prospective
// dispensary owners, not a real shop's public page. Noindex meta tag is what
// actually keeps it out of search (see robots.ts — a Disallow there would
// stop a crawler from ever seeing this tag in the first place).
export const metadata: Metadata = {
  // `absolute`, not a plain string: a plain string gets the root layout's
  // "%s - 420 Store" template appended even when it already equals the
  // template's own default, producing "420 Store - 420 Store".
  title: { absolute: siteConfig.name },
  description: siteConfig.description,
  robots: { index: false, follow: false },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
  },
}

export default function DemoPage() {
  return (
    <main>
      <HomeClient />
    </main>
  );
}
