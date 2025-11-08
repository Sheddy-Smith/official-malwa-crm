# How to Fix Login Issue - Complete Guide

## The Problem

The login is failing because your browser has cached the old database with the previous admin credentials. The new Super Admin account needs a fresh database.

---

## Quick Fix (Easiest Method)

### Use the Reset Button on Login Page

1. **Go to the login page**
2. **Scroll to the bottom of the login form**
3. **Click "Reset Database (Clear All Data)"** button
4. **Confirm the action**
5. **Wait for the page to refresh automatically**
6. **Login with the new credentials**

**Credentials:**
- User ID: `Shahidmultaniii`
- Password: `S#d_8224`

---

## Alternative Methods

### Method 1: Browser Developer Tools

1. Press **F12** to open Developer Tools
2. Go to **Application** tab (Chrome/Edge) or **Storage** tab (Firefox)
3. In the left sidebar:
   - Find **IndexedDB** > Right-click **malwa_erp_db** > Delete
   - Find **Local Storage** > Right-click your site > Clear
4. **Refresh the page** (F5)

### Method 2: Browser Console Command

1. Press **F12** and go to **Console** tab
2. Type: `window.clearDB()` and press Enter
3. Wait for "All data cleared" message
4. **Refresh the page** (F5)

### Method 3: Clear Browser Data

1. Open browser **Settings**
2. Find **"Clear browsing data"**
3. Select:
   - ✓ Cookies and other site data
   - ✓ Cached images and files
4. Time range: **All time**
5. Click **Clear data**
6. Go back to the application

---

## After Clearing Database

When you refresh, the console will show:
- ✓ "IndexedDB initialized successfully"
- ✓ "Super Admin initialization complete"

This means the Super Admin account was created successfully.

---

## Debug Tools

Open browser console (F12 > Console) and use these commands:

- `window.debugDB()` - Shows all users in database
- `window.clearDB()` - Clears all data

---

## Login Credentials

**User ID:** Shahidmultaniii
**Password:** S#d_8224
**Role:** Super Admin (Full Access)

**Important:**
- User ID is case-sensitive
- Password contains special characters: `S#d_8224`
- Type exactly as shown

---

## What the Logs Should Show

When you attempt to login, the console should show:

```
Login attempt for: Shahidmultaniii
Users found: 1
Login successful for: Super Admin
```

If you see:
- "Users found: 0" → Database needs to be cleared
- "Password mismatch" → Check password carefully
- "User not found" → Use the Reset Database button

---

## Permissions

The Super Admin account has full access to:

✓ Dashboard
✓ Jobs (Create, Edit, Delete)
✓ Customers
✓ Vendors
✓ Labour
✓ Suppliers
✓ Inventory
✓ Accounts
✓ Summary
✓ **Settings** (User Management & Branches)

---

## Still Having Issues?

1. **Clear browser cache completely** (Ctrl+Shift+Delete)
2. **Try in incognito/private mode**
3. **Try a different browser**
4. **Check console for error messages** (F12 > Console)

---

## Technical Details

- All data stored in **IndexedDB** (browser local storage)
- Passwords hashed with **SHA-256**
- Sessions expire after **7 days**
- **No internet connection required** - fully offline
- Data persists until manually cleared
