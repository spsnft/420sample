import { type MetadataRoute } from "next"

import { siteConfig } from "@/config/site"

// Indexing is decided per route by that route's own `robots` meta tag (see
// app/demo/page.tsx, app/menu/page.tsx, app/staff/*/page.tsx), not by a
// Disallow here. A Disallow stops a crawler from ever fetching the page, so
// it never sees the noindex tag either — the URL can still surface in
// search with no title or snippet, just a bare link. robots.txt is left for
// what only it can do: naming specific AI-training crawlers by user agent,
// which no meta tag can address.
const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "ClaudeBot",
  "anthropic-ai",
  "Google-Extended",
  "CCBot",
  "PerplexityBot",
  "Bytespider",
  "Applebot-Extended",
  "Amazonbot",
  "meta-externalagent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // "/" is the one surface meant to rank — fully open, AI crawlers
      // included. /staff is a login-gated internal panel, not a page that
      // benefits from a crawler ever reaching it, so it's the one path kept
      // Disallow'd outright for everyone; /demo and /menu rely on their own
      // noindex tag instead (see the note above).
      { userAgent: "*", allow: "/", disallow: ["/staff"] },
      // Training crawlers get an extra Disallow on /menu (real product data,
      // not marketing copy) alongside /staff.
      { userAgent: AI_CRAWLERS, disallow: ["/menu", "/staff"] },
    ],
    sitemap: `${siteConfig.partners.url}/sitemap.xml`,
  }
}
