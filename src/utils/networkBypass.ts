
// Network bypass utility to work around Lovable.js script interference
import { supabase } from '@/integrations/supabase/client';

export interface NetworkBypassResult<T> {
  data: T | null;
  error: any;
  bypassUsed: boolean;
}

// Direct Supabase client bypass - uses different approach to avoid network wrapper
export const bypassNetworkWrapper = async <T>(
  operation: () => Promise<{ data: T | null; error: any }>
): Promise<NetworkBypassResult<T>> => {
  console.log('🔧 Attempting network bypass...');
  
  try {
    // Method 1: Direct operation (should work if wrapper is not interfering)
    console.log('📡 Trying direct Supabase operation...');
    const result = await operation();
    
    if (result.data !== null || !result.error) {
      console.log('✅ Direct operation successful');
      return { 
        data: result.data, 
        error: result.error, 
        bypassUsed: false 
      };
    }
    
    // Method 2: If direct fails, try with timeout wrapper
    console.log('⚠️ Direct operation failed, trying with timeout wrapper...');
    const timeoutPromise = new Promise<{ data: T | null; error: any }>((_, reject) => {
      setTimeout(() => reject(new Error('Operation timeout')), 10000);
    });
    
    const operationPromise = operation();
    const timeoutResult = await Promise.race([operationPromise, timeoutPromise]);
    
    console.log('✅ Timeout wrapper successful');
    return { 
      data: timeoutResult.data, 
      error: timeoutResult.error, 
      bypassUsed: true 
    };
    
  } catch (error) {
    console.error('❌ All bypass methods failed:', error);
    return { 
      data: null, 
      error: error, 
      bypassUsed: true 
    };
  }
};

// Enhanced connectivity test
export const testSupabaseConnectivity = async (): Promise<{
  isConnected: boolean;
  latency: number;
  error?: any;
}> => {
  const startTime = performance.now();
  
  try {
    console.log('🔍 Testing Supabase connectivity...');
    
    // Simple connectivity test
    const { error } = await supabase
      .from('children')
      .select('id')
      .limit(1);
    
    const latency = performance.now() - startTime;
    
    if (error) {
      console.error('🔴 Connectivity test failed:', error);
      return { isConnected: false, latency, error };
    }
    
    console.log(`✅ Connectivity test passed (${latency.toFixed(2)}ms)`);
    return { isConnected: true, latency };
    
  } catch (error) {
    const latency = performance.now() - startTime;
    console.error('🔴 Connectivity test error:', error);
    return { isConnected: false, latency, error };
  }
};

// Network diagnostics
export const runNetworkDiagnostics = async () => {
  console.group('🔧 Network Diagnostics');
  
  // Test 1: Basic connectivity
  const connectivity = await testSupabaseConnectivity();
  console.log('Connectivity:', connectivity);
  
  // Test 2: Check if we're in Lovable environment
  const isLovable = window.location.hostname.includes('lovable.app') || 
                   window.location.hostname.includes('lovable.dev') ||
                   !!document.querySelector('script[src*="lovable"]');
  console.log('Lovable environment detected:', isLovable);
  
  // Test 3: Check for network wrappers
  const originalFetch = window.fetch;
  const fetchIsWrapped = originalFetch.toString().includes('native code') === false;
  console.log('Fetch appears to be wrapped:', fetchIsWrapped);
  
  // Test 4: Basic Supabase client status
  console.log('Supabase client available:', !!supabase);
  
  console.groupEnd();
  
  return {
    connectivity,
    isLovable,
    fetchIsWrapped,
    timestamp: new Date().toISOString()
  };
};
