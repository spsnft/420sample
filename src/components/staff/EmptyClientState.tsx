import { BotanicalDecor } from "@/components/decor/BotanicalDecor"

export function EmptyClientState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <BotanicalDecor className="w-24 h-24 opacity-[0.12]" />
      <p className="text-[12px] text-brand-light/40">Start typing a name or PT.33 number</p>
    </div>
  );
}
