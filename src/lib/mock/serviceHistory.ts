import type { ServiceHistoryEntry } from "@/types/service";

export const customerServiceHistory: Record<string, ServiceHistoryEntry[]> = {
  "cust-001": [
    {
      id: "hist-c001-1",
      service_number: "SR-2026-00055",
      customer_id: "cust-001",
      product_id: "prod-001",
      service_date: "2026-08-15",
      complaint_type: "General Service",
      work_performed: "Cooling pads cleaned, pump serviced, motor lubricated.",
      final_status: "completed",
      parts_summary: "None",
    },
    {
      id: "hist-c001-2",
      service_number: "SR-2026-00012",
      customer_id: "cust-001",
      product_id: "prod-001",
      service_date: "2026-06-12",
      complaint_type: "Cooling Issue",
      work_performed: "Pump cleaned and water distribution adjusted.",
      final_status: "completed",
      parts_summary: "None",
    },
    {
      id: "hist-c001-3",
      service_number: "SR-2026-00003",
      customer_id: "cust-001",
      product_id: "prod-001",
      service_date: "2026-04-15",
      complaint_type: "General Service",
      work_performed: "Pre-season maintenance completed.",
      final_status: "completed",
    },
  ],
  "cust-004": [
    {
      id: "hist-c004-1",
      service_number: "SR-2026-00041",
      customer_id: "cust-004",
      product_id: "prod-004",
      service_date: "2026-08-10",
      complaint_type: "Cooling Issue",
      work_performed: "Cooling pads replaced. Water distribution adjusted.",
      final_status: "completed",
      parts_summary: "Cooling Pad Set x2",
    },
  ],
};

export const productServiceHistory: Record<string, ServiceHistoryEntry[]> = {
  "prod-001": [
    {
      id: "hist-p001-1",
      service_number: "SR-2026-00055",
      customer_id: "cust-001",
      product_id: "prod-001",
      service_date: "2026-08-15",
      complaint_type: "General Service",
      work_performed: "Annual maintenance — pads cleaned, pump serviced.",
      final_status: "completed",
    },
    {
      id: "hist-p001-2",
      service_number: "SR-2026-00012",
      customer_id: "cust-001",
      product_id: "prod-001",
      service_date: "2026-06-12",
      complaint_type: "Cooling Issue",
      work_performed: "Pump cleaned",
      final_status: "completed",
    },
  ],
  "MHV-140-XP": [
    {
      id: "hist-m001-1",
      service_number: "SR-2026-00072",
      customer_id: "cust-006",
      product_id: "prod-006",
      service_date: "2026-06-15",
      complaint_type: "Pump Replacement",
      work_performed: "Water pump replaced under warranty.",
      final_status: "completed",
      parts_summary: "MHV-PUMP-140",
    },
  ],
};
