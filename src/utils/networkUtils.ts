
export interface NetworkStatus {
  isOnline: boolean;
  connectionType?: string;
  effectiveType?: string;
}

export const checkNetworkConnectivity = (): NetworkStatus => {
  const isOnline = navigator.onLine;
  
  // Get connection info if available
  const connection = (navigator as any).connection || 
                    (navigator as any).mozConnection || 
                    (navigator as any).webkitConnection;
  
  return {
    isOnline,
    connectionType: connection?.type,
    effectiveType: connection?.effectiveType
  };
};

export const createRetryWrapper = <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  return new Promise(async (resolve, reject) => {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Network request attempt ${attempt}/${maxRetries}`);
        const result = await fn();
        console.log(`✅ Network request succeeded on attempt ${attempt}`);
        resolve(result);
        return;
      } catch (error) {
        lastError = error as Error;
        console.error(`❌ Network request failed on attempt ${attempt}:`, {
          error: error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          errorType: typeof error,
          stack: error instanceof Error ? error.stack : undefined
        });
        
        if (attempt === maxRetries) {
          console.error(`🔴 All ${maxRetries} attempts failed. Final error:`, lastError);
          break;
        }
        
        // Wait before retrying with exponential backoff
        const retryDelay = delay * attempt;
        console.log(`⏱️ Waiting ${retryDelay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
    
    reject(lastError);
  });
};

export const logNetworkError = (error: any, context: string) => {
  const networkStatus = checkNetworkConnectivity();
  
  console.group(`🔴 Network Error in ${context}`);
  console.error("Error details:", error);
  console.log("Network status:", networkStatus);
  console.log("User agent:", navigator.userAgent);
  console.log("Timestamp:", new Date().toISOString());
  console.log("URL:", window.location.href);
  
  // Enhanced error logging
  if (error?.message) {
    console.log("Error message:", error.message);
  }
  
  if (error?.code) {
    console.log("Error code:", error.code);
  }
  
  if (error?.details) {
    console.log("Error details:", error.details);
  }
  
  if (error?.hint) {
    console.log("Error hint:", error.hint);
  }
  
  // Check for common network issues
  const errorMessage = error?.message?.toLowerCase() || '';
  if (errorMessage.includes('fetch')) {
    console.log("⚠️ Fetch-related error detected - possible network wrapper interference");
  }
  if (errorMessage.includes('cors')) {
    console.log("⚠️ CORS error detected - check server configuration");
  }
  if (errorMessage.includes('timeout')) {
    console.log("⚠️ Timeout error detected - slow network or server issues");
  }
  
  // Log current fetch implementation status
  const originalFetch = window.fetch;
  const fetchIsNative = originalFetch.toString().includes('native code');
  console.log("Fetch is native:", fetchIsNative);
  
  console.groupEnd();
};

// Enhanced network performance monitoring
export const measureNetworkPerformance = async <T>(
  operation: () => Promise<T>,
  operationName: string = 'network_operation'
): Promise<{ result: T; performance: { duration: number; timestamp: string } }> => {
  const startTime = performance.now();
  const startTimestamp = new Date().toISOString();
  
  console.log(`⏱️ Starting ${operationName}...`);
  
  try {
    const result = await operation();
    const duration = performance.now() - startTime;
    
    console.log(`✅ ${operationName} completed in ${duration.toFixed(2)}ms`);
    
    return {
      result,
      performance: {
        duration,
        timestamp: startTimestamp
      }
    };
  } catch (error) {
    const duration = performance.now() - startTime;
    console.error(`❌ ${operationName} failed after ${duration.toFixed(2)}ms:`, error);
    throw error;
  }
};
