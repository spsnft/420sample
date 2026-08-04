import type { Metadata } from "next"
import HomeClient from "@/components/HomeClient"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
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
