import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { LoginForm } from "@/components/staff/LoginForm"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: "Staff Sign In",
  robots: { index: false, follow: false },
}

export default function StaffLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-6">
          <Image src="/images/logo.svg" priority width={56} height={56} className="w-12 h-12 object-contain mb-3" alt={siteConfig.name} />
          <h1 className="text-lg font-black uppercase tracking-tight text-brand-light">Staff Sign In</h1>
          <p className="text-[12px] text-brand-light/40 mt-1">{siteConfig.name} compliance tool</p>
        </div>

        <div className="p-5 rounded-card bg-white/5 border border-white/10">
          <LoginForm />
        </div>

        <p className="text-center text-[12px] text-brand-light/40 mt-4">
          Have an invite code?{" "}
          <Link href="/staff/signup" className="text-brand-secondary/80 hover:text-brand-secondary transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
