
-- Create enum for adoption status
CREATE TYPE adoption_status AS ENUM ('available', 'adopted', 'fulfilled');

-- Create children table
CREATE TABLE public.children (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    story TEXT,
    wishes TEXT[],
    photo_url TEXT,
    location TEXT,
    status adoption_status DEFAULT 'available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create donors table
CREATE TABLE public.donors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create adoptions table
CREATE TABLE public.adoptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES public.children(id) ON DELETE CASCADE,
    donor_id UUID REFERENCES public.donors(id) ON DELETE CASCADE,
    adopted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    gift_delivered BOOLEAN DEFAULT FALSE,
    notes TEXT,
    UNIQUE(child_id, donor_id)
);

-- Enable RLS
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adoptions ENABLE ROW LEVEL SECURITY;

-- Children policies - readable by everyone, only admins can modify
CREATE POLICY "Children are viewable by everyone" ON public.children
    FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can insert children" ON public.children
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Only authenticated users can update children" ON public.children
    FOR UPDATE TO authenticated USING (true);

-- Donors policies - users can only see/edit their own donor profile
CREATE POLICY "Users can view their own donor profile" ON public.donors
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own donor profile" ON public.donors
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own donor profile" ON public.donors
    FOR UPDATE USING (auth.uid() = user_id);

-- Adoptions policies - users can see adoptions they're involved in
CREATE POLICY "Users can view adoptions they're involved in" ON public.adoptions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.donors 
            WHERE donors.id = adoptions.donor_id 
            AND donors.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create adoptions" ON public.adoptions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.donors 
            WHERE donors.id = adoptions.donor_id 
            AND donors.user_id = auth.uid()
        )
    );

-- Add some sample children data
INSERT INTO public.children (name, age, gender, story, wishes, location) VALUES
('Emma', 8, 'Female', 'Emma loves drawing and dreams of becoming an artist. She lives with her grandmother who works two jobs to make ends meet.', ARRAY['Art supplies', 'Drawing tablet', 'Books'], 'Martin County, FL'),
('Lucas', 6, 'Male', 'Lucas is fascinated by dinosaurs and loves building things with blocks. His favorite activity is reading dinosaur books.', ARRAY['Dinosaur toys', 'Building blocks', 'Science books'], 'Martin County, FL'),
('Sofia', 10, 'Female', 'Sofia is a bright student who loves math and science. She dreams of becoming a doctor to help people in her community.', ARRAY['Science kit', 'Books', 'School supplies'], 'Martin County, FL'),
('Noah', 7, 'Male', 'Noah loves sports, especially soccer. He practices every day in his backyard and dreams of playing professionally.', ARRAY['Soccer ball', 'Sports equipment', 'Team jersey'], 'Martin County, FL');
