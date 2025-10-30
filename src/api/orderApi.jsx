import apiRequest from './apiRequest';

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
  
  const url = `${baseUrl}${orderId}`;
  return await apiRequest(url, null);
};

export default {
  fetchAllOrders,
  fetchOrdersByStatus,
  updateOrderStatus,
  getOrderDetails
};
