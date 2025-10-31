import React, { useState, useRef, useEffect } from 'react';
import AdminHeader from '../../components/admin/AdminHeader';

import {
  AddVideo,
  AddImage,
  DropDownIconBlack,
  DropUpIconBlack
} from '../../assets/index.js';

const LiveChat = () => {
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
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Sample chat data with logical status assignments
  const [chats, setChats] = useState([
    {
      id: 1,
      customerName: "Meg Fabian",
      customerInitials: "MF",
      lastMessage: "Hi, I need help with my order.",
      lastSender: "customer",
      timestamp: "9:47PM",
      status: "unread",
      unreadCount: 2,
      isOnline: true,
      messages: [
        {
          id: 1,
          sender: "customer",
          content: "Hi, I need help with my order.",
          timestamp: "9:47PM",
          isRead: false
        },
        {
          id: 2,
          sender: "customer", 
          content: "My order number is #3894O123.",
          timestamp: "9:48PM",
          isRead: false
        }
      ]
    },
    {
      id: 2,
      customerName: "Giuliani Calais",
      customerInitials: "GC",
      lastMessage: "Can you help me with sizing?",
      lastSender: "customer",
      timestamp: "9:45PM",
      status: "unanswered",
      unreadCount: 0,
      isOnline: true,
      messages: [
        {
          id: 1,
          sender: "customer",
          content: "Hi there!",
          timestamp: "9:44PM",
          isRead: true
        },
        {
          id: 2,
          sender: "customer",
          content: "Can you help me with sizing?",
          timestamp: "9:45PM",
          isRead: true
        }
      ]
    },
    {
      id: 3,
      customerName: "Sarah Johnson",
      customerInitials: "SJ",
      lastMessage: "You: Thank you for contacting us! Your order has been processed.",
      lastSender: "admin",
      timestamp: "9:40PM",
      status: "answered",
      unreadCount: 0,
      isOnline: false,
      messages: [
        {
          id: 1,
          sender: "customer",
          content: "I want to cancel my order.",
          timestamp: "9:35PM",
          isRead: true
        },
        {
          id: 2,
          sender: "admin",
          content: "I can help you with that. What's your order number?",
          timestamp: "9:36PM",
          isRead: true
        },
        {
          id: 3,
          sender: "customer",
          content: "It's #ORDER789",
          timestamp: "9:37PM",
          isRead: true
        },
        {
          id: 4,
          sender: "admin",
          content: "Thank you for contacting us! Your order has been processed.",
          timestamp: "9:40PM",
          isRead: true
        }
      ]
    },
    {
      id: 4,
      customerName: "Shanley Galo",
      customerInitials: "SG",
      lastMessage: "When will my ring be ready?",
      lastSender: "customer",
      timestamp: "9:30PM",
      status: "unread",
      unreadCount: 1,
      isOnline: false,
      messages: [
        {
          id: 1,
          sender: "customer",
          content: "When will my ring be ready?",
          timestamp: "9:30PM",
          isRead: false
        }
      ]
    },
    {
      id: 5,
      customerName: "Mike Chen",
      customerInitials: "MC",
      lastMessage: "You: The issue has been resolved. Have a great day!",
      lastSender: "admin",
      timestamp: "8:30PM",
      status: "resolved",
      unreadCount: 0,
      isOnline: false,
      messages: [
        {
          id: 1,
          sender: "customer",
          content: "I have a problem with my bracelet.",
          timestamp: "8:25PM",
          isRead: true
        },
        {
          id: 2,
          sender: "admin",
          content: "I'm sorry to hear that. What seems to be the issue?",
          timestamp: "8:26PM",
          isRead: true
        },
        {
          id: 3,
          sender: "customer",
          content: "The clasp is not working properly.",
          timestamp: "8:27PM",
          isRead: true
        },
        {
          id: 4,
          sender: "admin",
          content: "The issue has been resolved. Have a great day!",
          timestamp: "8:30PM",
          isRead: true
        }
      ]
    }
  ]);

  // Automated reply templates
  const [templates, setTemplates] = useState([
    {
      id: 1,
      title: "GREETING",
      content: "Hello! Welcome to Burvon Jewelry. How can I help you today?",
      keywords: "hello, hi, start"
    },
    {
      id: 2,
      title: "ORDER STATUS",
      content: "To check a customer's order status and will tell you the confirmation method. track your confirmation. Thank you!\n\nRegards, sales team, where is my order tracking",
      keywords: "order, status, shipping"
    }
  ]);

  // Updated filter options - Chat includes all except resolved, Unread only unread messages, Resolved only resolved
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

  // Get filtered chats with updated logic
  const filteredChats = chats.filter(chat => {
    const matchesFilter = selectedFilter === 'CHAT' ? 
      chat.status !== 'resolved' : 
      chat.status.toLowerCase() === selectedFilter.toLowerCase();
    const matchesSearch = chat.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Get current chat
  const currentChat = chats.find(chat => chat.id === selectedChat);

  // Get current message for this chat
  const getCurrentMessage = () => {
    return messagesByChat[selectedChat] || '';
  };

  // Set message for current chat
  const setCurrentMessage = (message) => {
    setMessagesByChat(prev => ({
      ...prev,
      [selectedChat]: message
    }));
  };

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  // Handle file selection
  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // Handle file upload (multiple files up to 4)
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.slice(0, 4 - selectedFiles.length);
    
    if (newFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...newFiles].slice(0, 4));
    }
  };

  // Remove selected file
  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle chat click with improved status management
  const handleChatClick = (chatId) => {
    // Update previously opened chats to move them to unanswered if they were unread
    if (selectedChat && selectedChat !== chatId && selectedChat !== activelyAnswering) {
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === selectedChat && chat.status === 'unread' && previouslyOpenedChats.has(selectedChat)
            ? { ...chat, status: 'unanswered' }
            : chat
        )
      );
    }

    // Set new selected chat and mark as opened
    setSelectedChat(chatId);
    setLastOpenedChat(chatId);
    setPreviouslyOpenedChats(prev => new Set([...prev, chatId]));
    
    // Mark messages as read but don't change status immediately
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId 
          ? { 
              ...chat, 
              unreadCount: 0,
              messages: chat.messages.map(msg => ({ ...msg, isRead: true }))
            }
          : chat
      )
    );
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

  // Handle send message with file display - moves chat to "answered" tab
  const handleSendMessage = () => {
    const currentMessage = getCurrentMessage();
    if ((!currentMessage.trim() && selectedFiles.length === 0) || !currentChat) return;

    const newMsg = {
      id: currentChat.messages.length + 1,
      sender: "admin",
      content: currentMessage || '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      files: selectedFiles.map(file => ({
        ...file,
        url: createFilePreview(file),
        type: file.type,
        name: file.name,
        size: file.size
      })),
      isRead: true
    };

    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === selectedChat 
          ? { 
              ...chat, 
              messages: [...chat.messages, newMsg],
              lastMessage: currentMessage || `You: Sent ${selectedFiles.length} file(s)`,
              lastSender: "admin",
              timestamp: newMsg.timestamp,
              status: 'answered'
            }
          : chat
      )
    );

    // Clear message for this chat
    setCurrentMessage('');
    setSelectedFiles([]);
    setActivelyAnswering(null);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // Handle mark as resolved
  const handleMarkAsResolved = () => {
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === selectedChat 
          ? { ...chat, status: 'resolved' }
          : chat
      )
    );
    setActivelyAnswering(null);
  };

  // Handle use template
  const handleUseTemplate = (template) => {
    setCurrentMessage(template.content);
    
    // Mark as actively answering when using template
    if (currentChat && currentChat.status === 'unread') {
      setActivelyAnswering(currentChat.id);
    }
    
    setTimeout(() => adjustTextareaHeight(), 0);
  };

  // Handle edit template
  const handleEditTemplateClick = (template) => {
    setEditTemplate({
      id: template.id,
      title: template.title,
      content: template.content,
      keywords: template.keywords
    });
    setShowEditTemplateModal(true);
  };

  // Handle add template
  const handleAddTemplate = () => {
    if (!newTemplate.title.trim() || !newTemplate.content.trim()) return;

    const template = {
      id: templates.length + 1,
      title: newTemplate.title,
      content: newTemplate.content,
      keywords: newTemplate.keywords
    };

    setTemplates(prev => [...prev, template]);
    setNewTemplate({ title: '', content: '', keywords: '' });
    setShowTemplateModal(false);
  };

  // Handle update template
  const handleUpdateTemplate = () => {
    if (!editTemplate.title.trim() || !editTemplate.content.trim()) return;

    setTemplates(prev => 
      prev.map(template => 
        template.id === editTemplate.id 
          ? { 
              ...template, 
              title: editTemplate.title,
              content: editTemplate.content,
              keywords: editTemplate.keywords
            }
          : template
      )
    );
    setShowEditTemplateModal(false);
    setEditTemplate({ id: null, title: '', content: '', keywords: '' });
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
                    {currentChat.messages.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] px-4 py-2 rounded-lg ${
                          message.sender === 'admin'
                            ? 'bg-black text-white'
                            : `${!message.isRead ? 'bg-yellow-100 border-2 border-yellow-300' : 'bg-gray-200'} text-black`
                        }`}>
                          {/* Text content with proper word breaking */}
                          {message.content && (
                            <p className="text-sm avant break-words whitespace-pre-wrap mb-2" style={{ wordBreak: 'break-word' }}>{message.content}</p>
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
                            message.sender === 'admin' ? 'text-gray-300' : 'text-gray-500'
                          }`}>
                            {message.timestamp}
                            {!message.isRead && message.sender === 'customer' && (
                              <span className="ml-2 text-yellow-600 font-medium">NEW</span>
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
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
                        disabled={selectedFiles.length >= 4}
                        className={`p-2 transition-colors ${
                          selectedFiles.length >= 4 
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
                      />
                      <textarea
                        ref={textareaRef}
                        placeholder="Type your message..."
                        value={getCurrentMessage()}
                        onChange={handleMessageInputChange}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black resize-none min-h-[40px] max-h-[120px] overflow-y-auto"
                        rows="1"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors avant text-sm font-medium self-end"
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
                  onClick={() => setShowTemplateModal(true)}
                  className="w-full px-3 py-2 bg-black text-white rounded text-xs avant font-medium hover:bg-gray-800 transition-colors"
                >
                  ADD NEW TEMPLATE
                </button>
              </div>

              {/* Templates List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {templates.map(template => (
                  <div key={template.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm avantbold text-black">{template.title}</h4>
                      <button
                        onClick={() => handleEditTemplateClick(template)}
                        className="text-xs avant text-gray-600 hover:text-black"
                      >
                        EDIT
                      </button>
                    </div>
                    <p className="text-xs avant text-gray-600 mb-2 line-clamp-3">{template.content}</p>
                    <p className="text-xs avant text-gray-500 mb-3">
                      <span className="font-medium">Keywords:</span> {template.keywords}
                    </p>
                    <button
                      onClick={() => handleUseTemplate(template)}
                      className="w-full px-3 py-2 bg-gray-100 text-black rounded hover:bg-gray-200 transition-colors avant text-xs font-medium"
                    >
                      USE TEMPLATE
                    </button>
                  </div>
                ))}
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
    </div>
  );
};

export default LiveChat;
