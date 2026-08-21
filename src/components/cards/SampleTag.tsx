import * as React from "react"

// One style shared by the three demo cards that carry invented data (address,
// rating, storefront photo — see HomeClient) so a prospect reads them as a
// matched set of placeholders. The interface, menu and cart aren't tagged:
// those are the product itself, not a stand-in for a real shop's own.
export const SampleTag: React.FC = () => (
  <span
    className="absolute top-2 right-2 z-10 inline-flex items-center h-5 px-2 rounded-full bg-black/55 backdrop-blur-sm border border-white/15 text-[9px] font-black uppercase tracking-wide text-brand-light/70"
  >
    Sample
  </span>
);
