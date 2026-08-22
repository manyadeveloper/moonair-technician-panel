import { MOCK_TECHNICIAN } from "@/lib/mock/technicians";
import type { Technician } from "@/types/technician";

export function getTechnician(): Technician {
  return MOCK_TECHNICIAN;
}

export function getTechnicianById(id: string): Technician | null {
  return MOCK_TECHNICIAN.id === id ? MOCK_TECHNICIAN : null;
}
