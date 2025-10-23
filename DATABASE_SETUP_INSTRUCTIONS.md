# 🚀 Database Setup Instructions

## Malwa CRM - Complete Database Migration

### ⚡ Quick Setup (5 Minutes)

#### Step 1: Open SQL File
```bash
# File location in your project:
COMPLETE_DATABASE_SETUP.sql
```

#### Step 2: Copy All Content
- Open `COMPLETE_DATABASE_SETUP.sql` in any text editor
- Press `Ctrl + A` (Select All)
- Press `Ctrl + C` (Copy)

#### Step 3: Run in Supabase
1. Open Supabase SQL Editor:
   - URL: https://supabase.com/dashboard/project/fyvhgzaqcbqcteucnzxy/editor
   - Or: Dashboard → SQL Editor

2. Create New Query:
   - Click **"New query"** button
   - Delete any default text

3. Paste SQL:
   - Press `Ctrl + V` to paste
   - You should see 679 lines of SQL

4. Execute:
   - Click **"Run"** button (or press `F5`)
   - Wait 1-2 minutes for completion
   - You'll see success messages

#### Step 4: Verify
```sql
-- Run this query to check tables:
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see **20 tables**:
- ✓ customers
- ✓ customer_ledger_entries
- ✓ customer_jobs
- ✓ invoices
- ✓ receipts
- ✓ vendors
- ✓ vendor_ledger_entries
- ✓ labour
- ✓ labour_ledger_entries
- ✓ suppliers
- ✓ supplier_ledger_entries
- ✓ inventory_categories
- ✓ inventory_items
- ✓ stock_movements
- ✓ vouchers
- ✓ gst_ledger
- ✓ purchase_challans
- ✓ sell_challans
- ✓ branches
- ✓ profiles

---

## 📦 What Gets Created

### 1. Customer Management
- Customers table with ledger system
- Automatic balance tracking
- Job/project tracking
- Invoice & receipt management

### 2. Vendor Management
- Service provider tracking (painters, electricians, etc.)
- Ledger entries with automatic balance updates
- Payment tracking

### 3. Labour Management
- Worker/employee tracking
- Daily rate & skill type
- Ledger with hours worked tracking

### 4. Supplier Management
- Parts & material supplier tracking
- Purchase tracking
- Payment management

### 5. Inventory System
- Categories & items
- Stock movements (IN/OUT/Adjustment)
- Automatic stock updates

### 6. Accounts Module
- Payment vouchers
- GST ledger
- Purchase & sell challans
- Automated accounting entries

### 7. User Management
- User profiles
- Branch management
- Role-based permissions

---

## 🔐 Security Features

✓ Row Level Security (RLS) enabled on all tables
✓ Policies for authenticated users
✓ Automatic ledger entry creation
✓ Balance auto-calculation
✓ Transaction triggers

---

## 🎯 After Migration

### Test Your Setup

1. **Login to Application**
   ```
   Your application URL
   ```

2. **Try Adding Data**
   - Go to Customer page → Add new customer
   - Go to Vendor page → Add new vendor
   - Go to Labour page → Add new labour
   - Go to Supplier page → Add new supplier

3. **All Should Work!**
   - No more "upload failed" errors ✓
   - Data saves to database ✓
   - Ledgers automatically update ✓

---

## 🆘 Troubleshooting

### Error: "Permission denied"
**Solution:** Make sure you're logged in to Supabase Dashboard

### Error: "Already exists"
**Solution:** Tables already created! You're good to go.

### Error: "Syntax error"
**Solution:**
1. Copy the SQL file again
2. Make sure you copied the entire file
3. Paste in a fresh query window

### Still Having Issues?
1. Clear browser cache
2. Try in incognito/private mode
3. Check if you're using the correct Supabase project

---

## 📊 Database Stats

- **Total Tables:** 20
- **Total Triggers:** 10
- **Total Functions:** 12
- **Total Policies:** 20
- **Total Indexes:** 6
- **Total Views:** 1

---

## ✅ Success Indicators

After running the migration, you should see:
```
✓ Database setup completed successfully!
✓ All tables created
✓ All indexes created
✓ All triggers created
✓ RLS policies enabled
→ You can now use the application!
```

---

## 🔄 Need to Reset?

If you want to start fresh, uncomment the DROP TABLE statements at the top of the SQL file (lines 9-29), then run the migration again.

---

**Happy Building! 🚀**
