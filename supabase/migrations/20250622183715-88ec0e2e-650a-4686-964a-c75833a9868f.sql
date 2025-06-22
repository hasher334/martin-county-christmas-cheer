
-- Drop the existing dashboard_stats view first
DROP VIEW IF EXISTS public.dashboard_stats;

-- Create a proper dashboard_stats view using the existing get_admin_dashboard_data function
CREATE OR REPLACE VIEW public.dashboard_stats WITH (security_invoker = on) AS
SELECT 
  -- Get stats from the existing function and pivot them into columns
  COALESCE((SELECT stat_value FROM public.get_admin_dashboard_data() WHERE stat_name = 'available_children'), 0) as available_children,
  COALESCE((SELECT stat_value FROM public.get_admin_dashboard_data() WHERE stat_name = 'pending_applications'), 0) as pending_applications,
  COALESCE((SELECT stat_value FROM public.get_admin_dashboard_data() WHERE stat_name = 'new_donors_week'), 0) as new_donors_this_month,
  COALESCE((SELECT stat_value FROM public.get_admin_dashboard_data() WHERE stat_name = 'total_donations_month'), 0) as donations_this_month,
  -- Calculate adopted children
  (SELECT COUNT(*) FROM public.children WHERE status = 'adopted') as adopted_children,
  -- Calculate recent adoptions (last 7 days)
  (SELECT COUNT(*) FROM public.adoptions WHERE adopted_at > NOW() - INTERVAL '7 days') as recent_adoptions;
