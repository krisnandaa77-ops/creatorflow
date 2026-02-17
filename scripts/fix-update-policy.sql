-- Fix Admin Update Permissions
-- Allows admins to update user roles and subscription tiers

-- 1. Drop existing update limitations
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;

-- 2. Restore User Self-Update
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING ( auth.uid() = id );

-- 3. Enable Admin Global Update
-- Uses the is_admin() security definer function to avoid recursion
CREATE POLICY "Admins can update any profile"
ON profiles FOR UPDATE
USING ( is_admin() )
WITH CHECK ( is_admin() );
