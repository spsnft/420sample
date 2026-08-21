import type { Metadata } from "next"
import PrivacyClient from "@/components/privacy/PrivacyClient"
import { siteConfig } from "@/config/site"

const TITLE = "Privacy Policy — buds.digital"
const DESCRIPTION = "What personal data this site collects, why, and how it is used."

// Linked from the consultation form's PDPA consent line (see
// ConsultationRequestForm) and from the pitch page's footer.
export const metadata: Metadata = {
  // `absolute` bypasses the root layout's `%s - 420 Store` title template —
  // this title already ends in "buds.digital" on its own.
  title: { absolute: TITLE },
  description: DESCRIPTION,
  robots: { index: false, follow: false },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "buds.digital",
    url: `${siteConfig.partners.url}/privacy`,
  },
  // Next replaces the whole `twitter` object per route rather than merging
  // it with the root layout's — see app/page.tsx's note — so this needs its
  // own copy too, or it keeps the layout's "420 Store" title/description.
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
  },
}

export default function PrivacyPage() {
  return (
    <main>
      <PrivacyClient />
    </main>
  );
}
