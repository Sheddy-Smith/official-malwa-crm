# 100% Offline Migration - Supabase to IndexedDB

## Status: 22 Files Need Updates

All files below are currently using Supabase but need to use IndexedDB instead.

## Pattern to Replace

### OLD (Supabase):
```javascript
const { data, error } = await supabase.from('table_name').select('*');
const { error } = await supabase.from('table_name').insert(record);
const { error } = await supabase.from('table_name').update(record).eq('id', id);
const { error } = await supabase.from('table_name').delete().eq('id', id);
```

### NEW (IndexedDB):
```javascript
import { dbOperations } from '@/lib/db';

const data = await dbOperations.getAll('table_name');
await dbOperations.insert('table_name', record);
await dbOperations.update('table_name', id, record);
await dbOperations.delete('table_name', id);
```

## Files to Update:

### Jobs Steps (3 files)
- [ ] src/pages/jobs/InspectionStep.jsx
- [ ] src/pages/jobs/EstimateStep.jsx  
- [ ] src/pages/jobs/ChalanStep.jsx

### Accounts (6 files)
- [ ] src/pages/accounts/Purchase.jsx
- [ ] src/pages/accounts/Voucher.jsx
- [ ] src/pages/accounts/Invoice.jsx
- [ ] src/pages/accounts/Challan.jsx
- [ ] src/pages/accounts/Sellchallan.jsx
- [ ] src/pages/accounts/Gstledger.jsx

### Customer Tabs (3 files)
- [ ] src/pages/customer/CustomerLedgerTab.jsx
- [ ] src/pages/customer/JobHistoryTab.jsx
- [ ] src/pages/customer/SalesHistoryTab.jsx

### Inventory (3 files)
- [ ] src/pages/inventory/StockTab.jsx
- [ ] src/pages/inventory/StockMovements.jsx
- [ ] src/pages/inventory/CategoryManager.jsx

### Settings (3 files)
- [ ] src/pages/settings/UserManagementTab.jsx
- [ ] src/pages/settings/MyProfileTab.jsx
- [ ] src/pages/settings/BranchesTab.jsx

### Ledgers (3 files)
- [ ] src/pages/labour/LabourLedgerTab.jsx
- [ ] src/pages/vendors/VendorLedgerTab.jsx
- [ ] src/pages/supplier/SupplierLedgerTab.jsx

### Other (1 file)
- [ ] src/pages/Summary.jsx

## Important Notes

- NO internet connection required
- ALL data stored in browser IndexedDB
- Data persists across sessions
- Each browser has its own data
- No cloud sync (100% local)
