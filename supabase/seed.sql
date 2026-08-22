INSERT INTO service_centers (id, name, code, city, state) VALUES
  ('sc-delhi-north', 'New Delhi Service Centre', 'SC-ND', 'New Delhi', 'Delhi')
ON CONFLICT DO NOTHING;

INSERT INTO customers (id, name, phone, alternate_phone, address, city, state, pincode) VALUES
  ('cust-001', 'Hardik Sir', '8006686588', NULL, '42, Sector 15, Rohini', 'New Delhi', 'Delhi', '110085'),
  ('cust-002', 'Manya', '8006686588', NULL, '18, Green Park Extension', 'New Delhi', 'Delhi', '110016'),
  ('cust-003', 'Hardik Sir', '8006686588', NULL, '7, Connaught Place', 'New Delhi', 'Delhi', '110001'),
  ('cust-004', 'Manya', '8006686588', NULL, '55, Model Town', 'New Delhi', 'Delhi', '110009'),
  ('cust-005', 'Hardik Sir', '8006686588', NULL, '23, Karol Bagh', 'New Delhi', 'Delhi', '110005'),
  ('cust-006', 'Manya', '8006686588', NULL, '91, Pitampura', 'New Delhi', 'Delhi', '110034')
ON CONFLICT DO NOTHING;

INSERT INTO products (id, customer_id, name, model_name, model_number, serial_number, category, purchase_date, warranty_status, dealer, installation_date) VALUES
  ('prod-001', 'cust-001', 'Mahaveer 140 XP', 'Mahaveer 140 XP', 'MHV-140-XP', 'MA2026MHV14000124', 'Desert Cooler', '2026-05-14', 'active', 'MoonAir Authorised Dealer - New Delhi', '2026-05-15'),
  ('prod-002', 'cust-002', 'Cyclone 135 L Commercial', 'Cyclone 135 L', 'CYC-135-CM', 'MA2025CYC13500089', 'Commercial Cooler', '2025-06-20', 'active', 'MoonAir Authorised Dealer - New Delhi', '2025-06-21'),
  ('prod-003', 'cust-003', 'Classic 85 L Desert', 'Classic 85 L', 'CLS-85-DT', 'MA2024CLS8500456', 'Desert Cooler', '2024-04-10', 'expired', 'MoonAir Authorised Dealer - New Delhi', '2024-04-11'),
  ('prod-004', 'cust-004', 'Marvel 65 L Metal', 'Marvel 65 L', 'MRV-65-MT', 'MA2025MRV6500234', 'Metal Cooler', '2025-03-05', 'active', 'MoonAir Authorised Dealer - New Delhi', '2025-03-06'),
  ('prod-005', 'cust-005', 'Iconic 95 L Desert', 'Iconic 95 L', 'ICN-95-DT', 'MA2026ICN9500789', 'Desert Cooler', '2026-02-28', 'active', 'MoonAir Authorised Dealer - New Delhi', '2026-03-01'),
  ('prod-006', 'cust-006', 'Mahaveer 140 XP', 'Mahaveer 140 XP', 'MHV-140-XP', 'MA2025MHV14000678', 'Desert Cooler', '2025-07-12', 'active', 'MoonAir Authorised Dealer - New Delhi', '2025-07-13')
ON CONFLICT DO NOTHING;

INSERT INTO service_requests (id, service_number, customer_id, product_id, complaint_type, complaint_category, complaint_description, customer_notes, service_type, priority, status, scheduled_date, location) VALUES
  ('sr-001', 'SR-2026-00124', 'cust-001', 'prod-001', 'Cooling Issue', 'Performance', 'Cooler is running but airflow is weak. Customer reports that water pump is making unusual noise.', 'Issue started 3 days ago after heavy usage during heatwave.', 'On-site Repair', 'high', 'assigned', '2026-08-22', 'New Delhi'),
  ('sr-002', 'SR-2026-00118', 'cust-002', 'prod-002', 'Motor Issue', 'Electrical', 'Cooler motor making grinding noise. Auto-swing not working properly.', 'Used daily in shop. Noise is getting louder.', 'On-site Repair', 'urgent', 'work_in_progress', '2026-08-22', 'New Delhi'),
  ('sr-003', 'SR-2026-00109', 'cust-003', 'prod-003', 'Water Leakage', 'Mechanical', 'Water leaking from bottom of cooler. Cooling pads appear worn out.', NULL, 'On-site Repair', 'medium', 'accepted', '2026-08-22', 'New Delhi'),
  ('sr-004', 'SR-2026-00098', 'cust-004', 'prod-004', 'No Cooling', 'Performance', 'Cooler turns on but no cold air. Fan working but pump seems inactive.', 'Warranty card available.', 'Warranty Service', 'high', 'on_the_way', '2026-08-22', 'New Delhi'),
  ('sr-005', 'SR-2026-00087', 'cust-005', 'prod-005', 'Installation Check', 'Installation', 'Post-installation check requested.', 'New installation done 2 weeks ago.', 'Installation Support', 'low', 'assigned', '2026-08-23', 'New Delhi'),
  ('sr-006', 'SR-2026-00072', 'cust-006', 'prod-006', 'Pump Replacement', 'Spares', 'Water pump failed completely. Cooler running dry.', 'Customer available only after 2 PM.', 'On-site Repair', 'urgent', 'requires_parts', '2026-08-21', 'New Delhi'),
  ('sr-007', 'SR-2026-00055', 'cust-001', 'prod-001', 'General Service', 'Maintenance', 'Annual maintenance service requested.', NULL, 'Preventive Maintenance', 'low', 'completed', '2026-08-15', 'New Delhi'),
  ('sr-008', 'SR-2026-00041', 'cust-004', 'prod-004', 'Cooling Issue', 'Performance', 'Reduced cooling efficiency. Pads need replacement.', NULL, 'On-site Repair', 'medium', 'completed', '2026-08-10', 'New Delhi')
ON CONFLICT DO NOTHING;

INSERT INTO service_timeline (service_request_id, event_type, description, created_at) VALUES
  ('sr-001', 'created', 'Service request created by customer.', '2026-08-21T06:30:00Z'),
  ('sr-001', 'assigned', 'Service assigned to technician.', '2026-08-22T05:00:00Z');

UPDATE service_requests SET
  diagnosis = 'All systems normal after maintenance.',
  work_performed = 'Cooling pads cleaned, pump serviced, motor lubricated.',
  final_observation = 'Cooler performing at optimal capacity.',
  recommendation = 'Next service due in 6 months.',
  completed_at = '2026-08-15T16:30:00Z'
WHERE id = 'sr-007';

UPDATE service_requests SET
  diagnosis = 'Cooling pads degraded. Water distribution uneven.',
  work_performed = 'Cooling pads replaced. Water distribution adjusted.',
  final_observation = 'Cooling restored to normal levels.',
  completed_at = '2026-08-10T14:00:00Z'
WHERE id = 'sr-008';
