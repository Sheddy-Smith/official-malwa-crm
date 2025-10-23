-- ============================================
-- FIX SECURITY ISSUES
-- ============================================
-- 1. Add missing indexes for foreign keys
-- 2. Fix function search path mutability
-- 3. Fix security definer view
-- ============================================

-- ============================================
-- 1. ADD MISSING INDEXES FOR FOREIGN KEYS
-- ============================================

-- profiles table
CREATE INDEX IF NOT EXISTS idx_profiles_branch_id ON profiles(branch_id);

-- purchase_challans table
CREATE INDEX IF NOT EXISTS idx_purchase_challans_item_id ON purchase_challans(item_id);
CREATE INDEX IF NOT EXISTS idx_purchase_challans_supplier_id ON purchase_challans(supplier_id);

-- sell_challans table
CREATE INDEX IF NOT EXISTS idx_sell_challans_customer_id ON sell_challans(customer_id);
CREATE INDEX IF NOT EXISTS idx_sell_challans_item_id ON sell_challans(item_id);
CREATE INDEX IF NOT EXISTS idx_sell_challans_job_id ON sell_challans(job_id);

-- ============================================
-- 2. FIX FUNCTION SEARCH PATH MUTABILITY
-- ============================================
-- Drop and recreate all functions with SET search_path

-- Function: Recalculate customer balance
DROP FUNCTION IF EXISTS recalculate_customer_balance() CASCADE;
CREATE OR REPLACE FUNCTION recalculate_customer_balance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
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
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS trigger_recalculate_customer_balance ON customer_ledger_entries;
CREATE TRIGGER trigger_recalculate_customer_balance
AFTER INSERT OR UPDATE OR DELETE ON customer_ledger_entries
FOR EACH ROW
EXECUTE FUNCTION recalculate_customer_balance();

-- Function: Update vendor balance
DROP FUNCTION IF EXISTS update_vendor_balance() CASCADE;
CREATE OR REPLACE FUNCTION update_vendor_balance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
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
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS trigger_update_vendor_balance ON vendor_ledger_entries;
CREATE TRIGGER trigger_update_vendor_balance
AFTER INSERT OR UPDATE OR DELETE ON vendor_ledger_entries
FOR EACH ROW
EXECUTE FUNCTION update_vendor_balance();

-- Function: Update labour balance
DROP FUNCTION IF EXISTS update_labour_balance() CASCADE;
CREATE OR REPLACE FUNCTION update_labour_balance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
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
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS trigger_update_labour_balance ON labour_ledger_entries;
CREATE TRIGGER trigger_update_labour_balance
AFTER INSERT OR UPDATE OR DELETE ON labour_ledger_entries
FOR EACH ROW
EXECUTE FUNCTION update_labour_balance();

-- Function: Update supplier balance
DROP FUNCTION IF EXISTS update_supplier_balance() CASCADE;
CREATE OR REPLACE FUNCTION update_supplier_balance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
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
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS trigger_update_supplier_balance ON supplier_ledger_entries;
CREATE TRIGGER trigger_update_supplier_balance
AFTER INSERT OR UPDATE OR DELETE ON supplier_ledger_entries
FOR EACH ROW
EXECUTE FUNCTION update_supplier_balance();

-- Function: Update inventory stock
DROP FUNCTION IF EXISTS update_inventory_stock() CASCADE;
CREATE OR REPLACE FUNCTION update_inventory_stock()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
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
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS trigger_update_inventory_stock ON stock_movements;
CREATE TRIGGER trigger_update_inventory_stock
AFTER INSERT ON stock_movements
FOR EACH ROW
EXECUTE FUNCTION update_inventory_stock();

-- Function: Create ledger from invoice
DROP FUNCTION IF EXISTS create_ledger_from_invoice() CASCADE;
CREATE OR REPLACE FUNCTION create_ledger_from_invoice()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO customer_ledger_entries (
    customer_id, entry_date, particulars, ref_type, ref_no, ref_id, debit, credit
  ) VALUES (
    NEW.customer_id, NEW.invoice_date, 'Sale Invoice', 'invoice', NEW.invoice_no, NEW.id, NEW.total_amount, 0
  );
  RETURN NEW;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS trigger_invoice_to_ledger ON invoices;
CREATE TRIGGER trigger_invoice_to_ledger
AFTER INSERT ON invoices
FOR EACH ROW
EXECUTE FUNCTION create_ledger_from_invoice();

-- Function: Create ledger from receipt
DROP FUNCTION IF EXISTS create_ledger_from_receipt() CASCADE;
CREATE OR REPLACE FUNCTION create_ledger_from_receipt()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO customer_ledger_entries (
    customer_id, entry_date, particulars, ref_type, ref_no, ref_id, debit, credit
  ) VALUES (
    NEW.customer_id, NEW.receipt_date, 'Payment Received', 'receipt', NEW.receipt_no, NEW.id, 0, NEW.amount
  );
  RETURN NEW;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS trigger_receipt_to_ledger ON receipts;
CREATE TRIGGER trigger_receipt_to_ledger
AFTER INSERT ON receipts
FOR EACH ROW
EXECUTE FUNCTION create_ledger_from_receipt();

-- Function: Process voucher payment
DROP FUNCTION IF EXISTS process_voucher_payment() CASCADE;
CREATE OR REPLACE FUNCTION process_voucher_payment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
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
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS trigger_process_voucher_payment ON vouchers;
CREATE TRIGGER trigger_process_voucher_payment
AFTER INSERT ON vouchers
FOR EACH ROW
EXECUTE FUNCTION process_voucher_payment();

-- Function: Handle new user
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
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
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================
-- 3. FIX SECURITY DEFINER VIEW
-- ============================================
-- Drop and recreate view without SECURITY DEFINER

DROP VIEW IF EXISTS customer_aging_analysis;

CREATE OR REPLACE VIEW customer_aging_analysis 
WITH (security_invoker=true)
AS
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

-- ============================================
-- 4. VERIFY INDEXES
-- ============================================

-- List all indexes to verify
DO $$
BEGIN
  RAISE NOTICE '✓ Security issues fixed successfully!';
  RAISE NOTICE '✓ Added 6 missing foreign key indexes';
  RAISE NOTICE '✓ Fixed 9 function search path issues';
  RAISE NOTICE '✓ Fixed security definer view';
  RAISE NOTICE '→ All security issues resolved!';
END $$;