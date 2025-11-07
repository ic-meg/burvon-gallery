import apiRequest from './apiRequest';
import { getAuthToken } from '../services/authService';

const baseUrl = `${import.meta.env.VITE_API_URL?.replace(/\/$/, '')}/user`;

const missing = (field) => {
  console.error(`Missing required field: ${field}`);
  return { error: `Missing required field: ${field}`, data: null };
};

const fetchUserProfile = async (userId) => {
  if (!import.meta.env.VITE_API_URL) return missing("VITE_API_URL");
  if (!userId) return missing("userId");
  
  const token = getAuthToken();
  if (!token) {
    return { error: "Not authenticated", data: null };
  }

  const url = `${baseUrl}/${userId}`;
  return await apiRequest(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

const updateUserProfile = async (userId, updateData) => {
  if (!import.meta.env.VITE_API_URL) return missing("VITE_API_URL");
  if (!userId) return missing("userId");
  if (!updateData) return missing("updateData");
  
  const token = getAuthToken();
  if (!token) {
    return { error: "Not authenticated", data: null };
  }

  const url = `${baseUrl}/${userId}`;
  return await apiRequest(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateData)
  });
};

const fetchUserOrders = async (userId) => {
  if (!import.meta.env.VITE_ORDER_API) return missing("VITE_ORDER_API");
  if (!userId) return missing("userId");
  
  const token = getAuthToken();
  if (!token) {
    return { error: "Not authenticated", data: null };
  }

  const url = `${import.meta.env.VITE_ORDER_API?.replace(/\/$/, '')}/orders/user/${userId}`;
  return await apiRequest(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

export default {
  fetchUserProfile,
  updateUserProfile,
  fetchUserOrders
};

