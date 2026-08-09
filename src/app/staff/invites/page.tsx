import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCurrentStaff, getStaffInvites } from "@/lib/staff/queries"
import { InviteManager } from "@/components/staff/InviteManager"

export const metadata: Metadata = {
  title: "Staff Invites",
  robots: { index: false, follow: false },
}

export default async function StaffInvitesPage() {
  const staff = await getCurrentStaff();
  if (!staff || staff.role !== "owner") notFound();

  const invites = await getStaffInvites();

  return <InviteManager initial={invites} />;
}
