export type PrescriptionStatus = "active" | "expired" | "revoked";

export interface StaffProfile {
  id: string;
  name: string;
  role: "staff" | "owner";
}

// Row shape of public.prescriptions_view — the single read model the app
// queries for anything status/quota related. See supabase/migrations/0001_init.sql.
export interface PrescriptionCard {
  id: string;
  client_id: string;
  pt33_number: string;
  issue_date: string;
  expiry_date: string;
  doctor: string | null;
  revoked: boolean;
  status: PrescriptionStatus;
  quota_used_g: number;
  client_name: string;
  client_phone: string | null;
  client_line_id: string | null;
  client_id_number: string | null;
  client_first_visit_date: string;
}

export interface ClientSearchResult {
  client_id: string;
  client_name: string;
  pt33_number: string;
  status: PrescriptionStatus;
  issue_date: string;
}

// Row shape of public.clients_directory_view — one row per client, used by
// both the Recently Viewed strip and the full client list. pt33_number/status
// are null for a client with no prescriptions on file.
export interface ClientDirectoryEntry {
  client_id: string;
  client_name: string;
  pt33_number: string | null;
  status: PrescriptionStatus | null;
}

export interface ClientListRow extends ClientDirectoryEntry {
  last_visit_at: string;
  client_created_at: string;
}

export type ClientListSort = "last_visit" | "name" | "created_at";

// "none" = clients with no prescription on file (status is null in
// clients_directory_view), not a PrescriptionStatus value.
export type ClientListStatusFilter = "all" | PrescriptionStatus | "none";

export interface ClientListPage {
  rows: ClientListRow[];
  total: number;
  hasMore: boolean;
}

export interface Purchase {
  id: string;
  date: string;
  client_id: string;
  prescription_id: string;
  product: string;
  quantity: number;
  price: number;
  staff_id: string;
  staff: { name: string } | null;
}

export interface ClientCardData {
  client: {
    id: string;
    name: string;
    phone: string | null;
    line_id: string | null;
    id_number: string | null;
    first_visit_date: string;
  };
  prescriptions: PrescriptionCard[];
  purchases: Purchase[];
}

export interface StaffInvite {
  id: string;
  code: string;
  role: "staff" | "owner";
  expires_at: string;
  used_at: string | null;
  created_at: string;
}
