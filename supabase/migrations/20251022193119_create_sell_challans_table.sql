/*
  # Create Sell Challans Table

  1. New Tables
    - `sell_challans`
      - `id` (uuid, primary key)
      - `challan_no` (text, unique) - Delivery challan number
      - `challan_date` (date) - Date of challan
      - `customer_id` (uuid, foreign key) - Reference to customers table
      - `job_id` (uuid, foreign key) - Optional link to customer_jobs table
      - `item_id` (uuid, foreign key) - Reference to inventory_items table
      - `quantity` (numeric) - Quantity delivered
      - `rate` (numeric) - Rate per unit
      - `amount` (numeric) - Total amount (quantity * rate)
      - `destination` (text) - Delivery destination
      - `vehicle_no` (text) - Transport vehicle number
      - `delivery_status` (text) - Delivery status (pending/delivered/returned)
      - `notes` (text) - Additional notes
      - `linked_invoice_id` (uuid) - Reference to invoice if converted
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `sell_challans` table
    - Add policy for authenticated users to manage challans
*/

-- Create sell_challans table
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

-- Enable RLS
ALTER TABLE sell_challans ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to manage their sell challans
CREATE POLICY "Authenticated users can manage sell challans"
  ON sell_challans
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_sell_challans_customer ON sell_challans(customer_id);
CREATE INDEX IF NOT EXISTS idx_sell_challans_job ON sell_challans(job_id);
CREATE INDEX IF NOT EXISTS idx_sell_challans_item ON sell_challans(item_id);
CREATE INDEX IF NOT EXISTS idx_sell_challans_date ON sell_challans(challan_date);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_sell_challan_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sell_challan_timestamp
  BEFORE UPDATE ON sell_challans
  FOR EACH ROW
  EXECUTE FUNCTION update_sell_challan_timestamp();