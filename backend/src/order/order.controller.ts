import { Controller, Get, Post, Body, Param, Put, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    try {
      const order = await this.orderService.createOrder(createOrderDto);
      return {
        success: true,
        data: order,
        message: 'Order created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to create order',
      };
    }
  }

  @Get('user/:userId')
  async getOrdersByUserId(@Param('userId') userId: string) {
    try {
      const orders = await this.orderService.getOrdersByUserId(parseInt(userId));
      return {
        success: true,
        data: orders,
        message: 'Orders retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve orders',
      };
    }
  }

  @Get(':orderId')
  async getOrderById(@Param('orderId') orderId: string) {
    try {
      const order = await this.orderService.getOrderById(parseInt(orderId));
      if (!order) {
        return {
          success: false,
          message: 'Order not found',
        };
      }
      return {
        success: true,
        data: order,
        message: 'Order retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve order',
      };
    }
  }

  @Put(':orderId')
  async updateOrder(
    @Param('orderId') orderId: string,
    @Body() updateData: any,
  ) {
    try {
      const order = await this.orderService.updateOrder(
        parseInt(orderId),
        updateData,
      );
      return {
        success: true,
        data: order,
        message: 'Order updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to update order',
      };
    }
  }

  @Put(':orderId/status')
  async updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body('status') status: string,
  ) {
    try {
      console.log(`[Order Controller] Received request to update order ${orderId} to status: ${status}`);
      const order = await this.orderService.updateOrderStatus(
        parseInt(orderId),
        status,
      );
      console.log(`[Order Controller] Order ${orderId} updated successfully`);
      return {
        success: true,
        data: order,
        message: 'Order status updated successfully',
      };
    } catch (error) {
      console.log(`[Order Controller] Error updating order ${orderId}:`, error.message);
      return {
        success: false,
        error: error.message,
        message: 'Failed to update order status',
      };
    }
  }

  @Get('session/:sessionId')
  async getOrderByCheckoutSession(@Param('sessionId') sessionId: string) {
    try {
      const order = await this.orderService.getOrderByCheckoutSession(sessionId);
      if (!order) {
        return {
          success: false,
          message: 'Order not found',
        };
      }
      return {
        success: true,
        data: order,
        message: 'Order retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve order',
      };
    }
  }

  @Get('email/:email')
  async getOrdersByEmail(@Param('email') email: string) {
    try {
      const orders = await this.orderService.getOrdersByEmail(email);
      return {
        success: true,
        data: orders,
        message: 'Orders retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve orders',
      };
    }
  }

  @Post('temp')
  async storeTempOrder(@Body() tempOrderData: { checkout_session_id: string; order_data: any }) {
    try {
      const tempOrder = await this.orderService.storeTempOrder(tempOrderData);
      return {
        success: true,
        data: tempOrder,
        message: 'Temporary order data stored successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to store temporary order data',
      };
    }
  }

  @Get('temp/:sessionId')
  async getTempOrder(@Param('sessionId') sessionId: string) {
    try {
      const tempOrder = await this.orderService.getTempOrder(sessionId);
      if (!tempOrder) {
        return {
          success: false,
          message: 'No temporary order data found for this session',
        };
      }
      return {
        success: true,
        data: tempOrder,
        message: 'Temporary order data retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve temporary order data',
      };
    }
  }

  @Post('cleanup-expired-pending')
  async cleanupExpiredPendingOrders() {
    try {
      const result = await this.orderService.cleanupExpiredPendingOrders();
      return {
        success: result.success,
        data: result,
        message: result.success ? 'Expired pending orders cleaned up successfully' : 'Failed to clean up expired pending orders'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to clean up expired pending orders',
      };
    }
  }

  // Admin endpoints
  @Get('admin/all')
  async getAllOrdersForAdmin(@Query('page') page: string = '1', @Query('limit') limit: string = '10') {
    try {
      const orders = await this.orderService.getAllOrdersForAdmin(parseInt(page), parseInt(limit));
      return {
        success: true,
        data: orders,
        message: 'Orders fetched successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch orders',
      };
    }
  }

  @Get('admin/status/:status')
  async getOrdersByStatus(@Param('status') status: string, @Query('page') page: string = '1', @Query('limit') limit: string = '10') {
    try {
      const orders = await this.orderService.getOrdersByStatus(status, parseInt(page), parseInt(limit));
      return {
        success: true,
        data: orders,
        message: 'Orders fetched successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch orders',
      };
    }
  }


  @Get('admin/:orderId')
  async getOrderDetailsForAdmin(@Param('orderId') orderId: string) {
    try {
      const order = await this.orderService.getOrderDetailsForAdmin(parseInt(orderId));
      return {
        success: true,
        data: order,
        message: 'Order details fetched successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch order details',
      };
    }
  }



  @Get()
  async getAllOrders(@Query('status') status?: string) {
    try {
      const orders = await this.orderService.getAllOrders();
      return {
        success: true,
        data: orders,
        message: 'Orders retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve orders',
      };
    }
  }

  @Post('dev/complete-payment/:sessionId')
  async devCompletePayment(@Param('sessionId') sessionId: string, @Body() body: { payment_method?: string }) {
    try {
      const paymentMethod = body.payment_method || 'PayMongo';
      const result = await this.orderService.createOrderFromWebhook(sessionId, paymentMethod);
      
      if (result) {
        return {
          success: true,
          message: 'Order created successfully for development',
          data: { sessionId, paymentMethod }
        };
      } else {
        return {
          success: false,
          message: 'Failed to create order - may already exist or no temp data found'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to create order'
      };
    }
  }


  @Post('create-checkout-session')
  async createCheckoutSession(@Body() orderData: any) {
    try {
      const PAYMONGO_SECRET_KEY = process.env.VITE_PAYMONGO_SECRET_KEY;
      const API_BASE_URL = 'https://api.paymongo.com/v1';
      
      
      if (!PAYMONGO_SECRET_KEY) {
        throw new Error('PayMongo secret key is not configured');
      }

      const requestBody = {
        data: {
          attributes: {
            line_items: orderData.items.map(item => ({
              name: item.name || `Product ${item.product_id}`,
              quantity: item.quantity,
              amount: Math.round(item.price * 100), // Convert to centavos
              currency: 'PHP'
            })),
            payment_method_types: [
              'card',
              'gcash',
              'grab_pay',
              'paymaya'
            ],
            success_url: `${process.env.VITE_FRONTEND_URL || 'http://localhost:5173'}/profile/ordercompleted?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.VITE_FRONTEND_URL || 'http://localhost:5173'}/user/cart/checkout`,
            send_email_receipt: false
          }
        }
      };

      const response = await fetch(`${API_BASE_URL}/checkout_sessions`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(PAYMONGO_SECRET_KEY + ':').toString('base64')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`PayMongo API error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to create checkout session',
      };
    }
  }
}