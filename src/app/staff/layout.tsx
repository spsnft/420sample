import type { ReactNode } from "react"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { getCurrentStaff } from "@/lib/staff/queries"
import { StaffHeader } from "@/components/staff/StaffHeader"

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

  return (
    <div className="min-h-screen bg-brand-primary text-brand-light font-sans">
      {staff && <StaffHeader staff={staff} />}
      <main className="max-w-2xl mx-auto p-4">{children}</main>
    </div>
  );
}
