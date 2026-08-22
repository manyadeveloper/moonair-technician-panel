export type PartAction =
  | "inspected"
  | "cleaned"
  | "repaired"
  | "replaced"
  | "not_used";

export interface ServicePart {
  id: string;
  service_request_id: string;
  part_name: string;
  part_code: string | null;
  quantity: number;
  action: PartAction;
  remarks: string | null;
  created_at: string;
}
