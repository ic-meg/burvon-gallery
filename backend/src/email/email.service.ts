import { Injectable, BadRequestException } from '@nestjs/common';
import { Resend } from 'resend';
import { generateOrderConfirmationEmail, OrderConfirmationEmailData } from './order-confirmation-email.template';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY || '';


    if (apiKey && apiKey !== 're_test_key_here') {
      this.resend = new Resend(apiKey);
    } else {
      throw new BadRequestException('Email service not configured');
    }
  }

  async sendMagicLink(email: string, magicLink: string) {

    if (!this.resend) {
      throw new BadRequestException('Email service not configured');
    }

    try {
      const fromAddress = process.env.RESEND_FROM_EMAIL || 'noreply@burvon-gallery.website';
      const result = await this.resend.emails.send({
        from: fromAddress,
        to: email,
        subject: 'Your BURVON Gallery Login Link',
        html: this.getMagicLinkTemplate(magicLink, email),
      });


      return { success: true, message: 'Magic link sent to email' };
    } catch (error) {
      console.error('❌ Resend error:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      throw new BadRequestException(`Failed to send email: ${error.message}`);
    }
  }

  private getMagicLinkTemplate(magicLink: string, email: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #181818; }
            .subtitle { font-size: 12px; color: #959595; margin-top: 5px; }
            .content { margin: 30px 0; line-height: 1.6; color: #333; }
            .button-container { text-align: center; margin: 40px 0; }
            .button { 
              background-color: #FFF7DC;
              color: #181818;
              padding: 14px 32px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              display: inline-block;
            }
            .button:hover { background-color: #ffe9b3; }
            .footer { 
              text-align: center; 
              margin-top: 40px; 
              padding-top: 20px; 
              border-top: 1px solid #eee;
              font-size: 12px;
              color: #959595;
            }
            .link-text { 
              word-break: break-all; 
              background: #f9f9f9;
              padding: 12px;
              border-radius: 4px;
              font-size: 12px;
              color: #666;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">BURVON</div>
              <div class="subtitle">REVELED BY ALL</div>
            </div>

            <div class="content">
              <p>Hello,</p>
              <p>We received a request to log in to your BURVON Gallery account with this email address: <strong>${email}</strong></p>
              <p>Click the button below to verify your email and log in. This link expires in 15 minutes.</p>
            </div>

            <div class="button-container">
              <a href="${magicLink}" class="button">Verify & Login</a>
            </div>

            <div class="content">
              <p>Or copy and paste this link in your browser:</p>
              <div class="link-text">${magicLink}</div>
            </div>

            <div class="content">
              <p>If you didn't request this email, you can safely ignore it.</p>
              <p>Best regards,<br>The BURVON Team</p>
            </div>

            <div class="footer">
              <p>&copy; 2025 BURVON Gallery. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  async sendOrderConfirmationEmail(data: OrderConfirmationEmailData): Promise<boolean> {
    if (!this.resend) {
      console.error('Resend is not initialized. Skipping order confirmation email.');
      return false;
    }

    try {
      const emailHtml = generateOrderConfirmationEmail(data);
      const fromAddress = process.env.RESEND_FROM_EMAIL || 'noreply@burvon-gallery.website';

      const result = await this.resend.emails.send({
        from: fromAddress,
        to: data.email,
        subject: `Order Confirmation #${data.orderId} - Burvon Gallery`,
        html: emailHtml,
      });

      if (result.error) {
        console.error('Error sending order confirmation email:', result.error);
        return false;
      }


      return true;
    } catch (error) {
      console.error('❌ Failed to send order confirmation email:', error);
      return false;
    }
  }

  async sendOrderStatusUpdateEmail(
    email: string,
    orderId: number,
    customerName: string,
    status: string,
    trackingNumber?: string
  ): Promise<boolean> {
    if (!this.resend) {
      console.error('Resend is not initialized. Skipping order status update email.');
      return false;
    }

    try {
      let statusMessage = '';
      let statusColor = '#fff7dc';

      switch (status) {
        case 'Processing':
          statusMessage = 'Your order is now being processed and will be shipped soon.';
          break;
        case 'Shipped':
          statusMessage = trackingNumber
            ? `Your order has been shipped! Tracking number: ${trackingNumber}`
            : 'Your order has been shipped and is on its way to you!';
          break;
        case 'Delivered':
          statusMessage = 'Your order has been delivered. We hope you enjoy your purchase!';
          break;
        case 'Cancelled':
          statusMessage = 'Your order has been cancelled. If you have any questions, please contact us.';
          statusColor = '#ff6b6b';
          break;
        default:
          statusMessage = `Your order status has been updated to: ${status}`;
      }

      const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Update - Burvon Gallery</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      background-color: #f5f5f5;
    }

    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #181818;
      color: #fff7dc;
    }

    .header {
      text-align: center;
      padding: 40px 20px 20px;
      border-bottom: 2px solid rgba(255, 247, 220, 0.2);
    }

    .header h1 {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 48px;
      margin: 0 0 10px;
      color: #fff7dc;
      letter-spacing: 2px;
    }

    .content {
      padding: 30px 20px;
    }

    .status-badge {
      display: inline-block;
      padding: 12px 24px;
      background-color: rgba(255, 247, 220, 0.1);
      border: 2px solid ${statusColor};
      border-radius: 8px;
      color: ${statusColor};
      font-family: 'Bebas Neue', sans-serif;
      font-size: 24px;
      letter-spacing: 1px;
      margin: 20px 0;
    }

    .order-info {
      background-color: rgba(255, 247, 220, 0.05);
      border: 1px solid rgba(255, 247, 220, 0.2);
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }

    .button {
      display: inline-block;
      padding: 15px 40px;
      background-color: #fff7dc;
      color: #181818;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 700;
      font-size: 16px;
      margin: 20px 0;
      letter-spacing: 1px;
    }

    .footer {
      text-align: center;
      padding: 30px 20px;
      border-top: 2px solid rgba(255, 247, 220, 0.2);
      margin-top: 40px;
    }

    .footer p {
      color: #fff7dc;
      opacity: 0.7;
      font-size: 14px;
      margin: 8px 0;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h2>BURVON GALLERY</h2>
      <p>Order Status Update</p>
    </div>

    <div class="content">
      <p>Hello <strong>${customerName}</strong>,</p>

      <div style="text-align: center;">
        <div class="status-badge">${status.toUpperCase()}</div>
      </div>

      <div class="order-info">
        <p style="margin: 0;"><strong>Order ID:</strong> #${orderId}</p>
        ${trackingNumber ? `<p style="margin: 10px 0 0;"><strong>Tracking Number:</strong> ${trackingNumber}</p>` : ''}
      </div>

      <p style="font-size: 16px; line-height: 1.6;">
        ${statusMessage}
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.VITE_FRONTEND_URL || 'https://burvon-gallery.vercel.app'}/profile/orders" class="button">
          VIEW ORDER DETAILS
        </a>
      </div>

      <p style="margin-top: 30px; font-size: 14px; opacity: 0.8;">
        If you have any questions, please contact us at support@burvongallery.com
      </p>
    </div>

    <div class="footer">
      <p>BURVON GALLERY</p>
      <p>&copy; ${new Date().getFullYear()} Burvon Gallery. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
      `.trim();

      const fromAddress = process.env.RESEND_FROM_EMAIL || 'noreply@burvon-gallery.website';

      const result = await this.resend.emails.send({
        from: fromAddress,
        to: email,
        subject: `Order #${orderId} Update: ${status} - Burvon Gallery`,
        html: emailHtml,
      });

      if (result.error) {
        console.error('Error sending order status update email:', result.error);
        return false;
      }


      return true;
    } catch (error) {
      console.error('Failed to send order status update email:', error);
      return false;
    }
  }
}
