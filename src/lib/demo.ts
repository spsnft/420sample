// Single source of truth for "is this the buds.digital demo instance, not a
// real client's deployment" — see .env.example. Vercel's dashboard UI invites
// "true" for a boolean-looking env var as naturally as "1", so both (and any
// case) are accepted rather than silently no-op'ing on whichever one nobody
// typed. Real client instances simply leave the var unset, which is falsy
// either way.
//
// Reused for two things that both need exactly this same signal:
// middleware.ts (auto sign-in on /staff) and the storefront header (its logo
// links back to the pitch page here instead of to its own /demo homepage).
export function isDemoInstance(): boolean {
  return /^(1|true)$/i.test((process.env.DEMO_AUTO_LOGIN ?? "").trim());
}
