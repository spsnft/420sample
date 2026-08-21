import { type MetadataRoute } from "next"

import { siteConfig } from "@/config/site"

// buds.digital's apex ("/") is the B2B pitch page — the product's main
// marketing surface, meant to be found by search. Everything reached from
// it (the storefront demo at /demo, the public menu, the staff panel) is a
// walkthrough for a prospect who already clicked in from the pitch, not a
// page meant to rank on its own — so only "/" stays crawlable.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/demo", "/menu", "/staff"],
      },
    ],
    sitemap: `${siteConfig.partners.url}/sitemap.xml`,
  }
}
