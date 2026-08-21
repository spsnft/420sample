import * as React from "react"
import { LucideIcon } from "lucide-react"
import { SampleTag } from "@/components/cards/SampleTag"

interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  className?: string;
  /** Diameter of the icon circle backdrop, in px. */
  iconWrapperSize?: number;
  /** Icon glyph size, in px. */
  iconSize?: number;
  /** Fill opacity of the icon circle backdrop, 0-100. */
  bgOpacity?: number;
  /** Tailwind radius class shared by the outer ring and inner card. */
  radius?: string;
  /** Tailwind padding class for the inner card. */
  padding?: string;
  /** Marks the value as demo placeholder data — see SampleTag. */
  sample?: boolean;
}

// Single source of truth for the Address / Working Hours / Reviews cards —
// same geometry props everywhere so the three can't drift out of sync again.
export const InfoCard: React.FC<InfoCardProps> = ({
  icon: Icon,
  label,
  value,
  className = "",
  iconWrapperSize = 36,
  iconSize = 16,
  bgOpacity = 15,
  radius = "rounded-card",
  padding = "p-4",
  sample = false,
}) => (
  <div className={`relative surface ${radius} h-full ${className}`}>
    {sample && <SampleTag />}
    <div className={`${padding} ${radius} h-full min-h-[88px] flex items-center gap-3`}>
      <div
        className="rounded-full border border-brand-secondary/30 flex items-center justify-center text-brand-secondary shrink-0"
        style={{
          width: iconWrapperSize,
          height: iconWrapperSize,
          backgroundColor: `rgba(200, 158, 88, ${bgOpacity / 100})`,
        }}
      >
        <Icon size={iconSize} />
      </div>
      <div>
        <p className="text-[11px] font-black uppercase tracking-wide text-brand-light/40 mb-0.5">{label}</p>
        <div className="text-[13px] font-bold text-brand-light leading-snug">{value}</div>
      </div>
    </div>
  </div>
);
