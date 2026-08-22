CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS service_centers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS technicians (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  technician_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  service_center_id UUID REFERENCES service_centers(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'offline')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  alternate_phone TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  model_name TEXT NOT NULL,
  model_number TEXT NOT NULL,
  serial_number TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Desert Cooler',
  purchase_date DATE,
  warranty_status TEXT DEFAULT 'active' CHECK (warranty_status IN ('active', 'expired', 'void')),
  dealer TEXT,
  installation_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_number TEXT UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES customers(id),
  product_id UUID NOT NULL REFERENCES products(id),
  technician_id UUID REFERENCES technicians(id),
  complaint_type TEXT NOT NULL,
  complaint_category TEXT NOT NULL,
  complaint_description TEXT NOT NULL,
  customer_notes TEXT,
  previous_complaint TEXT,
  service_type TEXT NOT NULL DEFAULT 'On-site Repair',
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'new',
  scheduled_date DATE,
  location TEXT,
  diagnosis TEXT,
  work_performed TEXT,
  final_observation TEXT,
  recommendation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS service_inspections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  technician_id UUID NOT NULL REFERENCES technicians(id),
  inspection_data JSONB NOT NULL DEFAULT '{}',
  diagnosis TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_parts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  part_name TEXT NOT NULL,
  part_code TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  action TEXT NOT NULL DEFAULT 'replaced' CHECK (action IN ('replaced', 'repaired', 'not_used', 'installed')),
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  technician_id UUID NOT NULL REFERENCES technicians(id),
  note TEXT NOT NULL,
  attachment_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  technician_id UUID NOT NULL REFERENCES technicians(id),
  photo_url TEXT NOT NULL,
  photo_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  technician_id UUID REFERENCES technicians(id),
  event_type TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_requests_technician ON service_requests(technician_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
CREATE INDEX IF NOT EXISTS idx_service_requests_scheduled ON service_requests(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_service_requests_number ON service_requests(service_number);
CREATE INDEX IF NOT EXISTS idx_service_timeline_request ON service_timeline(service_request_id);
CREATE INDEX IF NOT EXISTS idx_service_notes_request ON service_notes(service_request_id);
CREATE INDEX IF NOT EXISTS idx_service_parts_request ON service_parts(service_request_id);
CREATE INDEX IF NOT EXISTS idx_service_photos_request ON service_photos(service_request_id);
CREATE INDEX IF NOT EXISTS idx_products_customer ON products(customer_id);
CREATE INDEX IF NOT EXISTS idx_technicians_user ON technicians(user_id);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER service_requests_updated_at
  BEFORE UPDATE ON service_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER technicians_updated_at
  BEFORE UPDATE ON technicians
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_timeline ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION get_technician_id()
RETURNS UUID AS $$
  SELECT id FROM technicians WHERE user_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE POLICY "Technicians can view own profile"
  ON technicians FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Technicians can update own profile"
  ON technicians FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Technicians view assigned service requests"
  ON service_requests FOR SELECT
  USING (technician_id = get_technician_id());

CREATE POLICY "Technicians update assigned service requests"
  ON service_requests FOR UPDATE
  USING (technician_id = get_technician_id());

CREATE POLICY "Technicians view customers via assigned requests"
  ON customers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM service_requests sr
      WHERE sr.customer_id = customers.id
      AND sr.technician_id = get_technician_id()
    )
  );

CREATE POLICY "Technicians view products via assigned requests"
  ON products FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM service_requests sr
      WHERE sr.product_id = products.id
      AND sr.technician_id = get_technician_id()
    )
  );

CREATE POLICY "Technicians manage inspections on assigned requests"
  ON service_inspections FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM service_requests sr
      WHERE sr.id = service_inspections.service_request_id
      AND sr.technician_id = get_technician_id()
    )
  );

CREATE POLICY "Technicians manage parts on assigned requests"
  ON service_parts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM service_requests sr
      WHERE sr.id = service_parts.service_request_id
      AND sr.technician_id = get_technician_id()
    )
  );

CREATE POLICY "Technicians manage notes on assigned requests"
  ON service_notes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM service_requests sr
      WHERE sr.id = service_notes.service_request_id
      AND sr.technician_id = get_technician_id()
    )
  );

CREATE POLICY "Technicians manage photos on assigned requests"
  ON service_photos FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM service_requests sr
      WHERE sr.id = service_photos.service_request_id
      AND sr.technician_id = get_technician_id()
    )
  );

CREATE POLICY "Technicians view timeline on assigned requests"
  ON service_timeline FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM service_requests sr
      WHERE sr.id = service_timeline.service_request_id
      AND sr.technician_id = get_technician_id()
    )
  );

CREATE POLICY "Technicians insert timeline on assigned requests"
  ON service_timeline FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM service_requests sr
      WHERE sr.id = service_timeline.service_request_id
      AND sr.technician_id = get_technician_id()
    )
  );

INSERT INTO storage.buckets (id, name, public)
VALUES ('service-photos', 'service-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Technicians upload service photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'service-photos'
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Anyone can view service photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'service-photos');
