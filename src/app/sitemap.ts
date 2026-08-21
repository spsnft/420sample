import { type MetadataRoute } from "next"
import { siteConfig } from "@/config/site"

// Lists the B2B pitch page's own root (buds.digital/) — the one surface
// meant to be indexed post domain-swap. The storefront demo at
// partners.buds.digital carries its own noindex metadata (see app/page.tsx)
// and has no business being crawled or listed here.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteConfig.partners.url}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
