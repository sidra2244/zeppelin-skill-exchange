// src/utils/websocket.js
export const getWebSocketUrl = (roomId) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    console.error('No access token found');
    return null;
  }
  
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = import.meta.env.VITE_WS_HOST || '127.0.0.1:8000';
  return `${protocol}//${host}/ws/chat/${roomId}/?token=${encodeURIComponent(token)}`;
};

export const createWebSocketConnection = (roomId, onMessage, onConnect, onDisconnect) => {
  const url = getWebSocketUrl(roomId);
  if (!url) {
    console.error('Cannot create WebSocket connection: no URL');
    return null;
  }

  const ws = new WebSocket(url);

  ws.onopen = () => {
    console.log('WebSocket connected');
    onConnect?.();
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('WebSocket message received:', data);
      onMessage?.(data);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };

  ws.onclose = () => {
    console.log('WebSocket disconnected');
    onDisconnect?.();
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return ws;
};