import Image from "next/image"
import Link from "next/link"
import { siteConfig } from "@/config/site"
import { signOut } from "@/app/staff/actions"
import type { StaffProfile } from "@/lib/staff/types"

export function StaffHeader({ staff }: { staff: StaffProfile }) {
  return (
    <header className="border-b border-white/10">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-3 px-4 py-3">
        <Link href="/staff" className="flex items-center gap-2 min-w-0">
          <Image src="/images/logo.svg" priority width={28} height={28} className="w-6 h-6 object-contain shrink-0" alt={siteConfig.name} />
          <span className="text-[12px] font-black uppercase tracking-wide text-brand-light/80 truncate">
            {siteConfig.name} Staff
          </span>
        </Link>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[11px] font-bold text-brand-light/50 truncate max-w-[120px]">
            {staff.name}
          </span>
          <form action={signOut}>
            <button
              type="submit"
              className="text-[11px] font-black uppercase tracking-wide text-brand-secondary/80 hover:text-brand-secondary transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
