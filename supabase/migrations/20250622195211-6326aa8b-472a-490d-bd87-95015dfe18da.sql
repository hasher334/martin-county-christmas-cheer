
-- Create storage bucket for child photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('child-photos', 'child-photos', true);

-- Create policy to allow public access to child photos
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'child-photos');

-- Create policy to allow authenticated users to upload child photos
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'child-photos');

-- Create policy to allow authenticated users to update child photos
CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'child-photos');

-- Create policy to allow authenticated users to delete child photos
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'child-photos');
