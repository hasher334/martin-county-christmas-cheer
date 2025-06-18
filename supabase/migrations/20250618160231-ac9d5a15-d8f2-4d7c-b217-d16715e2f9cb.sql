
-- Add the missing status values to the adoption_status enum
ALTER TYPE adoption_status ADD VALUE IF NOT EXISTS 'draft';
ALTER TYPE adoption_status ADD VALUE IF NOT EXISTS 'pending_review';

-- Add a column to store parent information in the children table
ALTER TABLE public.children ADD COLUMN IF NOT EXISTS parent_info JSONB;
