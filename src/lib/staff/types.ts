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
