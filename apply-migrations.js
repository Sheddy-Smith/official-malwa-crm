import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

VITE_SUPABASE_URL=https://nxbxumuhuvhbenmddwef.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54Ynh1bXVodXZoYmVubWRkd2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMzI4MTgsImV4cCI6MjA3NjgwODgxOH0.oyG3w1-CmZ3EcLMN_TbBe9Zfia746VLfsb7DoKmZuDM

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
