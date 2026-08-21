import "@/styles/globals.css"
import type { Metadata, Viewport } from "next"
import { Montserrat } from "next/font/google"
import { siteConfig } from "@/config/site"
import { PageBackdrop } from "@/components/decor/PageBackdrop"

// tailwind.config.ts sets `sans: ['var(--font-montserrat)', ...]`. Without this
// the custom property is never defined, and an undefined var() with no fallback
// invalidates the whole font-family declaration — dropping system-ui/sans-serif
// along with it and leaving every page in the browser default (Times New Roman).
// next/font self-hosts the files at build time, so there is no request to
// Google at runtime. Thai has no Montserrat coverage and correctly falls
// through to the system-ui/sans-serif tail of the stack.
const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-montserrat",
  display: "swap",
})

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  // The whole app's own origin, not the storefront demo's "/demo" — this is
  // the base every route's relative metadata (icons, OG image) resolves
  // against, and buds.digital's apex is what visitors actually land on.
  metadataBase: new URL(siteConfig.partners.url),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: siteConfig.locale || "en_US",
    url: siteConfig.partners.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${montserrat.variable}`} style={{ colorScheme: 'dark' }}>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
      </head>
      <body className="min-h-screen bg-brand-primary text-brand-light antialiased selection:bg-brand-secondary/30">
        {/* First child and behind everything: every route gets the same room to
            stand in, instead of each page carrying its own flat fill. */}
        <PageBackdrop />
        {children}
      </body>
    </html>
  )
}
