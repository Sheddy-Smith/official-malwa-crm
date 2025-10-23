# Malwa CRM - Complete Automotive Garage & Fabrication ERP System

## Project Overview

A comprehensive Enterprise Resource Planning (ERP) / Customer Relationship Management (CRM) system specifically designed for truck garage and fabrication businesses. The system manages the complete workflow from lead inquiry to final invoice generation, with automatic management of customer, vendor, and labour ledgers, plus inventory tracking.

## Technology Stack

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.1.4
- **Language**: JavaScript/JSX
- **Styling**: Tailwind CSS 3.4.1 with custom brand colors
- **State Management**: Zustand 4.5.2
- **Routing**: React Router DOM 6.22.2
- **Animation**: Framer Motion 11.0.8
- **Charts**: Recharts 2.12.2
- **Notifications**: Sonner 1.4.3
- **PDF Generation**: jsPDF 3.0.3

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **Client Library**: @supabase/supabase-js 2.76.1

## Core Modules

### 1. Dashboard
- Business overview with graphs and statistics
- Quick access to key metrics
- Recent activities summary

### 2. Jobs Module (Complete Workflow)
The main workflow pipeline with 5 sequential steps:

#### a) Vehicle Inspection
- Capture vehicle details and condition
- Photo documentation
- Initial damage assessment

#### b) Estimate
- Parts pricing with multipliers
- Labour cost calculation
- GST computation
- Approval workflow for discounts >5%

#### c) Job Sheet
- **CRITICAL AUTOMATION ON FINALIZATION:**
  1. **Inventory Update**: Auto-deduct all parts from stock
  2. **Labour Cost Posting**: Auto-post labour costs to Labour Ledger
  3. **Vendor Cost Posting**: Auto-post vendor services to Vendor Ledger
  4. **Supplier Cost Posting**: Auto-post material costs to Supplier Ledger

#### d) Challan
- Delivery note generation
- Material dispatch tracking

#### e) Invoice
- Final bill generation
- **AUTO-UPDATES:**
  - Customer Ledger (debit entry)
  - GST Ledger (output tax)

### 3. Customer Management

#### Three Tabs:
1. **Customer Details**
   - Complete customer database
   - Credit limit management
   - Status tracking (Active/On Hold/Preferred)

2. **Customer Ledger** (Advanced Features)
   - Running balance calculation
   - Date range filtering
   - Search functionality
   - **Receipt Allocation System:**
     - Link payments to specific invoices
     - Auto-allocate oldest feature
     - Partial payment support
     - Advance payment tracking
   - **Aging Analysis:**
     - 0-30 days
     - 31-60 days
     - 61-90 days
     - 90+ days
   - Pie chart visualization
   - Export to CSV
   - Print functionality
   - Density toggle (Compact/Comfortable)

3. **Sales History**
   - All invoices by customer
   - Payment status tracking
   - Filter by status (Pending/Partial/Paid/Overdue)
   - Outstanding amount tracking

### 4. Vendors Module
Service providers (painting, denting, electrical, etc.)

#### Features:
- Vendor Details management
- Vendor Ledger with running balance
- Service cost tracking
- Payment history
- Auto-posting from Job Sheet

### 5. Labour Module
Workers and technicians management

#### Features:
- Labour Details (skill type, daily rate)
- Labour Ledger with hours tracking
- Cost posting from jobs
- Payment via vouchers
- Work history

### 6. Supplier Module
Parts and material suppliers

#### Features:
- Supplier Details management
- Supplier Ledger
- Purchase tracking
- Payment management
- Credit limit monitoring

### 7. Inventory Module

#### Three Components:
1. **Stock Tab**
   - Current stock levels
   - Reorder alerts
   - Cost price and selling price
   - Location tracking

2. **Category Manager**
   - Organize items by category
   - Category-wise reporting

3. **Stock Movements**
   - Track all stock in/out/adjustments
   - Reference to source documents (Purchase/Job/Adjustment)
   - Movement history
   - Audit trail

**AUTO-UPDATES:**
- Purchase Invoice → Stock IN
- Job Sheet Finalization → Stock OUT
- Manual adjustments

### 8. Accounts Module

#### Six Sub-modules:

1. **Purchase Invoice**
   - Record supplier purchases
   - **AUTO-UPDATES:**
     - Inventory (stock in)
     - Supplier Ledger (debit)
     - GST Ledger (input tax credit)

2. **Voucher**
   - Payment vouchers for labour/vendor/supplier
   - Multiple payment modes
   - **AUTO-UPDATES:**
     - Respective ledger (credit entry)

3. **Sell Invoice**
   - Sales billing
   - **AUTO-UPDATES:**
     - Customer Ledger (debit)
     - GST Ledger (output tax)

4. **Purchase Challan**
   - Purchase delivery notes
   - Receipt documentation

5. **Sell Challan**
   - Sales delivery notes
   - Dispatch tracking

6. **GST Ledger**
   - Complete tax tracking
   - Input tax credit (purchases)
   - Output tax (sales)
   - CGST, SGST, IGST breakdown
   - Reconciliation reports

### 9. Settings
- User Management
- Role-based access control
- System configuration
- Theme toggle (Light/Dark)

## Database Schema

### Core Tables

#### Customer System
- `customers` - Customer master data
- `customer_ledger_entries` - Transaction history
- `customer_aging_analysis` - View for aging report
- `invoices` - Sales invoices
- `receipts` - Payment receipts

#### Vendor System
- `vendors` - Vendor master data
- `vendor_ledger_entries` - Service cost tracking

#### Labour System
- `labour` - Labour master data
- `labour_ledger_entries` - Work and payment tracking

#### Supplier System
- `suppliers` - Supplier master data
- `supplier_ledger_entries` - Purchase tracking

#### Inventory System
- `inventory_categories` - Product categories
- `inventory_items` - Item master
- `stock_movements` - All stock transactions

#### Jobs System
- `customer_jobs` - Job tracking
- Linked to customers, invoices, and stock movements

#### Accounts System
- `vouchers` - Payment vouchers
- `gst_ledger` - Tax tracking

## Business Logic & Automation

### 1. Job Sheet Finalization (CRITICAL)
When a job sheet is finalized:
```
Job Sheet Finalized →
  ├── Inventory: Deduct all parts
  ├── Labour Ledger: Post labour costs (debit)
  ├── Vendor Ledger: Post vendor service costs (debit)
  └── Supplier Ledger: Post material costs (if any) (debit)
```

### 2. Purchase Invoice
When purchase invoice is created:
```
Purchase Invoice →
  ├── Inventory: Add stock (IN movement)
  ├── Supplier Ledger: Debit entry
  └── GST Ledger: Input tax credit
```

### 3. Sales Invoice
When sales invoice is created:
```
Sales Invoice →
  ├── Customer Ledger: Debit entry
  └── GST Ledger: Output tax
```

### 4. Voucher Payment
When payment voucher is created:
```
Voucher →
  └── Respective Ledger: Credit entry (reduce payable)
```

### 5. Cash Receipt
When customer payment is received:
```
Cash Receipt →
  ├── Customer Ledger: Credit entry
  └── Optional: Allocate to specific invoices
```

## Key Features

### 1. Automatic Ledger Management
- All ledgers update automatically based on transactions
- Running balance calculation
- No manual entries needed

### 2. Receipt Allocation System
- Link payments to specific invoices
- Auto-allocate to oldest invoices
- Track partial payments
- Handle advance payments

### 3. Aging Analysis
- Automatic categorization of outstanding amounts
- Visual representation with charts
- Credit limit enforcement
- On-hold customer flagging

### 4. Inventory Tracking
- Real-time stock levels
- Automatic stock movements
- Audit trail for all transactions
- Reorder level alerts

### 5. GST Compliance
- Automatic GST calculation
- Input tax credit tracking
- Output tax tracking
- Reconciliation support

### 6. Workflow Automation
- Job progression tracking
- Status-based actions
- Approval workflows
- Notification system

## Security Features

### Row Level Security (RLS)
- All tables protected with RLS
- User-based data access
- Branch-level segregation (future)

### Authentication
- Email/password authentication via Supabase
- JWT token-based sessions
- Secure password handling

## Responsive Design

- Mobile-first approach
- Tablet optimization
- Desktop full-feature experience
- Collapsible sidebar for space management

## Login Credentials

**Test Account:**
- Email: malwatrolley@gmail.com
- Password: Malwa822

## Project Structure

```
/malwa-crm
├── /public
├── /src
│   ├── /assets
│   ├── /components
│   │   ├── /common (Button, Input, Modal, Card)
│   │   ├── /ui (ConfirmModal, etc.)
│   │   └── Layout components (Sidebar, Navbar)
│   ├── /hooks (ThemeProvider)
│   ├── /pages
│   │   ├── Dashboard.jsx
│   │   ├── Jobs.jsx (with 5 steps)
│   │   ├── Customer.jsx (3 tabs)
│   │   ├── Vendors.jsx
│   │   ├── Labour.jsx
│   │   ├── Supplier.jsx
│   │   ├── Inventory.jsx (3 tabs)
│   │   ├── Accounts.jsx (6 modules)
│   │   ├── Settings.jsx
│   │   └── Login.jsx
│   ├── /store (Zustand state management)
│   │   ├── authStore.js
│   │   ├── customerStore.js
│   │   ├── jobsStore.js
│   │   ├── inventoryStore.js
│   │   └── ... (other stores)
│   ├── /lib
│   │   └── supabase.js (DB client)
│   ├── /utils
│   │   └── calculations.js
│   ├── App.jsx
│   └── main.jsx
├── /supabase/migrations (All database migrations)
├── .env (Environment variables)
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Database Triggers & Functions

### Automatic Triggers
1. `recalculate_customer_balance()` - Updates customer balance on ledger changes
2. `update_vendor_balance()` - Updates vendor balance
3. `update_labour_balance()` - Updates labour balance
4. `update_supplier_balance()` - Updates supplier balance
5. `update_inventory_stock()` - Updates stock on movements
6. `create_ledger_from_invoice()` - Auto-creates ledger entry from invoice
7. `create_ledger_from_receipt()` - Auto-creates ledger entry from receipt
8. `process_voucher_payment()` - Processes voucher payments to ledgers
9. `update_invoice_payment_status()` - Auto-updates invoice status
10. `check_customer_credit_limit()` - Enforces credit limits
11. `allocate_receipt_to_invoices()` - Handles receipt allocations

## Deployment

### Environment Variables Required
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Build Command
```bash
npm run build
```

### Dev Server
```bash
npm run dev
```

## Future Enhancements

1. Branch-level access control
2. Multi-user collaboration
3. Real-time notifications
4. SMS/Email integration
5. Advanced reporting and analytics
6. Mobile app version
7. Barcode/QR code scanning for inventory
8. Automated backup system
9. Integration with accounting software
10. Customer portal for job status tracking

## Business Benefits

1. **Streamlined Operations**: Complete workflow automation from lead to invoice
2. **Financial Accuracy**: Automatic ledger management eliminates manual errors
3. **Inventory Control**: Real-time stock tracking prevents shortages
4. **Better Cash Flow**: Aging analysis helps in timely collection
5. **Tax Compliance**: Automatic GST tracking simplifies filing
6. **Data-Driven Decisions**: Dashboard provides actionable insights
7. **Customer Satisfaction**: Faster service delivery with systematic approach
8. **Cost Control**: Track labour, vendor, and material costs accurately

## Support & Documentation

For technical support or feature requests, contact the development team.

---

**Version**: 1.0.0
**Last Updated**: October 22, 2025
**Developed for**: Malwa Trolley Works
