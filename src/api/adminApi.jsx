import apiRequest from './apiRequest';
import orderApi from './orderApi';
import productApi from './productApi';

const getAdminAuthToken = () => {
  return localStorage.getItem('adminAuthToken');
};

const getAdminAuthHeaders = () => {
  const token = getAdminAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

const missing = (field) => {
  console.error(`Missing required field: ${field}`);
  return { error: `Missing required field: ${field}`, data: null };
};

const fetchAllOrdersForAdmin = async (page = 1, limit = 1000) => {
  if (!import.meta.env.VITE_ORDER_API) return missing("VITE_ORDER_API");
  
  const baseUrl = `${import.meta.env.VITE_ORDER_API}/admin/all`;
  const url = `${baseUrl}?page=${page}&limit=${limit}`;
  
  return await apiRequest(url, {
    method: 'GET',
    headers: getAdminAuthHeaders(),
  });
};

const fetchOrdersByStatus = async (status, page = 1, limit = 1000) => {
  if (!import.meta.env.VITE_ORDER_API) return missing("VITE_ORDER_API");
  if (!status) return missing("status");
  
  const baseUrl = `${import.meta.env.VITE_ORDER_API}/admin/status/${status}`;
  const url = `${baseUrl}?page=${page}&limit=${limit}`;
  
  return await apiRequest(url, {
    method: 'GET',
    headers: getAdminAuthHeaders(),
  });
};

const fetchDashboardStats = async () => {
  try {
    const ordersResponse = await fetchAllOrdersForAdmin(1, 10000);
    if (ordersResponse.error) {
      return { error: ordersResponse.error, data: null };
    }

    const productsResponse = await productApi.fetchAllProducts();
    if (productsResponse.error) {
      return { error: productsResponse.error, data: null };
    }

    let orders = [];
    if (ordersResponse.data) {
      if (ordersResponse.data.data && ordersResponse.data.data.orders) {
        orders = ordersResponse.data.data.orders;
      } else if (ordersResponse.data.orders) {
        orders = ordersResponse.data.orders;
      } else if (Array.isArray(ordersResponse.data)) {
        orders = ordersResponse.data;
      }
    }
    
    let products = [];
    if (productsResponse.data) {
      if (productsResponse.data.products) {
        products = Array.isArray(productsResponse.data.products) 
          ? productsResponse.data.products 
          : [];
      } else if (Array.isArray(productsResponse.data)) {
        products = productsResponse.data;
      }
    }

    // Calculate today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate dates for comparison
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    // Helper function to get order date
    const getOrderDate = (order) => {
      const dateStr = order.created_at || order.createdAt || order.date;
      if (!dateStr) return null;
      return new Date(dateStr);
    };

    // Filter orders by date
    const todayOrders = orders.filter(order => {
      const orderDate = getOrderDate(order);
      if (!orderDate) return false;
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    });

    const weekOrders = orders.filter(order => {
      const orderDate = getOrderDate(order);
      if (!orderDate) return false;
      return orderDate >= weekAgo;
    });

    const yesterdayOrders = orders.filter(order => {
      const orderDate = getOrderDate(order);
      if (!orderDate) return false;
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === yesterday.getTime();
    });

    const lastWeekOrders = orders.filter(order => {
      const orderDate = getOrderDate(order);
      if (!orderDate) return false;
      const lastWeekStart = new Date(weekAgo);
      lastWeekStart.setDate(lastWeekStart.getDate() - 7);
      return orderDate >= lastWeekStart && orderDate < weekAgo;
    });

    // Calculate sales summary (today)
    const todaySales = todayOrders.reduce((sum, order) => {
      return sum + (parseFloat(order.total_price || order.totalPrice || 0));
    }, 0);
    const todayOrderCount = todayOrders.length;

    // Calculate week sales for comparison
    const weekSales = weekOrders.reduce((sum, order) => {
      return sum + (parseFloat(order.total_price || order.totalPrice || 0));
    }, 0);
    const lastWeekSales = lastWeekOrders.reduce((sum, order) => {
      return sum + (parseFloat(order.total_price || order.totalPrice || 0));
    }, 0);
    const salesChange = lastWeekSales > 0 
      ? ((weekSales - lastWeekSales) / lastWeekSales) * 100 
      : 0;

    // Calculate returning customers (this month)
    const thisMonthOrders = orders.filter(order => {
      const orderDate = getOrderDate(order);
      if (!orderDate) return false;
      return orderDate >= monthAgo;
    });
    
    const uniqueCustomersThisMonth = new Set(
      thisMonthOrders
        .map(order => order.user_id || order.userId || order.email)
        .filter(Boolean)
    );
    
    const lastMonthOrders = orders.filter(order => {
      const orderDate = getOrderDate(order);
      if (!orderDate) return false;
      const twoMonthsAgo = new Date(monthAgo);
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 1);
      return orderDate >= twoMonthsAgo && orderDate < monthAgo;
    });
    
    const uniqueCustomersLastMonth = new Set(
      lastMonthOrders
        .map(order => order.user_id || order.userId || order.email)
        .filter(Boolean)
    );
    
    const customerChange = uniqueCustomersLastMonth.size > 0
      ? ((uniqueCustomersThisMonth.size - uniqueCustomersLastMonth.size) / uniqueCustomersLastMonth.size) * 100
      : 0;

    // Calculate top selling products
    const productSales = {};
    orders.forEach(order => {
      const items = order.items || [];
      items.forEach(item => {
        const productId = item.product_id || item.productId;
        const productName = item.name || item.product?.name || 'Unknown';
        if (!productSales[productId]) {
          productSales[productId] = {
            id: productId,
            name: productName,
            sold: 0,
          };
        }
        productSales[productId].sold += item.quantity || 0;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 3);

    // Calculate product sales change
    const thisWeekProductSales = {};
    const lastWeekProductSales = {};
    
    weekOrders.forEach(order => {
      const items = order.items || [];
      items.forEach(item => {
        const productId = item.product_id || item.productId;
        if (!thisWeekProductSales[productId]) {
          thisWeekProductSales[productId] = 0;
        }
        thisWeekProductSales[productId] += item.quantity || 0;
      });
    });

    lastWeekOrders.forEach(order => {
      const items = order.items || [];
      items.forEach(item => {
        const productId = item.product_id || item.productId;
        if (!lastWeekProductSales[productId]) {
          lastWeekProductSales[productId] = 0;
        }
        lastWeekProductSales[productId] += item.quantity || 0;
      });
    });

    const totalThisWeekSales = Object.values(thisWeekProductSales).reduce((a, b) => a + b, 0);
    const totalLastWeekSales = Object.values(lastWeekProductSales).reduce((a, b) => a + b, 0);
    const productSalesChange = totalLastWeekSales > 0
      ? ((totalThisWeekSales - totalLastWeekSales) / totalLastWeekSales) * 100
      : 0;

    // Calculate revenue trends (this week)
    const weekRevenue = weekOrders.reduce((sum, order) => {
      return sum + (parseFloat(order.total_price || order.totalPrice || 0));
    }, 0);
    
    const yesterdayRevenue = yesterdayOrders.reduce((sum, order) => {
      return sum + (parseFloat(order.total_price || order.totalPrice || 0));
    }, 0);
    
    const revenueChange = yesterdayRevenue > 0
      ? ((weekRevenue - yesterdayRevenue) / yesterdayRevenue) * 100
      : 0;

    // Calculate to-do list counts
    const pendingOrders = orders.filter(order => 
      (order.status || '').toLowerCase() === 'pending'
    ).length;

    // Get low stock items (assuming stock field exists)
    const lowStockItems = products.filter(product => {
      const stock = product.stock || product.total_stock || 0;
      return stock > 0 && stock <= 5; // Consider low stock if 5 or less
    }).length;

    // Count return/refund requests (assuming status exists)
    const returnRefundRequests = orders.filter(order => {
      const status = (order.status || '').toLowerCase();
      return status === 'returned' || status === 'refunded' || status === 'refund_requested';
    }).length;

    // Count cancellation requests
    const cancellationRequests = orders.filter(order => {
      const status = (order.status || '').toLowerCase();
      return status === 'cancelled' || status === 'cancellation_requested';
    }).length;

    return {
      error: null,
      data: {
        salesSummary: {
          amount: todaySales,
          orderCount: todayOrderCount,
          change: salesChange,
        },
        returningCustomers: {
          count: uniqueCustomersThisMonth.size,
          change: customerChange,
        },
        topProducts: topProducts,
        productSalesChange: productSalesChange,
        revenueTrends: {
          amount: weekRevenue,
          change: revenueChange,
        },
        todoList: {
          pendingOrders,
          lowStockItems,
          returnRefundRequests,
          cancellationRequests,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return { error: error.message || 'Failed to fetch dashboard statistics', data: null };
  }
};

export default {
  fetchAllOrdersForAdmin,
  fetchOrdersByStatus,
  fetchDashboardStats,
};

