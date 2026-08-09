import Image from "next/image"
import Link from "next/link"
import { siteConfig } from "@/config/site"
import { StaffProfileMenu } from "./StaffProfileMenu"
import type { StaffProfile } from "@/lib/staff/types"

export function StaffHeader({ staff }: { staff: StaffProfile }) {
  return (
    <header className="border-b border-white/10">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-3 px-4 py-3">
        <Link href="/staff" className="flex items-center gap-2 min-w-0 opacity-90 hover:opacity-100 transition-opacity">
          <Image src="/images/logo.svg" priority width={28} height={28} className="w-6 h-6 object-contain shrink-0" alt={siteConfig.name} />
          <span className="text-[12px] font-black uppercase tracking-wide text-brand-light/80 truncate">
            {siteConfig.name} Staff
          </span>
        </Link>

        <StaffProfileMenu staff={staff} />
      </div>
    </header>
  );
}
