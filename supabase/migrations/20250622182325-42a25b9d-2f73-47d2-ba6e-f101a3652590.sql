
-- First, let's create an enum for application status
CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected', 'draft');

-- Create an enum for payment status
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Create an enum for notification types
CREATE TYPE notification_type AS ENUM ('application_status', 'donation_receipt', 'adoption_confirmation', 'admin_alert');

-- Update the existing adoption_status enum to include more states
ALTER TYPE adoption_status ADD VALUE IF NOT EXISTS 'pending_review';
ALTER TYPE adoption_status ADD VALUE IF NOT EXISTS 'draft';

-- Create applications table for tracking adoption applications
CREATE TABLE public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES public.children(id) ON DELETE CASCADE,
    donor_id UUID REFERENCES public.donors(id) ON DELETE CASCADE,
    status application_status DEFAULT 'pending',
    application_data JSONB,
    admin_notes TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create donations table for tracking payments
CREATE TABLE public.donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_id UUID REFERENCES public.donors(id) ON DELETE CASCADE,
    stripe_payment_intent_id TEXT UNIQUE,
    stripe_session_id TEXT,
    amount INTEGER NOT NULL, -- Amount in cents
    currency TEXT DEFAULT 'usd',
    status payment_status DEFAULT 'pending',
    is_recurring BOOLEAN DEFAULT FALSE,
    subscription_id TEXT,
    refund_amount INTEGER DEFAULT 0,
    refunded_at TIMESTAMP WITH TIME ZONE,
    refunded_by UUID REFERENCES auth.users(id),
    donation_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table for tracking email notifications
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit_logs table for tracking admin actions
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID REFERENCES auth.users(id) NOT NULL,
    action_type TEXT NOT NULL,
    target_table TEXT,
    target_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to existing tables
ALTER TABLE public.children ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE public.children ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id);
ALTER TABLE public.children ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

-- Update donors table to include more profile information
ALTER TABLE public.donors ADD COLUMN IF NOT EXISTS profile_status TEXT DEFAULT 'active';
ALTER TABLE public.donors ADD COLUMN IF NOT EXISTS application_data JSONB;
ALTER TABLE public.donors ADD COLUMN IF NOT EXISTS notes TEXT;

-- Enable RLS on new tables
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for applications
CREATE POLICY "Users can view their own applications" ON public.applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.donors 
            WHERE donors.id = applications.donor_id 
            AND donors.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create applications" ON public.applications
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.donors 
            WHERE donors.id = applications.donor_id 
            AND donors.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all applications" ON public.applications
    FOR ALL USING (public.is_admin(auth.uid()));

-- Create RLS policies for donations
CREATE POLICY "Users can view their own donations" ON public.donations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.donors 
            WHERE donors.id = donations.donor_id 
            AND donors.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all donations" ON public.donations
    FOR ALL USING (public.is_admin(auth.uid()));

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON public.notifications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage all notifications" ON public.notifications
    FOR ALL USING (public.is_admin(auth.uid()));

-- Create RLS policies for audit_logs
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
    FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "System can insert audit logs" ON public.audit_logs
    FOR INSERT WITH CHECK (true);

-- Create admin role for arodseo@gmail.com
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::app_role
FROM auth.users u
WHERE u.email = 'arodseo@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER applications_updated_at
    BEFORE UPDATE ON public.applications
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER donations_updated_at
    BEFORE UPDATE ON public.donations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create audit trigger function
CREATE OR REPLACE FUNCTION public.audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO public.audit_logs (
            admin_user_id,
            action_type,
            target_table,
            target_id,
            old_values
        ) VALUES (
            auth.uid(),
            TG_OP,
            TG_TABLE_NAME,
            OLD.id,
            to_jsonb(OLD)
        );
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public.audit_logs (
            admin_user_id,
            action_type,
            target_table,
            target_id,
            old_values,
            new_values
        ) VALUES (
            auth.uid(),
            TG_OP,
            TG_TABLE_NAME,
            NEW.id,
            to_jsonb(OLD),
            to_jsonb(NEW)
        );
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO public.audit_logs (
            admin_user_id,
            action_type,
            target_table,
            target_id,
            new_values
        ) VALUES (
            auth.uid(),
            TG_OP,
            TG_TABLE_NAME,
            NEW.id,
            to_jsonb(NEW)
        );
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit triggers for important tables
CREATE TRIGGER audit_children
    AFTER INSERT OR UPDATE OR DELETE ON public.children
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

CREATE TRIGGER audit_applications
    AFTER INSERT OR UPDATE OR DELETE ON public.applications
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

CREATE TRIGGER audit_donations
    AFTER INSERT OR UPDATE OR DELETE ON public.donations
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

-- Create helpful views for the admin dashboard
CREATE OR REPLACE VIEW public.dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM public.children WHERE status = 'available') as available_children,
    (SELECT COUNT(*) FROM public.children WHERE status = 'adopted') as adopted_children,
    (SELECT COUNT(*) FROM public.applications WHERE status = 'pending') as pending_applications,
    (SELECT COUNT(*) FROM public.donors WHERE created_at > NOW() - INTERVAL '30 days') as new_donors_this_month,
    (SELECT COALESCE(SUM(amount), 0) FROM public.donations WHERE status = 'completed' AND created_at > NOW() - INTERVAL '30 days') as donations_this_month,
    (SELECT COUNT(*) FROM public.adoptions WHERE adopted_at > NOW() - INTERVAL '7 days') as recent_adoptions;

-- Create function to get admin dashboard data
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_data()
RETURNS TABLE (
    stat_name TEXT,
    stat_value BIGINT,
    stat_description TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 'available_children'::TEXT, 
           COUNT(*)::BIGINT, 
           'Children available for adoption'::TEXT
    FROM public.children WHERE status = 'available'
    UNION ALL
    SELECT 'pending_applications'::TEXT, 
           COUNT(*)::BIGINT, 
           'Applications awaiting review'::TEXT
    FROM public.applications WHERE status = 'pending'
    UNION ALL
    SELECT 'new_donors_week'::TEXT, 
           COUNT(*)::BIGINT, 
           'New donors this week'::TEXT
    FROM public.donors WHERE created_at > NOW() - INTERVAL '7 days'
    UNION ALL
    SELECT 'total_donations_month'::TEXT, 
           COALESCE(SUM(amount), 0)::BIGINT, 
           'Total donations this month (in cents)'::TEXT
    FROM public.donations WHERE status = 'completed' AND created_at > NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
