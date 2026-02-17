-- Add last_seen column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS last_seen timestamptz DEFAULT now();

-- Optional: Create an index for performance if querying by last_seen often
CREATE INDEX IF NOT EXISTS idx_profiles_last_seen ON profiles(last_seen);
