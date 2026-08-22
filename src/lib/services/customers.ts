import { customers } from "@/lib/mock/customers";
import type { Customer } from "@/types/customer";

export function getCustomers(): Customer[] {
  return customers;
}

export function getCustomerById(id: string): Customer | null {
  return customers.find((c) => c.id === id) ?? null;
}
