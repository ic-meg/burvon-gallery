import { Controller, Get, Post, Body, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly orderService: OrderService) { }

  @Get('paymongo')
  @HttpCode(HttpStatus.OK)
  async testWebhook() {
    return { message: 'Webhook endpoint is working', timestamp: new Date().toISOString() };
  }

  @Post('paymongo')
  @HttpCode(HttpStatus.OK)
  async handlePayMongoWebhook(
    @Body() payload: any,
    @Headers() headers: any,
  ) {
    try {


      const { type, data } = payload;

      switch (type) {
        case 'payment.paid':
          await this.handlePaymentPaid(data);
          break;
        case 'payment.failed':
          await this.handlePaymentFailed(data);
          break;
        case 'checkout_session.completed':
          await this.handleCheckoutSessionCompleted(data);
          break;
        default:
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  private async handlePaymentPaid(data: any) {

    const checkoutSessionId = data.attributes.data?.checkout_session_id;
    const amount = data.attributes.amount;
    const currency = data.attributes.currency;


    let paymentMethod: string | null = null;

    const possibleFields = [
      'payment_method',
      'payment_method_type',
      'payment_method_used',
      'method',
      'type'
    ];

    let methodFound = false;
    for (const field of possibleFields) {
      if (data.attributes[field]) {
        const method = data.attributes[field];

       
        switch (method.toLowerCase()) {
          case 'gcash':
            paymentMethod = 'GCash';
            break;
          case 'grab_pay':
            paymentMethod = 'GrabPay';
            break;
          case 'paymaya':
            paymentMethod = 'PayMaya';
            break;
          case 'card':
            paymentMethod = 'Credit/Debit Card';
            break;
          default:
            paymentMethod = method.charAt(0).toUpperCase() + method.slice(1);
        }
        methodFound = true;
        break;
      }
    }

    if (!methodFound) {
    }

    if (!methodFound && checkoutSessionId) {
      try {
        const apiPaymentMethod = await this.orderService.getPaymentMethodFromPayMongo(checkoutSessionId);
        if (apiPaymentMethod && apiPaymentMethod !== 'PayMongo') {
          paymentMethod = apiPaymentMethod;
        }
      } catch (error) {
      }
    }

    if (checkoutSessionId) {
      try {

        // Create the order using stored temporary data
        const orderCreated = await this.orderService.createOrderFromWebhook(checkoutSessionId, paymentMethod || '');

        if (orderCreated) {
        } else {
        }
      } catch (error) {
      }
    } else {
    }
  }

  private async handlePaymentFailed(data: any) {

    const checkoutSessionId = data.attributes.data?.checkout_session_id;


    if (checkoutSessionId) {
      await this.orderService.updateOrderByCheckoutSession(checkoutSessionId, 'Cancelled');
    }
  }

  private async handleCheckoutSessionCompleted(data: any) {

    const sessionId = data.id;
    const status = data.attributes.status;


  }

  private verifySignature(payload: any, signature: string): boolean {
    return true; 
  }
}
