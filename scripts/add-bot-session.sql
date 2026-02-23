-- Add bot_session column to store Telegram conversation state
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bot_session jsonb DEFAULT NULL;

-- Allow users to update their own bot_session (covered by existing policy, but good to double check)
-- Existing policy: "Users can update own profile" (auth.uid() = id)
-- Since the bot uses service_role key to update, RLS is bypassed for the bot, which is what we want.
