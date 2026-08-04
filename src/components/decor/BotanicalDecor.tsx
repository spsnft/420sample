// Abstract line-art botanical accent (no photography/product imagery —
// keeps the demo instance's marketing-free, illustration-only background).
// Purely decorative: hidden from assistive tech, never intercepts clicks.
export function BotanicalDecor({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
    >
      <path d="M120 8C82 40 62 92 72 142C80 180 104 208 120 232" stroke="#C89E58" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M120 8C158 40 178 92 168 142C160 180 136 208 120 232" stroke="#C89E58" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M120 34C120 34 97 56 92 84" stroke="#E3DDD1" strokeWidth="1" strokeLinecap="round" />
      <path d="M120 34C120 34 143 56 148 84" stroke="#E3DDD1" strokeWidth="1" strokeLinecap="round" />
      <path d="M120 74C120 74 97 95 93 120" stroke="#E3DDD1" strokeWidth="1" strokeLinecap="round" />
      <path d="M120 74C120 74 143 95 147 120" stroke="#E3DDD1" strokeWidth="1" strokeLinecap="round" />
      <path d="M120 114C120 114 101 133 98 154" stroke="#E3DDD1" strokeWidth="1" strokeLinecap="round" />
      <path d="M120 114C120 114 139 133 142 154" stroke="#E3DDD1" strokeWidth="1" strokeLinecap="round" />
      <path d="M120 8V232" stroke="#C89E58" strokeWidth="1" strokeLinecap="round" strokeDasharray="1 5" opacity="0.6" />
    </svg>
  );
}
