# Database Migration Instructions

Your database is currently empty and needs all migrations applied.

## Quick Solution

### Option 1: Apply via Supabase Dashboard (Recommended)

1. Visit: https://supabase.com/dashboard/project/anywqwnkwmlvdctnmhgp/editor

2. Copy and execute the entire contents of `/tmp/all_migrations.sql`

OR apply each migration file individually in order:

1. `supabase/migrations/20251022132635_create_customer_ledger_system.sql`
2. `supabase/migrations/20251022155047_add_allocations_and_aging.sql`
3. `supabase/migrations/20251022161029_create_complete_erp_system.sql`
4. `supabase/migrations/20251022192745_create_purchase_challans_table.sql`
5. `supabase/migrations/20251022193119_create_sell_challans_table.sql`
6. `supabase/migrations/20251022202143_create_user_management_system.sql`
7. `supabase/migrations/20251023125804_fix_security_issues.sql`

### Option 2: Using Supabase CLI (If Available)

```bash
# Navigate to project directory
cd /tmp/cc-agent/59044569/project

# Link to your project
supabase link --project-ref anywqwnkwmlvdctnmhgp

# Push migrations
supabase db push
```

## What These Migrations Create

### Core Tables
- `customers` - Customer master data
- `vendors` - Service providers (painting, denting, etc.)
- `labour` - Workers (mistri, mazdoor)
- `suppliers` - Material/parts suppliers
- `customer_jobs` - Job tracking with inspection/estimate/jobsheet workflow
- `invoices` - Sales invoices
- `receipts` - Payment receipts
- `vouchers` - Payment vouchers

### Ledger Tables
- `customer_ledger_entries` - Customer transaction history
- `vendor_ledger_entries` - Vendor transaction history
- `labour_ledger_entries` - Labour transaction history
- `supplier_ledger_entries` - Supplier transaction history
- `gst_ledger` - GST tracking

### Inventory
- `inventory_categories` - Item categories
- `inventory_items` - Inventory master
- `stock_movements` - Stock in/out/adjustment tracking

### Challan Tables
- `purchase_challans` - Purchase delivery challans
- `sell_challans` - Sales delivery challans

### User Management
- `profiles` - User profiles with roles and permissions
- `branches` - Branch master data

## After Migration

Once migrations are applied:

1. Verify tables exist:
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

2. Test inserting data (make sure you're authenticated first):
```sql
-- Test customer insert
INSERT INTO customers (name, phone)
VALUES ('Test Customer', '1234567890');

-- Test vendor insert
INSERT INTO vendors (name, phone)
VALUES ('Test Vendor', '1234567890');

-- Test labour insert
INSERT INTO labour (name, phone)
VALUES ('Test Labour', '1234567890');
```

## Current Issue

The "upload failed" error occurs because:
1. **No tables exist** in your database yet
2. All migrations need to be applied first
3. RLS policies will be in place after migrations

After applying migrations, all INSERT operations should work correctly from your application.
