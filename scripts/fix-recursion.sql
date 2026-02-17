-- Fix RLS Infinite Recursion Bug

-- 1. Create "God Mode" function to check admin status safely
-- "SECURITY DEFINER" allows this to run without triggering the table's RLS policies recursively
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the user has the 'admin' role in the profiles table
  RETURN EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Clean up the broken/conflicting policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;

-- 3. Re-apply the Basic User Policy (The Mirror)
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING ( auth.uid() = id );

-- 4. Re-apply the Admin Policy using the Safe Function
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
USING ( is_admin() );

-- 5. Grant execute permission
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin TO service_role;
GRANT EXECUTE ON FUNCTION public.is_admin TO anon; -- Just in case, though usually authenticated is enough
