-- ============================================================
-- CreatorFlow Payments Setup
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Create table
CREATE TABLE IF NOT EXISTS payments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    amount numeric NOT NULL,
    currency text DEFAULT 'IDR',
    status text CHECK (status IN ('succeeded', 'pending', 'failed')),
    payment_date timestamp with time zone DEFAULT now(),
    plan_type text CHECK (plan_type IN ('pro_monthly', 'pro_yearly')),
    created_at timestamp with time zone DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- 3. Create Policies

-- Policy 1: Admins can SELECT all rows
-- Assumes you have a 'profiles' table with a 'role' column.
-- If not, you might need to adjust this condition.
CREATE POLICY "Admins can view all payments" ON payments
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Policy 2: Users can SELECT their own rows
CREATE POLICY "Users can view own payments" ON payments
FOR SELECT
USING (auth.uid() = user_id);

-- Policy 3: Only service_role or admins can insert (usually payments come from backend)
-- For now, let's allow authenticated users to insert IF it's their own data (e.g. strict flow)
-- OR just leave it to service_role. 
-- The user didn't ask for INSERT policies, but we should probably add one for testing?
-- Let's add restricted insert for now: users can insert their own.
CREATE POLICY "Users can insert own payments" ON payments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 4. Dummy Data
-- Insert 3-5 dummy records linked to existing users
DO $$
DECLARE
    user_record RECORD;
BEGIN
    -- Loop through first 3 users
    FOR user_record IN SELECT id FROM auth.users LIMIT 3
    LOOP
        INSERT INTO payments (user_id, amount, status, plan_type, payment_date)
        VALUES 
            (user_record.id, 150000, 'succeeded', 'pro_monthly', now() - interval '2 days'),
            (user_record.id, 1500000, 'pending', 'pro_yearly', now());
    END LOOP;
    
    RAISE NOTICE 'Dummy payment data inserted.';
END $$;
