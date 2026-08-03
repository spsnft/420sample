import type { Metadata } from "next"
import HomeClient from "@/components/HomeClient"
import { siteConfig } from "@/config/site"
import { getPlaceRating } from "@/lib/place"

export const revalidate = 86400; // 24h — rating badge shouldn't hit the API on every visit

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
  },
}

export default async function HomePage() {
  const rating = await getPlaceRating();

  return (
    <main>
      <HomeClient rating={rating} />
    </main>
  );
}
