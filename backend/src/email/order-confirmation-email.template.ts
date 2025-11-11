export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  size?: string;
}

export interface OrderConfirmationEmailData {
  orderId: number;
  customerName: string;
  email: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  totalPrice: number;
  shippingAddress: string;
  paymentMethod: string;
  orderDate: string;
}

export function generateOrderConfirmationEmail(data: OrderConfirmationEmailData): string {
  const { orderId, customerName, email, items, subtotal, shippingCost, totalPrice, shippingAddress, paymentMethod, orderDate } = data;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - Burvon Gallery</title>
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

    .header p {
      font-size: 16px;
      margin: 5px 0;
      color: #fff7dc;
      opacity: 0.9;
    }

    .content {
      padding: 30px 20px;
    }

    .section-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 28px;
      color: #fff7dc;
      margin: 30px 0 15px;
      letter-spacing: 1px;
      border-bottom: 1px solid rgba(255, 247, 220, 0.2);
      padding-bottom: 8px;
    }

    .order-info {
      background-color: rgba(255, 247, 220, 0.05);
      border: 1px solid rgba(255, 247, 220, 0.2);
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }

    .order-info-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid rgba(255, 247, 220, 0.1);
    }

    .order-info-row:last-child {
      border-bottom: none;
    }

    .order-info-label {
      font-weight: 600;
      color: #fff7dc;
      opacity: 0.8;
    }

    .order-info-value {
      color: #fff7dc;
      text-align: right;
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }

    .items-table th {
      font-family: 'Bebas Neue', sans-serif;
      background-color: rgba(255, 247, 220, 0.1);
      color: #fff7dc;
      padding: 12px 8px;
      text-align: left;
      border-bottom: 2px solid rgba(255, 247, 220, 0.3);
      font-size: 16px;
      letter-spacing: 1px;
    }

    .items-table td {
      padding: 15px 8px;
      border-bottom: 1px solid rgba(255, 247, 220, 0.1);
      color: #fff7dc;
    }

    .item-name {
      font-weight: 600;
    }

    .totals-section {
      background-color: rgba(255, 247, 220, 0.05);
      border: 1px solid rgba(255, 247, 220, 0.2);
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      font-size: 16px;
    }

    .total-row.grand-total {
      border-top: 2px solid rgba(255, 247, 220, 0.3);
      margin-top: 10px;
      padding-top: 15px;
      font-family: 'Bebas Neue', sans-serif;
      font-size: 24px;
      color: #fff7dc;
    }

    .shipping-info {
      background-color: rgba(255, 247, 220, 0.05);
      border: 1px solid rgba(255, 247, 220, 0.2);
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      line-height: 1.6;
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

    .highlight {
      color: #fff7dc;
      font-weight: 700;
    }

    @media only screen and (max-width: 600px) {
      .header h1 {
        font-size: 36px;
      }

      .section-title {
        font-size: 24px;
      }

      .items-table th,
      .items-table td {
        padding: 8px 4px;
        font-size: 14px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>BURVON GALLERY</h1>
      <p>Thank you for your order!</p>
    </div>

    <div class="content">
      <p>Hello <strong>${customerName}</strong>,</p>
      <p>Your order has been confirmed and is being processed. We'll notify you once it ships.</p>

      <div class="section-title">ORDER DETAILS</div>
      <div class="order-info">
        <div class="order-info-row">
          <span class="order-info-label">Order ID:</span>
          <span class="order-info-value highlight">#${orderId}</span>
        </div>
        <div class="order-info-row">
          <span class="order-info-label">Order Date:</span>
          <span class="order-info-value">${orderDate}</span>
        </div>
        <div class="order-info-row">
          <span class="order-info-label">Payment Method:</span>
          <span class="order-info-value">${paymentMethod}</span>
        </div>
      </div>

      <div class="section-title">ITEMS ORDERED</div>
      <table class="items-table">
        <thead>
          <tr>
            <th>ITEM</th>
            <th>SIZE</th>
            <th>QTY</th>
            <th>PRICE</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td class="item-name">${item.name}</td>
              <td>${item.size || '-'}</td>
              <td>${item.quantity}</td>
              <td>₱${item.price.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="totals-section">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>₱${subtotal.toFixed(2)}</span>
        </div>
        <div class="total-row">
          <span>Shipping:</span>
          <span>₱${shippingCost.toFixed(2)}</span>
        </div>
        <div class="total-row grand-total">
          <span>TOTAL:</span>
          <span>₱${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <div class="section-title">SHIPPING ADDRESS</div>
      <div class="shipping-info">
        <strong>${customerName}</strong><br>
        ${shippingAddress}
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.VITE_FRONTEND_URL || 'https://burvon-gallery.vercel.app'}/profile/orders" class="button">
          VIEW ORDER STATUS
        </a>
      </div>

      <p style="margin-top: 30px; font-size: 14px; opacity: 0.8;">
        If you have any questions about your order, please contact us at support@burvongallery.com
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
}
