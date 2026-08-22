export interface Technician {
  id: string;
  user_id: string;
  technician_code: string;
  name: string;
  phone: string;
  email: string;
  service_center_id: string | null;
  service_center_name?: string;
  service_area?: string;
  address?: string;
  joining_date?: string;
  status: "active" | "inactive" | "offline";
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  technician: Technician;
}
