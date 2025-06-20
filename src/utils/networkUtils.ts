
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
        console.log(`Network request attempt ${attempt}/${maxRetries}`);
        const result = await fn();
        console.log(`Network request succeeded on attempt ${attempt}`);
        resolve(result);
        return;
      } catch (error) {
        lastError = error as Error;
        console.error(`Network request failed on attempt ${attempt}:`, error);
        
        if (attempt === maxRetries) {
          break;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
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
  
  if (error?.message) {
    console.log("Error message:", error.message);
  }
  
  if (error?.code) {
    console.log("Error code:", error.code);
  }
  
  if (error?.details) {
    console.log("Error details:", error.details);
  }
  
  console.groupEnd();
};
