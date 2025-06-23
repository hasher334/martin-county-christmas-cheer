
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Child = Tables<'children'>;

interface UseSimpleChildrenDataReturn {
  children: Child[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useSimpleChildrenData = (): UseSimpleChildrenDataReturn => {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChildren = async () => {
    try {
      console.log('🔄 Simple fetch: Starting children data fetch...');
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('children')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: true });

      if (supabaseError) {
        console.error('❌ Simple fetch error:', supabaseError);
        setError(supabaseError.message);
        setChildren([]);
      } else {
        console.log('✅ Simple fetch success:', { count: data?.length || 0 });
        setChildren(data || []);
        setError(null);
      }
    } catch (fetchError) {
      console.error('❌ Simple fetch exception:', fetchError);
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to fetch children');
      setChildren([]);
    } finally {
      setLoading(false);
      console.log('🏁 Simple fetch completed');
    }
  };

  const refetch = async () => {
    console.log('🔄 Manual refetch triggered');
    await fetchChildren();
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  return {
    children,
    loading,
    error,
    refetch
  };
};
