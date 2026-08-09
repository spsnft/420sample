"use client"
import * as React from "react"
import { useRouter } from "next/navigation"
import { triggerHaptic } from "@/lib/utils"

// Route-level loading.tsx replaces the whole page the moment a <Link>
// navigation starts — fine for a direct/refresh load, but it made every tap
// from the client list feel like it wiped the list out from under you.
// useTransition + router.push keeps the current list mounted and interactive
// while the target page resolves, so callers can show a per-row "this one is
// loading" state instead.
export function useClientRowNav() {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [pendingId, setPendingId] = React.useState<string | null>(null);

  const navigate = (clientId: string) => {
    triggerHaptic("light");
    setPendingId(clientId);
    startTransition(() => {
      router.push(`/staff/clients/${clientId}`);
    });
  };

  const isRowPending = (clientId: string) => isPending && pendingId === clientId;

  return { navigate, isRowPending };
}
