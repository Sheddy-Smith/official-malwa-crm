# Malwa CRM - Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Configuration
Your Supabase database is already configured with the following credentials in `.env`:
- `VITE_SUPABASE_URL`: https://anywqwnkwmlvdctnmhgp.supabase.co
- `VITE_SUPABASE_ANON_KEY`: [Already configured]

**IMPORTANT**: Never commit the `.env` file to version control (it's already in `.gitignore`).

### 2. Database Status
All migrations have been applied:
- Customer ledger system
- Complete ERP tables (inventory, jobs, vendors, suppliers, labour)
- Purchase and sell challans
- User management system
- Row Level Security (RLS) enabled on all tables

### 3. Authentication
The application uses a local authentication system with two Director accounts:
- `malwatrolley@gmail.com` / `Malwa822`
- `SheddySmith822@gmail.com` / `S#d_8224`

**NOTE**: For production, consider migrating to Supabase Auth for better security.

### 4. Build Verification
Production build completed successfully:
- All dependencies resolved
- No critical errors
- Assets optimized and compressed

## Deployment Options

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variables in Vercel Dashboard:
   - Go to Project Settings → Environment Variables
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Option 2: Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build and deploy:
```bash
npm run build
netlify deploy --prod --dir=dist
```

3. Add environment variables in Netlify Dashboard:
   - Go to Site Settings → Environment Variables
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Option 3: Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Upload the `dist` folder to your hosting provider

3. Configure environment variables on your hosting platform

## Post-Deployment Steps

### 1. Verify Database Connection
- Login to the application
- Check if data loads correctly on Dashboard
- Test creating a new customer or job

### 2. Test Core Features
- Customer management (create, view, edit)
- Jobs workflow (inspection → estimate → job sheet → invoice)
- Inventory management
- Ledger entries

### 3. Mobile Responsiveness
- Test on mobile devices
- Verify blue header displays correctly
- Check bottom navigation bar functionality
- Test floating action button

### 4. Security Checks
- Verify RLS policies are active (users can only access their own data)
- Test that unauthenticated users are redirected to login
- Verify Settings page requires password re-entry for Directors

## Environment Variables Reference

```bash
# Production Environment Variables
VITE_SUPABASE_URL=https://anywqwnkwmlvdctnmhgp.supabase.co
VITE_SUPABASE_ANON_KEY=[Your Supabase Anon Key]
```

## Important Notes

1. **Data is Real-Time**: All dashboard metrics now pull from Supabase database
2. **No Demo Data**: All placeholder/demo data has been removed
3. **Mobile Optimized**: Responsive design matches the reference image
4. **Production Ready**: Build tested and verified

## Troubleshooting

### Issue: Dashboard shows zero values
**Solution**: Add data through the application (customers, jobs, invoices)

### Issue: Login fails
**Solution**: Verify credentials match the hardcoded Director accounts

### Issue: Database connection error
**Solution**: Check environment variables are set correctly in deployment platform

### Issue: Mobile navigation not showing
**Solution**: Clear browser cache and test on actual mobile device

## Support

For issues or questions:
1. Check Supabase dashboard for database connectivity
2. Verify environment variables are correctly set
3. Check browser console for any errors
4. Review migration files in `supabase/migrations/`

---

**Deployment Date**: 2025-10-22
**Version**: 1.0.0
**Status**: Production Ready
