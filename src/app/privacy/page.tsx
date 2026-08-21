import type { Metadata } from "next"
import PrivacyClient from "@/components/privacy/PrivacyClient"

// Linked from the consultation form's PDPA consent line (see
// ConsultationRequestForm) and from the pitch page's footer.
export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What personal data this site collects, why, and how it is used.",
  robots: { index: false, follow: false },
}

export default function PrivacyPage() {
  return (
    <main>
      <PrivacyClient />
    </main>
  );
}
