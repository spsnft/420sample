import { createClient } from "@/lib/supabase/server"
import type { ClientCardData, ClientSearchResult, StaffProfile } from "./types"

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

  const { data: purchases } = await supabase
    .from("purchases")
    .select("*, staff:staff!staff_id(name)")
    .eq("client_id", clientId)
    .order("date", { ascending: false })
    .limit(50);

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
  };
}
