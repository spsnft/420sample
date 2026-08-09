"use client"
import * as React from "react"
import { UserPlus2, Copy, Check } from "lucide-react"
import { createStaffInvite } from "@/app/staff/actions"
import { formatDate } from "@/lib/staff/format"
import { triggerHaptic, absoluteUrl } from "@/lib/utils"
import type { StaffInvite } from "@/lib/staff/types"

function inviteStatus(invite: StaffInvite): { label: string; className: string } {
  if (invite.used_at) return { label: "Used", className: "text-brand-light/40" };
  if (new Date(invite.expires_at) < new Date()) return { label: "Expired", className: "text-red-400/80" };
  return { label: "Active", className: "text-emerald-400/80" };
}

function InviteRow({ invite }: { invite: StaffInvite }) {
  const [copied, setCopied] = React.useState(false);
  const status = inviteStatus(invite);
  const link = absoluteUrl(`/staff/signup?code=${invite.code}`);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    triggerHaptic("light");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-button bg-white/5 border border-white/10">
      <div className="min-w-0">
        <p className="text-[12px] font-bold text-brand-light/80 truncate font-mono">{invite.code}</p>
        <p className="text-[11px] text-brand-light/40">
          {invite.role} · <span className={status.className}>{status.label}</span> · expires {formatDate(invite.expires_at)}
        </p>
      </div>
      {!invite.used_at && (
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 h-9 px-3 rounded-button bg-white/5 border border-white/10 hover:border-brand-secondary/30 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wide text-brand-light/60 hover:text-brand-light transition-all"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied" : "Copy link"}
        </button>
      )}
    </div>
  );
}

export function InviteManager({ initial }: { initial: StaffInvite[] }) {
  const [invites, setInvites] = React.useState(initial);
  const [role, setRole] = React.useState<"staff" | "owner">("staff");
  const [isCreating, setIsCreating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleCreate = async () => {
    triggerHaptic("medium");
    setError(null);
    setIsCreating(true);
    const result = await createStaffInvite(role);
    setIsCreating(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    // Optimistic prepend — revalidatePath in the action refreshes the real
    // list on next navigation, this just avoids a full reload to see it now.
    setInvites((prev) => [
      {
        id: result.code!,
        code: result.code!,
        role,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        used_at: null,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-black uppercase tracking-tight text-brand-light">Staff Invites</h1>
        <p className="text-[12px] text-brand-light/40 mt-0.5">Owners only · codes expire after 7 days</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex gap-1 p-0.5 rounded-button bg-white/5 border border-white/10">
          {(["staff", "owner"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`px-3 py-1.5 rounded-button text-[11px] font-black uppercase tracking-wide transition-colors capitalize ${
                role === r ? "bg-brand-secondary/20 text-brand-secondary" : "text-brand-light/40 hover:text-brand-light/70"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleCreate}
          disabled={isCreating}
          className="flex-1 h-9 rounded-button bg-white/5 border border-white/10 hover:border-brand-secondary/30 flex items-center justify-center gap-1.5 text-[11px] font-black uppercase tracking-wide text-brand-light/70 hover:text-brand-light transition-all disabled:opacity-60"
        >
          <UserPlus2 size={14} />
          {isCreating ? "Creating…" : "New Invite"}
        </button>
      </div>

      {error && <p className="text-[12px] font-bold text-red-400">{error}</p>}

      <div className="space-y-2">
        {invites.length === 0 ? (
          <p className="text-[12px] text-brand-light/40 text-center py-8">No invites yet.</p>
        ) : (
          invites.map((invite) => <InviteRow key={invite.id} invite={invite} />)
        )}
      </div>
    </div>
  );
}
