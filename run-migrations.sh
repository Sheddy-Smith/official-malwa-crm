#!/bin/bash
set -e

echo "Applying database migrations..."

# Read environment
SUPABASE_URL="https://anywqwnkwmlvdctnmhgp.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFueXdxd25rd21sdmRjdG5taGdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMzIyOTcsImV4cCI6MjA3NjcwODI5N30.fBKdysuSQZ245hdRC9HIrk6keq_JC4ROhN5rW3CGnBU"

echo "This script requires manual application via Supabase Dashboard or CLI"
echo "Migration files are located in: ./supabase/migrations/"
echo ""
echo "To apply migrations manually:"
echo "1. Go to https://supabase.com/dashboard/project/anywqwnkwmlvdctnmhgp/editor"
echo "2. Copy and paste the SQL from each migration file"
echo "3. Run each migration in order"
echo ""
ls -1 ./supabase/migrations/*.sql | sort
