import type { Metadata } from "next"
import PartnersClient from "@/components/partners/PartnersClient"

// B2B pitch page for dispensary/vape shop owners, served at buds.digital's
// own apex — the product's main marketing surface, meant to be found by
// search. The storefront demo it links out to (/demo) carries the noindex
// instead (see app/demo/page.tsx).
export const metadata: Metadata = {
  title: { absolute: "buds.digital — Storefront, live menu & PT.33 records" },
  description: "A ready-made storefront, live menu and PT.33 compliance panel for your dispensary — one system, built by FT.Agency.",
  openGraph: {
    title: "buds.digital — Storefront, live menu & PT.33 records",
    description: "A ready-made storefront, live menu and PT.33 compliance panel for your dispensary — one system, built by FT.Agency.",
  },
}

export default function PitchPage() {
  return (
    <main>
      <PartnersClient />
    </main>
  );
}
