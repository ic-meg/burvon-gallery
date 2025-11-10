
export const getChatSessionId = () => {
  let sessionId = localStorage.getItem('chatSessionId');
  
  if (!sessionId) {
    // Generate UUID v4
    sessionId = 'chat_' + crypto.randomUUID();
    localStorage.setItem('chatSessionId', sessionId);
  }
  
  return sessionId;
};

// Get user identifier (user_id if logged in, session_id if anonymous)
export const getChatUserIdentifier = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  if (user && user.user_id) {
    return {
      type: 'user',
      user_id: user.user_id,
      email: user.email,
      name: user.full_name || user.name
    };
  }
  
  return {
    type: 'anonymous',
    session_id: getChatSessionId(),
    email: localStorage.getItem('chatEmail') || null, // Get stored email if available
    name: null
  };
};

export const setChatEmail = (email) => {
  localStorage.setItem('chatEmail', email);
};

export const getChatEmail = () => {
  return localStorage.getItem('chatEmail');
};

export const linkSessionToUser = (user) => {
  const sessionId = localStorage.getItem('chatSessionId');
  if (sessionId && user?.user_id) {
    localStorage.setItem('pendingSessionLink', JSON.stringify({
      session_id: sessionId,
      user_id: user.user_id
    }));
  }
};

