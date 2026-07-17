// src/context/ChatContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useUser } from './UserContext';
import { chatAPI } from '../services/api';
import { createWebSocketConnection } from '../utils/websocket';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user } = useUser();
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const wsRef = useRef(null);

  // Fetch rooms
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await chatAPI.getRooms();
        setRooms(response.data || []);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [user]);

  // Connect to WebSocket when room changes
  useEffect(() => {
    if (!currentRoom || !user) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      return;
    }

    // Fetch messages
    const fetchMessages = async () => {
      try {
        const response = await chatAPI.getMessages(currentRoom.id);
        setMessages(response.data.results || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Connect WebSocket
    const handleMessage = (data) => {
      switch (data.type) {
        case 'message_history':
          setMessages(data.messages || []);
          break;
        case 'chat_message':
          setMessages(prev => [...prev, data.message]);
          break;
        case 'typing_indicator':
          // Handle typing indicator if needed
          break;
        case 'presence_update':
          // Handle presence update if needed
          break;
        default:
          break;
      }
    };

    wsRef.current = createWebSocketConnection(
      currentRoom.id,
      handleMessage,
      () => console.log('Connected to room:', currentRoom.id),
      () => console.log('Disconnected from room:', currentRoom.id)
    );

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [currentRoom, user]);

  const startChat = async (participantId) => {
    try {
      const response = await chatAPI.createRoom({
        participant_ids: [participantId]
      });
      setCurrentRoom(response.data);
      return response.data;
    } catch (error) {
      console.error('Error starting chat:', error);
      throw error;
    }
  };

  const sendMessage = async (content) => {
    if (!currentRoom || !content.trim()) return;

    // Send via WebSocket if connected
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'chat_message',
        content: content.trim()
      }));
    } else {
      // Fallback to REST API
      try {
        await chatAPI.sendMessage(currentRoom.id, content.trim());
        // Refresh messages after REST send
        const response = await chatAPI.getMessages(currentRoom.id);
        setMessages(response.data.results || []);
      } catch (error) {
        console.error('Error sending message via REST:', error);
      }
    }
  };

  const sendTyping = (isTyping) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'typing',
        is_typing: isTyping
      }));
    }
  };

  const selectRoom = (room) => {
    setCurrentRoom(room);
  };

  const getOtherParticipantId = (room) => {
    if (!room || !room.participants || !user) return null;
    return room.participants.find(id => id !== user.id) || null;
  };

  return (
    <ChatContext.Provider value={{
      rooms,
      currentRoom,
      messages,
      loading,
      startChat,
      sendMessage,
      sendTyping,
      selectRoom,
      getOtherParticipantId,
      setCurrentRoom,
    }}>
      {children}
    </ChatContext.Provider>
  );
};