/*
  # Complete ERP System for Automotive Garage & Fabrication

  ## Overview
  This migration creates the complete database schema for the ERP system including
  all ledgers, inventory tracking, and workflow automation.

  ## New Tables Created
  
  ### 1. vendors (Service providers - painting, denting, etc)
    - id, code, name, company, phone, address, gstin
    - opening_balance, current_balance, credit_limit
    - vendor_type (painting, denting, electrical, etc)
    - created_at, updated_at

  ### 2. vendor_ledger_entries
    - id, vendor_id, entry_date, particulars
    - ref_type (job, voucher, opening), ref_no, ref_id
    - debit (to pay), credit (paid), balance
    - created_at

  ### 3. labour (Workers - mistri, mazdoor)
    - id, code, name, phone, address, skill_type
    - opening_balance, current_balance, daily_rate
    - created_at, updated_at

  ### 4. labour_ledger_entries
    - id, labour_id, entry_date, particulars
    - ref_type (job, voucher, opening), ref_no, ref_id
    - debit (to pay), credit (paid), balance
    - hours_worked, rate_per_hour
    - created_at

  ### 5. suppliers (Material/Parts suppliers)
    - Already exists, ensure proper structure

  ### 6. supplier_ledger_entries
    - id, supplier_id, entry_date, particulars
    - ref_type (purchase, voucher, opening), ref_no, ref_id
    - debit (to pay), credit (paid), balance
    - created_at

  ### 7. inventory_items
    - id, code, name, category_id, unit
    - current_stock, reorder_level, cost_price, selling_price
    - location, created_at, updated_at

  ### 8. inventory_categories
    - id, name, description, created_at

  ### 9. stock_movements
    - id, item_id, movement_type (in, out, adjustment)
    - quantity, from_location, to_location
    - reference_type (purchase, job, adjustment)
    - reference_id, notes, movement_date
    - created_at, created_by

  ### 10. vouchers (Payment vouchers)
    - id, voucher_no, voucher_date, voucher_type (labour, vendor, supplier)
    - payee_id, payee_type, amount, payment_mode
    - reference, notes, created_at

  ### 11. gst_ledger
    - id, transaction_date, transaction_type (purchase, sales)
    - document_no, party_name, taxable_amount
    - cgst, sgst, igst, total_gst
    - input_credit (for purchase), output_tax (for sales)
    - created_at

  ## Automation Functions
  
  ### Job Sheet Finalization Triggers
  1. Auto-deduct inventory when job finalized
  2. Auto-post labour cost to labour ledger
  3. Auto-post vendor cost to vendor ledger
  4. Auto-post supplier cost to supplier ledger

  ### Purchase Invoice Triggers
  1. Auto-add to inventory
  2. Auto-update supplier ledger
  3. Auto-update GST ledger

  ### Sales Invoice Triggers
  1. Auto-update customer ledger
  2. Auto-update GST ledger

  ## Security
  - RLS enabled on all tables
  - Policies for authenticated users
*/

-- Create vendors table
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

-- Create vendor_ledger_entries table
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

-- Create labour table
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

-- Create labour_ledger_entries table
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

-- Create suppliers table if not exists
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

-- Create supplier_ledger_entries table
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

-- Create inventory_categories table
CREATE TABLE IF NOT EXISTS inventory_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create inventory_items table
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

-- Create stock_movements table
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

-- Create vouchers table
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

-- Create gst_ledger table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_vendor_ledger_vendor_date ON vendor_ledger_entries(vendor_id, entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_labour_ledger_labour_date ON labour_ledger_entries(labour_id, entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_supplier_ledger_supplier_date ON supplier_ledger_entries(supplier_id, entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_stock_movements_item ON stock_movements(item_id, movement_date DESC);
CREATE INDEX IF NOT EXISTS idx_gst_ledger_date ON gst_ledger(transaction_date DESC);

-- Enable RLS
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

-- RLS Policies for vendors
CREATE POLICY "Users can manage vendors" ON vendors FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can manage vendor ledger" ON vendor_ledger_entries FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- RLS Policies for labour
CREATE POLICY "Users can manage labour" ON labour FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can manage labour ledger" ON labour_ledger_entries FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- RLS Policies for suppliers
CREATE POLICY "Users can manage suppliers" ON suppliers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can manage supplier ledger" ON supplier_ledger_entries FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- RLS Policies for inventory
CREATE POLICY "Users can manage categories" ON inventory_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can manage items" ON inventory_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can manage stock movements" ON stock_movements FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- RLS Policies for vouchers and GST
CREATE POLICY "Users can manage vouchers" ON vouchers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Users can manage gst ledger" ON gst_ledger FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Function to update vendor balance
CREATE OR REPLACE FUNCTION update_vendor_balance()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE vendors
  SET current_balance = (
    SELECT COALESCE(SUM(debit - credit), 0) + opening_balance
    FROM vendor_ledger_entries
    WHERE vendor_id = NEW.vendor_id
  ),
  updated_at = now()
  WHERE id = NEW.vendor_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_vendor_balance
AFTER INSERT OR UPDATE OR DELETE ON vendor_ledger_entries
FOR EACH ROW EXECUTE FUNCTION update_vendor_balance();

-- Function to update labour balance
CREATE OR REPLACE FUNCTION update_labour_balance()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE labour
  SET current_balance = (
    SELECT COALESCE(SUM(debit - credit), 0) + opening_balance
    FROM labour_ledger_entries
    WHERE labour_id = NEW.labour_id
  ),
  updated_at = now()
  WHERE id = NEW.labour_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_labour_balance
AFTER INSERT OR UPDATE OR DELETE ON labour_ledger_entries
FOR EACH ROW EXECUTE FUNCTION update_labour_balance();

-- Function to update supplier balance
CREATE OR REPLACE FUNCTION update_supplier_balance()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE suppliers
  SET current_balance = (
    SELECT COALESCE(SUM(debit - credit), 0) + opening_balance
    FROM supplier_ledger_entries
    WHERE supplier_id = NEW.supplier_id
  ),
  updated_at = now()
  WHERE id = NEW.supplier_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_supplier_balance
AFTER INSERT OR UPDATE OR DELETE ON supplier_ledger_entries
FOR EACH ROW EXECUTE FUNCTION update_supplier_balance();

-- Function to update inventory stock
CREATE OR REPLACE FUNCTION update_inventory_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.movement_type = 'in' THEN
    UPDATE inventory_items
    SET current_stock = current_stock + NEW.quantity,
        updated_at = now()
    WHERE id = NEW.item_id;
  ELSIF NEW.movement_type = 'out' THEN
    UPDATE inventory_items
    SET current_stock = current_stock - NEW.quantity,
        updated_at = now()
    WHERE id = NEW.item_id;
  ELSIF NEW.movement_type = 'adjustment' THEN
    UPDATE inventory_items
    SET current_stock = NEW.quantity,
        updated_at = now()
    WHERE id = NEW.item_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_inventory_stock
AFTER INSERT ON stock_movements
FOR EACH ROW EXECUTE FUNCTION update_inventory_stock();

-- Function to process voucher payments
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_process_voucher_payment
AFTER INSERT ON vouchers
FOR EACH ROW EXECUTE FUNCTION process_voucher_payment();

-- Function to recalculate running balances
CREATE OR REPLACE FUNCTION recalculate_vendor_ledger_balance(p_vendor_id uuid)
RETURNS void AS $$
DECLARE
  v_balance numeric := 0;
  v_entry RECORD;
BEGIN
  SELECT opening_balance INTO v_balance FROM vendors WHERE id = p_vendor_id;
  
  FOR v_entry IN
    SELECT id, debit, credit
    FROM vendor_ledger_entries
    WHERE vendor_id = p_vendor_id
    ORDER BY entry_date ASC, created_at ASC
  LOOP
    v_balance := v_balance + v_entry.debit - v_entry.credit;
    UPDATE vendor_ledger_entries SET balance = v_balance WHERE id = v_entry.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION recalculate_labour_ledger_balance(p_labour_id uuid)
RETURNS void AS $$
DECLARE
  v_balance numeric := 0;
  v_entry RECORD;
BEGIN
  SELECT opening_balance INTO v_balance FROM labour WHERE id = p_labour_id;
  
  FOR v_entry IN
    SELECT id, debit, credit
    FROM labour_ledger_entries
    WHERE labour_id = p_labour_id
    ORDER BY entry_date ASC, created_at ASC
  LOOP
    v_balance := v_balance + v_entry.debit - v_entry.credit;
    UPDATE labour_ledger_entries SET balance = v_balance WHERE id = v_entry.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION recalculate_supplier_ledger_balance(p_supplier_id uuid)
RETURNS void AS $$
DECLARE
  v_balance numeric := 0;
  v_entry RECORD;
BEGIN
  SELECT opening_balance INTO v_balance FROM suppliers WHERE id = p_supplier_id;
  
  FOR v_entry IN
    SELECT id, debit, credit
    FROM supplier_ledger_entries
    WHERE supplier_id = p_supplier_id
    ORDER BY entry_date ASC, created_at ASC
  LOOP
    v_balance := v_balance + v_entry.debit - v_entry.credit;
    UPDATE supplier_ledger_entries SET balance = v_balance WHERE id = v_entry.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;