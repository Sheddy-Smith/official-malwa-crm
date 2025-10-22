# Jobs Section Polish Plan

## Overview
Polish all 5 job workflow steps with Supabase integration, proper error handling, and production-ready UI.

## Components to Polish

### 1. InspectionStep.jsx ✅
**Current State:** Uses localStorage for inspection items and categories
**Polish Tasks:**
- ✅ Clean styling with dark mode support
- ✅ Integrate with inventoryStore for categories
- ✅ Add toast notifications
- ✅ Add proper validation
- ✅ Calculate totals with multipliers
- 🔄 Save to Supabase customer_jobs table

### 2. EstimateStep.jsx ✅
**Current State:** Loads from localStorage, calculates totals
**Polish Tasks:**
- ✅ Clean PDF generation
- ✅ GST calculation (0%, 5%, 12%, 18%, 28%)
- ✅ Discount validation (>5% triggers approval)
- ✅ Amount in words
- ✅ Print functionality
- 🔄 Load from Supabase

### 3. JobSheetStep.jsx ⚠️
**Current State:** Critical - needs finalization automation
**Polish Tasks:**
- ✅ Display inspection items
- ✅ Add extra work section
- ✅ Assign to Labour/Vendor
- ⭐ **CRITICAL:** Implement finalization with triggers:
  - Deduct inventory (stock_movements OUT)
  - Post to labour_ledger_entries
  - Post to vendor_ledger_entries
  - Update job status

### 4. ChalanStep.jsx ✅
**Current State:** Display-only with PDF generation
**Polish Tasks:**
- ✅ Professional layout
- ✅ Load finalized items
- ✅ PDF generation
- ✅ Print functionality

### 5. InvoiceStep.jsx ⚠️
**Current State:** Needs Supabase integration
**Polish Tasks:**
- ✅ Customer selection from Supabase
- ✅ Add new customer inline
- ✅ Payment type selection
- ✅ GST calculation
- ⭐ **CRITICAL:** Save invoice to Supabase
  - Insert into invoices table
  - Trigger customer_ledger_entries update
  - Trigger gst_ledger update

## Implementation Priority

### High Priority (Production Blockers)
1. **JobSheetStep finalization automation** - Core business logic
2. **InvoiceStep Supabase integration** - Financial accuracy
3. **Proper data flow** - localStorage → Supabase

### Medium Priority (UX Improvements)
1. Loading states across all steps
2. Error handling with toast notifications
3. Form validation
4. Dark mode consistency

### Low Priority (Nice-to-have)
1. Advanced PDF customization
2. Email integration
3. SMS notifications

## Data Flow

```
Inspection → localStorage (inspectionItems)
     ↓
Estimate → Load items, apply multipliers, calculate GST
     ↓
Job Sheet → Load items + Add extra work → **FINALIZE**
     ↓                                         ↓
     ↓                                   [Triggers]
     ↓                                         ↓
     ↓                           ├─ Stock Movements (OUT)
     ↓                           ├─ Labour Ledger (DEBIT)
     ↓                           └─ Vendor Ledger (DEBIT)
     ↓
Challan → Display finalized items, PDF
     ↓
Invoice → Select customer, GST → **SAVE**
                                     ↓
                               [Triggers]
                                     ↓
                     ├─ Customer Ledger (DEBIT)
                     └─ GST Ledger (OUTPUT TAX)
```

## Success Criteria

✅ All steps have consistent UI/UX
✅ Dark mode fully supported
✅ Proper error handling
✅ Toast notifications for user feedback
✅ PDF generation works perfectly
⭐ Job Sheet finalization triggers work
⭐ Invoice save triggers work
✅ Data persists correctly
✅ Build completes without errors
