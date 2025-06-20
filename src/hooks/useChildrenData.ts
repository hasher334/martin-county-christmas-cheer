
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { createRetryWrapper, logNetworkError } from '@/utils/networkUtils';
import type { Tables } from '@/integrations/supabase/types';

type Child = Tables<'children'>;

interface UseChildrenDataReturn {
  children: Child[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  retryCount: number;
}

export const useChildrenData = (): UseChildrenDataReturn => {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  const fetchChildren = async (isRetry: boolean = false) => {
    try {
      console.log('🔄 Starting children fetch...', { isRetry, retryCount });
      
      if (isRetry) {
        setRetryCount(prev => prev + 1);
      } else {
        setLoading(true);
        setError(null);
        setRetryCount(0);
      }

      // Test basic connectivity first
      console.log('🔍 Testing Supabase connectivity...');
      
      const fetchWithRetry = async () => {
        const result = await supabase
          .from('children')
          .select('*')
          .eq('status', 'available')
          .order('created_at', { ascending: true });
        return result;
      };

      const { data, error: supabaseError } = await createRetryWrapper(
        fetchWithRetry,
        3,
        1000
      ) as { data: Child[] | null; error: any };

      console.log('📊 Supabase response:', { 
        data: data?.length, 
        error: supabaseError,
        hasData: !!data,
        dataType: typeof data
      });

      if (supabaseError) {
        throw supabaseError;
      }

      setChildren(data || []);
      setError(null);
      
      console.log('✅ Children fetch successful:', {
        count: data?.length || 0,
        retryCount
      });

      if (isRetry) {
        toast({
          title: "Connection Restored",
          description: "Successfully loaded children data",
        });
      }

    } catch (fetchError) {
      console.error('❌ Children fetch failed:', fetchError);
      
      logNetworkError(fetchError, 'fetchChildren');
      
      const errorMessage = fetchError instanceof Error 
        ? fetchError.message 
        : 'Unknown error occurred';
      
      setError(errorMessage);
      setChildren([]);

      // Show toast for user feedback
      toast({
        title: "Failed to Load Data",
        description: `${errorMessage}. ${retryCount < 2 ? 'Retrying...' : 'Please check your connection.'}`,
        variant: "destructive",
      });

    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    console.log('🔄 Manual refetch triggered');
    await fetchChildren(true);
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  return {
    children,
    loading,
    error,
    refetch,
    retryCount
  };
};
