
-- First, let's modify the profiles table to allow nullable user_id for demo purposes
ALTER TABLE public.profiles ALTER COLUMN user_id DROP NOT NULL;

-- Now insert the demo profiles without user_id (they will be NULL)
INSERT INTO public.profiles (first_name, last_name, email, phone, address, bio) VALUES
('Sarah', 'Johnson', 'sarah.johnson@email.com', '(772) 555-0101', '123 Ocean Drive, Stuart, FL 34994', 'Local teacher and volunteer who loves helping families during the holidays.'),
('Michael', 'Rodriguez', 'michael.rodriguez@email.com', '(772) 555-0102', '456 Pine Street, Port St. Lucie, FL 34952', 'Small business owner committed to giving back to the Treasure Coast community.'),
('Emily', 'Chen', 'emily.chen@email.com', '(772) 555-0103', '789 Maple Avenue, Vero Beach, FL 32960', 'Retired nurse who enjoys participating in local charity events and community outreach.'),
('David', 'Thompson', 'david.thompson@email.com', '(772) 555-0104', '321 Palm Boulevard, Jensen Beach, FL 34957', 'Marketing professional and father of two who believes in the spirit of giving.'),
('Lisa', 'Martinez', 'lisa.martinez@email.com', '(772) 555-0105', '654 Coral Way, Fort Pierce, FL 34950', 'Healthcare administrator and community volunteer passionate about helping children in need.');

-- Also create some demo children
INSERT INTO public.children (name, age, gender, location, story, wishes, photo_url) VALUES
('Emma', 8, 'Female', 'Stuart, FL', 'Emma loves to read and dream of adventures. She hopes Santa will bring her some new books this Christmas.', ARRAY['Children''s books', 'Art supplies', 'Stuffed animal'], '/lovable-uploads/0014c541-d3af-4b1b-aa10-28d9cb931211.png'),
('Marcus', 10, 'Male', 'Port St. Lucie, FL', 'Marcus is passionate about science and loves conducting experiments. He dreams of becoming an astronaut one day.', ARRAY['Science kit', 'Telescope', 'Space books'], '/lovable-uploads/5a57abc7-69b1-48e1-86bc-34547e214e3f.png'),
('Sofia', 6, 'Female', 'Vero Beach, FL', 'Sofia loves dancing and music. She practices ballet every day and hopes to perform on stage someday.', ARRAY['Ballet shoes', 'Tutu', 'Music box'], '/lovable-uploads/92766bf4-249f-46f3-aae7-6002084cf56c.png'),
('Jayden', 12, 'Male', 'Jensen Beach, FL', 'Jayden enjoys sports, especially basketball. He practices shooting hoops every afternoon after school.', ARRAY['Basketball', 'Sports shoes', 'Team jersey'], '/lovable-uploads/9b7c78e5-e2e5-4e1d-9ff0-05333593d9f4.png'),
('Isabella', 9, 'Female', 'Fort Pierce, FL', 'Isabella loves animals and wants to be a veterinarian. She takes care of her pet hamster and helps at the local animal shelter.', ARRAY['Veterinarian kit', 'Pet care books', 'Stuffed animals'], '/lovable-uploads/0014c541-d3af-4b1b-aa10-28d9cb931211.png');
