import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: DatabaseService) {}

  async getSalesReport(dateFrom?: string, dateTo?: string, groupBy?: string, orderStatus?: string) {
    const whereClause: any = {};
    
    // Handle groupBy filter to set default date ranges
    if (groupBy && !dateFrom && !dateTo) {
      const now = new Date();
      switch (groupBy) {
        case 'daily':
          // Today's orders
          const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
          whereClause.created_at = {
            gte: startOfDay,
            lt: endOfDay
          };
          break;
        case 'monthly':
          // This month's orders
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          whereClause.created_at = {
            gte: startOfMonth,
            lt: endOfMonth
          };
          break;
        case 'yearly':
          // This year's orders
          const startOfYear = new Date(now.getFullYear(), 0, 1);
          const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
          whereClause.created_at = {
            gte: startOfYear,
            lt: endOfYear
          };
          break;
      }
    } else if (dateFrom || dateTo) {
      whereClause.created_at = {};
      if (dateFrom) whereClause.created_at.gte = new Date(dateFrom);
      if (dateTo) {
        // Add one day to dateTo to include the entire day
        const endDate = new Date(dateTo);
        endDate.setDate(endDate.getDate() + 1);
        whereClause.created_at.lt = endDate;
      }
    }

    if (orderStatus && orderStatus !== 'all') {
      whereClause.status = orderStatus === 'paid' ? 'Paid' : 
                          orderStatus === 'completed' ? 'Completed' : 
                          orderStatus === 'refunded' ? 'Refunded' : orderStatus;
    }

    const orders = await this.prisma.order.findMany({
      where: whereClause,
      include: {
        items: true,
        user: true,
      },
      orderBy: { created_at: 'desc' }
    });

    let fallbackOrders: any[] = [];
    if (orders.length === 0 && groupBy) {
      fallbackOrders = await this.prisma.order.findMany({
        include: {
          items: true,
          user: true,
        },
        orderBy: { created_at: 'desc' },
        take: 10 // Limit to 10 
      });
    }

    const ordersToUse = orders.length > 0 ? orders : fallbackOrders;

    let salesData;

    if (groupBy) {
      // Group orders by the specified time period
      const grouped = new Map();
      
      ordersToUse.forEach(order => {
        let key: string;
        const date = new Date(order.created_at);
        
        switch (groupBy) {
          case 'daily':
            // Format: January 3, 2026
            key = date.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            });
            break;
          case 'monthly':
            // Format: January 2026
            key = date.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long' 
            });
            break;
          case 'yearly':
            // Format: 2026
            key = date.getFullYear().toString();
            break;
          default:
            key = date.toISOString().split('T')[0];
        }

        if (!grouped.has(key)) {
          grouped.set(key, {
            orders: [],
            totalAmount: 0,
            totalItems: 0
          });
        }

        const group = grouped.get(key);
        group.orders.push(order);
        group.totalAmount += Number(order.total_price || 0);
        group.totalItems += order.items.reduce((sum, item) => sum + item.quantity, 0);
      });

      // Convert grouped data to array format
      salesData = Array.from(grouped.entries()).map(([period, data]) => ({
        date: period,
        orderId: `${data.orders.length} orders`,
        customer: `${data.orders.length} customers`,
        itemsSold: data.totalItems,
        totalAmount: data.totalAmount
      }));
    } else {
      // Individual order data for non-grouped view
      salesData = ordersToUse.map(order => ({
        date: order.created_at.toISOString().split('T')[0],
        orderId: order.order_id,
        customer: order.user?.full_name || `${order.first_name} ${order.last_name}`,
        itemsSold: order.items.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount: order.total_price
      }));
    }

    const totalOrders = ordersToUse.length;
    const totalRevenue = ordersToUse.reduce((sum, order) => sum + Number(order.total_price || 0), 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      data: salesData,
      summary: {
        totalOrders,
        totalRevenue,
        averageOrderValue
      }
    };
  }

  async getInventoryReport() {
    const products = await this.prisma.product.findMany({
      include: {
        category: true,
        sizeStocks: true,
      },
      orderBy: { name: 'asc' }
    });

    const inventoryData = products.map(product => {
      const totalStock = product.sizeStocks.length > 0 
        ? product.sizeStocks.reduce((sum, ss) => sum + ss.stock, 0)
        : product.stock;

      const status = totalStock === 0 ? 'Out of Stock' : 
                    totalStock <= 10 ? 'Low Stock' : 'In Stock';

      const lastUpdated = product.sizeStocks.length > 0
        ? Math.max(...product.sizeStocks.map(ss => ss.updated_at.getTime()))
        : product.created_at.getTime();

      // Use current_price if it exists and is not 0, otherwise fall back to original_price
      const displayPrice = (product.current_price && Number(product.current_price) > 0) 
        ? Number(product.current_price) 
        : Number(product.original_price) || 0;

      return {
        productName: product.name,
        category: product.category?.name || 'Uncategorized',
        price: displayPrice,
        stock: totalStock,
        status,
        lastUpdated: new Date(lastUpdated).toISOString().split('T')[0]
      };
    });

    return { data: inventoryData };
  }

  async getLowStockReport(threshold: number = 10) {
    const products = await this.prisma.product.findMany({
      include: {
        category: true,
        sizeStocks: true,
      },
      orderBy: { name: 'asc' }
    });

    const lowStockData = products
      .map(product => {
        const currentStock = product.sizeStocks.length > 0 
          ? product.sizeStocks.reduce((sum, ss) => sum + ss.stock, 0)
          : product.stock;

        // Calculate recommended reorder level based on current stock and business logic
        let reorderLevel: number;
        if (currentStock === 0) {
          reorderLevel = 20; // Urgent restock needed
        } else if (currentStock <= 5) {
          reorderLevel = 25; // High priority restock
        } else if (currentStock <= 10) {
          reorderLevel = 20; // Medium priority restock
        } else {
          reorderLevel = 15; // Standard restock level
        }

        return {
          productName: product.name,
          currentStock,
          reorderLevel,
          status: currentStock === 0 ? 'Out of Stock' : 'Low Stock'
        };
      })
      .filter(item => item.currentStock <= threshold);

    return { data: lowStockData };
  }

  async getTopProductsReport(dateFrom?: string, dateTo?: string, limit: number = 10) {
    const whereClause: any = {};
    
    if (dateFrom || dateTo) {
      whereClause.order = {};
      whereClause.order.created_at = {};
      if (dateFrom) whereClause.order.created_at.gte = new Date(dateFrom);
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setDate(endDate.getDate() + 1);
        whereClause.order.created_at.lt = endDate;
      }
    }

    const orderItems = await this.prisma.orderItem.findMany({
      where: whereClause,
      include: {
        product: {
          include: {
            category: true
          }
        }
      }
    });

    const productStats = new Map();

    orderItems.forEach(item => {
      if (!item.product) return;

      const productId = item.product.product_id;
      if (!productStats.has(productId)) {
        productStats.set(productId, {
          productName: item.product.name,
          category: item.product.category?.name || 'Uncategorized',
          unitsSold: 0,
          totalRevenue: 0
        });
      }

      const stats = productStats.get(productId);
      stats.unitsSold += item.quantity;
      stats.totalRevenue += item.quantity * Number(item.price);
    });

    const topProductsData = Array.from(productStats.values())
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, limit === -1 ? undefined : limit);

    return { data: topProductsData };
  }
}
