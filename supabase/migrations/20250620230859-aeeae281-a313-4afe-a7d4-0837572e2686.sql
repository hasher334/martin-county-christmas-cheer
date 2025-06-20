
-- Insert 5 demo child profiles
INSERT INTO public.children (name, age, gender, location, story, wishes, photo_url, status, parent_info) VALUES
(
  'Isabella',
  7,
  'female',
  'Martin County, FL',
  'Isabella is a bright and curious 7-year-old who loves painting and creating art. She dreams of having her own art studio someday and hopes to share her colorful world with everyone.',
  ARRAY['Watercolor paint set', 'Canvas and easel', 'Art smock', 'Colored pencils'],
  '/lovable-uploads/92766bf4-249f-46f3-aae7-6002084cf56c.png',
  'available',
  '{"situation": "Single father working nights", "contact": "Available through local community center"}'::jsonb
),
(
  'Jayden',
  10,
  'male',
  'Martin County, FL',
  'Jayden is an energetic boy who loves sports, especially basketball. He practices every day at the local park and dreams of playing for his school team next year.',
  ARRAY['Basketball shoes', 'Team jersey', 'Basketball', 'Sports water bottle'],
  '/lovable-uploads/5a57abc7-69b1-48e1-86bc-34547e214e3f.png',
  'available',
  '{"situation": "Family recovering from medical expenses", "contact": "Available through school social worker"}'::jsonb
),
(
  'Zoe',
  5,
  'female',
  'Martin County, FL',
  'Little Zoe has the biggest smile and loves to help everyone around her. She enjoys reading picture books and playing with dolls, always creating imaginative stories.',
  ARRAY['Picture books', 'Baby doll with accessories', 'Puzzle set', 'Warm winter coat'],
  '/lovable-uploads/92766bf4-249f-46f3-aae7-6002084cf56c.png',
  'available',
  '{"situation": "Young mother attending college", "contact": "Available through daycare center"}'::jsonb
),
(
  'Carlos',
  9,
  'male',
  'Martin County, FL',
  'Carlos is fascinated by how things work and loves building with blocks and taking apart old toys to see inside. He wants to be an inventor when he grows up.',
  ARRAY['Building blocks set', 'Science experiment kit', 'Tool set for kids', 'Winter jacket'],
  '/lovable-uploads/5a57abc7-69b1-48e1-86bc-34547e214e3f.png',
  'available',
  '{"situation": "Grandparents on fixed income", "contact": "Available through local church"}'::jsonb
),
(
  'Lily',
  11,
  'female',
  'Martin County, FL',
  'Lily loves music and has been learning to play guitar with borrowed instruments. She writes her own songs and dreams of performing for her friends and family.',
  ARRAY['Acoustic guitar', 'Music notebook', 'Guitar picks', 'Warm boots'],
  '/lovable-uploads/92766bf4-249f-46f3-aae7-6002084cf56c.png',
  'available',
  '{"situation": "Foster family with limited resources", "contact": "Available through social services"}'::jsonb
);
