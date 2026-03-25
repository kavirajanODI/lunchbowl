
import { useCallback, useEffect, useRef, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

type UseNetworkProps = {
  onReconnect?: () => void;
};

export const useNetwork = ({ onReconnect }: UseNetworkProps = {}) => {
  const [isConnected, setIsConnected] = useState(true);
  const wasConnected = useRef(true);

  const handleConnectionChange = useCallback(
    (state: NetInfoState) => {
      const connected = !!state.isConnected && state.isInternetReachable !== false;
      
      setIsConnected(connected);

      if (!wasConnected.current && connected && onReconnect) {
        onReconnect();
      }

      wasConnected.current = connected;
    },
    [onReconnect]
  );

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(handleConnectionChange);
    NetInfo.fetch().then(state => handleConnectionChange(state));

    return () => unsubscribe();
  }, [handleConnectionChange]);

  return { isConnected };
};
