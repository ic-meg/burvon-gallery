import apiRequest from './apiRequest';

const baseUrl = `${import.meta.env.VITE_REPORTS_API || 'http://localhost:3000/reports'}`;

const missing = (field) => {
  console.error(`Missing required field: ${field}`);
  return { error: `Missing required field: ${field}`, data: null };
};

export const reportsApi = {
  getSalesReport: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.groupBy) params.append('groupBy', filters.groupBy);
    if (filters.orderStatus && filters.orderStatus !== 'all') {
      params.append('orderStatus', filters.orderStatus);
    }
    
    const queryString = params.toString();
    const url = `${baseUrl}/sales${queryString ? `?${queryString}` : ''}`;
    return await apiRequest(url, null);
  },

  getInventoryReport: async () => {
    const url = `${baseUrl}/inventory`;
    return await apiRequest(url, null);
  },

  getLowStockReport: async (threshold = 10) => {
    const url = `${baseUrl}/low-stock?threshold=${threshold}`;
    return await apiRequest(url, null);
  },

  getTopProductsReport: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.limit) params.append('limit', filters.limit);
    
    const queryString = params.toString();
    const url = `${baseUrl}/top-products${queryString ? `?${queryString}` : ''}`;
    return await apiRequest(url, null);
  }
};