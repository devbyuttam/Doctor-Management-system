import { createContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';

export const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const socketRef = useRef(null);
  const { isAuthenticated, user } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated && user) {
      socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
        withCredentials: true,
      });
      // Join room based on role
      socketRef.current.emit(`join:${user.role}`, user._id);
    }
    return () => { if (socketRef.current) socketRef.current.disconnect(); };
  }, [isAuthenticated, user]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
}
