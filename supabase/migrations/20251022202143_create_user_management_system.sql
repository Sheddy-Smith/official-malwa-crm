/*
  # Create User Management System

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text) - Full name
      - `email` (text) - Email address
      - `role` (text) - User role (Director, Manager, Accountant)
      - `branch_id` (uuid) - Assigned branch
      - `permissions` (jsonb) - Module-level permissions
      - `status` (text) - Active/Inactive
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `branches`
      - `id` (uuid, primary key)
      - `name` (text) - Branch name
      - `address` (text) - Branch address
      - `manager_name` (text) - Manager name
      - `phone` (text) - Contact phone
      - `email` (text) - Contact email
      - `is_active` (boolean) - Active status
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Profiles: Users can view their own profile, Directors can view/manage all
    - Branches: All authenticated users can view active branches, only Directors can manage

  3. Important Notes
    - Permissions stored as JSONB for flexibility: {"jobs": "full", "accounts": "view", "inventory": "none"}
    - Role values: "Director", "Manager", "Accountant"
    - Status values: "Active", "Inactive"
*/

-- Create branches table first (no dependencies)
CREATE TABLE IF NOT EXISTS branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text DEFAULT '',
  manager_name text DEFAULT '',
  phone text DEFAULT '',
  email text DEFAULT '',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'Accountant',
  branch_id uuid REFERENCES branches(id) ON DELETE SET NULL,
  permissions jsonb DEFAULT '{"dashboard": "full", "jobs": "full", "customer": "full", "vendors": "full", "labour": "full", "supplier": "full", "inventory": "full", "accounts": "full", "summary": "view", "settings": "none"}'::jsonb,
  status text DEFAULT 'Active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Branches Policies
CREATE POLICY "Authenticated users can view active branches"
  ON branches
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Directors can insert branches"
  ON branches
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'Director'
    )
  );

CREATE POLICY "Directors can update branches"
  ON branches
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'Director'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'Director'
    )
  );

CREATE POLICY "Directors can delete branches"
  ON branches
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'Director'
    )
  );

-- Profiles Policies
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Directors can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles AS p
      WHERE p.id = auth.uid()
      AND p.role = 'Director'
    )
  );

CREATE POLICY "Directors can insert profiles"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'Director'
    )
  );

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Directors can update any profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles AS p
      WHERE p.id = auth.uid()
      AND p.role = 'Director'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles AS p
      WHERE p.id = auth.uid()
      AND p.role = 'Director'
    )
  );

CREATE POLICY "Directors can delete profiles"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'Director'
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_branches_is_active ON branches(is_active);
CREATE INDEX IF NOT EXISTS idx_branches_created_at ON branches(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_branch_id ON profiles(branch_id);

-- Function to handle user creation (trigger on auth.users)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'Accountant')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();