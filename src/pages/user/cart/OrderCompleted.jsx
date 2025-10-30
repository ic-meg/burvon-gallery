import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';

const OrderCompleted = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const status = searchParams.get('status') || 'success';
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { clearSelectedItems } = useCart();

  const isSuccess = status === 'success';
  const isFailed = status === 'failed';
  const isCancelled = status === 'cancelled';

  useEffect(() => {
    
    const fetchOrderData = async () => {
      if (sessionId) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/session/${sessionId}`);
          const data = await response.json();
          if (data.success) {
            setOrderData(data.data);
          }
        } catch (error) {
          console.error('Error fetching order data by session:', error);
        }
      } else {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`);
          const data = await response.json();
          if (data.success && data.data.length > 0) {
            const latestOrder = data.data[0];
            setOrderData(latestOrder);
          }
        } catch (error) {
          console.error('Error fetching latest order:', error);
        }
      }
      setLoading(false);
    };

    fetchOrderData();
  }, [sessionId]);

  useEffect(() => {
    if (isSuccess) {
      clearSelectedItems();
    }
  }, [isSuccess, clearSelectedItems]);

  return (
    <Layout full>
      <div className="min-h-screen bg-[#181818] flex items-center justify-center text-[#fff7dc] px-4">
        <div className="text-center max-w-md mx-auto">
          {/* Status Icon */}
          <div className="mb-8">
            {isSuccess && (
              <div className="w-20 h-20 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {isFailed && (
              <div className="w-20 h-20 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
            {isCancelled && (
              <div className="w-20 h-20 mx-auto mb-4 bg-yellow-500 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            )}
          </div>

          {/* Status Messages */}
          {isSuccess && (
            <>
              <h1 className="bebas text-4xl mb-4 text-green-400">ORDER COMPLETED!</h1>
              <p className="avant text-lg mb-6">Thank you for your purchase! Your order has been confirmed and will be processed shortly.</p>
              
              {sessionId && (
                <div className="bg-[#2a2a2a] border border-[#FFF7DC] rounded-lg p-4 mb-6">
                  <p className="avant text-sm text-[#FFF7DC]">
                    <span className="font-bold">Transaction ID:</span> {sessionId}
                  </p>
                  {orderData && (
                    <>
                      <p className="avant text-sm text-[#FFF7DC] mt-2">
                        <span className="font-bold">Order ID:</span> #{orderData.order_id}
                      </p>
                      <p className="avant text-sm text-[#FFF7DC]">
                        <span className="font-bold">Total:</span> ₱{orderData.total_price}
                      </p>
                      <p className="avant text-sm text-[#FFF7DC]">
                        <span className="font-bold">Status:</span> {orderData.status}
                      </p>
                      <p className="avant text-sm text-[#FFF7DC]">
                        <span className="font-bold">Customer:</span> {orderData.first_name} {orderData.last_name}
                      </p>
                      <p className="avant text-sm text-[#FFF7DC]">
                        <span className="font-bold">Email:</span> {orderData.email}
                      </p>
                      <p className="avant text-sm text-[#FFF7DC]">
                        <span className="font-bold">Shipping:</span> {orderData.street_address}, {orderData.barangay}, {orderData.city_municipality}
                      </p>
                    </>
                  )}
                </div>
              )}

              <div className="bg-[#2a2a2a] border border-[#FFF7DC] rounded-lg p-4 mb-8">
                <h3 className="bebas text-xl mb-3 text-[#FFF7DC]">WHAT'S NEXT?</h3>
                <ul className="avant text-sm text-[#FFF7DC] space-y-2">
                  <li>• You will receive an email confirmation shortly</li>
                  <li>• Your order will be processed within 1-2 business days</li>
                  <li>• You will receive tracking information once shipped</li>
                </ul>
              </div>

              {/* Login Note */}
              <div className="bg-[#2a2a2a] border border-[#FFF7DC] rounded-lg p-4 mb-8">
                <h3 className="bebas text-xl mb-3 text-[#FFF7DC]">ORDER TRACKING</h3>
                <p className="avant text-sm text-[#FFF7DC] mb-2">
                  To track your order and view order history, you can login using the email address you used during checkout:
                </p>
                {orderData && (
                  <p className="avant text-sm text-[#FFF7DC] font-bold mb-2">
                    Email: {orderData.email}
                  </p>
                )}
                <p className="avant text-xs text-[#FFF7DC]/70">
                  Note: If you don't have an account yet, you can create one using this email address.
                </p>
              </div>
            </>
          )}

          {isFailed && (
            <>
              <h1 className="bebas text-4xl mb-4 text-red-400">PAYMENT FAILED</h1>
              <p className="avant text-lg mb-6">Your payment could not be processed. Please try again or contact support if the problem persists.</p>
            </>
          )}

          {isCancelled && (
            <>
              <h1 className="bebas text-4xl mb-4 text-yellow-400">ORDER CANCELLED</h1>
              <p className="avant text-lg mb-6">Your payment was not completed. No charges have been made to your account.</p>
            </>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            {isSuccess && (
              <Link 
                to="/" 
                className="block bg-[#FFF7DC] text-[#181818] px-8 py-3 rounded avantbold text-lg hover:bg-[#ffe9b3] transition"
              >
                CONTINUE SHOPPING
              </Link>
            )}
            
            {(isFailed || isCancelled) && (
              <div className="space-y-3">
                <Link 
                  to="/user/cart/checkout" 
                  className="block bg-[#FFF7DC] text-[#181818] px-8 py-3 rounded avantbold text-lg hover:bg-[#ffe9b3] transition"
                >
                  TRY AGAIN
                </Link>
                <Link 
                  to="/" 
                  className="block border border-[#FFF7DC] text-[#FFF7DC] px-8 py-3 rounded avantbold text-lg hover:bg-[#FFF7DC] hover:text-[#181818] transition"
                >
                  CONTINUE SHOPPING
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderCompleted;
