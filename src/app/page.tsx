import type { Metadata } from "next"
import HomeClient from "@/components/HomeClient"
import { siteConfig } from "@/config/site"

// Reached at partners.buds.digital post domain-swap (see middleware.ts) — a
// storefront demo shown to prospective dispensary owners, not a real shop's
// public page. Noindex mirrors what the B2B pitch page carried before the
// swap: it's meant to be opened from a link the pitch page hands out, not
// found on its own.
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

export default function HomePage() {
  return (
    <main>
      <HomeClient />
    </main>
  );
}
