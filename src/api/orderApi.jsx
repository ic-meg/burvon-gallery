import apiRequest from './apiRequest';
import { getAuthToken } from '../services/authService';

const baseUrl = `${import.meta.env.VITE_ORDER_API}/`;

const missing = (field) => {
  console.error(`Missing required field: ${field}`);
  return { error: `Missing required field: ${field}`, data: null };
};

const fetchAllOrders = async () => {
  if (!import.meta.env.VITE_ORDER_API) return missing("VITE_ORDER_API");
  
  const url = `${baseUrl}`;
  return await apiRequest(url, null);
};

const fetchOrdersByStatus = async (status) => {
  if (!import.meta.env.VITE_ORDER_API) return missing("VITE_ORDER_API");
  if (!status) return missing("status");
  
  const url = `${baseUrl}?status=${status}`;
  return await apiRequest(url, null);
};

const updateOrderStatus = async (orderId, status) => {
  if (!import.meta.env.VITE_ORDER_API) return missing("VITE_ORDER_API");
  if (!orderId) return missing("orderId");
  if (!status) return missing("status");
  
  const url = `${baseUrl}${orderId}/status`;
  return await apiRequest(url, {
    method: 'PUT',
    body: JSON.stringify({ status }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

const getOrderDetails = async (orderId) => {
  if (!import.meta.env.VITE_ORDER_API) return missing("VITE_ORDER_API");
  if (!orderId) return missing("orderId");
  
  const token = getAuthToken();
  const url = `${baseUrl}${orderId}`;
  return await apiRequest(url, {
    method: 'GET',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    }
  });
};

const fetchOrdersByUserId = async (userId) => {
  if (!import.meta.env.VITE_ORDER_API) return missing("VITE_ORDER_API");
  if (!userId) return missing("userId");
  
  const token = getAuthToken();
  if (!token) {
    return { error: "Not authenticated", data: null };
  }

  const url = `${baseUrl.replace(/\/$/, '')}/user/${userId}`;
  return await apiRequest(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

const fetchOrdersByEmail = async (email) => {
  if (!import.meta.env.VITE_ORDER_API) return missing("VITE_ORDER_API");
  if (!email) return missing("email");
  
  const token = getAuthToken();
  if (!token) {
    return { error: "Not authenticated", data: null };
  }

  const url = `${baseUrl.replace(/\/$/, '')}/email/${email}`;
  return await apiRequest(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

const getOrderByTrackingNumber = async (trackingNumber) => {
  if (!import.meta.env.VITE_ORDER_API) return missing("VITE_ORDER_API");
  if (!trackingNumber) return missing("trackingNumber");
  
  const url = `${baseUrl.replace(/\/$/, '')}/tracking/${encodeURIComponent(trackingNumber)}`;
  return await apiRequest(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export default {
  fetchAllOrders,
  fetchOrdersByStatus,
  updateOrderStatus,
  getOrderDetails,
  fetchOrdersByUserId,
  fetchOrdersByEmail,
  getOrderByTrackingNumber
};
