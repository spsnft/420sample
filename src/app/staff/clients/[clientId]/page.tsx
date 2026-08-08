import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getClientCard, recordClientView } from "@/lib/staff/queries"
import { ClientCard } from "@/components/staff/ClientCard"

export const metadata: Metadata = {
  title: "Client",
  robots: { index: false, follow: false },
}

export default async function StaffClientPage({ params }: { params: { clientId: string } }) {
  const [data] = await Promise.all([
    getClientCard(params.clientId),
    recordClientView(params.clientId),
  ]);
  if (!data) notFound();

  return <ClientCard data={data} />;
}
