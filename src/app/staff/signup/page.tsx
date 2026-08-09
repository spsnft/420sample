import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { SignUpForm } from "@/components/staff/SignUpForm"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: "Staff Sign Up",
  robots: { index: false, follow: false },
}

// Invite-only: this page just collects the form, redeem_staff_invite()
// (called from the signUp server action) is what actually validates the
// code. See supabase/migrations/0003_intake_and_signup.sql.
export default function StaffSignUpPage({
  searchParams,
}: {
  searchParams: { code?: string };
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-6">
          <Image src="/images/logo.svg" priority width={56} height={56} className="w-12 h-12 object-contain mb-3" alt={siteConfig.name} />
          <h1 className="text-lg font-black uppercase tracking-tight text-brand-light">Staff Sign Up</h1>
          <p className="text-[12px] text-brand-light/40 mt-1">Requires an invite code from an owner</p>
        </div>

        <div className="p-5 rounded-card bg-white/5 border border-white/10">
          <SignUpForm inviteCode={searchParams.code ?? ""} />
        </div>

        <p className="text-center text-[12px] text-brand-light/40 mt-4">
          Already have an account?{" "}
          <Link href="/staff/login" className="text-brand-secondary/80 hover:text-brand-secondary transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
