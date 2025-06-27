
-- Create admin-specific views and functions for better data management
CREATE OR REPLACE VIEW admin_children_view AS
SELECT 
  c.*,
  CASE 
    WHEN c.status = 'available' THEN 'Available'
    WHEN c.status = 'adopted' THEN 'Adopted'
    WHEN c.status = 'fulfilled' THEN 'Fulfilled'
    WHEN c.status = 'draft' THEN 'Draft'
    WHEN c.status = 'pending_review' THEN 'Pending Review'
    ELSE 'Unknown'
  END as status_display,
  COUNT(a.id) as application_count
FROM children c
LEFT JOIN applications a ON c.id = a.child_id
GROUP BY c.id;

-- Create function to get admin statistics
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS TABLE(
  total_children bigint,
  available_children bigint,
  adopted_children bigint,
  pending_applications bigint,
  total_donors bigint
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    (SELECT COUNT(*) FROM children) as total_children,
    (SELECT COUNT(*) FROM children WHERE status = 'available') as available_children,
    (SELECT COUNT(*) FROM children WHERE status = 'adopted') as adopted_children,
    (SELECT COUNT(*) FROM applications WHERE status = 'pending') as pending_applications,
    (SELECT COUNT(*) FROM donors) as total_donors;
$$;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Admins can manage all children" ON children;
DROP POLICY IF EXISTS "Admins can manage all applications" ON applications;
DROP POLICY IF EXISTS "Admins can view all donors" ON donors;

-- Create admin policies
CREATE POLICY "Admins can manage all children" ON children
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "Admins can manage all applications" ON applications
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "Admins can view all donors" ON donors
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Enable RLS on tables if not already enabled
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
