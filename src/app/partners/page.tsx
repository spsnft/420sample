import type { Metadata } from "next"
import PartnersClient from "@/components/partners/PartnersClient"

// B2B pitch page for dispensary/vape shop owners, served at partners.buds.digital
// (see middleware.ts for the host → /partners rewrite). Deliberately kept out
// of search results and off the public buds.digital nav — this is a
// cold-outreach landing page, not a consumer page.
export const metadata: Metadata = {
  title: "buds.digital for Business",
  description: "A ready-made public page and staff compliance panel for your dispensary — live in one day.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "buds.digital for Business",
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
