import { useEffect } from 'react';
import { io } from 'socket.io-client';
import useAgentStore from '../store/useAgentStore';

// Safety Fallback: Use the env variable, or default to localhost:5000
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Logic: Socket.io needs the base domain (http://localhost:5000), not the /api path
const SOCKET_URL = API_BASE.replace('/api', '');

const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ['websocket'],
});

export const useSocket = (userId) => {
  const setStatus = useAgentStore((state) => state.setStatus);
  const openModal = useAgentStore((state) => state.openModal);

  useEffect(() => {
    // Only attempt connection if a user is logged in
    if (!userId) return;

    console.log(`📡 Connecting to Agent Room: ${userId}`);
    socket.emit('join_notification_room', userId);

    // Listen for Agentic Workflow steps
    socket.on('agent_status', (data) => {
      setStatus(data.status);
    });

    // Listen for the final ranked payload from Gemini
    socket.on('notification:new', (data) => {
      if (data.fullData) {
        setStatus('complete');
        openModal(data.fullData);
      }
    });

    socket.on('agent_error', (data) => {
      setStatus('idle');
      console.error("HireSense Agent Error:", data.message);
    });

    return () => {
      socket.off('agent_status');
      socket.off('notification:new');
      socket.off('agent_error');
    };
  }, [userId, setStatus, openModal]);

  return socket;
};