import { type MetadataRoute } from "next"

import { siteConfig } from "@/config/site"

// "/partners" stays disallowed regardless of host: on buds.digital it is a
// duplicate of the rewritten "/" (see middleware.ts) and would only split
// search value between two URLs for the same page; on partners.buds.digital
// it isn't reachable at all. "/" itself is intentionally left crawlable here
// — the per-host split between the indexable pitch page and the noindex
// storefront demo is enforced by each route's own metadata, not by path.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/menu", "/partners"],
      },
    ],
    // Points at the marketing domain's sitemap regardless of which host
    // served this robots.txt — buds.digital is the only surface meant to be
    // indexed post domain-swap (see siteConfig.partners.url).
    sitemap: `${siteConfig.partners.url}/sitemap.xml`,
  }
}
