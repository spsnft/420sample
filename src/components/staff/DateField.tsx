import { formatDate } from "@/lib/staff/format"

// Native <input type="date"> renders its own closed-state text in the
// device's system locale — on a Thai-locale phone that's the Buddhist
// calendar ("22 ส.ค. 2569"), while every date already on the client card is
// Gregorian English (see formatDate: "19 Aug 2026"). A staff member typing a
// date on that phone has no way to tell the two agree, in the one field on
// the screen where being wrong is most expensive.
//
// Storage is untouched — the input's own value stays a plain ISO date
// string, exactly what the DB and the server action expect (see ТЗ note:
// "Хранение в БД не меняется"). Only the *displayed* text is pinned: the
// native input is kept underneath for its picker UI, keyboard entry and
// validation, but its own text is made transparent, and a plain span
// painted over it shows the same format the client card renders with,
// regardless of the device's locale or calendar setting.
export function DateField({
  value,
  onChange,
  required,
}: {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div className="relative w-full h-11 mt-1 rounded-button field-recessed border border-white/5 focus-within:border-brand-secondary/50 transition-colors">
      <input
        required={required}
        type="date"
        lang="en-GB"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-full h-full px-3 bg-transparent text-transparent caret-transparent outline-none"
      />
      <span className="pointer-events-none flex items-center h-full px-3 text-[14px] font-bold text-brand-light">
        {value ? formatDate(value) : ""}
      </span>
    </div>
  );
}
