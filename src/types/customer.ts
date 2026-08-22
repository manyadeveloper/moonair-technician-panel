export interface Customer {
  id: string;
  name: string;
  phone: string;
  alternate_phone: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  created_at: string;
}
