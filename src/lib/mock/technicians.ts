import type { Technician } from "@/types/technician";

export const MOCK_TECHNICIAN: Technician = {
  id: "tech-001",
  user_id: "mock-user",
  technician_code: "TECH-1001",
  name: "Mahi",
  phone: "8006686588",
  email: "mahi@moonair.in",
  service_center_id: "sc-delhi-north",
  service_center_name: "New Delhi Service Centre",
  service_area: "New Delhi",
  address: "Block C, Rohini Sector 7, New Delhi — 110085",
  joining_date: "2026-08-22",
  status: "active",
  created_at: "2025-01-15T08:00:00Z",
  updated_at: "2026-08-20T10:00:00Z",
};

/**
 * Demo-only mock credentials for frontend testing.
 * NOT real account security — replaced by Supabase Auth during backend integration.
 * Do not encode or encrypt passwords here; Supabase will manage credentials securely.
 */
export const MOCK_CREDENTIALS = {
  technicianId: "TECH-1001",
  password: "Demo@123",
} as const;

/** Accept technician ID or registered work email for mock sign-in. */
export function isValidMockLoginIdentifier(identifier: string): boolean {
  const trimmed = identifier.trim();
  const idMatch =
    trimmed.toUpperCase() === MOCK_CREDENTIALS.technicianId.toUpperCase();
  const emailMatch =
    trimmed.toLowerCase() === MOCK_TECHNICIAN.email.toLowerCase();
  return idMatch || emailMatch;
}

export function isValidMockLoginPassword(password: string): boolean {
  return password === MOCK_CREDENTIALS.password;
}

/** Keep demo sidebar/header profile aligned with mock technician data. */
export function resolveDemoTechnician(
  technician?: Technician | null
): Technician {
  if (!technician) return MOCK_TECHNICIAN;

  if (technician.technician_code !== MOCK_TECHNICIAN.technician_code) {
    return technician;
  }

  return {
    ...MOCK_TECHNICIAN,
    ...technician,
    name: MOCK_TECHNICIAN.name,
    email: MOCK_TECHNICIAN.email,
    phone: MOCK_TECHNICIAN.phone,
    joining_date: MOCK_TECHNICIAN.joining_date,
    technician_code: MOCK_TECHNICIAN.technician_code,
  };
}
