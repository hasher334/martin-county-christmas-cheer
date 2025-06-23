
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getFallbackChildren } from '@/services/fallbackDataService';
import type { Tables } from '@/integrations/supabase/types';

type Child = Tables<'children'>;

interface UseChildrenDataReturn {
  children: Child[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  retryCount: number;
  isUsingFallback: boolean;
}

// Simple in-memory cache
let cachedChildren: Child[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useChildrenData = (): UseChildrenDataReturn => {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const { toast } = useToast();

  const fetchChildren = async (isRetry: boolean = false) => {
    try {
      // Check cache first
      const now = Date.now();
      if (cachedChildren && (now - cacheTimestamp) < CACHE_DURATION && !isRetry) {
        console.log('✅ Using cached children data');
        setChildren(cachedChildren);
        setError(null);
        setIsUsingFallback(false);
        setLoading(false);
        return;
      }

      if (isRetry) {
        setRetryCount(prev => prev + 1);
      } else {
        setLoading(true);
        setError(null);
        setRetryCount(0);
        setIsUsingFallback(false);
      }

      console.log('🔄 Fetching children from database...');
      
      const { data, error: supabaseError } = await supabase
        .from('children')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: true });

      if (supabaseError) {
        throw supabaseError;
      }

      if (data) {
        console.log('✅ Successfully fetched children:', { count: data.length });
        
        // Update cache
        cachedChildren = data;
        cacheTimestamp = now;
        
        setChildren(data);
        setError(null);
        setIsUsingFallback(false);
        
        if (isRetry) {
          toast({
            title: "Connection Restored",
            description: "Successfully loaded children data",
          });
        }
      }

    } catch (fetchError) {
      console.error('❌ Failed to fetch children:', fetchError);
      
      // Use fallback data only as last resort
      const fallbackData = getFallbackChildren();
      setChildren(fallbackData);
      setIsUsingFallback(true);
      
      const errorMessage = fetchError instanceof Error 
        ? fetchError.message 
        : 'Failed to load children data';
      
      setError(errorMessage);
      
      toast({
        title: "Using Sample Data",
        description: "Showing sample data while we restore the connection.",
        variant: "default",
      });

    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    console.log('🔄 Manual refetch triggered');
    // Clear cache on manual refetch
    cachedChildren = null;
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
    retryCount,
    isUsingFallback
  };
};
