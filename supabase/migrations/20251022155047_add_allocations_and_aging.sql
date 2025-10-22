/*
  # Add Allocations and Aging Support

  ## Overview
  This migration adds support for receipt allocations and invoice aging analysis.

  ## Changes
  
  ### 1. Add allocations column to ledger entries
    - Store which invoices a receipt payment is allocated to
    - Format: [{ invoice_id, allocated_amount, allocation_date }]
  
  ### 2. Add payment tracking to invoices
    - `paid_amount` - total amount paid so far
    - `payment_status` - pending, partial, paid, overdue
    - `due_date` - when payment is due
    - `days_overdue` - calculated field for aging
  
  ### 3. Add customer credit management
    - `credit_limit` - maximum credit allowed
    - `credit_days` - payment terms in days
    - `on_hold` - boolean flag for credit limit breach
  
  ### 4. Create helper functions
    - Function to calculate aging buckets
    - Function to update invoice payment status
    - Function to check credit limit
*/

-- Add allocations column to customer_ledger_entries
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customer_ledger_entries' AND column_name = 'allocations'
  ) THEN
    ALTER TABLE customer_ledger_entries ADD COLUMN allocations jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Add payment tracking columns to invoices
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'paid_amount'
  ) THEN
    ALTER TABLE invoices ADD COLUMN paid_amount numeric DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE invoices ADD COLUMN payment_status text DEFAULT 'pending';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'due_date'
  ) THEN
    ALTER TABLE invoices ADD COLUMN due_date date;
  END IF;
END $$;

-- Add credit management columns to customers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customers' AND column_name = 'credit_limit'
  ) THEN
    ALTER TABLE customers ADD COLUMN credit_limit numeric DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customers' AND column_name = 'credit_days'
  ) THEN
    ALTER TABLE customers ADD COLUMN credit_days integer DEFAULT 30;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customers' AND column_name = 'on_hold'
  ) THEN
    ALTER TABLE customers ADD COLUMN on_hold boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customers' AND column_name = 'preferred'
  ) THEN
    ALTER TABLE customers ADD COLUMN preferred boolean DEFAULT false;
  END IF;
END $$;

-- Function to calculate days overdue
CREATE OR REPLACE FUNCTION calculate_days_overdue(p_due_date date)
RETURNS integer AS $$
BEGIN
  IF p_due_date IS NULL THEN
    RETURN 0;
  END IF;
  
  RETURN GREATEST(0, CURRENT_DATE - p_due_date);
END;
$$ LANGUAGE plpgsql;

-- Function to get aging bucket
CREATE OR REPLACE FUNCTION get_aging_bucket(p_days_overdue integer)
RETURNS text AS $$
BEGIN
  IF p_days_overdue <= 30 THEN
    RETURN '0-30';
  ELSIF p_days_overdue <= 60 THEN
    RETURN '31-60';
  ELSIF p_days_overdue <= 90 THEN
    RETURN '61-90';
  ELSE
    RETURN '90+';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to update invoice payment status
CREATE OR REPLACE FUNCTION update_invoice_payment_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.paid_amount >= NEW.total_amount THEN
    NEW.payment_status := 'paid';
  ELSIF NEW.paid_amount > 0 THEN
    NEW.payment_status := 'partial';
  ELSIF NEW.due_date IS NOT NULL AND CURRENT_DATE > NEW.due_date THEN
    NEW.payment_status := 'overdue';
  ELSE
    NEW.payment_status := 'pending';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update payment status
DROP TRIGGER IF EXISTS trigger_update_invoice_payment_status ON invoices;
CREATE TRIGGER trigger_update_invoice_payment_status
BEFORE INSERT OR UPDATE ON invoices
FOR EACH ROW
EXECUTE FUNCTION update_invoice_payment_status();

-- Function to check and update customer credit hold status
CREATE OR REPLACE FUNCTION check_customer_credit_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.current_balance > NEW.credit_limit AND NEW.credit_limit > 0 THEN
    NEW.on_hold := true;
  ELSE
    NEW.on_hold := false;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-check credit limit
DROP TRIGGER IF EXISTS trigger_check_credit_limit ON customers;
CREATE TRIGGER trigger_check_credit_limit
BEFORE INSERT OR UPDATE ON customers
FOR EACH ROW
EXECUTE FUNCTION check_customer_credit_limit();

-- View for customer aging analysis
CREATE OR REPLACE VIEW customer_aging_analysis AS
SELECT 
  c.id as customer_id,
  c.name as customer_name,
  c.current_balance,
  c.credit_limit,
  c.on_hold,
  COUNT(CASE WHEN i.payment_status = 'pending' THEN 1 END) as pending_invoices,
  COUNT(CASE WHEN i.payment_status = 'overdue' THEN 1 END) as overdue_invoices,
  SUM(CASE WHEN calculate_days_overdue(i.due_date) <= 30 THEN (i.total_amount - i.paid_amount) ELSE 0 END) as aging_0_30,
  SUM(CASE WHEN calculate_days_overdue(i.due_date) BETWEEN 31 AND 60 THEN (i.total_amount - i.paid_amount) ELSE 0 END) as aging_31_60,
  SUM(CASE WHEN calculate_days_overdue(i.due_date) BETWEEN 61 AND 90 THEN (i.total_amount - i.paid_amount) ELSE 0 END) as aging_61_90,
  SUM(CASE WHEN calculate_days_overdue(i.due_date) > 90 THEN (i.total_amount - i.paid_amount) ELSE 0 END) as aging_90_plus
FROM customers c
LEFT JOIN invoices i ON c.id = i.customer_id AND i.payment_status != 'paid'
GROUP BY c.id, c.name, c.current_balance, c.credit_limit, c.on_hold;

-- Function to allocate receipt to invoices
CREATE OR REPLACE FUNCTION allocate_receipt_to_invoices(
  p_receipt_id uuid,
  p_allocations jsonb
)
RETURNS void AS $$
DECLARE
  v_allocation jsonb;
  v_invoice_id uuid;
  v_amount numeric;
BEGIN
  FOR v_allocation IN SELECT * FROM jsonb_array_elements(p_allocations)
  LOOP
    v_invoice_id := (v_allocation->>'invoice_id')::uuid;
    v_amount := (v_allocation->>'allocated_amount')::numeric;
    
    UPDATE invoices
    SET paid_amount = paid_amount + v_amount
    WHERE id = v_invoice_id;
  END LOOP;
  
  UPDATE customer_ledger_entries
  SET allocations = p_allocations
  WHERE ref_id = p_receipt_id AND ref_type = 'receipt';
END;
$$ LANGUAGE plpgsql;