import type { Metadata } from "next"
import { SearchScreen } from "@/components/staff/SearchScreen"
import { getClientsList, getRecentlyViewedClients } from "@/lib/staff/queries"

export const metadata: Metadata = {
  title: "Staff",
  robots: { index: false, follow: false },
}

export default async function StaffSearchPage() {
  const [recentlyViewed, clientsList] = await Promise.all([
    getRecentlyViewedClients(),
    getClientsList(),
  ]);

  return <SearchScreen recentlyViewed={recentlyViewed} clientsList={clientsList} />;
}
