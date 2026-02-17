-- ============================================================
-- CreatorFlow Data Isolation Fix
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- STEP 1: Fix profiles table RLS (drop ALL recursive policies)
-- ============================================================
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'profiles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON profiles', pol.policyname);
    END LOOP;
END $$;

-- Create simple non-recursive policies for profiles
CREATE POLICY "read_own_profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Add missing columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company_name text;

-- ============================================================
-- STEP 2: Add user_id column to all data tables
-- ============================================================
ALTER TABLE contents ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE daily_todos ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE talents ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE content_talents ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- ============================================================
-- STEP 3: Enable RLS on all tables
-- ============================================================
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE talents ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_talents ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- STEP 4: Drop any existing open policies
-- ============================================================
DO $$ 
DECLARE
    pol RECORD;
    tbl TEXT;
BEGIN
    FOREACH tbl IN ARRAY ARRAY['contents', 'daily_todos', 'talents', 'content_talents']
    LOOP
        FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = tbl
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, tbl);
        END LOOP;
    END LOOP;
END $$;

-- ============================================================
-- STEP 5: Create strict isolation policies
-- ============================================================

-- CONTENTS
CREATE POLICY "contents_select" ON contents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "contents_insert" ON contents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "contents_update" ON contents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "contents_delete" ON contents FOR DELETE USING (auth.uid() = user_id);

-- DAILY_TODOS
CREATE POLICY "daily_todos_select" ON daily_todos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "daily_todos_insert" ON daily_todos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "daily_todos_update" ON daily_todos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "daily_todos_delete" ON daily_todos FOR DELETE USING (auth.uid() = user_id);

-- TALENTS
CREATE POLICY "talents_select" ON talents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "talents_insert" ON talents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "talents_update" ON talents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "talents_delete" ON talents FOR DELETE USING (auth.uid() = user_id);

-- CONTENT_TALENTS
CREATE POLICY "content_talents_select" ON content_talents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "content_talents_insert" ON content_talents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "content_talents_update" ON content_talents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "content_talents_delete" ON content_talents FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- STEP 6: Migrate existing rows to admin user
-- Replace YOUR_USER_ID with your actual auth.users id
-- You can find it by running:
--   SELECT id FROM auth.users LIMIT 5;
-- ============================================================

-- Assign all existing NULL user_id rows to the first user (admin)
DO $$
DECLARE
    admin_id uuid;
BEGIN
    SELECT id INTO admin_id FROM auth.users ORDER BY created_at ASC LIMIT 1;
    
    IF admin_id IS NOT NULL THEN
        UPDATE contents SET user_id = admin_id WHERE user_id IS NULL;
        UPDATE daily_todos SET user_id = admin_id WHERE user_id IS NULL;
        UPDATE talents SET user_id = admin_id WHERE user_id IS NULL;
        UPDATE content_talents SET user_id = admin_id WHERE user_id IS NULL;
        
        RAISE NOTICE 'Migrated NULL rows to user: %', admin_id;
    ELSE
        RAISE NOTICE 'No users found — skipping migration';
    END IF;
END $$;

-- ============================================================
-- STEP 7: Create avatars storage bucket (if not exists)
-- ============================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies (safe with IF NOT EXISTS via DO block)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view avatars' AND tablename = 'objects') THEN
    CREATE POLICY "Anyone can view avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Auth users upload avatars' AND tablename = 'objects') THEN
    CREATE POLICY "Auth users upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users update own avatar' AND tablename = 'objects') THEN
    CREATE POLICY "Users update own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users delete own avatar' AND tablename = 'objects') THEN
    CREATE POLICY "Users delete own avatar" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;

-- ============================================================
-- DONE! All tables now enforce user-level data isolation.
-- ============================================================
