/*
  # Customer Ledger System

  ## Overview
  This migration creates the database schema for a complete customer ledger system with automatic transaction tracking.

  ## New Tables
  
  ### 1. customers
    - `id` (uuid, primary key) - Unique customer identifier
    - `name` (text, not null) - Customer name
    - `company` (text, nullable) - Company name
    - `phone` (text, not null) - Phone number
    - `address` (text, nullable) - Address
    - `gstin` (text, nullable) - GST identification number
    - `opening_balance` (numeric, default 0) - Opening balance (positive = receivable)
    - `current_balance` (numeric, default 0) - Current outstanding balance
    - `created_at` (timestamptz, default now()) - Record creation timestamp
    - `updated_at` (timestamptz, default now()) - Last update timestamp

  ### 2. customer_ledger_entries
    - `id` (uuid, primary key) - Unique entry identifier
    - `customer_id` (uuid, foreign key) - References customers table
    - `entry_date` (date, not null) - Transaction date
    - `particulars` (text, not null) - Transaction description
    - `ref_type` (text, nullable) - Type: 'invoice', 'receipt', 'opening', 'adjustment'
    - `ref_no` (text, nullable) - Reference number (e.g., INV-102, RCPT-45)
    - `ref_id` (uuid, nullable) - Reference to source document ID
    - `debit` (numeric, default 0) - Debit amount (to receive)
    - `credit` (numeric, default 0) - Credit amount (received)
    - `balance` (numeric, default 0) - Running balance after this entry
    - `notes` (text, nullable) - Additional notes
    - `created_at` (timestamptz, default now()) - Entry creation timestamp

  ### 3. customer_jobs
    - `id` (uuid, primary key) - Unique job identifier
    - `customer_id` (uuid, foreign key) - References customers table
    - `job_no` (text, not null, unique) - Job number (e.g., JOB-001)
    - `vehicle_no` (text, not null) - Vehicle registration number
    - `job_date` (date, not null) - Job creation date
    - `status` (text, default 'inspection') - inspection, estimate, jobsheet, chalan, invoice, completed
    - `inspection_data` (jsonb, nullable) - Inspection details
    - `estimate_data` (jsonb, nullable) - Estimate details
    - `jobsheet_data` (jsonb, nullable) - Job sheet details
    - `chalan_data` (jsonb, nullable) - Challan details
    - `invoice_data` (jsonb, nullable) - Invoice details
    - `total_amount` (numeric, default 0) - Total job amount
    - `created_at` (timestamptz, default now())
    - `updated_at` (timestamptz, default now())

  ### 4. invoices
    - `id` (uuid, primary key) - Unique invoice identifier
    - `invoice_no` (text, not null, unique) - Invoice number
    - `customer_id` (uuid, foreign key) - References customers table
    - `job_id` (uuid, foreign key, nullable) - References customer_jobs table
    - `invoice_date` (date, not null) - Invoice date
    - `subtotal` (numeric, not null) - Subtotal before tax
    - `discount` (numeric, default 0) - Discount amount
    - `gst_rate` (numeric, default 18) - GST percentage
    - `gst_amount` (numeric, default 0) - GST amount
    - `total_amount` (numeric, not null) - Final invoice amount
    - `items` (jsonb, not null) - Invoice line items
    - `created_at` (timestamptz, default now())

  ### 5. receipts
    - `id` (uuid, primary key) - Unique receipt identifier
    - `receipt_no` (text, not null, unique) - Receipt number
    - `customer_id` (uuid, foreign key) - References customers table
    - `receipt_date` (date, not null) - Payment receipt date
    - `amount` (numeric, not null) - Payment amount
    - `payment_mode` (text, default 'cash') - cash, cheque, upi, neft, card
    - `reference` (text, nullable) - Cheque no / UPI ref / Transaction ID
    - `notes` (text, nullable) - Additional notes
    - `created_at` (timestamptz, default now())

  ## Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their data
    - Restrict access based on organization/branch (future enhancement)

  ## Important Notes
    1. All monetary values use numeric type for precision
    2. Ledger entries are automatically created via triggers
    3. Running balance is recalculated on each transaction
    4. JSONB fields allow flexible storage of complex data structures
*/

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text,
  phone text NOT NULL,
  address text,
  gstin text,
  opening_balance numeric DEFAULT 0,
  current_balance numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create customer_ledger_entries table
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
  created_at timestamptz DEFAULT now()
);

-- Create customer_jobs table
CREATE TABLE IF NOT EXISTS customer_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  job_no text NOT NULL UNIQUE,
  vehicle_no text NOT NULL,
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

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_no text NOT NULL UNIQUE,
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  job_id uuid REFERENCES customer_jobs(id) ON DELETE SET NULL,
  invoice_date date NOT NULL,
  subtotal numeric NOT NULL,
  discount numeric DEFAULT 0,
  gst_rate numeric DEFAULT 18,
  gst_amount numeric DEFAULT 0,
  total_amount numeric NOT NULL,
  items jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create receipts table
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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ledger_customer_date ON customer_ledger_entries(customer_id, entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_customer ON customer_jobs(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_receipts_customer ON receipts(customer_id);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customers table
CREATE POLICY "Users can view all customers"
  ON customers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert customers"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update customers"
  ON customers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete customers"
  ON customers FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for customer_ledger_entries table
CREATE POLICY "Users can view ledger entries"
  ON customer_ledger_entries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert ledger entries"
  ON customer_ledger_entries FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update ledger entries"
  ON customer_ledger_entries FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete ledger entries"
  ON customer_ledger_entries FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for customer_jobs table
CREATE POLICY "Users can view jobs"
  ON customer_jobs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert jobs"
  ON customer_jobs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update jobs"
  ON customer_jobs FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete jobs"
  ON customer_jobs FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for invoices table
CREATE POLICY "Users can view invoices"
  ON invoices FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert invoices"
  ON invoices FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update invoices"
  ON invoices FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete invoices"
  ON invoices FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for receipts table
CREATE POLICY "Users can view receipts"
  ON receipts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert receipts"
  ON receipts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update receipts"
  ON receipts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete receipts"
  ON receipts FOR DELETE
  TO authenticated
  USING (true);

-- Function to recalculate customer balance
CREATE OR REPLACE FUNCTION recalculate_customer_balance()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE customers
  SET current_balance = (
    SELECT COALESCE(SUM(debit - credit), 0) + opening_balance
    FROM customer_ledger_entries
    WHERE customer_id = NEW.customer_id
  ),
  updated_at = now()
  WHERE id = NEW.customer_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to recalculate balance after ledger entry
CREATE TRIGGER trigger_recalculate_balance
AFTER INSERT OR UPDATE OR DELETE ON customer_ledger_entries
FOR EACH ROW
EXECUTE FUNCTION recalculate_customer_balance();

-- Function to auto-create ledger entry from invoice
CREATE OR REPLACE FUNCTION create_ledger_from_invoice()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO customer_ledger_entries (
    customer_id,
    entry_date,
    particulars,
    ref_type,
    ref_no,
    ref_id,
    debit,
    credit
  ) VALUES (
    NEW.customer_id,
    NEW.invoice_date,
    'Sale against Invoice',
    'invoice',
    NEW.invoice_no,
    NEW.id,
    NEW.total_amount,
    0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create ledger entry on invoice creation
CREATE TRIGGER trigger_invoice_to_ledger
AFTER INSERT ON invoices
FOR EACH ROW
EXECUTE FUNCTION create_ledger_from_invoice();

-- Function to auto-create ledger entry from receipt
CREATE OR REPLACE FUNCTION create_ledger_from_receipt()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO customer_ledger_entries (
    customer_id,
    entry_date,
    particulars,
    ref_type,
    ref_no,
    ref_id,
    debit,
    credit
  ) VALUES (
    NEW.customer_id,
    NEW.receipt_date,
    'Payment Received',
    'receipt',
    NEW.receipt_no,
    NEW.id,
    0,
    NEW.amount
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create ledger entry on receipt creation
CREATE TRIGGER trigger_receipt_to_ledger
AFTER INSERT ON receipts
FOR EACH ROW
EXECUTE FUNCTION create_ledger_from_receipt();

-- Function to recalculate running balance for all entries
CREATE OR REPLACE FUNCTION recalculate_running_balance(p_customer_id uuid)
RETURNS void AS $$
DECLARE
  v_balance numeric := 0;
  v_entry RECORD;
BEGIN
  SELECT opening_balance INTO v_balance
  FROM customers
  WHERE id = p_customer_id;

  FOR v_entry IN
    SELECT id, debit, credit
    FROM customer_ledger_entries
    WHERE customer_id = p_customer_id
    ORDER BY entry_date ASC, created_at ASC
  LOOP
    v_balance := v_balance + v_entry.debit - v_entry.credit;
    UPDATE customer_ledger_entries
    SET balance = v_balance
    WHERE id = v_entry.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;