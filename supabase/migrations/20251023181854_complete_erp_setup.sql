-- ============================================
-- MALWA CRM - COMPLETE ERP SYSTEM SETUP
-- ============================================
-- Automotive Garage Management System
-- All tables, triggers, policies, and functions
-- ============================================

-- ============================================
-- 1. CUSTOMERS MODULE
-- ============================================

CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text,
  phone text NOT NULL,
  address text,
  gstin text,
  opening_balance numeric DEFAULT 0,
  current_balance numeric DEFAULT 0,
  credit_limit numeric DEFAULT 0,
  credit_days integer DEFAULT 30,
  on_hold boolean DEFAULT false,
  preferred boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS customer_ledger_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  entry_date date NOT NULL,
  particulars text NOT NULL,
  ref_type text,
  ref_no text,
  ref_id uuid,
  debit numeric DEFAULT 0,
  credit numeric DEFAULT 0,
  balance numeric DEFAULT 0,
  notes text,
  allocations jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS customer_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  job_no text NOT NULL UNIQUE,
  vehicle_no text NOT NULL,
  owner_name text,
  branch text DEFAULT 'Head Office',
  job_date date NOT NULL,
  status text DEFAULT 'inspection',
  inspection_data jsonb,
  estimate_data jsonb,
  jobsheet_data jsonb,
  chalan_data jsonb,
  invoice_data jsonb,
  total_amount numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_no text NOT NULL UNIQUE,
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  job_id uuid REFERENCES customer_jobs(id) ON DELETE SET NULL,
  invoice_date date NOT NULL,
  subtotal numeric NOT NULL,
  discount numeric DEFAULT 0,
  discount_amount numeric DEFAULT 0,
  gst_rate numeric DEFAULT 18,
  gst_amount numeric DEFAULT 0,
  total_amount numeric NOT NULL,
  paid_amount numeric DEFAULT 0,
  payment_status text DEFAULT 'pending',
  due_date date,
  items jsonb NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_no text NOT NULL UNIQUE,
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  receipt_date date NOT NULL,
  amount numeric NOT NULL,
  payment_mode text DEFAULT 'cash',
  reference text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- 2. VENDORS MODULE
-- ============================================

CREATE TABLE IF NOT EXISTS vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE,
  name text NOT NULL,
  company text,
  phone text NOT NULL,
  address text,
  gstin text,
  opening_balance numeric DEFAULT 0,
  current_balance numeric DEFAULT 0,
  credit_limit numeric DEFAULT 0,
  vendor_type text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vendor_ledger_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  entry_date date NOT NULL,
  particulars text NOT NULL,
  ref_type text,
  ref_no text,
  ref_id uuid,
  debit numeric DEFAULT 0,
  credit numeric DEFAULT 0,
  balance numeric DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- 3. LABOUR MODULE
-- ============================================

CREATE TABLE IF NOT EXISTS labour (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE,
  name text NOT NULL,
  phone text,
  address text,
  skill_type text,
  opening_balance numeric DEFAULT 0,
  current_balance numeric DEFAULT 0,
  daily_rate numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS labour_ledger_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  labour_id uuid NOT NULL REFERENCES labour(id) ON DELETE CASCADE,
  entry_date date NOT NULL,
  particulars text NOT NULL,
  ref_type text,
  ref_no text,
  ref_id uuid,
  debit numeric DEFAULT 0,
  credit numeric DEFAULT 0,
  balance numeric DEFAULT 0,
  hours_worked numeric,
  rate_per_hour numeric,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- 4. SUPPLIERS MODULE
-- ============================================

CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE,
  name text NOT NULL,
  company text,
  phone text NOT NULL,
  address text,
  gstin text,
  opening_balance numeric DEFAULT 0,
  current_balance numeric DEFAULT 0,
  credit_limit numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS supplier_ledger_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  entry_date date NOT NULL,
  particulars text NOT NULL,
  ref_type text,
  ref_no text,
  ref_id uuid,
  debit numeric DEFAULT 0,
  credit numeric DEFAULT 0,
  balance numeric DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- 5. INVENTORY MODULE
-- ============================================

CREATE TABLE IF NOT EXISTS inventory_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE,
  name text NOT NULL,
  category_id uuid REFERENCES inventory_categories(id),
  unit text DEFAULT 'pcs',
  current_stock numeric DEFAULT 0,
  reorder_level numeric DEFAULT 0,
  cost_price numeric DEFAULT 0,
  selling_price numeric DEFAULT 0,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  movement_type text NOT NULL,
  quantity numeric NOT NULL,
  from_location text,
  to_location text,
  reference_type text,
  reference_id uuid,
  reference_no text,
  notes text,
  movement_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  created_by uuid
);

-- ============================================
-- 6. ACCOUNTS MODULE
-- ============================================

CREATE TABLE IF NOT EXISTS vouchers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  voucher_no text NOT NULL UNIQUE,
  voucher_date date NOT NULL,
  voucher_type text NOT NULL,
  payee_id uuid NOT NULL,
  payee_type text NOT NULL,
  amount numeric NOT NULL,
  payment_mode text DEFAULT 'cash',
  reference text,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gst_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_date date NOT NULL,
  transaction_type text NOT NULL,
  document_no text NOT NULL,
  party_name text NOT NULL,
  taxable_amount numeric NOT NULL,
  cgst numeric DEFAULT 0,
  sgst numeric DEFAULT 0,
  igst numeric DEFAULT 0,
  total_gst numeric DEFAULT 0,
  input_credit numeric DEFAULT 0,
  output_tax numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS purchase_challans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challan_no text UNIQUE NOT NULL,
  challan_date date NOT NULL,
  supplier_id uuid REFERENCES suppliers(id) ON DELETE RESTRICT,
  item_id uuid REFERENCES inventory_items(id) ON DELETE RESTRICT,
  quantity numeric NOT NULL DEFAULT 0,
  rate numeric NOT NULL DEFAULT 0,
  amount numeric NOT NULL DEFAULT 0,
  source text,
  vehicle_no text,
  payment_status text DEFAULT 'pending',
  notes text,
  linked_invoice_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sell_challans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challan_no text UNIQUE NOT NULL,
  challan_date date NOT NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE RESTRICT,
  job_id uuid REFERENCES customer_jobs(id) ON DELETE SET NULL,
  item_id uuid REFERENCES inventory_items(id) ON DELETE RESTRICT,
  quantity numeric NOT NULL DEFAULT 0,
  rate numeric NOT NULL DEFAULT 0,
  amount numeric NOT NULL DEFAULT 0,
  destination text,
  vehicle_no text,
  delivery_status text DEFAULT 'pending',
  notes text,
  linked_invoice_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 7. USER MANAGEMENT
-- ============================================

CREATE TABLE IF NOT EXISTS branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text DEFAULT '',
  manager_name text DEFAULT '',
  phone text DEFAULT '',
  email text DEFAULT '',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'Accountant',
  branch_id uuid REFERENCES branches(id) ON DELETE SET NULL,
  permissions jsonb DEFAULT '{"dashboard": "full", "jobs": "full", "customer": "full", "vendors": "full", "labour": "full", "supplier": "full", "inventory": "full", "accounts": "full", "summary": "view", "settings": "none"}'::jsonb,
  status text DEFAULT 'Active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_customer_ledger_customer_date ON customer_ledger_entries(customer_id, entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_customer_jobs_customer ON customer_jobs(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_jobs_status ON customer_jobs(status);
CREATE INDEX IF NOT EXISTS idx_invoices_customer ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_job_id ON invoices(job_id);
CREATE INDEX IF NOT EXISTS idx_receipts_customer ON receipts(customer_id);
CREATE INDEX IF NOT EXISTS idx_vendor_ledger_vendor_date ON vendor_ledger_entries(vendor_id, entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_labour_ledger_labour_date ON labour_ledger_entries(labour_id, entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_supplier_ledger_supplier_date ON supplier_ledger_entries(supplier_id, entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_inventory_items_category_id ON inventory_items(category_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_item_id ON stock_movements(item_id);

-- ============================================
-- RLS ENABLE
-- ============================================

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE labour ENABLE ROW LEVEL SECURITY;
ALTER TABLE labour_ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE gst_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_challans ENABLE ROW LEVEL SECURITY;
ALTER TABLE sell_challans ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Authenticated users full access" ON customers;
CREATE POLICY "Authenticated users full access" ON customers FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users full access" ON customer_ledger_entries;
CREATE POLICY "Authenticated users full access" ON customer_ledger_entries FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users full access" ON customer_jobs;
CREATE POLICY "Authenticated users full access" ON customer_jobs FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users full access" ON invoices;
CREATE POLICY "Authenticated users full access" ON invoices FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users full access" ON receipts;
CREATE POLICY "Authenticated users full access" ON receipts FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users full access" ON vendors;
CREATE POLICY "Authenticated users full access" ON vendors FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users full access" ON vendor_ledger_entries;
CREATE POLICY "Authenticated users full access" ON vendor_ledger_entries FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users full access" ON labour;
CREATE POLICY "Authenticated users full access" ON labour FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users full access" ON labour_ledger_entries;
CREATE POLICY "Authenticated users full access" ON labour_ledger_entries FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users full access" ON suppliers;
CREATE POLICY "Authenticated users full access" ON suppliers FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users full access" ON supplier_ledger_entries;
CREATE POLICY "Authenticated users full access" ON supplier_ledger_entries FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users full access" ON inventory_categories;
CREATE POLICY "Authenticated users full access" ON inventory_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users full access" ON inventory_items;
CREATE POLICY "Authenticated users full access" ON inventory_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users full access" ON stock_movements;
CREATE POLICY "Authenticated users full access" ON stock_movements FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users full access" ON vouchers;
CREATE POLICY "Authenticated users full access" ON vouchers FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users full access" ON gst_ledger;
CREATE POLICY "Authenticated users full access" ON gst_ledger FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users full access" ON purchase_challans;
CREATE POLICY "Authenticated users full access" ON purchase_challans FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users full access" ON sell_challans;
CREATE POLICY "Authenticated users full access" ON sell_challans FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users full access" ON branches;
CREATE POLICY "Authenticated users full access" ON branches FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users full access" ON profiles;
CREATE POLICY "Authenticated users full access" ON profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- TRIGGERS & FUNCTIONS
-- ============================================

-- Customer balance recalculation
CREATE OR REPLACE FUNCTION recalculate_customer_balance()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE customers
  SET current_balance = (
    SELECT COALESCE(SUM(debit - credit), 0) + opening_balance
    FROM customer_ledger_entries
    WHERE customer_id = COALESCE(NEW.customer_id, OLD.customer_id)
  ),
  updated_at = now()
  WHERE id = COALESCE(NEW.customer_id, OLD.customer_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_recalculate_customer_balance ON customer_ledger_entries;
CREATE TRIGGER trigger_recalculate_customer_balance
AFTER INSERT OR UPDATE OR DELETE ON customer_ledger_entries
FOR EACH ROW
EXECUTE FUNCTION recalculate_customer_balance();

-- Vendor balance update
CREATE OR REPLACE FUNCTION update_vendor_balance()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE vendors
  SET current_balance = (
    SELECT COALESCE(SUM(debit - credit), 0) + opening_balance
    FROM vendor_ledger_entries
    WHERE vendor_id = COALESCE(NEW.vendor_id, OLD.vendor_id)
  ),
  updated_at = now()
  WHERE id = COALESCE(NEW.vendor_id, OLD.vendor_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_vendor_balance ON vendor_ledger_entries;
CREATE TRIGGER trigger_update_vendor_balance
AFTER INSERT OR UPDATE OR DELETE ON vendor_ledger_entries
FOR EACH ROW
EXECUTE FUNCTION update_vendor_balance();

-- Labour balance update
CREATE OR REPLACE FUNCTION update_labour_balance()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE labour
  SET current_balance = (
    SELECT COALESCE(SUM(debit - credit), 0) + opening_balance
    FROM labour_ledger_entries
    WHERE labour_id = COALESCE(NEW.labour_id, OLD.labour_id)
  ),
  updated_at = now()
  WHERE id = COALESCE(NEW.labour_id, OLD.labour_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_labour_balance ON labour_ledger_entries;
CREATE TRIGGER trigger_update_labour_balance
AFTER INSERT OR UPDATE OR DELETE ON labour_ledger_entries
FOR EACH ROW
EXECUTE FUNCTION update_labour_balance();

-- Supplier balance update
CREATE OR REPLACE FUNCTION update_supplier_balance()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE suppliers
  SET current_balance = (
    SELECT COALESCE(SUM(debit - credit), 0) + opening_balance
    FROM supplier_ledger_entries
    WHERE supplier_id = COALESCE(NEW.supplier_id, OLD.supplier_id)
  ),
  updated_at = now()
  WHERE id = COALESCE(NEW.supplier_id, OLD.supplier_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_supplier_balance ON supplier_ledger_entries;
CREATE TRIGGER trigger_update_supplier_balance
AFTER INSERT OR UPDATE OR DELETE ON supplier_ledger_entries
FOR EACH ROW
EXECUTE FUNCTION update_supplier_balance();

-- Stock movement trigger
CREATE OR REPLACE FUNCTION update_inventory_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.movement_type = 'in' THEN
    UPDATE inventory_items
    SET current_stock = current_stock + NEW.quantity, updated_at = now()
    WHERE id = NEW.item_id;
  ELSIF NEW.movement_type = 'out' THEN
    UPDATE inventory_items
    SET current_stock = current_stock - NEW.quantity, updated_at = now()
    WHERE id = NEW.item_id;
  ELSIF NEW.movement_type = 'adjustment' THEN
    UPDATE inventory_items
    SET current_stock = NEW.quantity, updated_at = now()
    WHERE id = NEW.item_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_inventory_stock ON stock_movements;
CREATE TRIGGER trigger_update_inventory_stock
AFTER INSERT ON stock_movements
FOR EACH ROW
EXECUTE FUNCTION update_inventory_stock();

-- Invoice ledger entry
CREATE OR REPLACE FUNCTION create_ledger_from_invoice()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO customer_ledger_entries (
    customer_id, entry_date, particulars, ref_type, ref_no, ref_id, debit, credit
  ) VALUES (
    NEW.customer_id, NEW.invoice_date, 'Sale Invoice', 'invoice', NEW.invoice_no, NEW.id, NEW.total_amount, 0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_invoice_to_ledger ON invoices;
CREATE TRIGGER trigger_invoice_to_ledger
AFTER INSERT ON invoices
FOR EACH ROW
EXECUTE FUNCTION create_ledger_from_invoice();

-- Receipt ledger entry
CREATE OR REPLACE FUNCTION create_ledger_from_receipt()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO customer_ledger_entries (
    customer_id, entry_date, particulars, ref_type, ref_no, ref_id, debit, credit
  ) VALUES (
    NEW.customer_id, NEW.receipt_date, 'Payment Received', 'receipt', NEW.receipt_no, NEW.id, 0, NEW.amount
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_receipt_to_ledger ON receipts;
CREATE TRIGGER trigger_receipt_to_ledger
AFTER INSERT ON receipts
FOR EACH ROW
EXECUTE FUNCTION create_ledger_from_receipt();

-- Voucher payment processing
CREATE OR REPLACE FUNCTION process_voucher_payment()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payee_type = 'labour' THEN
    INSERT INTO labour_ledger_entries (
      labour_id, entry_date, particulars, ref_type, ref_no, ref_id, credit
    ) VALUES (
      NEW.payee_id, NEW.voucher_date, 'Payment via Voucher', 'voucher', NEW.voucher_no, NEW.id, NEW.amount
    );
  ELSIF NEW.payee_type = 'vendor' THEN
    INSERT INTO vendor_ledger_entries (
      vendor_id, entry_date, particulars, ref_type, ref_no, ref_id, credit
    ) VALUES (
      NEW.payee_id, NEW.voucher_date, 'Payment via Voucher', 'voucher', NEW.voucher_no, NEW.id, NEW.amount
    );
  ELSIF NEW.payee_type = 'supplier' THEN
    INSERT INTO supplier_ledger_entries (
      supplier_id, entry_date, particulars, ref_type, ref_no, ref_id, credit
    ) VALUES (
      NEW.payee_id, NEW.voucher_date, 'Payment via Voucher', 'voucher', NEW.voucher_no, NEW.id, NEW.amount
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_process_voucher_payment ON vouchers;
CREATE TRIGGER trigger_process_voucher_payment
AFTER INSERT ON vouchers
FOR EACH ROW
EXECUTE FUNCTION process_voucher_payment();

-- User profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'Accountant')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================
-- VIEWS
-- ============================================

CREATE OR REPLACE VIEW customer_aging_analysis AS
SELECT
  c.id as customer_id,
  c.name as customer_name,
  c.current_balance,
  c.credit_limit,
  c.on_hold,
  COUNT(CASE WHEN i.payment_status = 'pending' THEN 1 END) as pending_invoices,
  COUNT(CASE WHEN i.payment_status = 'overdue' THEN 1 END) as overdue_invoices,
  SUM(CASE WHEN CURRENT_DATE - i.due_date <= 30 THEN (i.total_amount - i.paid_amount) ELSE 0 END) as aging_0_30,
  SUM(CASE WHEN CURRENT_DATE - i.due_date BETWEEN 31 AND 60 THEN (i.total_amount - i.paid_amount) ELSE 0 END) as aging_31_60,
  SUM(CASE WHEN CURRENT_DATE - i.due_date BETWEEN 61 AND 90 THEN (i.total_amount - i.paid_amount) ELSE 0 END) as aging_61_90,
  SUM(CASE WHEN CURRENT_DATE - i.due_date > 90 THEN (i.total_amount - i.paid_amount) ELSE 0 END) as aging_90_plus
FROM customers c
LEFT JOIN invoices i ON c.id = i.customer_id AND i.payment_status != 'paid'
GROUP BY c.id, c.name, c.current_balance, c.credit_limit, c.on_hold;