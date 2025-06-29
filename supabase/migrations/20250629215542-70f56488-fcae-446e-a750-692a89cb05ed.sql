
-- Drop existing conflicting policies that might interfere
DROP POLICY IF EXISTS "Admins can manage all children" ON children;
DROP POLICY IF EXISTS "Only authenticated users can insert children" ON children;
DROP POLICY IF EXISTS "Only authenticated users can update children" ON children;

-- Keep the existing public read policy (children are viewable by everyone)
-- This policy should already exist: "Children are viewable by everyone"

-- Create comprehensive admin policies for child management
-- Policy for INSERT - only admins can create new children
CREATE POLICY "Admins can insert children" ON children
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Policy for UPDATE - only admins can update children
CREATE POLICY "Admins can update children" ON children
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Policy for DELETE - only admins can delete children
CREATE POLICY "Admins can delete children" ON children
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Ensure the authenticated user has admin role in user_roles table
-- Insert admin role for the current authenticated user if it doesn't exist
-- Replace 'dd6398b8-938f-4c6c-9785-44a80c5fc359' with the actual admin user ID
INSERT INTO user_roles (user_id, role)
VALUES ('dd6398b8-938f-4c6c-9785-44a80c5fc359', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
