
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { createRetryWrapper, logNetworkError } from '@/utils/networkUtils';
import { bypassNetworkWrapper, runNetworkDiagnostics } from '@/utils/networkBypass';
import { getFallbackChildren, getFallbackChildrenWithDelay, isFallbackData } from '@/services/fallbackDataService';
import type { Tables } from '@/integrations/supabase/types';

type Child = Tables<'children'>;

interface UseChildrenDataReturn {
  children: Child[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  retryCount: number;
  isUsingFallback: boolean;
  networkDiagnostics: any;
}

export const useChildrenData = (): UseChildrenDataReturn => {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [networkDiagnostics, setNetworkDiagnostics] = useState<any>(null);
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
        setIsUsingFallback(false);
      }

      // Run network diagnostics on first load or after failures
      if (!isRetry || retryCount > 1) {
        console.log('🔧 Running network diagnostics...');
        const diagnostics = await runNetworkDiagnostics();
        setNetworkDiagnostics(diagnostics);
      }

      // Method 1: Try with network bypass
      console.log('🚀 Attempting data fetch with network bypass...');
      
      const fetchOperation = async () => {
        const result = await supabase
          .from('children')
          .select('*')
          .eq('status', 'available')
          .order('created_at', { ascending: true });
        return result;
      };

      const bypassResult = await bypassNetworkWrapper(fetchOperation);
      
      if (bypassResult.data) {
        console.log('✅ Network bypass successful:', {
          count: bypassResult.data.length,
          bypassUsed: bypassResult.bypassUsed
        });
        
        setChildren(bypassResult.data);
        setError(null);
        setIsUsingFallback(false);
        
        if (isRetry) {
          toast({
            title: "Connection Restored",
            description: "Successfully loaded children data",
          });
        }
        
        return;
      }

      // Method 2: Try with retry wrapper as backup
      console.log('⚠️ Network bypass failed, trying retry wrapper...');
      
      const { data, error: supabaseError } = await createRetryWrapper(
        fetchOperation,
        2, // Reduced retries since we have fallback
        1000
      ) as { data: Child[] | null; error: any };

      if (data && !supabaseError) {
        console.log('✅ Retry wrapper successful:', { count: data.length });
        setChildren(data);
        setError(null);
        setIsUsingFallback(false);
        
        if (isRetry) {
          toast({
            title: "Connection Restored", 
            description: "Successfully loaded children data",
          });
        }
        
        return;
      }

      // Method 3: Use fallback data
      console.log('🔄 All network methods failed, using fallback data...');
      
      const fallbackData = await getFallbackChildrenWithDelay(500);
      setChildren(fallbackData);
      setIsUsingFallback(true);
      
      const errorMessage = supabaseError?.message || bypassResult.error?.message || 'Network connection failed';
      setError(errorMessage);
      
      toast({
        title: "Using Offline Data",
        description: "Showing sample data while we work to restore the connection. Please try refreshing in a moment.",
        variant: "default",
      });

    } catch (fetchError) {
      console.error('❌ Complete fetch failure:', fetchError);
      
      logNetworkError(fetchError, 'fetchChildren');
      
      // Last resort: provide fallback data
      try {
        const fallbackData = getFallbackChildren();
        setChildren(fallbackData);
        setIsUsingFallback(true);
        
        toast({
          title: "Connection Issues",
          description: "Showing sample data. Please check your internet connection and try again.",
          variant: "destructive",
        });
        
      } catch (fallbackError) {
        console.error('❌ Even fallback data failed:', fallbackError);
        setChildren([]);
        setIsUsingFallback(false);
      }
      
      const errorMessage = fetchError instanceof Error 
        ? fetchError.message 
        : 'Unknown error occurred';
      
      setError(errorMessage);

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
    retryCount,
    isUsingFallback: isUsingFallback || isFallbackData(children),
    networkDiagnostics
  };
};
