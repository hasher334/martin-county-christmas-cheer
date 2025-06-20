
-- Update the adoptions table to include gift information and contact features
ALTER TABLE public.adoptions 
ADD COLUMN gift_description TEXT,
ADD COLUMN gift_amount DECIMAL(10,2),
ADD COLUMN contact_allowed BOOLEAN DEFAULT true,
ADD COLUMN last_contact_date TIMESTAMP WITH TIME ZONE;

-- Create a table for contact messages between donors and families
CREATE TABLE public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adoption_id UUID REFERENCES public.adoptions(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('donor', 'family')),
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on contact_messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Policy for donors to see messages related to their adoptions
CREATE POLICY "Donors can view their adoption messages" ON public.contact_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.adoptions a
            JOIN public.donors d ON a.donor_id = d.id
            WHERE a.id = contact_messages.adoption_id 
            AND d.user_id = auth.uid()
        )
    );

-- Policy for donors to send messages for their adoptions
CREATE POLICY "Donors can send messages for their adoptions" ON public.contact_messages
    FOR INSERT WITH CHECK (
        sender_type = 'donor' AND
        EXISTS (
            SELECT 1 FROM public.adoptions a
            JOIN public.donors d ON a.donor_id = d.id
            WHERE a.id = contact_messages.adoption_id 
            AND d.user_id = auth.uid()
        )
    );

-- Update RLS policies for adoptions table to allow proper access
DROP POLICY IF EXISTS "Users can view adoptions they're involved in" ON public.adoptions;
DROP POLICY IF EXISTS "Users can create adoptions" ON public.adoptions;

CREATE POLICY "Donors can view their adoptions" ON public.adoptions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.donors 
            WHERE donors.id = adoptions.donor_id 
            AND donors.user_id = auth.uid()
        )
    );

CREATE POLICY "Donors can create adoptions" ON public.adoptions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.donors 
            WHERE donors.id = adoptions.donor_id 
            AND donors.user_id = auth.uid()
        )
    );

CREATE POLICY "Donors can update their adoptions" ON public.adoptions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.donors 
            WHERE donors.id = adoptions.donor_id 
            AND donors.user_id = auth.uid()
        )
    );
