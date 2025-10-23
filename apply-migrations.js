import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const supabaseUrl = 'https://anywqwnkwmlvdctnmhgp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFueXdxd25rd21sdmRjdG5taGdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMzIyOTcsImV4cCI6MjA3NjcwODI5N30.fBKdysuSQZ245hdRC9HIrk6keq_JC4ROhN5rW3CGnBU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function applyMigrations() {
  const migrationsDir = './supabase/migrations';
  const files = readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

  console.log(`Found ${files.length} migration files`);

  for (const file of files) {
    console.log(`\nApplying: ${file}`);
    const filePath = join(migrationsDir, file);
    const sql = readFileSync(filePath, 'utf8');

    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
      if (error) throw error;
      console.log(`✓ ${file} applied successfully`);
    } catch (error) {
      console.error(`✗ Error applying ${file}:`, error.message);
    }
  }
}

applyMigrations().catch(console.error);
