import type { ReactNode } from "react"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { getCurrentStaff } from "@/lib/staff/queries"
import { isDemoInstance } from "@/lib/demo"
import { StaffHeader } from "@/components/staff/StaffHeader"
import { DemoBar } from "@/components/layout/DemoBar"
import { PageBackdrop } from "@/components/layout/PageBackdrop"

// Every screen under /staff is per-user, RLS-gated data — never let the
// Full Route Cache serve a prerendered/stale version of it.
export const dynamic = "force-dynamic"

function SetupNeeded() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-sm text-center p-6 rounded-card bg-white/5 border border-white/10">
        <h1 className="text-base font-black uppercase tracking-tight text-brand-light mb-2">
          Supabase not configured
        </h1>
        <p className="text-[13px] text-brand-light/60 leading-relaxed">
          Set <code className="text-brand-secondary">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="text-brand-secondary">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, then run the
          migration in <code className="text-brand-secondary">supabase/README.md</code> to enable
          the staff tool.
        </p>
      </div>
    </div>
  );
}

export default async function StaffLayout({ children }: { children: ReactNode }) {
  if (!isSupabaseConfigured()) {
    return <SetupNeeded />;
  }

  const staff = await getCurrentStaff();
  const demoInstance = isDemoInstance();

  return (
    <PageBackdrop>
      {/* bleed={false}: DemoBar's default -mx-4/px-4 trick bleeds edge-to-edge
          by cancelling an ambient page p-4 (see /demo's page wrapper) — /staff
          has no such ambient padding, so with the trick on, -mx-4 had nothing
          to cancel and the label sat flush against (and clipped by) the
          screen edge instead. Also: wrapping DemoBar in its own padded div to
          fake that ambient padding would shrink its sticky containing block
          down to the bar's own height, breaking the stickiness itself — see
          PageBackdrop for the other half of that fix. */}
      {demoInstance && (
        <DemoBar bleed={false} label="DEMO STAFF PANEL — sample data" cta="Back to buds.digital" />
      )}
      {staff && <StaffHeader staff={staff} demoInstance={demoInstance} />}
      <main className="max-w-2xl mx-auto p-4">{children}</main>
    </PageBackdrop>
  );
}
