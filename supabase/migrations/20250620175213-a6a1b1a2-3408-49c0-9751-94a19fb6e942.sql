
-- Create the child-photos storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('child-photos', 'child-photos', true);

-- Create policy to allow authenticated users to upload photos
CREATE POLICY "Allow authenticated users to upload child photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'child-photos');

-- Create policy to allow public read access to child photos
CREATE POLICY "Allow public read access to child photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'child-photos');

-- Create policy to allow authenticated users to update their uploaded photos
CREATE POLICY "Allow authenticated users to update child photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'child-photos');

-- Create policy to allow authenticated users to delete their uploaded photos
CREATE POLICY "Allow authenticated users to delete child photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'child-photos');
