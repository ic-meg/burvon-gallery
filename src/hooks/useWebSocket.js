import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { getChatUserIdentifier, getChatEmail } from '../utils/chatSession';

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:3000';

export const useWebSocket = (isAdmin = false, onConversationsUpdate = null, onNewMessage = null) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    try {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }


      // Connect to Socket.IO server with /chat namespace
      const socket = io(`${API_URL}/chat`, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      });

      socket.on('connect', () => {

        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;

        // Join chat room
        const userIdentifier = isAdmin
          ? { isAdmin: true }
          : getChatUserIdentifier();

        socket.emit('JOIN_CHAT', userIdentifier);
      });

      socket.on('disconnect', (reason) => {

        setIsConnected(false);

        if (reason === 'io server disconnect') {
          socket.connect();
        } else if (reason === 'io client disconnect') {
        } else {
        }
      });

      socket.on('connect_error', (err) => {
        console.error('WebSocket connection error:', err.message);
        setError('Connection error');
        reconnectAttempts.current++;

        if (reconnectAttempts.current >= maxReconnectAttempts) {
          setError('Failed to connect. Please refresh the page.');
        }
      });

      socket.on('NEW_MESSAGE', (data) => {
        try {
          if (data.chatMessage) {
            setMessages(prev => {
              const exists = prev.some(msg => msg.chat_id === data.chatMessage.chat_id);
              if (exists) return prev;
              return [...prev, data.chatMessage];
            });

            if (onNewMessage) {
              onNewMessage(data.chatMessage);
            }
          }
        } catch (err) {
          console.error('Error processing NEW_MESSAGE:', err);
        }
      });

      socket.on('CONVERSATIONS_LIST', (data) => {
        if (isAdmin && data.conversations && onConversationsUpdate) {
          onConversationsUpdate(data.conversations);
        }
      });

      socket.on('ERROR', (data) => {
        console.error('WebSocket error:', data);
        setError(data.message || 'An error occurred');
      });

      socket.on('TYPING', (data) => {
      });

      socketRef.current = socket;
    } catch (err) {
      console.error('Error creating WebSocket:', err);
      setError('Failed to create connection');
    }
  }, [isAdmin, onConversationsUpdate, onNewMessage]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback((message, adminId = null, targetUserId = null, targetSessionId = null, targetEmail = null) => {
    if (!socketRef.current || !socketRef.current.connected) {
      setError('Not connected to server');
      return false;
    }

    try {
      if (isAdmin) {
        // Admin sending message
        const messageData = {
          admin_id: adminId,
          message: message,
          sender_type: 'admin',
          user_id: targetUserId || undefined,
          session_id: targetSessionId || undefined,
          email: targetEmail || undefined, // Include email for session-based messages
        };

        socketRef.current.emit('SEND_MESSAGE', messageData);
      } else {
        // Customer sending message
        const userIdentifier = getChatUserIdentifier();
        const email = userIdentifier.email || getChatEmail();

        const messageData = {
          ...userIdentifier,
          email: email,
          message: message,
          sender_type: 'user',
        };

        socketRef.current.emit('SEND_MESSAGE', messageData);
      }

      return true;
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
      return false;
    }
  }, [isAdmin]);

  const sendTyping = useCallback((isTyping) => {
    if (!socketRef.current || !socketRef.current.connected) {
      return;
    }

    try {
      const userIdentifier = isAdmin
        ? {}
        : getChatUserIdentifier();

      socketRef.current.emit(isTyping ? 'TYPING_START' : 'TYPING_STOP', userIdentifier);
    } catch (err) {
      console.error('Error sending typing indicator:', err);
    }
  }, [isAdmin]);

  const markAsRead = useCallback(() => {
    if (!socketRef.current || !socketRef.current.connected) {
      return;
    }

    try {
      const userIdentifier = isAdmin
        ? {}
        : getChatUserIdentifier();

      socketRef.current.emit('MARK_READ', userIdentifier);
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  }, [isAdmin]);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    messages,
    error,
    sendMessage,
    sendTyping,
    markAsRead,
    reconnect: connect,
    socket: socketRef.current // Expose socket for direct event listening
  };
};
