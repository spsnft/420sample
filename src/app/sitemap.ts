import { type MetadataRoute } from "next"
import { siteConfig } from "@/config/site"

// Lists the B2B pitch page's own root (buds.digital/) — the one surface
// meant to be indexed. The storefront demo at /demo carries its own noindex
// metadata (see app/demo/page.tsx) and has no business being crawled or
// listed here.
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
