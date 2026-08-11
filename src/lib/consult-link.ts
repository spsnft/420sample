// The free-consultation dialog — the medical certificate — is a modal on the
// home page rather than a route of its own, which for a long time made it the
// one thing on the site nothing could link to. These two constants are how the
// header's Sections panel reaches it from anywhere.
//
// The hash carries the intent across a page load: arrive at /#consult from the
// menu and HomeClient opens the dialog as it mounts. It is a hash and not a
// query parameter because useSearchParams would drag the whole home page out of
// static rendering for the sake of one modal.
export const CONSULT_HASH = "#consult";
export const CONSULT_HREF = `/${CONSULT_HASH}`;

// And the event carries it when there is no page load. Tapping the certificate
// while already on the home page only changes the hash, and Next does that with
// history.pushState — which, unlike a real hash navigation, fires no
// `hashchange` for anyone to hear. So the nav says so itself.
export const CONSULT_EVENT = "buds:open-consult";
