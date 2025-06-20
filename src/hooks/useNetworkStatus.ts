
import { useState, useEffect } from 'react';
import { checkNetworkConnectivity, NetworkStatus } from '@/utils/networkUtils';

export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>(() => 
    checkNetworkConnectivity()
  );

  useEffect(() => {
    const updateNetworkStatus = () => {
      const status = checkNetworkConnectivity();
      console.log('Network status changed:', status);
      setNetworkStatus(status);
    };

    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    // Also check connection change if supported
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;
    
    if (connection) {
      connection.addEventListener('change', updateNetworkStatus);
    }

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      if (connection) {
        connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, []);

  return networkStatus;
};
