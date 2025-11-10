import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateOrderDto, OrderStatus } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  private processingSessions = new Set<string>();

  constructor(private prisma: DatabaseService) { }

  async createOrder(createOrderDto: CreateOrderDto) {
    const {
      items,
      user_id,
      email,
      first_name,
      last_name,
      street_address,
      barangay,
      city_municipality,
      province_region,
      postal_code,
      phone,
      notes,
      shipping_method,
      payment_method,
      total_price,
      shipping_cost,
      checkout_session_id,
    } = createOrderDto;

    if (!checkout_session_id) {
      throw new Error('Checkout session ID is required to create an order');
    }

    await this.reduceStockForItems(items);

    const order = await this.prisma.order.create({
      data: {
        user_id: user_id || null,
        email: email,
        first_name: first_name,
        last_name: last_name,
        street_address: street_address,
        barangay: barangay,
        city_municipality: city_municipality,
        province_region: province_region,
        postal_code: postal_code,
        phone: phone,
        notes: notes || null,
        shipping_address: `${street_address}, ${barangay}, ${city_municipality}, ${province_region} ${postal_code}`,
        shipping_method: shipping_method as any,
        payment_method: payment_method,
        total_price: total_price,
        shipping_cost: shipping_cost,
        checkout_session_id: checkout_session_id,
        status: 'Pending',
        items: {
          create: items.map((item) => ({
            product_id: item.product_id,
            name: item.name || null,
            quantity: item.quantity,
            price: item.price,
            size: item.size || null,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    return order;
  }

  private async reduceStockForItems(items: any[]) {
    for (const item of items) {
      const { product_id, quantity, size } = item;

      if (size) {
        let sizeStock = await this.prisma.sizeStock.findUnique({
          where: {
            product_id_size: {
              product_id: product_id,
              size: size,
            },
          },
        });

        if (!sizeStock && !size.startsWith('Size ')) {
          sizeStock = await this.prisma.sizeStock.findUnique({
            where: {
              product_id_size: {
                product_id: product_id,
                size: `Size ${size}`,
              },
            },
          });
        }

        if (sizeStock) {
          if (sizeStock.stock < quantity) {
            throw new Error(
              `Insufficient stock for size ${size} of product ${product_id}. Available: ${sizeStock.stock}, Requested: ${quantity}`,
            );
          }

          await this.prisma.sizeStock.update({
            where: {
              product_id_size: {
                product_id: product_id,
                size: sizeStock.size,
              },
            },
            data: {
              stock: sizeStock.stock - quantity,
            },
          });

          // Log inventory change
          await this.prisma.inventory.create({
            data: {
              product_id: product_id,
              quantity: -quantity, 
              change_type: 'sale',
              note: `Order: Reduced stock for size ${size}`,
            },
          });
        } else {
          const product = await this.prisma.product.findUnique({
            where: { product_id: product_id },
          });

          if (!product) {
            throw new Error(`Product ${product_id} not found`);
          }

          if (product.stock < quantity) {
            throw new Error(
              `Insufficient stock for product ${product_id}. Available: ${product.stock}, Requested: ${quantity}`,
            );
          }

     
          await this.prisma.product.update({
            where: { product_id: product_id },
            data: {
              stock: product.stock - quantity,
            },
          });

          // Log inventory change
          await this.prisma.inventory.create({
            data: {
              product_id: product_id,
              quantity: -quantity, 
              change_type: 'sale',
              note: `Order: Reduced general stock (size ${size} not in size-specific inventory)`,
            },
          });
        }
      } else {
        const product = await this.prisma.product.findUnique({
          where: { product_id: product_id },
        });

        if (!product) {
          throw new Error(`Product ${product_id} not found`);
        }

        if (product.stock < quantity) {
          throw new Error(
            `Insufficient stock for product ${product_id}. Available: ${product.stock}, Requested: ${quantity}`,
          );
        }

      
        await this.prisma.product.update({
          where: { product_id: product_id },
          data: {
            stock: product.stock - quantity,
          },
        });

        // Log inventory change
        await this.prisma.inventory.create({
          data: {
            product_id: product_id,
            quantity: -quantity, 
            change_type: 'sale',
            note: 'Order: Reduced general stock',
          },
        });
      }
    }
  }

  async getOrdersByUserId(userId: number) {
    return this.prisma.order.findMany({
      where: {
        user_id: userId,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                collection: true,
                category: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async getOrderById(orderId: number) {
    return this.prisma.order.findUnique({
      where: {
        order_id: orderId,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                collection: true,
                category: true,
              },
            },
          },
        },
        user: true,
      },
    });
  }

  async getAllOrders() {
    return this.prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async getOrderByCheckoutSession(checkoutSessionId: string) {
    return this.prisma.order.findFirst({
      where: { checkout_session_id: checkoutSessionId },
      include: {
        items: {
          include: {
            product: {
              include: {
                collection: true,
                category: true,
              },
            },
          },
        },
        user: true,
      },
    });
  }

  async getOrdersByEmail(email: string) {
    return this.prisma.order.findMany({
      where: { email: email },
      include: {
        items: {
          include: {
            product: {
              include: {
                collection: true,
                category: true,
              },
            },
          },
        },
        user: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async getOrderByTrackingNumber(trackingNumber: string) {
    return this.prisma.order.findFirst({
      where: { tracking_number: trackingNumber },
      include: {
        items: {
          include: {
            product: {
              include: {
                collection: true,
                category: true,
              },
            },
          },
        },
        user: true,
      },
    });
  }

  async updateOrder(orderId: number, updateData: any) {
    const data: any = { ...updateData };

    if (data.status === 'Shipped') {
      const trackingNumber =
        'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase();
      if (!data.tracking_number) {
        data.tracking_number = trackingNumber;
      }
      if (!data.shipped_date) {
        data.shipped_date = new Date();
      }
    }

    if (data.status === 'Delivered') {
      if (!data.delivered_date) {
        data.delivered_date = new Date();
      }
    }

    const order = await this.prisma.order.update({
      where: { order_id: orderId },
      data,
      include: {
        items: { include: { product: true } },
        user: true,
      },
    });

    if (data.status === 'Shipped' && !(order as any).tracking_number) {
      throw new Error('Failed to save tracking number to database');
    }

    return order;
  }

  async updateOrderByCheckoutSession(
    checkoutSessionId: string,
    status: string,
    paymentMethod?: string,
  ) {
    const updateData: any = { status };
    if (paymentMethod) {
      updateData.payment_method = paymentMethod;
    }

    return await this.prisma.order.updateMany({
      where: { checkout_session_id: checkoutSessionId },
      data: updateData,
    });
  }

  async storeTempOrder(tempOrderData: {
    checkout_session_id: string;
    order_data: any;
  }) {
    const { checkout_session_id, order_data } = tempOrderData;

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); 

    try {
      await this.prisma.pendingOrder.create({
        data: {
          checkout_session_id,
          order_data,
          expires_at: expiresAt,
        },
      });

      return { success: true, checkout_session_id };
    } catch (error) {
      console.error('Error storing temp order:', error);
      return { success: false, error: error.message };
    }
  }

  async getTempOrder(checkoutSessionId: string) {
    
    try {
      const tempOrder = await this.prisma.pendingOrder.findUnique({
        where: { checkout_session_id: checkoutSessionId },
      });
      

      if (!tempOrder) {
        
        return null;
      }

      if (new Date() > tempOrder.expires_at) {
        
        // Delete expired order
        await this.prisma.pendingOrder.delete({
          where: { checkout_session_id: checkoutSessionId },
        });
        return null;
      }

      
      // Parse if it's a string (JSON was stringified)
      const orderData = typeof tempOrder.order_data === 'string' 
        ? JSON.parse(tempOrder.order_data) 
        : tempOrder.order_data;
      return orderData;
    } catch (error) {
      
      return null;
    }
  }

  async getDebugTempOrders() {
    try {
      const tempOrders = await this.prisma.pendingOrder.findMany({
        orderBy: { created_at: 'desc' },
      });

      return {
        count: tempOrders.length,
        orders: tempOrders.map((order) => ({
          checkout_session_id: order.checkout_session_id,
          order_data: order.order_data,
          expires_at: order.expires_at,
          is_expired: new Date() > order.expires_at,
          created_at: order.created_at,
        })),
      };
    } catch (error) {
      console.error('Error getting debug temp orders:', error);
      return { count: 0, orders: [] };
    }
  }

  async cleanupExpiredPendingOrders() {
    try {
      const now = new Date();
      const deletedCount = await this.prisma.pendingOrder.deleteMany({
        where: {
          expires_at: {
            lt: now,
          },
        },
      });

      return { success: true, deletedCount: deletedCount.count };
    } catch (error) {
      console.error('Error cleaning up expired pending orders:', error);
      return { success: false, error: error.message };
    }
  }

  async createOrderFromWebhook(
    checkoutSessionId: string,
    paymentMethod: string,
  ) {
    
    try {
      if (this.processingSessions.has(checkoutSessionId)) {
        
        return false;
      }

      
      this.processingSessions.add(checkoutSessionId);

      try {
        
        const existingOrder = await this.prisma.order.findFirst({
          where: { checkout_session_id: checkoutSessionId },
        });

        if (existingOrder) {
          
          return true; 
        }

        
        const orderData = await this.getTempOrder(checkoutSessionId);

        if (!orderData) {
          console.error(
            `[ORDER SERVICE] No temp order data found for session: ${checkoutSessionId}`,
          );
          
          const availableSessions = await this.prisma.pendingOrder.findMany({
            select: { checkout_session_id: true },
          });
          console.error(
            `[ORDER SERVICE] Available sessions: ${availableSessions.map((s) => s.checkout_session_id).join(', ')}`,
          );
          return false;
        }

        
        // Transform the order data to match CreateOrderDto format
        const orderDataTyped = orderData as any;
        const finalOrderData = {
          user_id: undefined,
          email: orderDataTyped.email,
          first_name: orderDataTyped.first_name,
          last_name: orderDataTyped.last_name,
          street_address: orderDataTyped.street_address,
          barangay: orderDataTyped.barangay,
          city_municipality: orderDataTyped.city_municipality,
          province_region: orderDataTyped.province_region,
          postal_code: orderDataTyped.postal_code,
          phone: orderDataTyped.phone,
          notes: orderDataTyped.notes || null,
          shipping_method: orderDataTyped.shipping_method,
          payment_method: paymentMethod,
          total_price: orderDataTyped.total_price,
          shipping_cost: orderDataTyped.shipping_cost,
          checkout_session_id: orderDataTyped.checkout_session_id,
          items: orderDataTyped.items || [],
        };

        const order = await this.createOrder(finalOrderData);

        // Clean up temporary data
        try {
          
          await this.prisma.pendingOrder.delete({
            where: { checkout_session_id: checkoutSessionId },
          });
          
        } catch (cleanupError) {
          console.error(
            `[ORDER SERVICE] Error cleaning up pending order for session ${checkoutSessionId}:`,
            cleanupError,
          );
        }

        
        return true;
      } finally {
        this.processingSessions.delete(checkoutSessionId);
      }
    } catch (error) {
      
      this.processingSessions.delete(checkoutSessionId);
      return false;
    }
  }

  async getPaymentMethodFromPayMongo(
    checkoutSessionId: string,
  ): Promise<string> {
    try {
      const paymongoSecretKey = process.env.VITE_PAYMONGO_SECRET_KEY;
      if (!paymongoSecretKey) {
        throw new Error('PayMongo secret key not configured');
      }

      const paymentIntentsResponse = await fetch(
        `https://api.paymongo.com/v1/payment_intents?filter[checkout_session_id]=${checkoutSessionId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Basic ${Buffer.from(paymongoSecretKey + ':').toString('base64')}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (paymentIntentsResponse.ok) {
        const paymentIntentsData = await paymentIntentsResponse.json();

        if (paymentIntentsData.data && paymentIntentsData.data.length > 0) {
          const paymentIntent = paymentIntentsData.data[0];
          if (paymentIntent.attributes.payment_method) {
            const method = paymentIntent.attributes.payment_method;

            switch (method.toLowerCase()) {
              case 'gcash':
                return 'GCash';
              case 'grab_pay':
                return 'GrabPay';
              case 'paymaya':
                return 'PayMaya';
              case 'card':
                return 'Credit/Debit Card';
              default:
                return method.charAt(0).toUpperCase() + method.slice(1);
            }
          }
        }
      }

      const response = await fetch(
        `https://api.paymongo.com/v1/checkout_sessions/${checkoutSessionId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Basic ${Buffer.from(paymongoSecretKey + ':').toString('base64')}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`PayMongo API error: ${response.status}`);
      }

      const data = await response.json();
      const session = data.data;

      if (session.attributes.payment_method_allowed) {
        const allowedMethods = session.attributes.payment_method_allowed;

        // E-Wallets
        if (allowedMethods.includes('gcash')) return 'GCash';
        if (allowedMethods.includes('grab_pay')) return 'GrabPay';
        if (allowedMethods.includes('paymaya')) return 'PayMaya';

        // Credit/Debit Cards
        if (allowedMethods.includes('card')) return 'Credit/Debit Card';
      }

      return 'PayMongo'; // Fallback
    } catch (error) {
      return 'PayMongo'; 
    }
  }

  // Admin methods
  async getAllOrdersForAdmin(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        skip,
        take: limit,
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      }),
      this.prisma.order.count(),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOrdersByStatus(
    status: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { status: status as any },
        skip,
        take: limit,
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      }),
      this.prisma.order.count({
        where: { status: status as any },
      }),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateOrderStatus(orderId: number, status: string) {
    // here, we generate tracking number when marked as shipped. 
    let trackingNumber: string | null = null;
    if (status === 'Shipped') {
      trackingNumber =
        'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase();
      if (!trackingNumber || trackingNumber.length < 10) {
        throw new Error('Failed to generate valid tracking number');
      }
    }

    const order = await this.prisma.order.update({
      where: { order_id: orderId },
      data: {
        status: status as any,
        ...(status === 'Shipped' && {
          tracking_number: trackingNumber,
          shipped_date: new Date(),
        }),
        ...(status === 'Delivered' && { delivered_date: new Date() }),
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

   
    if (status === 'Shipped') {
      if (!(order as any).tracking_number) {
        throw new Error('Failed to save tracking number to database');
      }
    }

    return order;
  }

  async getOrderDetailsForAdmin(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { order_id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
        refunds: true,
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }
}

