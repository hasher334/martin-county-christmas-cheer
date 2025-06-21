
-- First, let's add better constraints and indexes to prevent future issues
ALTER TABLE donors ADD CONSTRAINT unique_user_id UNIQUE (user_id);

-- Add an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_donors_email ON donors (email);

-- Clean up duplicate donors by keeping the most recent one for each email
WITH ranked_donors AS (
  SELECT id, email, user_id, created_at,
         ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at DESC) as rn
  FROM donors
),
donors_to_delete AS (
  SELECT id FROM ranked_donors WHERE rn > 1
)
DELETE FROM donors WHERE id IN (SELECT id FROM donors_to_delete);

-- Update any orphaned adoptions to point to the correct donor
WITH correct_donors AS (
  SELECT DISTINCT d.id as donor_id, d.email
  FROM donors d
),
adoption_fixes AS (
  SELECT a.id as adoption_id, cd.donor_id as correct_donor_id
  FROM adoptions a
  JOIN donors d_old ON a.donor_id = d_old.id
  JOIN correct_donors cd ON d_old.email = cd.email
  WHERE a.donor_id != cd.donor_id
)
UPDATE adoptions 
SET donor_id = af.correct_donor_id
FROM adoption_fixes af
WHERE adoptions.id = af.adoption_id;

-- Add a function to handle user signup and donor creation
CREATE OR REPLACE FUNCTION handle_new_user_donor()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create or update donor profile when user signs up
  INSERT INTO public.donors (user_id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email
  )
  ON CONFLICT (user_id) DO UPDATE SET
    name = COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', donors.name),
    email = NEW.email;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically handle donor creation
DROP TRIGGER IF EXISTS on_auth_user_created_donor ON auth.users;
CREATE TRIGGER on_auth_user_created_donor
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_donor();

-- Enable RLS on donors table (safe if already enabled)
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first, then recreate them
DROP POLICY IF EXISTS "Users can view their own donor profile" ON donors;
DROP POLICY IF EXISTS "Users can update their own donor profile" ON donors;
DROP POLICY IF EXISTS "System can insert donor profiles" ON donors;

-- Create RLS policies for donors table
CREATE POLICY "Users can view their own donor profile" ON donors
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own donor profile" ON donors
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert donor profiles" ON donors
  FOR INSERT WITH CHECK (true);
