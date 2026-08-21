import type { Metadata } from "next"
import HomeClient from "@/components/HomeClient"
import { siteConfig } from "@/config/site"

// The storefront demo, one path off buds.digital's apex (see middleware.ts —
// the apex "/" itself now serves the B2B pitch page). Shown to prospective
// dispensary owners, not a real shop's public page. Noindex: it's meant to
// be opened from a link the pitch page hands out, not found on its own (see
// robots.ts, which disallows this path outright).
export const metadata: Metadata = {
  title: siteConfig.name,
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
