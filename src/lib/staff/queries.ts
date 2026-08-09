import { createClient } from "@/lib/supabase/server"
import type {
  ClientCardData,
  ClientDirectoryEntry,
  ClientListPage,
  ClientListSort,
  ClientListStatusFilter,
  ClientSearchResult,
  StaffInvite,
  StaffProfile,
} from "./types"

const CLIENT_LIST_PAGE_SIZE = 10;
const RECENTLY_VIEWED_LIMIT = 8;

const SORT_COLUMNS: Record<ClientListSort, { column: string; ascending: boolean }> = {
  last_visit: { column: "last_visit_at", ascending: false },
  name: { column: "client_name", ascending: true },
  created_at: { column: "client_created_at", ascending: false },
};

export async function getCurrentStaff(): Promise<StaffProfile | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("staff")
    .select("id, name, role")
    .eq("auth_user_id", user.id)
    .single();

  return data as StaffProfile | null;
}

// Two plain ilike() queries merged client-side rather than a single .or()
// filter string — .or() interpolates the raw query text into a PostgREST
// filter expression, so an unescaped comma/paren in someone's search input
// could break or redirect the filter. ilike() passes the value as a bound
// parameter instead.
export async function searchClients(query: string): Promise<ClientSearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const supabase = createClient();
  const selection = "client_id, client_name, pt33_number, status, issue_date";

  const [byName, byPt33] = await Promise.all([
    supabase
      .from("prescriptions_view")
      .select(selection)
      .ilike("client_name", `%${trimmed}%`)
      .order("issue_date", { ascending: false })
      .limit(20),
    supabase
      .from("prescriptions_view")
      .select(selection)
      .ilike("pt33_number", `%${trimmed}%`)
      .order("issue_date", { ascending: false })
      .limit(20),
  ]);

  if (byName.error) console.error("searchClients (by name):", byName.error.message);
  if (byPt33.error) console.error("searchClients (by pt33):", byPt33.error.message);

  const rows = [...(byName.data ?? []), ...(byPt33.data ?? [])] as ClientSearchResult[];
  const seen = new Set<string>();
  const deduped: ClientSearchResult[] = [];
  for (const row of rows) {
    const key = `${row.client_id}:${row.pt33_number}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(row);
  }
  return deduped;
}

export async function getClientCard(clientId: string): Promise<ClientCardData | null> {
  const supabase = createClient();

  const { data: prescriptions, error } = await supabase
    .from("prescriptions_view")
    .select("*")
    .eq("client_id", clientId)
    .order("issue_date", { ascending: false });

  if (error || !prescriptions || prescriptions.length === 0) return null;

  // Purchase history in the UI only ever shows the most recent 50, but
  // Lifetime Spent / Purchases on ClientStats need the true total — a
  // second, unbounded query over just `price` so a client with a long
  // history doesn't get a silently truncated "lifetime" figure.
  const [{ data: purchases }, { data: allPrices }] = await Promise.all([
    supabase
      .from("purchases")
      .select("*, staff:staff!staff_id(name)")
      .eq("client_id", clientId)
      .order("date", { ascending: false })
      .limit(50),
    supabase
      .from("purchases")
      .select("price")
      .eq("client_id", clientId),
  ]);

  const first = prescriptions[0];
  return {
    client: {
      id: first.client_id,
      name: first.client_name,
      phone: first.client_phone,
      line_id: first.client_line_id,
      id_number: first.client_id_number,
      first_visit_date: first.client_first_visit_date,
    },
    prescriptions,
    purchases: (purchases ?? []) as ClientCardData["purchases"],
    stats: {
      lifetimeSpent: (allPrices ?? []).reduce((sum, p) => sum + Number(p.price), 0),
      purchaseCount: (allPrices ?? []).length,
    },
  };
}

// Best-effort — a failed view record should never block a staff member from
// seeing the client card, so errors are logged, not thrown.
export async function recordClientView(clientId: string): Promise<void> {
  const staff = await getCurrentStaff();
  if (!staff) return;

  const supabase = createClient();
  const { error } = await supabase
    .from("client_views")
    .upsert(
      { staff_id: staff.id, client_id: clientId, viewed_at: new Date().toISOString() },
      { onConflict: "staff_id,client_id" }
    );

  if (error) console.error("recordClientView:", error.message);
}

export async function getRecentlyViewedClients(): Promise<ClientDirectoryEntry[]> {
  const staff = await getCurrentStaff();
  if (!staff) return [];

  const supabase = createClient();
  const { data: views, error: viewsError } = await supabase
    .from("client_views")
    .select("client_id")
    .eq("staff_id", staff.id)
    .order("viewed_at", { ascending: false })
    .limit(RECENTLY_VIEWED_LIMIT);

  if (viewsError) {
    console.error("getRecentlyViewedClients (views):", viewsError.message);
    return [];
  }
  if (!views || views.length === 0) return [];

  const orderedIds = views.map((v) => v.client_id);
  const { data: rows, error: rowsError } = await supabase
    .from("clients_directory_view")
    .select("client_id, client_name, pt33_number, status")
    .in("client_id", orderedIds);

  if (rowsError) {
    console.error("getRecentlyViewedClients (rows):", rowsError.message);
    return [];
  }

  const byId = new Map((rows ?? []).map((r) => [r.client_id, r as ClientDirectoryEntry]));
  return orderedIds.map((id) => byId.get(id)).filter((r): r is ClientDirectoryEntry => Boolean(r));
}

export async function getClientsList(opts: {
  sort?: ClientListSort;
  page?: number;
  status?: ClientListStatusFilter;
} = {}): Promise<ClientListPage> {
  const sort = opts.sort ?? "last_visit";
  const status = opts.status ?? "all";
  const page = Math.max(0, opts.page ?? 0);
  const from = page * CLIENT_LIST_PAGE_SIZE;
  const to = from + CLIENT_LIST_PAGE_SIZE - 1;
  const { column, ascending } = SORT_COLUMNS[sort];

  const supabase = createClient();
  let query = supabase
    .from("clients_directory_view")
    .select("client_id, client_name, pt33_number, status, last_visit_at, client_created_at", { count: "exact" });

  if (status === "none") {
    query = query.is("status", null);
  } else if (status !== "all") {
    query = query.eq("status", status);
  }

  const { data, count, error } = await query.order(column, { ascending }).range(from, to);

  if (error) {
    console.error("getClientsList:", error.message);
    return { rows: [], total: 0, hasMore: false };
  }

  const rows = (data ?? []) as ClientListPage["rows"];
  const total = count ?? 0;
  return { rows, total, hasMore: from + rows.length < total };
}

// RLS on staff_invites only lets owners select rows at all, so this
// naturally returns [] for a non-owner rather than needing a role check here.
export async function getStaffInvites(): Promise<StaffInvite[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("staff_invites")
    .select("id, code, role, expires_at, used_at, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getStaffInvites:", error.message);
    return [];
  }
  return data as StaffInvite[];
}
