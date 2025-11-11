# Order Confirmation Email Setup Guide

This guide explains how to set up and use the order confirmation email system using Resend API.

## Features

- **Order Confirmation Email**: Automatically sent when a customer completes payment
- **Order Status Update Email**: Sent when order status changes (Processing, Shipped, Delivered, Cancelled)
- **Theme-Aligned Design**: Emails use your brand colors (#181818 dark background, #fff7dc cream text, Bebas Neue font)
- **Responsive Design**: Works beautifully on mobile and desktop email clients

## Setup Instructions

### 1. Get Resend API Key

1. Go to [Resend.com](https://resend.com) and sign up for a free account
2. Navigate to the API Keys section
3. Create a new API key
4. Copy the API key (it starts with `re_`)

### 2. Configure Your Domain (Optional but Recommended)

For production use, you should verify your domain with Resend:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `burvon-gallery.com`)
4. Add the DNS records provided by Resend to your domain registrar
5. Wait for verification (usually takes a few minutes)

### 3. Update Environment Variables

Add these variables to your `backend/.env` file:

```env
# Resend Email Configuration
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=Burvon Gallery <noreply@burvon-gallery.website>

# Frontend URL (for email links)
VITE_FRONTEND_URL=https://your-production-url.com
```

**Note**:
- If you haven't verified a domain, use the default: `onboarding@resend.dev`
- After domain verification, use: `Burvon Gallery <noreply@yourdomain.com>`

### 4. Test the Email System

#### Option 1: Complete a Real Order (Development)

1. Start your backend server: `cd backend && npm run start:dev`
2. Start your frontend: `npm run dev`
3. Go through the checkout process with test payment
4. Check the email inbox for the confirmation

#### Option 2: Use the Development Endpoint

The backend has a development endpoint to trigger order emails manually:

```bash
# Complete payment simulation for a session
curl -X POST http://localhost:3000/orders/dev/complete-payment/YOUR_SESSION_ID \
  -H "Content-Type: application/json" \
  -d '{"payment_method": "GCash"}'
```

Replace `YOUR_SESSION_ID` with an actual checkout session ID from your database.

## Email Templates

### 1. Order Confirmation Email

**When it's sent**: After successful payment when the webhook receives `payment.paid` event

**Contents**:
- Order ID
- Order date
- Items ordered (with sizes, quantities, and prices)
- Subtotal, shipping cost, and total
- Shipping address
- Payment method
- Link to view order status

### 2. Order Status Update Email

**When it's sent**: When an admin updates the order status

**Triggers**:
- **Processing**: Order is being prepared
- **Shipped**: Order has shipped (includes tracking number)
- **Delivered**: Order has been delivered
- **Cancelled**: Order has been cancelled

## Email Design Preview

Both emails feature:
- Dark background (#181818) with cream text (#fff7dc)
- Bebas Neue font for headings
- Professional layout with borders and sections
- Responsive design for mobile devices
- Clear call-to-action buttons

## Testing with Different Email Providers

Test your emails with various providers to ensure compatibility:

- ✅ Gmail
- ✅ Outlook
- ✅ Apple Mail
- ✅ Yahoo Mail
- ✅ Mobile email clients

## Troubleshooting

### Email Not Sending

1. **Check API Key**: Ensure `RESEND_API_KEY` is set correctly in `.env`
2. **Check Logs**: Look for console messages starting with `✅` (success) or `❌` (error)
3. **Verify Email Service**: Check backend logs for initialization errors

### Email Goes to Spam

1. **Verify Domain**: Use a verified domain instead of `onboarding@resend.dev`
2. **SPF/DKIM**: Ensure DNS records are properly configured
3. **Content**: Avoid spam trigger words in email content

### Domain Verification Issues

1. Wait 24-48 hours for DNS propagation
2. Double-check DNS records match exactly what Resend provides
3. Use a DNS checker tool to verify records are live

## Code Structure

```
backend/src/email/
├── email.module.ts                         # Email module
├── email.service.ts                        # Email service with Resend integration
└── order-confirmation-email.template.ts    # HTML template generator

backend/src/order/
├── order.service.ts                        # Sends emails on order creation/updates
└── webhook.controller.ts                   # Triggers order creation from PayMongo
```

## API Reference

### EmailService Methods

#### `sendOrderConfirmationEmail(data: OrderConfirmationEmailData)`
Sends order confirmation email to customer.

**Parameters**:
- `orderId`: Order ID number
- `customerName`: Customer's full name
- `email`: Customer's email address
- `items`: Array of order items
- `subtotal`: Order subtotal
- `shippingCost`: Shipping cost
- `totalPrice`: Total price
- `shippingAddress`: Full shipping address
- `paymentMethod`: Payment method used
- `orderDate`: Formatted order date

#### `sendOrderStatusUpdateEmail(email, orderId, customerName, status, trackingNumber?)`
Sends order status update email to customer.

**Parameters**:
- `email`: Customer's email address
- `orderId`: Order ID number
- `customerName`: Customer's full name
- `status`: New order status
- `trackingNumber`: Optional tracking number (for shipped orders)

## Monitoring

### Check Email Delivery

1. Log in to [Resend Dashboard](https://resend.com/emails)
2. View all sent emails, delivery status, and open rates
3. Check for bounces or delivery failures

### Backend Logs

Look for these log messages:
- `✅ Order confirmation email sent for order: {orderId}`
- `✅ Order status update email sent for order: {orderId}`
- `❌ Failed to send order confirmation email: {error}`

## Production Checklist

- [ ] Domain verified in Resend
- [ ] `RESEND_API_KEY` set in production environment
- [ ] `RESEND_FROM_EMAIL` updated to use verified domain
- [ ] `VITE_FRONTEND_URL` points to production URL
- [ ] Test orders completed successfully
- [ ] Emails delivered and not in spam
- [ ] All email links work correctly

## Support

For issues with Resend API:
- Documentation: https://resend.com/docs
- Support: https://resend.com/support

For issues with this implementation:
- Check backend logs for error messages
- Verify environment variables are set correctly
- Test with the development endpoint first
