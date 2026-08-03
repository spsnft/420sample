import type { Metadata } from "next"
import { SearchScreen } from "@/components/staff/SearchScreen"

export const metadata: Metadata = {
  title: "Staff",
  robots: { index: false, follow: false },
}

export default function StaffSearchPage() {
  return <SearchScreen />;
}
