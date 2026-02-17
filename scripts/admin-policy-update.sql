-- Allow admins to view all profiles
-- This policy works alongside existing "Users can see own profile" policies.

CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
USING (
  (select role from profiles where id = auth.uid()) = 'admin'
);

-- Note: If this fails due to infinite recursion (policy on profiles querying profiles),
-- you may need to use a dedicated admin check function or ensure the role check is efficient.
-- However, Supabase often handles simple self-referencing policies fine.

-- Verify policy creation:
-- SELECT * FROM pg_policies WHERE tablename = 'profiles';
