import type { Metadata } from "next"
import PartnersClient from "@/components/partners/PartnersClient"

// B2B pitch page for dispensary/vape shop owners, served at buds.digital's
// apex (see middleware.ts for the host → /partners rewrite). This is now the
// product's main marketing surface and is meant to be found by search — the
// storefront demo it links out to (partners.buds.digital) carries the
// noindex instead (see app/page.tsx).
export const metadata: Metadata = {
  // `absolute` bypasses the root layout's `%s - 420 Store` title template —
  // this title already ends in "420 Store" on its own, and the template
  // would otherwise double it up to "...420 Store - 420 Store".
  title: { absolute: "Dispensary CRM & Web-App — 420 Store" },
  description: "A ready-made public page and staff compliance panel for your dispensary — live in one day.",
  openGraph: {
    title: "Dispensary CRM & Web-App — 420 Store",
    description: "A ready-made public page and staff compliance panel for your dispensary — live in one day.",
  },
}

export default function PartnersPage() {
  return (
    <main>
      <PartnersClient />
    </main>
  );
}
