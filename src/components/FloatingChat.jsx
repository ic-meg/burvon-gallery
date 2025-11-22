import { useEffect, useRef, useState, useCallback } from "react";
import whiteIcon from "../assets/icons/customer-service-white.png";
import blackIcon from "../assets/icons/customer-service.png";
import XIcon from "../assets/icons/X.png";
import XWhite from "../assets/icons/x-white.png";
import SentIcon from "../assets/icons/send.png";
import { useWebSocket } from "../hooks/useWebSocket";
import { getChatUserIdentifier, getChatEmail, setChatEmail } from "../utils/chatSession";
import chatApi from "../api/chatApi";
import { getUser } from "../services/authService";

const FloatingChatButton = () => {
  const [overFooter, setOverFooter] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [isAdminOnline, setIsAdminOnline] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const emailInputRef = useRef(null);
  const buttonsContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const chatContainerRef = useRef(null);

  const userIdentifier = getChatUserIdentifier();
  const { isConnected, sendMessage, markAsRead, error: wsError, socket } = useWebSocket(false);


  useEffect(() => {
    if (chatOpen) {
      const user = getUser();
      setCurrentUser(user);
    }
  }, [chatOpen]);

  // Handle keyboard on mobile - move chat up when keyboard appears
  useEffect(() => {
    if (!chatOpen) return;

    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;

    const handleViewportResize = () => {
      if (window.visualViewport && chatContainerRef.current) {
        const keyboardHeight = window.innerHeight - window.visualViewport.height;

        if (keyboardHeight > 150) {
          // Keyboard is open - move chat up
          chatContainerRef.current.style.transform = `translateY(-${keyboardHeight}px)`;
        } else {
          // Keyboard is closed - reset position
          chatContainerRef.current.style.transform = 'translateY(0)';
        }
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportResize);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportResize);
      }
      if (chatContainerRef.current) {
        chatContainerRef.current.style.transform = '';
      }
    };
  }, [chatOpen]);



  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        
        setOverFooter(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px" 
      }
    );

    const footerEl = document.getElementById("footer");
    if (footerEl) {
      observer.observe(footerEl);
    } else {
    }

    return () => {
      if (footerEl) observer.unobserve(footerEl);
    };
  }, []);

  useEffect(() => {
    const checkMenu = () => {
      setMenuOpen(document.body.classList.contains("menu-open"));
    };

    const checkSearchOverlay = () => {
      setSearchOverlayOpen(document.body.classList.contains("search-overlay-open"));
    };

    checkMenu(); 
    checkSearchOverlay();

    const observer = new MutationObserver(() => {
      checkMenu();
      checkSearchOverlay();
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // console.log("Over footer state:", overFooter);
  }, [overFooter]);

  // Track processed message IDs to avoid duplicates
  const processedMessageIds = useRef(new Set());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = useCallback(async () => {
    try {
      let result;
      if (userIdentifier.type === 'user') {
        result = await chatApi.fetchUserChatHistory(userIdentifier.user_id);
      } else {
        const sessionId = userIdentifier.session_id; // Keep the full session_id including 'chat_' prefix
        result = await chatApi.fetchSessionChatHistory(sessionId);
      }

      if (!result.error && result.data) {
        const loadedMessages = result.data.chatMessages || [];
        

        // Set messages from loaded history (this will be the source of truth on refresh)
        setMessages(loadedMessages);
        
        processedMessageIds.current.clear();
        loadedMessages.forEach(msg => {
          if (msg.chat_id) {
            processedMessageIds.current.add(msg.chat_id);
          }
        });
        
        scrollToBottom();
        
        // Check if email exists in messages
        if (loadedMessages.length > 0 && loadedMessages[0].email) {
          setChatEmail(loadedMessages[0].email);
        }
      } else {
        console.error('Failed to load chat history:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  }, [userIdentifier.type, userIdentifier.user_id, userIdentifier.session_id]);

  useEffect(() => {
    if (chatOpen) {
      loadChatHistory();
    }
  }, [chatOpen, loadChatHistory]);

  // Also reload when connection is established (in case chat was already open)
  useEffect(() => {
    if (chatOpen && isConnected) {
      // Small delay to ensure WebSocket is fully ready
      const timer = setTimeout(() => {
        loadChatHistory();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isConnected, chatOpen, loadChatHistory]);

  // Listen for admin online/offline status (always listen, regardless of chatOpen)
  useEffect(() => {
    if (!socket) return;

    const handleAdminOnline = (data) => {

      setIsAdminOnline(true);
    };

    const handleAdminOffline = (data) => {

      setIsAdminOnline(false);
    };

    // Set up listeners
    socket.on('ADMIN_ONLINE', handleAdminOnline);
    socket.on('ADMIN_OFFLINE', handleAdminOffline);

  
    const checkStatusTimeout = setTimeout(() => {
    }, 500);

    return () => {
      clearTimeout(checkStatusTimeout);
      socket.off('ADMIN_ONLINE', handleAdminOnline);
      socket.off('ADMIN_OFFLINE', handleAdminOffline);
    };
  }, [socket, isConnected]);

  // Listen directly to WebSocket NEW_MESSAGE events (only when chat is open)
  useEffect(() => {
    if (!socket || !chatOpen) return;

    const handleNewMessage = (data) => {
      if (data.chatMessage) {
        const newMsg = data.chatMessage;
        const msgId = newMsg.chat_id;
        
        const alreadyProcessed = processedMessageIds.current.has(msgId);
        
        if (!alreadyProcessed) {
          setMessages(prevMessages => {
            const exists = prevMessages.some(msg => msg.chat_id === msgId);
            if (exists) return prevMessages;
            
            // Add new message
            const updated = [...prevMessages, newMsg];
            
            // Sort by created_at to maintain chronological order
            const sorted = updated.sort((a, b) => {
              const dateA = new Date(a.created_at || a.timestamp || 0);
              const dateB = new Date(b.created_at || b.timestamp || 0);
              return dateA - dateB;
            });
            
            processedMessageIds.current.add(msgId);
            scrollToBottom();
            
            if (newMsg.is_from_admin && !newMsg.is_read) {
              markAsRead();
            }
            
            return sorted;
          });
        }
      }
    };

    socket.on('NEW_MESSAGE', handleNewMessage);

    return () => {
      socket.off('NEW_MESSAGE', handleNewMessage);
    };
  }, [socket, chatOpen]);

  useEffect(() => {
    if (chatOpen && userIdentifier.type === 'anonymous' && !getChatEmail()) {
      if (messages.length > 0 && messages[0].email) {
        setChatEmail(messages[0].email);
        setShowEmailInput(false);
      } else {
        setShowEmailInput(true);
      }
    } else if (chatOpen && userIdentifier.type === 'anonymous' && getChatEmail()) {
      setShowEmailInput(false);
    }
  }, [chatOpen, messages, userIdentifier.type]);

  // Focus email input when it appears
  useEffect(() => {
    if (showEmailInput && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [showEmailInput]);

  const handleSendMessage = (messageText = null) => {
    const messageToSend = messageText || inputMessage;
    if (!messageToSend.trim() || !isConnected) return;

    // For anonymous users, check if email is needed
    if (userIdentifier.type === 'anonymous' && !getChatEmail()) {
      setShowEmailInput(true);
      return;
    }

    const email = userIdentifier.email || getChatEmail();
    const success = sendMessage(messageToSend);

    if (success) {
      if (!messageText) {
        setInputMessage("");
      }
      scrollToBottom();
    }
  };

  const handleQuickAction = (message) => {
    handleSendMessage(message);
  };

  // Drag to scroll handlers for recommendation buttons
  const handleMouseDown = (e) => {
    if (!buttonsContainerRef.current) return;
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - buttonsContainerRef.current.offsetLeft);
    setScrollLeft(buttonsContainerRef.current.scrollLeft);
    buttonsContainerRef.current.style.cursor = 'grabbing';
    buttonsContainerRef.current.style.userSelect = 'none';
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !buttonsContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - buttonsContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    
    if (Math.abs(x - startX) > 5) {
      setHasMoved(true);
    }
    
    buttonsContainerRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleMouseUp = useCallback(() => {
    if (!buttonsContainerRef.current) return;
    setIsDragging(false);
    buttonsContainerRef.current.style.cursor = 'grab';
    buttonsContainerRef.current.style.userSelect = '';
    setTimeout(() => setHasMoved(false), 100);
  }, []);

  // Touch handlers for mobile
  const handleTouchStart = (e) => {
    if (!buttonsContainerRef.current) return;
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.touches[0].pageX - buttonsContainerRef.current.offsetLeft);
    setScrollLeft(buttonsContainerRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !buttonsContainerRef.current) return;
    e.preventDefault();
    const x = e.touches[0].pageX - buttonsContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    
    // Check if touch has moved significantly (more than 5px)
    if (Math.abs(x - startX) > 5) {
      setHasMoved(true);
    }
    
    buttonsContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTimeout(() => setHasMoved(false), 100);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.trim())) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setChatEmail(emailInput.trim());
    setShowEmailInput(false);
    setEmailError("");
    setEmailInput("");
    
    // Focus on message input after email is set
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleEmailKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleEmailSubmit(e);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Hide floating chat when menu or search overlay is open
  if (menuOpen || searchOverlayOpen) return null;

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        className={`fixed bottom-6 right-6 z-[1000] w-16 h-16 md:w-20 md:h-20 rounded-full cursor-pointer border-2 border-[#FFF7DC] shadow-md flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all duration-300 ease-in-out ${
          overFooter ? "bg-black" : "cream-bg"
        }`}
        style={{
          filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))"
        }}
        onClick={() => setChatOpen(!chatOpen)}
        aria-label="Customer Support"
      >
        <img
          src={chatOpen ? (overFooter ? XWhite : XIcon) : (overFooter ? whiteIcon : blackIcon)}
          alt={chatOpen ? "Close Chat" : "Chat Icon"}
          className={`w-8 h-8 md:w-10 md:h-10 object-contain transition-all duration-500 ease-out ${chatOpen ? 'scale-110' : 'scale-100'}`}
        />
      </div>

      {/* Fixed Chat Panel */}
      <div
        ref={chatContainerRef}
        className={`fixed bottom-28 right-6 h-[500px] w-96 cream-bg shadow-2xl z-[2000] flex flex-col rounded-lg transition-all duration-800 ease-out overflow-hidden md:bottom-28 md:right-6 md:h-[500px] md:w-96 md:rounded-lg md:shadow-2xl ${
          chatOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'
        } ${
          chatOpen ? 'md:top-auto md:left-auto md:right-6 md:bottom-28 md:h-[500px] md:w-96 md:rounded-lg md:shadow-2xl top-0 left-0 right-0 bottom-0 h-screen w-screen rounded-none shadow-none transition-all duration-800 ease-out' : 'transition-none md:transition-all md:duration-500 md:ease-out'
        }`}
        style={{
          filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))",
          borderRadius: "8px"
        }}
      >
          {/* Header */}
          <div className="metallic-bg text-white p-4 flex items-center justify-between rounded-t-lg md:rounded-t-lg">
            <div className="flex items-center gap-3">
              <img src={whiteIcon} alt="Chat" className="w-6 h-6" />
              <div>
                <h3 className="font-medium bebas text-xl">Chat with burvon</h3>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isAdminOnline && isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className="text-xs text-gray-300">
                    {!isConnected ? 'Connecting...' : isAdminOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Mobile X Button */}
            <button 
              onClick={() => setChatOpen(false)}
              className="md:hidden text-white hover:text-gray-300 transition-colors"
            >
              <img src={XWhite} alt="Close" className="w-6 h-6" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
            {/* Welcome Message - Always shown */}
            <div className="flex justify-start">
              <div className="metallic-bg cream-text rounded-2xl px-4 py-3 max-w-[80%]">
                <p className="text-md avant">
                  Hi{currentUser?.name ? `, ${currentUser.name.split(' ')[0]}` : currentUser?.full_name ? `, ${currentUser.full_name.split(' ')[0]}` : ''}! Welcome to Burvon Support. How can we assist you today?
                </p>
              </div>
            </div>
            
            {/* Chat Messages */}
            {messages.map((message) => (
              <div
                key={message.chat_id}
                className={`flex ${message.is_from_admin ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.is_from_admin
                      ? 'metallic-bg cream-text'
                      : 'metallic-bg cream-text'
                  }`}
                >
                  <p className="text-md avant break-words whitespace-pre-wrap">
                    {message.message}
                  </p>
                  <span className={`text-xs mt-1 block cream-text opacity-75`}>
                    {new Date(message.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Field */}
          <div className="p-4 overflow-hidden">
            {/* Email Input for Anonymous Users */}
            {showEmailInput && userIdentifier.type === 'anonymous' && !getChatEmail() ? (
              <div className="space-y-3">
                <div className="bg-[#4A4C46] rounded-2xl px-4 py-3">
                  <p className="text-sm text-white avant mb-2">
                    To continue chatting, please provide your email address:
                  </p>
                </div>
                <form onSubmit={handleEmailSubmit}>
                  <div className="relative">
                    <input
                      ref={emailInputRef}
                      type="email"
                      value={emailInput}
                      onChange={(e) => {
                        setEmailInput(e.target.value);
                        setEmailError("");
                      }}
                      onKeyPress={handleEmailKeyPress}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black"
                      required
                    />
                    <button
                      type="submit"
                      disabled={!emailInput.trim()}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <img src={SentIcon} alt="Submit" className="w-6 h-6" />
                    </button>
                  </div>
                  {emailError && (
                    <p className="text-xs text-red-500 mt-2">{emailError}</p>
                  )}
                </form>
              </div>
            ) : (
              <>
                {/* Recommended Action Buttons */}
                <div 
                  ref={buttonsContainerRef}
                  className="flex gap-2 mb-3 -mx-4 px-4 py-1 overflow-x-auto cursor-grab active:cursor-grabbing scrollbar-hide"
                  style={{ 
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                  }}
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <button 
                    onClick={(e) => {
                      if (!hasMoved) {
                        handleQuickAction("I have a general inquiry");
                      }
                    }}
                    disabled={!isConnected}
                    className="bg-[#4A4C46] text-white px-4 py-2 rounded-full text-xs avant whitespace-nowrap hover:bg-gray-700 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed select-none"
                  >
                    General Inquiry
                  </button>
                  <button 
                    onClick={(e) => {
                      if (!hasMoved) {
                        handleQuickAction("I'd like to check my order status");
                      }
                    }}
                    disabled={!isConnected}
                    className="bg-[#4A4C46] text-white px-4 py-2 rounded-full text-xs avant whitespace-nowrap hover:bg-gray-700 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed select-none"
                  >
                    Order Status
                  </button>
                  <button 
                    onClick={(e) => {
                      if (!hasMoved) {
                        handleQuickAction("I'd like to try on a product");
                      }
                    }}
                    disabled={!isConnected}
                    className="bg-[#4A4C46] text-white px-4 py-2 rounded-full text-xs avant whitespace-nowrap hover:bg-gray-700 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed select-none"
                  >
                    Try On
                  </button>
                  <button 
                    onClick={(e) => {
                      if (!hasMoved) {
                        handleQuickAction("I need payment assistance");
                      }
                    }}
                    disabled={!isConnected}
                    className="bg-[#4A4C46] text-white px-4 py-2 rounded-full text-xs avant whitespace-nowrap hover:bg-gray-700 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed select-none"
                  >
                    Payment Assistance
                  </button>
                </div>
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Write a message"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={!isConnected}
                    className="w-full px-4 py-3 pr-12 border metallic-text rounded-lg text-md avant focus:outline-none focus:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!isConnected || !inputMessage.trim()}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      filter: "drop-shadow(0 0 6px rgba(255, 255, 255, 0.6))"
                    }}
                  >
                    <img src={SentIcon} alt="Send" className="w-6 h-6" />
                  </button>
                </div>
                {wsError && (
                  <p className="text-xs text-red-500 mt-2">{wsError}</p>
                )}
              </>
            )}
          </div>


        </div>
    </>
  );
};

export default FloatingChatButton;
