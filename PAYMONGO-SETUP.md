# PayMongo Setup Guide

## 🔑 Getting Your API Credentials

### 1. Create PayMongo Account
- Go to [https://paymongo.com](https://paymongo.com)
- Sign up for a free account
- Complete email verification

### 2. Access Developer Dashboard
- Log into your PayMongo account
- Navigate to **"API Keys"** or **"Developer"** section
- You'll find your API keys there

### 3. Get Your Keys
You'll need two keys:
- **Secret Key** (starts with `sk_test_` for test mode)
- **Public Key** (starts with `pk_test_` for test mode)

### 4. Set Up Environment Variables
Create a `.env` file in your project root with:

```env
# PayMongo API Keys
VITE_PAYMONGO_SECRET_KEY=sk_test_your_actual_secret_key_here
VITE_PAYMONGO_PUBLIC_KEY=pk_test_your_actual_public_key_here

# Frontend URL (for PayMongo redirects)
FRONTEND_URL=http://localhost:5173

# Backend URL (for webhooks)
BACKEND_URL=http://localhost:3000
```

## 🧪 Testing Your Setup

After setting up your credentials, run:

```bash
node test-paymongo-methods.js
```

This will test your API connection and show available payment methods.

## 📱 Available Payment Methods

PayMongo typically supports:
- **Credit/Debit Cards** (`card`)
- **GCash** (`gcash`)
- **GrabPay** (`grab_pay`)
- **PayMaya** (`paymaya`)

## 🔄 Next Steps

1. Get your API keys from PayMongo dashboard
2. Add them to your `.env` file
3. Test the connection with the script
4. Try creating a checkout session in your app

## 🆘 Troubleshooting

- **401 Error**: Check if your API key is correct
- **400 Error**: Check if payment method types are valid
- **Network Error**: Check your internet connection
