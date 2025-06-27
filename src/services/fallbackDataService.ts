
import type { Tables } from '@/integrations/supabase/types';

type Child = Tables<'children'>;

// Mock children data for fallback
const mockChildren: Child[] = [
  {
    id: 'mock-1',
    name: 'Emma',
    age: 8,
    gender: 'female',
    location: 'Martin County, FL',
    story: 'Emma loves to read and dream about magical adventures. She hopes Santa will bring her some new books this Christmas.',
    wishes: ['Harry Potter book set', 'Art supplies', 'Warm winter coat'],
    status: 'available' as any,
    photo_url: '/lovable-uploads/92766bf4-249f-46f3-aae7-6002084cf56c.png',
    parent_info: {
      situation: 'Single mother working two jobs',
      contact: 'Available through social services'
    },
    created_at: '2024-11-01T10:00:00Z',
    updated_at: '2024-11-01T10:00:00Z',
    approved_at: null,
    approved_by: null,
    created_by: null
  },
  {
    id: 'mock-2', 
    name: 'Marcus',
    age: 12,
    gender: 'male',
    location: 'Martin County, FL',
    story: 'Marcus is passionate about science and building things. He dreams of becoming an engineer someday.',
    wishes: ['LEGO Engineering set', 'Science experiment kit', 'Winter boots'],
    status: 'available' as any,
    photo_url: '/lovable-uploads/5a57abc7-69b1-48e1-86bc-34547e214e3f.png',
    parent_info: {
      situation: 'Family affected by recent job loss',
      contact: 'Available through local church'
    },
    created_at: '2024-11-02T14:30:00Z',
    updated_at: '2024-11-02T14:30:00Z',
    approved_at: null,
    approved_by: null,
    created_by: null
  },
  {
    id: 'mock-3',
    name: 'Sofia',
    age: 6,
    gender: 'female', 
    location: 'Martin County, FL',
    story: 'Sofia loves to dance and sing. She brings joy to everyone around her with her bright smile.',
    wishes: ['Dance costume', 'Music box', 'Warm pajamas'],
    status: 'available' as any,
    photo_url: '/lovable-uploads/9b7c78e5-e2e5-4e1d-9ff0-05333593d9f4.png',
    parent_info: {
      situation: 'Grandmother raising grandchildren',
      contact: 'Available through school counselor'
    },
    created_at: '2024-11-03T09:15:00Z',
    updated_at: '2024-11-03T09:15:00Z',
    approved_at: null,
    approved_by: null,
    created_by: null
  }
];

export const getFallbackChildren = (): Child[] => {
  console.log('🔄 Using fallback children data');
  return mockChildren;
};

export const isFallbackData = (children: Child[]): boolean => {
  return children.length > 0 && children[0].id?.startsWith('mock-');
};

// Simulate network delay for more realistic fallback experience
export const getFallbackChildrenWithDelay = async (delay: number = 1000): Promise<Child[]> => {
  console.log(`⏱️ Loading fallback data with ${delay}ms delay...`);
  await new Promise(resolve => setTimeout(resolve, delay));
  return getFallbackChildren();
};
