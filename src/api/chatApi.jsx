import apiRequest from "./apiRequest";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:3000';
const baseUrl = `${API_URL}/chat`;

const missing = (field) => {
  return { error: `${field} is required`, status: null, data: null };
};

const getAdminAuthToken = () => {
  return localStorage.getItem('adminAuthToken');
};


const getUserAuthToken = () => {
  return localStorage.getItem('authToken');
};


const getAdminAuthHeaders = () => {
  const token = getAdminAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};


const getUserAuthHeaders = () => {
  const token = getUserAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};


const fetchAllConversations = async () => {
  const result = await apiRequest(`${baseUrl}/conversations`, {
    method: 'GET',
    headers: getAdminAuthHeaders(),
  });
  return result;
};

const fetchConversationByIdentifier = async (identifier) => {
  if (!identifier) return missing('identifier');
  const result = await apiRequest(`${baseUrl}/conversation/${identifier}`, {
    method: 'GET',
    headers: getAdminAuthHeaders(),
  });
  return result;
};

const markMessagesAsReadByUser = async (user_id) => {
  if (!user_id) return missing('user_id');
  const result = await apiRequest(`${baseUrl}/mark-read/user/${user_id}`, {
    method: 'POST',
    headers: getAdminAuthHeaders(),
  });
  return result;
};

const markMessagesAsReadBySession = async (session_id) => {
  if (!session_id) return missing('session_id');
  const result = await apiRequest(`${baseUrl}/mark-read/session/${session_id}`, {
    method: 'POST',
    headers: getAdminAuthHeaders(),
  });
  return result;
};

const markConversationAsResolved = async (user_id, session_id, admin_id) => {
  if (!user_id && !session_id) {
    return { error: 'Either user_id or session_id is required', status: null, data: null };
  }
  
  const body = {};
  if (user_id) body.user_id = user_id;
  if (session_id) body.session_id = session_id;
  if (admin_id) body.admin_id = admin_id;
  
  const result = await apiRequest(`${baseUrl}/mark-resolved`, {
    method: 'POST',
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(body),
  });
  return result;
};

const fetchUserChatHistory = async (user_id) => {
  if (!user_id) return missing('user_id');
  const result = await apiRequest(`${baseUrl}/user/${user_id}`, {
    method: 'GET',
    headers: getUserAuthHeaders(),
  });
  return result;
};

const fetchSessionChatHistory = async (session_id) => {
  if (!session_id) return missing('session_id');
  const result = await apiRequest(`${baseUrl}/session/${session_id}`, {
    method: 'GET',
    headers: getUserAuthHeaders(),
  });
  return result;
};

const fetchAllTemplates = async () => {
  const result = await apiRequest(`${baseUrl}/templates`, {
    method: 'GET',
    headers: getAdminAuthHeaders(),
  });
  return result;
};

const fetchTemplateById = async (template_id) => {
  if (!template_id) return missing('template_id');
  const result = await apiRequest(`${baseUrl}/templates/${template_id}`, {
    method: 'GET',
    headers: getAdminAuthHeaders(),
  });
  return result;
};

const createTemplate = async (templateData) => {
  if (!templateData) return missing('templateData');
  const result = await apiRequest(`${baseUrl}/templates`, {
    method: 'POST',
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(templateData),
  });
  return result;
};

const updateTemplate = async (template_id, templateData) => {
  if (!template_id) return missing('template_id');
  if (!templateData) return missing('templateData');
  const result = await apiRequest(`${baseUrl}/templates/${template_id}`, {
    method: 'PATCH',
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(templateData),
  });
  return result;
};

const deleteTemplate = async (template_id) => {
  if (!template_id) return missing('template_id');
  const result = await apiRequest(`${baseUrl}/templates/${template_id}`, {
    method: 'DELETE',
    headers: getAdminAuthHeaders(),
  });
  return result;
};

export default {
  fetchAllConversations,
  fetchConversationByIdentifier,
  markMessagesAsReadByUser,
  markMessagesAsReadBySession,
  markConversationAsResolved,
  fetchUserChatHistory,
  fetchSessionChatHistory,
  fetchAllTemplates,
  fetchTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
};

