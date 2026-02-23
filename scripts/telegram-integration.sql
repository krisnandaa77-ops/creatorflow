-- Add Telegram integration columns
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS telegram_id bigint UNIQUE,
ADD COLUMN IF NOT EXISTS linking_token text;

-- Ensure RLS allows users to update their own linking_token
-- (Assuming existing policy handles "update own profile")
