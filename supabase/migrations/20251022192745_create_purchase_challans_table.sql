/*
  # Create Purchase Challans Table

  1. New Tables
    - `purchase_challans`
      - `id` (uuid, primary key)
      - `challan_no` (text, unique) - Delivery challan number
      - `challan_date` (date) - Date of challan
      - `supplier_id` (uuid, foreign key) - Reference to suppliers table
      - `item_id` (uuid, foreign key) - Reference to inventory_items table
      - `quantity` (numeric) - Quantity received
      - `rate` (numeric) - Rate per unit
      - `amount` (numeric) - Total amount (quantity * rate)
      - `source` (text) - Source location/warehouse
      - `vehicle_no` (text) - Transport vehicle number
      - `payment_status` (text) - Payment status (pending/paid)
      - `notes` (text) - Additional notes
      - `linked_invoice_id` (uuid) - Reference to purchase invoice if converted
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `purchase_challans` table
    - Add policy for authenticated users to manage challans
*/

-- Create purchase_challans table
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

-- Enable RLS
ALTER TABLE purchase_challans ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to manage their purchase challans
CREATE POLICY "Authenticated users can manage purchase challans"
  ON purchase_challans
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_purchase_challans_supplier ON purchase_challans(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchase_challans_item ON purchase_challans(item_id);
CREATE INDEX IF NOT EXISTS idx_purchase_challans_date ON purchase_challans(challan_date);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_purchase_challan_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_purchase_challan_timestamp
  BEFORE UPDATE ON purchase_challans
  FOR EACH ROW
  EXECUTE FUNCTION update_purchase_challan_timestamp();