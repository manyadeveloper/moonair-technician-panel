export interface Product {
  id: string;
  customer_id: string;
  name: string;
  model_name: string;
  model_number: string;
  serial_number: string;
  category: string;
  purchase_date: string | null;
  warranty_status: "active" | "expired" | "void";
  dealer: string | null;
  installation_date: string | null;
  created_at: string;
}
