"use client"
import * as React from "react"
import Link from "next/link"
import { ChevronDown, Users, Ticket, LogOut } from "lucide-react"
import { signOut } from "@/app/staff/actions"
import type { StaffProfile } from "@/lib/staff/types"

export function StaffProfileMenu({ staff }: { staff: StaffProfile }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-1.5 h-8 pl-3 pr-2 rounded-button bg-white/5 border border-white/10 hover:border-brand-secondary/30 transition-all text-[11px] font-bold text-brand-light/70 hover:text-brand-light"
      >
        <span className="truncate max-w-[120px]">{staff.name}</span>
        <ChevronDown size={13} className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+6px)] w-44 py-1.5 rounded-card bg-brand-primary border border-white/10 shadow-2xl z-[110]">
          <Link
            href="/staff"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] font-bold text-brand-light/80 hover:text-brand-light hover:bg-white/5 transition-colors"
          >
            <Users size={14} className="text-brand-light/40" />
            Clients
          </Link>

          {staff.role === "owner" && (
            <Link
              href="/staff/invites"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] font-bold text-brand-light/80 hover:text-brand-light hover:bg-white/5 transition-colors"
            >
              <Ticket size={14} className="text-brand-light/40" />
              Invites
            </Link>
          )}

          <form action={signOut}>
            <button
              type="submit"
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[12px] font-bold text-red-400/80 hover:text-red-400 hover:bg-white/5 transition-colors"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
