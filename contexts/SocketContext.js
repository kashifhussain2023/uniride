'use client';

import { createContext, useContext, useEffect } from 'react';
import { socketService } from '@/components/presentation/SocketEvents';

const SocketContext = createContext(socketService);

export function SocketProvider({ children }) {
  useEffect(() => {
    const connectSocket = async () => {
      try {
        await socketService.connect();
      } catch (error) {
        console.error('Socket connection failed:', error);
      }
    };

    connectSocket();

    return () => {
      socketService.disconnect();
    };
  }, []);

  return <SocketContext.Provider value={socketService}>{children}</SocketContext.Provider>;
}

export const useSocket = () => useContext(SocketContext);
