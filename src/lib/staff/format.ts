export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

// Keeps the prefix and last few characters visible, masks the rest — works
// regardless of the exact PT.33 format a white-label instance uses.
export function maskPt33Number(value: string) {
  const trimmed = value.trim();
  if (trimmed.length <= 7) return trimmed;
  return `${trimmed.slice(0, 4)}••••${trimmed.slice(-3)}`;
}
