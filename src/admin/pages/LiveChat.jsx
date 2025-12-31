import React, { useState, useRef, useEffect, useCallback } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';
import { useWebSocket } from '../../hooks/useWebSocket';
import { getAuthToken, getUser } from '../../services/authService';
import Toast from '../../components/Toast';
import chatApi from '../../api/chatApi';

import {
  AddVideo,
  AddImage,
  DropDownIconBlack,
  DropUpIconBlack
} from '../../assets/index.js';

const LiveChat = ({ hasAccess = true, canEdit = true, isCSR = false, isClerk = false, isManager = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('CHAT'); // Default to CHAT
  const [selectedChat, setSelectedChat] = useState(null); // No auto-selection
  const [lastOpenedChat, setLastOpenedChat] = useState(null);
  const [messagesByChat, setMessagesByChat] = useState({}); // Store messages per chat
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showEditTemplateModal, setShowEditTemplateModal] = useState(false);
  const [previouslyOpenedChats, setPreviouslyOpenedChats] = useState(new Set());
  const [activelyAnswering, setActivelyAnswering] = useState(null);
  const [newTemplate, setNewTemplate] = useState({
    title: '',
    content: '',
    keywords: ''
  });
  const [editTemplate, setEditTemplate] = useState({
    id: null,
    title: '',
    content: '',
    keywords: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || 'null');
  
  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      const result = await chatApi.fetchAllConversations();

      if (!result.error && result.data) {
        const formattedChats = result.data.conversations.map((conv, index) => ({
          id: conv.identifier,
          identifier: conv.identifier,
          customerName: conv.customerName,
          customerInitials: conv.customerInitials,
          lastMessage: conv.lastMessage,
          lastSender: conv.lastSender,
          timestamp: new Date(conv.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          status: conv.isResolved ? 'resolved' :
                  conv.unreadCount > 0 ? 'unread' : 
                  conv.lastSender === 'admin' ? 'answered' : 'unanswered',
          unreadCount: conv.unreadCount,
          isOnline: conv.isOnline,
          user_id: conv.user_id,
          session_id: conv.session_id,
          email: conv.email,
          messages: conv.messages || []
        }));
        setChats(formattedChats);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle conversations list from WebSocket
  const handleConversationsUpdate = useCallback((conversations) => {
    const formattedChats = conversations.map((conv) => ({
      id: conv.identifier,
      identifier: conv.identifier,
      customerName: conv.customerName,
      customerInitials: conv.customerInitials,
      lastMessage: conv.lastMessage,
      lastSender: conv.lastSender,
      timestamp: new Date(conv.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      status: conv.unreadCount > 0 ? 'unread' : 
              conv.lastSender === 'admin' ? 'answered' : 'unanswered',
      unreadCount: conv.unreadCount,
      isOnline: conv.isOnline,
      user_id: conv.user_id,
      session_id: conv.session_id,
      email: conv.email,
      messages: conv.messages || []
    }));
    setChats(formattedChats);
    setLoading(false);
  }, []);

  // Handle new message - refresh conversations list
  const handleNewMessage = useCallback((chatMessage) => {
    loadConversations();
  }, [loadConversations]);

  const { isConnected, sendMessage } = useWebSocket(true, handleConversationsUpdate, handleNewMessage);

  useEffect(() => {
    if (isConnected) {
      loadConversations();
    }
  }, [isConnected, loadConversations]);

  const [templates, setTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  
  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

  // Load templates from API
  const loadTemplates = useCallback(async () => {
    try {
      setTemplatesLoading(true);
      const result = await chatApi.fetchAllTemplates();

      if (!result.error && result.data) {
        // Convert backend format to frontend format
        const formattedTemplates = result.data.templates.map(template => ({
          id: template.auto_reply_id,
          title: template.title,
          content: template.reply_message,
          keywords: Array.isArray(template.trigger_keywords) 
            ? template.trigger_keywords.join(', ') 
            : template.trigger_keywords || ''
        }));
        setTemplates(formattedTemplates);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setTemplatesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const filterOptions = [
    { 
      value: 'CHAT', 
      label: 'CHAT', 
      count: chats.filter(c => c.status !== 'resolved').length 
    },
    { 
      value: 'UNREAD', 
      label: 'UNREAD', 
      count: chats.filter(c => c.status === 'unread').length 
    },
    { 
      value: 'RESOLVED', 
      label: 'RESOLVED', 
      count: chats.filter(c => c.status === 'resolved').length 
    }
  ];

  const filteredChats = chats.filter(chat => {
    const matchesFilter = selectedFilter === 'CHAT' ? 
      chat.status !== 'resolved' : 
      chat.status.toLowerCase() === selectedFilter.toLowerCase();
    const matchesSearch = chat.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const currentChat = chats.find(chat => chat.id === selectedChat);

  const getCurrentMessage = () => {
    return messagesByChat[selectedChat] || '';
  };

  const setCurrentMessage = (message) => {
    setMessagesByChat(prev => ({
      ...prev,
      [selectedChat]: message
    }));
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.slice(0, 4 - selectedFiles.length);
    
    if (newFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...newFiles].slice(0, 4));
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleChatClick = async (chatId) => {
    if (selectedChat && selectedChat !== chatId && selectedChat !== activelyAnswering) {
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === selectedChat && chat.status === 'unread' && previouslyOpenedChats.has(selectedChat)
            ? { ...chat, status: 'unanswered' }
            : chat
        )
      );
    }

    setSelectedChat(chatId);
    setLastOpenedChat(chatId);
    setPreviouslyOpenedChats(prev => new Set([...prev, chatId]));
    
    const chat = chats.find(c => c.id === chatId);
    if (chat && chat.identifier) {
      await loadConversationMessages(chat.identifier);
    }
    
    // Mark messages as read
    const chatToUpdate = chats.find(c => c.id === chatId);
    if (chatToUpdate) {
      const identifier = chatToUpdate.identifier;
      const isUser = identifier.startsWith('user_');
      const isSession = identifier.startsWith('session_');

      try {
        if (isUser) {
          const user_id = parseInt(identifier.replace('user_', ''));
          await chatApi.markMessagesAsReadByUser(user_id);
        } else if (isSession) {
          const session_id = identifier.replace('session_', '');
          await chatApi.markMessagesAsReadBySession(session_id);
        }
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
      
      loadConversations();
    }
  };

  // Create object URL for file preview
  const createFilePreview = (file) => {
    return URL.createObjectURL(file);
  };

  // Clean up object URLs
  useEffect(() => {
    return () => {
      selectedFiles.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [selectedFiles]);

    // Handle message input change - mark chat as actively being answered
  const handleMessageInputChange = (e) => {
    setCurrentMessage(e.target.value);
    
    // If user starts typing, mark this chat as actively being answered
    if (e.target.value.trim() && currentChat && currentChat.status === 'unread') {
      setActivelyAnswering(currentChat.id);
    }
    
    // If user clears the message, remove active answering status
    if (!e.target.value.trim()) {
      setActivelyAnswering(null);
    }
  };

  const handleSendMessage = async () => {
    if (!canEdit) return; // Prevent users without edit permission from sending messages
    
    const currentMessage = getCurrentMessage();
    if ((!currentMessage.trim() && selectedFiles.length === 0) || !currentChat) return;

    // Send via WebSocket
    const identifier = currentChat.identifier;
    const isUser = identifier.startsWith('user_');
    const isSession = identifier.startsWith('session_');

    const messageData = {
      message: currentMessage,
      admin_id: adminUser?.user_id,
      sender_type: 'admin',
    };

    let targetUserId = null;
    let targetSessionId = null;
    let targetEmail = null;

    if (isUser) {
      targetUserId = parseInt(identifier.replace('user_', ''));
    } else if (isSession) {
      targetSessionId = identifier.replace('session_', '');
      targetEmail = currentChat.email; // Get email from chat for session-based messages
    }

    const success = sendMessage(currentMessage, adminUser?.user_id, targetUserId, targetSessionId, targetEmail);
    
    if (success) {
      const newMsg = {
        chat_id: Date.now(), // Temporary ID
        message: currentMessage,
        is_from_admin: true,
        created_at: new Date().toISOString(),
        admin: adminUser,
      };

      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === selectedChat 
            ? { 
                ...chat, 
                messages: [...chat.messages, newMsg],
                lastMessage: currentMessage || `You: Sent ${selectedFiles.length} file(s)`,
                lastSender: "admin",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'answered',
                unreadCount: 0
              }
            : chat
        )
      );

      setCurrentMessage('');
      setSelectedFiles([]);
      setActivelyAnswering(null);
      
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

      // Reload conversation to get actual message from server
      setTimeout(() => {
        loadConversationMessages(identifier);
      }, 500);
    }
  };

  // Load messages for a specific conversation
  const loadConversationMessages = async (identifier) => {
    try {
      const result = await chatApi.fetchConversationByIdentifier(identifier);

      if (!result.error && result.data) {
        setChats(prevChats => 
          prevChats.map(chat => 
            chat.identifier === identifier 
              ? { ...chat, messages: result.data.messages || [] }
              : chat
          )
        );
      }
    } catch (error) {
      console.error('Error loading conversation messages:', error);
    }
  };

  // Handle mark as resolved
  const handleMarkAsResolved = async () => {
    if (!selectedChat) return;
    
    const chat = chats.find(c => c.id === selectedChat);
    if (!chat) return;

    try {
      const result = await chatApi.markConversationAsResolved(chat.user_id, chat.session_id, adminUser?.user_id);

      if (!result.error) {
        // Update local state
        setChats(prevChats => 
          prevChats.map(c => 
            c.id === selectedChat 
              ? { ...c, status: 'resolved' }
              : c
          )
        );
        setActivelyAnswering(null);
        setToast({ show: true, message: 'Conversation marked as resolved!', type: 'success' });
        // Reload conversations to get updated data
        loadConversations();
      } else {
        setToast({ show: true, message: result.error || 'Failed to mark as resolved', type: 'error' });
      }
    } catch (error) {
      console.error('Error marking conversation as resolved:', error);
      setToast({ show: true, message: `Error: ${error.message}`, type: 'error' });
    }
  };

  // Handle use template
  const handleUseTemplate = (template) => {
    if (!canEdit) return; 
    
    setCurrentMessage(template.content);
    
    // Mark as actively answering when using template
    if (currentChat && currentChat.status === 'unread') {
      setActivelyAnswering(currentChat.id);
    }
    
    setTimeout(() => adjustTextareaHeight(), 0);
  };

  // Handle delete template
  const handleDeleteTemplate = async (templateId) => {
    if (!canEdit) return; 
    
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return;
    }

    try {
      const result = await chatApi.deleteTemplate(templateId);

      if (!result.error) {
        setToast({ show: true, message: 'Template deleted successfully!', type: 'success' });
        // Reload templates
        loadTemplates();
      } else {
        setToast({ show: true, message: result.error || 'Failed to delete template', type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      setToast({ show: true, message: `Error deleting template: ${error.message}`, type: 'error' });
    }
  };

  // Handle edit template
  const handleEditTemplateClick = (template) => {
    if (!canEdit) return; 
    
    setEditTemplate({
      id: template.id,
      title: template.title,
      content: template.content,
      keywords: template.keywords
    });
    setShowEditTemplateModal(true);
  };

  // Handle add template
  const handleAddTemplate = async () => {
    if (!canEdit) return; 
    
    if (!newTemplate.title.trim() || !newTemplate.content.trim()) return;

    try {
      // Convert keywords string to array
      const keywordsArray = newTemplate.keywords
        ? newTemplate.keywords.split(',').map(k => k.trim()).filter(k => k)
        : [];

      const requestBody = {
        title: newTemplate.title.trim(),
        reply_message: newTemplate.content.trim(),
        trigger_keywords: keywordsArray
      };

   

      const result = await chatApi.createTemplate(requestBody);

      if (!result.error) {
        setNewTemplate({ title: '', content: '', keywords: '' });
        setShowTemplateModal(false);
        setToast({ show: true, message: 'Template created successfully!', type: 'success' });
        // Reload templates
        loadTemplates();
      } else {
        setToast({ show: true, message: result.error || 'Failed to create template', type: 'error' });
      }
    } catch (error) {
      console.error('Error creating template:', error);
      setToast({ show: true, message: `Error creating template: ${error.message}`, type: 'error' });
    }
  };

  // Handle update template
  const handleUpdateTemplate = async () => {
    if (!editTemplate.title.trim() || !editTemplate.content.trim() || !editTemplate.id) return;

    try {
      // Convert keywords string to array
      const keywordsArray = editTemplate.keywords
        ? editTemplate.keywords.split(',').map(k => k.trim()).filter(k => k)
        : [];

      const result = await chatApi.updateTemplate(editTemplate.id, {
        title: editTemplate.title,
        reply_message: editTemplate.content,
        trigger_keywords: keywordsArray
      });

      if (!result.error) {
        setShowEditTemplateModal(false);
        setEditTemplate({ id: null, title: '', content: '', keywords: '' });
        setToast({ show: true, message: 'Template updated successfully!', type: 'success' });
        // Reload templates
        loadTemplates();
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('Failed to update template:', response.status, errorData);
        setToast({ show: true, message: errorData.message || 'Failed to update template', type: 'error' });
      }
    } catch (error) {
      console.error('Error updating template:', error);
      setToast({ show: true, message: `Error updating template: ${error.message}`, type: 'error' });
    }
  };

  // Get last message preview
  const getLastMessagePreview = (chat) => {
    return chat.lastMessage;
  };

  // Handle page/component unmount - move currently viewed unread chat to unanswered (except actively answering ones)
  useEffect(() => {
    return () => {
      if (selectedChat && selectedChat !== activelyAnswering) {
        setChats(prevChats => 
          prevChats.map(chat => 
            chat.id === selectedChat && chat.status === 'unread'
              ? { ...chat, status: 'unanswered' }
              : chat
          )
        );
      }
    };
  }, [selectedChat, activelyAnswering]);

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages]);

  // Adjust textarea height on message change
  useEffect(() => {
    adjustTextareaHeight();
  }, [getCurrentMessage()]);

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader />

      {/* Page Header */}
      <div className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl bebas text-black mb-2">
            LIVE CHAT & CUSTOMER SUPPORT
          </h1>
          <div className="w-full h-1 bg-black mb-8"></div>
        </div>
      </div>

      {/* Live Chat Section Header */}
      <div className="px-6 pb-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <span className="text-lg avantbold text-black">LIVE CHAT</span>
            <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm avant">
              {chats.length}
            </span>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border-2 border-black rounded-lg overflow-hidden h-[700px] flex">
            
            {/* Left Panel - Chat List */}
            <div className="w-[35%] border-r-2 border-black flex flex-col">
              {/* Filter and Search */}
              <div className="p-4 border-b border-gray-200">
                {/* Updated Filter Buttons - Chat, Unread, Resolved */}
                <div className="flex gap-1 mb-4">
                  {filterOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedFilter(option.value)}
                      className={`flex-1 px-2 py-2 text-xs avantbold rounded transition-colors ${
                        selectedFilter === option.value
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-black hover:bg-gray-200'
                      }`}
                    >
                      <span className="truncate">
                        {option.label}
                        {option.count > 0 && ` ${option.count}`}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Search */}
                <input
                  type="text"
                  placeholder="Search Conversation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black avant text-sm text-black"
                />
              </div>

              {/* Chat List */}
              <div className="flex-1 overflow-y-auto">
                {filteredChats.map(chat => (
                  <div
                    key={chat.id}
                    onClick={() => handleChatClick(chat.id)}
                    className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
                      selectedChat === chat.id ? 'bg-gray-200' : ''
                    } ${chat.status === 'unread' && chat.unreadCount > 0 ? 'bg-blue-50' : ''} ${
                      activelyAnswering === chat.id ? 'ring-2 ring-yellow-400' : ''
                    }`}
                  >
                    <div className="relative mr-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm avantbold ${
                        chat.status === 'unread' ? 'bg-green-500' :
                        chat.status === 'unanswered' ? 'bg-red-500' :
                        chat.status === 'answered' ? 'bg-blue-500' :
                        'bg-gray-500'
                      }`}>
                        {chat.customerInitials}
                      </div>
                      {chat.status === 'unread' && chat.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-xs avantbold">
                          {chat.unreadCount}
                        </div>
                      )}
                      {activelyAnswering === chat.id && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                          <span className="text-xs">✏️</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm avantbold text-black truncate">{chat.customerName}</h4>
                        <span className="text-xs avant text-gray-500">{chat.timestamp}</span>
                      </div>
                      <p className="text-xs avant text-gray-600 truncate">{getLastMessagePreview(chat)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Center Panel - Chat Messages */}
            <div className="flex-[1.4] flex flex-col">
              {currentChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm avantbold mr-3 ${
                        currentChat.status === 'unread' ? 'bg-green-500' :
                        currentChat.status === 'unanswered' ? 'bg-red-500' :
                        currentChat.status === 'answered' ? 'bg-blue-500' :
                        'bg-gray-500'
                      }`}>
                        {currentChat.customerInitials}
                      </div>
                      <div>
                        <h3 className="text-lg avantbold text-black">{currentChat.customerName}</h3>
                        {activelyAnswering === currentChat.id && (
                          <span className="text-xs text-yellow-600 avantbold">Currently answering...</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={handleMarkAsResolved}
                      className="px-4 py-2 bg-gray-100 text-black rounded hover:bg-gray-200 transition-colors avant text-sm font-medium"
                    >
                      MARK AS RESOLVED
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {currentChat.messages && currentChat.messages.length > 0 ? (
                      currentChat.messages.map(message => {
                        const isAdmin = message.is_from_admin;
                        const messageId = message.chat_id || message.id;
                        const messageText = message.message || message.content || '';
                        
                        return (
                          <div
                            key={messageId}
                            className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[70%] px-4 py-2 rounded-lg ${
                              isAdmin
                                ? 'metallic-bg cream-text'
                                : `${!message.is_read ? 'bg-yellow-100 border-2 border-yellow-300' : 'bg-gray-200'} text-black`
                            }`}>
                              {/* Text content with proper word breaking */}
                              {messageText && (
                                <p className="text-sm avant break-words whitespace-pre-wrap mb-2" style={{ wordBreak: 'break-word' }}>{messageText}</p>
                              )}
                          
                              {/* File display */}
                              {message.files && message.files.length > 0 && (
                                <div className="space-y-2">
                                  {message.files.map((file, index) => (
                                    <div key={index}>
                                      {file.type?.startsWith('image/') ? (
                                        <div>
                                      <img 
                                        src={file.url} 
                                        alt={file.name}
                                        className="max-w-full max-h-48 rounded-lg object-cover"
                                        loading="lazy"
                                      />
                                        <p className="text-xs opacity-75 mt-1">{file.name}</p>
                                        </div>
                                      ) : file.type?.startsWith('video/') ? (
                                        <div>
                                      <video 
                                        src={file.url} 
                                        controls 
                                        className="max-w-full max-h-48 rounded-lg"
                                      >
                                        Your browser does not support the video tag.
                                      </video>
                                        <p className="text-xs opacity-75 mt-1">{file.name}</p>
                                        </div>
                                      ) : (
                                        <div className="flex items-center space-x-2 p-2 bg-gray-100 bg-opacity-20 rounded">
                                      <span className="text-lg">
                                        {file.type === 'application/pdf' ? '📄' : '📎'}
                                      </span>
                                      <div>
                                        <p className="text-xs font-medium">{file.name}</p>
                                        <p className="text-xs opacity-75">{(file.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                      </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              <span className={`text-xs mt-1 block ${
                                isAdmin ? 'cream-text opacity-75' : 'text-gray-500'
                              }`}>
                                {message.created_at 
                                  ? new Date(message.created_at).toLocaleTimeString([], { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })
                                  : message.timestamp || ''}
                                {!message.is_read && !isAdmin && (
                                  <span className="ml-2 text-yellow-600 font-medium">NEW</span>
                                )}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <p className="avant">No messages yet. Start the conversation!</p>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    {selectedFiles.length > 0 && (
                      <div className="mb-2 space-y-2">
                        <div className="text-sm avantbold text-gray-700">Files to send:</div>
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="p-2 bg-gray-100 rounded flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">
                                {file.type.startsWith('image/') ? '🖼️' : 
                                 file.type.startsWith('video/') ? '🎥' : 
                                 file.type === 'application/pdf' ? '📄' : '📎'}
                              </span>
                              <span className="text-sm avant text-gray-700 truncate">
                                {file.name} ({(file.size / 1024).toFixed(1)} KB)
                              </span>
                            </div>
                            <button
                              onClick={() => removeFile(index)}
                              className="text-red-500 hover:text-red-700 text-sm ml-2"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        {selectedFiles.length < 4 && (
                          <p className="text-xs text-gray-500">You can add {4 - selectedFiles.length} more file(s)</p>
                        )}
                      </div>
                    )}
                    <div className="flex items-end space-x-2">
                      <button 
                        onClick={handleFileSelect}
                        disabled={selectedFiles.length >= 4 || !canEdit}
                        title={!canEdit ? 'You do not have permission to send messages or files' : selectedFiles.length >= 4 ? 'Maximum 4 files allowed' : ''}
                        className={`p-2 transition-colors ${
                          selectedFiles.length >= 4 || !canEdit
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-gray-500 hover:text-black'
                        }`}
                      >
                        <img src={AddImage} alt="Add File" className="w-5 h-5" />
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                        multiple
                        className="hidden"
                        disabled={!canEdit}
                      />
                      <textarea
                        ref={textareaRef}
                        placeholder={!canEdit ? "You do not have permission to send messages..." : "Type your message..."}
                        value={getCurrentMessage()}
                        onChange={handleMessageInputChange}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey && canEdit) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        disabled={!canEdit}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black resize-none min-h-[40px] max-h-[120px] overflow-y-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100"
                        rows="1"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!canEdit}
                        title={!canEdit ? 'You do not have permission to send messages' : ''}
                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors avant text-sm font-medium self-end disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
                      >
                        ▶
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                // Default Welcome Screen when no chat is selected
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mb-6">
                    <span className="text-4xl">💬</span>
                  </div>
                  <h3 className="text-2xl avantbold text-gray-800 mb-2">Welcome to Live Chat</h3>
                  <p className="text-gray-600 avant text-lg mb-4">Select a conversation from the left to start chatting</p>
                  <p className="text-gray-500 avant text-sm">Choose any customer conversation to view messages and respond</p>
                </div>
              )}
            </div>

            {/* Right Panel - Automated Replies */}
            <div className="w-[25%] border-l-2 border-black flex flex-col">
              {/* Templates Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm avantbold text-black">AUTOMATED REPLIES</h3>
                </div>
                <button
                  onClick={() => canEdit && setShowTemplateModal(true)}
                  disabled={!canEdit}
                  title={!canEdit ? 'You do not have permission to manage templates' : ''}
                  className={`w-full px-3 py-2 rounded text-xs avant font-medium transition-colors ${
                    !canEdit
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  ADD NEW TEMPLATE
                </button>
              </div>

              {/* Templates List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {templatesLoading ? (
                  <div className="text-center text-gray-500 avant text-sm">Loading templates...</div>
                ) : templates.length === 0 ? (
                  <div className="text-center text-gray-500 avant text-sm">No templates yet. Add one to get started!</div>
                ) : (
                  templates.map(template => (
                    <div key={template.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm avantbold text-black">{template.title}</h4>
                        <div className="flex gap-2">
                          <button
                            onClick={() => canEdit && handleEditTemplateClick(template)}
                            disabled={!canEdit}
                            title={!canEdit ? 'You do not have permission to edit templates' : ''}
                            className={`text-xs avant transition-colors ${
                              !canEdit 
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'text-gray-600 hover:text-black'
                            }`}
                          >
                            EDIT
                          </button>
                          <button
                            onClick={() => canEdit && handleDeleteTemplate(template.id)}
                            disabled={!canEdit}
                            title={!canEdit ? 'You do not have permission to delete templates' : ''}
                            className={`text-xs avant transition-colors ${
                              !canEdit 
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'text-red-600 hover:text-red-800'
                            }`}
                          >
                            DELETE
                          </button>
                        </div>
                      </div>
                      <p className="text-xs avant text-gray-600 mb-2 line-clamp-3">{template.content}</p>
                      {template.keywords && (
                        <p className="text-xs avant text-gray-500 mb-3">
                          <span className="font-medium">Keywords:</span> {template.keywords}
                        </p>
                      )}
                      <button
                        onClick={() => canEdit && handleUseTemplate(template)}
                        disabled={!canEdit}
                        title={!canEdit ? 'You do not have permission to send template messages' : ''}
                        className={`w-full px-3 py-2 rounded transition-colors avant text-xs font-medium ${
                          !canEdit
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-100 text-black hover:bg-gray-200'
                        }`}
                      >
                        USE TEMPLATE
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Template Modal */}
      {showTemplateModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(5px)'
          }}
        >
          <div className="bg-white rounded-2xl border-2 border-black w-full max-w-md mx-4 shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl avantbold text-black">Add New Template</h2>
              <button 
                onClick={() => setShowTemplateModal(false)}
                className="text-2xl text-black hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm avantbold text-black mb-2">TEMPLATE TITLE</label>
                <input
                  type="text"
                  placeholder="e.g., Order Status"
                  value={newTemplate.title}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black placeholder:text-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm avantbold text-black mb-2">REPLY MESSAGE</label>
                <textarea
                  placeholder="Enter your automated reply message here."
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm resize-none text-black placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm avantbold text-black mb-2">TRIGGER KEYWORDS (OPTIONAL)</label>
                <input
                  type="text"
                  placeholder="e.g., order, status, shipping"
                  value={newTemplate.keywords}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, keywords: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black placeholder:text-gray-400"
                />
                <p className="text-xs avant text-gray-500 mt-1">Keywords that will trigger this automated response</p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="flex-1 px-4 py-2 bg-transparent border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors avant text-sm font-medium"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleAddTemplate}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors avant text-sm font-medium"
                >
                  SAVE TEMPLATE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Template Modal */}
      {showEditTemplateModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(5px)'
          }}
        >
          <div className="bg-white rounded-2xl border-2 border-black w-full max-w-md mx-4 shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl avantbold text-black">Edit Template</h2>
              <button 
                onClick={() => setShowEditTemplateModal(false)}
                className="text-2xl text-black hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm avantbold text-black mb-2">TEMPLATE TITLE</label>
                <input
                  type="text"
                  value={editTemplate.title}
                  onChange={(e) => setEditTemplate(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black"
                />
              </div>
              
              <div>
                <label className="block text-sm avantbold text-black mb-2">REPLY MESSAGE</label>
                <textarea
                  value={editTemplate.content}
                  onChange={(e) => setEditTemplate(prev => ({ ...prev, content: e.target.value }))}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm resize-none text-black"
                />
              </div>

              <div>
                <label className="block text-sm avantbold text-black mb-2">TRIGGER KEYWORDS (OPTIONAL)</label>
                <input
                  type="text"
                  value={editTemplate.keywords}
                  onChange={(e) => setEditTemplate(prev => ({ ...prev, keywords: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black"
                />
                <p className="text-xs avant text-gray-500 mt-1">Keywords that will trigger this automated response</p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => setShowEditTemplateModal(false)}
                  className="flex-1 px-4 py-2 bg-transparent border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors avant text-sm font-medium"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleUpdateTemplate}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors avant text-sm font-medium"
                >
                  SAVE TEMPLATE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ show: false, message: '', type: 'error' })}
      />
    </div>
  );
};

export default LiveChat;
