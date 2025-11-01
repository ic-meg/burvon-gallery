import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '../../../components/Layout'
import { Friden, Odyssey, checkIcon } from '../../../assets/index.js'

const ViewOrderDesktop = ({ order, loading }) => {
  const navigate = useNavigate()
  
  if (loading) {
    return (
      <div className="md:hidden w-full min-h-screen bg-[#181818] text-[#fff7dc] flex items-center justify-center">
        <div className="avant cream-text text-xl">Loading order details...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="hidden md:block min-h-screen bg-[#181818] text-[#fff7dc] px-0 py-0 flex items-center justify-center">
        <div className="avant cream-text text-xl"> </div>
      </div>
    )
  }

  return (
    <div className="hidden md:block min-h-screen bg-[#181818] text-[#fff7dc] px-0 py-0">
      {/* Header */}
      <div className="flex items-center justify-between px-12 pt-28 pb-2">
        <div style={{ width: 120 }}></div>
        <div style={{ width: 120 }}></div>
      </div>
      {/* Check icon above heading */}
      <div className="flex flex-col items-center mt-10 mb-2">
        <img src={checkIcon} alt="Order Completed" className="w-15 h-15 mb-4" />
        <div className="bebas cream-text text-center text-5xl">YOUR ORDER IS COMPLETED!</div>
      </div>
      <div className="avant cream-text text-center text-sm mb-10">THANK YOU. YOUR ORDER HAS BEEN RECEIVED. <br /> YOU CAN LOGIN USING EMAIL TO TRACK ORDER HISTORY AND ORDER.</div>

      {/* Table Header */}
      <div className="w-full px-12">
        <div className="grid grid-cols-[640px_80px_120px_120px_120px] avant cream-text text-xl border-b border-[#fff7dc]">
          <div className="py-2 pl-0">Product/s</div>
          <div className="py-2 text-center">Size</div>
          <div className="py-2 pl-23">Price</div>
          <div className="py-2 pl-30">Quantity</div>
          <div className="py-2 pl-44">Subtotal</div>
        </div>
      </div>
      {/* Items */}
      {order.items.map((item, idx) => (
        <div key={item.order_item_id} className="w-full px-12">
          <div className="flex items-center py-6 border-b border-[#fff7dc]">
            <div className="flex items-center w-[320px] gap-4">
              <img 
                src={item.product?.images?.[0] || Odyssey} 
                alt={item.product?.name || 'Product'} 
                className="w-[160px] h-[160px] object-cover rounded-md" 
              />
              <div>
                <div className="avantbold text-nowrap cream-text text-lg leading-tight">
                  {item.product?.name || 'Product'}
                  <br />
                  <span className="avantbold cream-text text-md">
                    {item.product?.collection?.name || item.product?.category ? `(${item.product?.collection?.name || item.product?.category})` : ''}
                  </span>
                </div>
                <div className="bebas cream-text text-md mt-1" style={{ color: '#959595' }}>
                  {item.size || '-'}
                </div>
              </div>
            </div>
            <div className="w-[120px] pl-89 text-center avant cream-text text-lg">{item.size || '-'}</div>
            <div className="w-[120px] pl-35 text-nowrap text-center avant cream-text text-lg">₱ {parseFloat(item.price).toLocaleString(undefined, {minimumFractionDigits:2})}</div>
            <div className="w-[120px] pl-45 text-center avant cream-text text-lg">{item.quantity}</div>
            <div className="w-[120px] pl-36 text-nowrap text-center avant cream-text text-lg">
              ₱ {(parseFloat(item.price) * item.quantity).toLocaleString(undefined, {minimumFractionDigits:2})}
            </div>
          </div>
   
          {idx < order.items.length - 1 && (
            <div className="w-full border-b border-[#fff7dc]" />
          )}
        </div>
      ))}
      {/* Details Section */}
      <div className="flex flex-row px-12 py-8 gap-12 relative">
        {/* Customer Details */}
        <div className="flex flex-col gap-2 avant cream-text text-md min-w-[220px]">
          <div className="avantbold cream-text text-xl mb-1">Customer Details</div>
          <div>{order.email}</div>
          <div>{order.phone}</div>
          <div className="mt-2 avantbold cream-text text-xl">Order Date</div>
          <div>{new Date(order.created_at).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</div>
          <div className="mt-2 avantbold cream-text text-xl">Payment Method</div>
          <div>{order.payment_method}</div>
        </div>
        {/* Shipping Address */}
        <div className="flex flex-col gap-2 avant cream-text text-md min-w-[220px]">
          <div className="avantbold cream-text text-xl mb-1">Shipping Address</div>
          <div>{order.first_name} {order.last_name}</div>
          <div style={{ whiteSpace: 'pre-line' }}>{order.shipping_address}</div>
          <div className="mt-2 avantbold cream-text text-xl">Expected Delivery</div>
          <div>{order.delivered_date ? new Date(order.delivered_date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }) : 'TBD'}</div>
        </div>
        {/* Totals */}
        <div className="absolute top-9 right-0 flex flex-col gap-2 avant cream-text text-md min-w-[460px] items-end pr-12">
          <div className="flex justify-between w-full">
            <span className="avantbold cream-text text-xl">Subtotal ( {order.items.reduce((a, b) => a + b.quantity, 0)} items )</span>
            <span className="avantbold cream-text text-xl">₱ {order.items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0).toLocaleString(undefined, {minimumFractionDigits:2})}</span>
          </div>
          <div className="flex justify-between w-full">
            <span className="avantbold cream-text text-xl">Shipping</span>
            <span className="avantbold cream-text text-xl">
              ₱ {order.shipping_cost ? parseFloat(order.shipping_cost).toLocaleString(undefined, {minimumFractionDigits:2}) : '0.00'}
            </span>
          </div>
          <div className="w-full border-b border-[#fff7dc] my-2" />
          <div className="flex justify-between w-full avantbold cream-text text-xl">
            <span>Total</span>
            <span>₱ {parseFloat(order.total_price).toLocaleString(undefined, {minimumFractionDigits:2})}</span>
          </div>
          <button className="avantbold cream-bg metallic-text px-3 py-2 rounded mt-4 text-md self-end cursor-pointer"
          onClick={() => navigate('/')}
          >
            SHOP AGAIN
        </button>
        </div>
      </div>
    </div>
  )
}

const ViewOrderMobile = ({ order, loading }) => {
  const navigate = useNavigate()
  
  if (loading) {
    return (
      <div className="md:hidden w-full min-h-screen bg-[#181818] text-[#fff7dc] flex items-center justify-center">
        <div className="avant cream-text text-lg">Loading order details...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="md:hidden w-full min-h-screen bg-[#181818] text-[#fff7dc] px-2 pt-4 flex items-center justify-center">
        <div className="avant cream-text text-lg">Order not found</div>
      </div>
    )
  }

  return (
    <div className="md:hidden w-full min-h-screen bg-[#181818] text-[#fff7dc] px-2 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mt-15 mb-2">
        <div style={{ width: 40 }}></div>
        <div style={{ width: 40 }}></div>
      </div>
      {/* Check icon above heading */}
      <div className="flex flex-col items-center mt-6 mb-1">
        <img src={checkIcon} alt="Order Completed" className="w-12 h-12 mb-2" />
        <div className="bebas cream-text text-center text-3xl">YOUR ORDER IS COMPLETED!</div>
      </div>
      <div className="avant cream-text text-center text-xs mb-4">THANK YOU. YOUR ORDER HAS BEEN RECEIVED.</div>
      {/* Items */}
      {order.items.map((item, idx) => (
        <div key={item.order_item_id} className="flex gap-3 items-center py-3 border-b border-[#fff7dc]">
          <img 
            src={item.product?.images?.[0] || Odyssey} 
            alt={item.product?.name || 'Product'} 
            className="w-20 h-20 object-cover rounded-md" 
          />
          <div className="flex-1">
            <div className="avantbold cream-text text-sm leading-tight">
              {item.product?.name || 'Product'}
              <br />
              <span className="avantbold cream-text text-xs">
                {item.product?.collection?.name || item.product?.category ? `(${item.product?.collection?.name || item.product?.category})` : ''}
              </span>
            </div>
            <div className="bebas cream-text text-xs mt-1" style={{ color: '#959595' }}>
              {item.size || '-'}
            </div>
            <div className="flex gap-2 mt-1 avant cream-text text-xs">
              <span className="w-[40px]">Size: <br/>{item.size || '-'}</span>
              <span className="w-[70px] text-nowrap">Price: <br/> ₱ {parseFloat(item.price).toLocaleString(undefined, {minimumFractionDigits:2})}</span>
              <span className="w-[40px] text-nowrap">Qty: <br/>{item.quantity}</span>
              <span className="w-[40px] text-nowrap">Subtotal: <br/>₱ {(parseFloat(item.price) * item.quantity).toLocaleString(undefined, {minimumFractionDigits:2})}</span>
            </div>
          </div>
        </div>
      ))}
      {/* Details Section */}
      <div className="flex flex-col gap-4 py-6">
        <div>
          <div className="avantbold cream-text text-md mb-1">Customer Details</div>
          <div className="avant cream-text text-xs">{order.email}</div>
          <div className="avant cream-text text-xs">{order.phone}</div>
        </div>
        <div>
          <div className="avantbold cream-text text-md mb-1">Shipping Address</div>
          <div className="avant cream-text text-xs">{order.first_name} {order.last_name}</div>
          <div className="avant cream-text text-xs" style={{ whiteSpace: 'pre-line' }}>{order.shipping_address}</div>
        </div>
        <div>
          <div className="avantbold cream-text text-md mb-1">Order Date</div>
          <div className="avant cream-text text-xs">{new Date(order.created_at).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</div>
        </div>
        <div>
          <div className="avantbold cream-text text-md mb-1">Expected Delivery</div>
          <div className="avant cream-text text-xs">{order.delivered_date ? new Date(order.delivered_date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }) : 'TBD'}</div>
        </div>
        <div>
          <div className="avantbold cream-text text-md mb-1">Payment Method</div>
          <div className="avant cream-text text-xs">{order.payment_method}</div>
        </div>
        <div className="flex flex-col items-end w-full max-w-[340px] pt-8">
          <div className="w-full flex justify-between items-center mb-4">
              <span className="avantbold cream-text text-md">Subtotal ( {order.items.reduce((a, b) => a + b.quantity, 0)} items )</span>
              <span className="avantbold cream-text text-md">₱ {order.items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0).toLocaleString(undefined, {minimumFractionDigits:2})}</span>
          </div>
          <div className="w-full flex justify-between items-center mb-4">
              <span className="avantbold cream-text text-md">Shipping</span>
              <span className="avantbold cream-text text-md">
                ₱ {order.shipping_cost ? parseFloat(order.shipping_cost).toLocaleString(undefined, {minimumFractionDigits:2}) : ''}
              </span>
          </div>
          <div className="w-full border-b border-[#fff7dc] my-2" />
          <div className="w-full flex justify-between items-center mb-6">
              <span className="avantbold cream-text text-md">Total</span>
              <span className="avantbold cream-text text-md">₱ {parseFloat(order.total_price).toLocaleString(undefined, {minimumFractionDigits:2})}</span>
          </div>
          <button className="avantbold cream-bg metallic-text px-4 py-2 rounded text-sm self-end cursor-pointer"
          onClick={() => navigate('/')}
          >
            SHOP AGAIN
        </button>
        </div>
      </div>
    </div>
  )
}

const OrderCompleted = () => {
  const [searchParams] = useSearchParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'info'
  });

  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');

  const showToast = (message, type = 'info') => {
    setToast({
      show: true,
      message,
      type
    });

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  useEffect(() => {
    const fetchOrderData = async (retryCount = 0) => {
      try {
        setLoading(true);
        setError(null);
    

        let order = null;
        let actualSessionId = sessionId;


        if (!actualSessionId || actualSessionId === '{CHECKOUT_SESSION_ID}') {
          const storedSessionId = localStorage.getItem('checkout_session_id');
          if (storedSessionId) {
            actualSessionId = storedSessionId;
          }
        }

        // Primary method: Get order by checkout session ID (most secure)
        const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
        if (actualSessionId && actualSessionId !== '{CHECKOUT_SESSION_ID}') {
          const response = await fetch(`${apiUrl}/orders/session/${actualSessionId}`);
          const data = await response.json();
          if (data.success && data.data) {
            order = data.data;
          }
        }

        // Fallback method: Get order by order ID (if session ID not available)
        if (!order && orderId) {
          const response = await fetch(`${apiUrl}/orders/${orderId}`);
          const data = await response.json();
          if (data.success && data.data) {
            order = data.data;
          }
        }

        // Development fallback: Auto-create order if not found (for development only)
        if (!order && actualSessionId && import.meta.env.DEV) {
          try {

            const devResponse = await fetch(`${apiUrl}/orders/dev/complete-payment/${actualSessionId}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ payment_method: 'PayMongo' })
            });
            
            if (devResponse.ok) {
              const devData = await devResponse.json();
              if (devData.success) {
                // Retry fetching the order after creation
                const retryResponse = await fetch(`${apiUrl}/orders/session/${actualSessionId}`);
                const retryData = await retryResponse.json();

                if (retryData.success && retryData.data) {
                  order = retryData.data;
                }
              }
            }
          } catch (devError) {
            console.error('[DEV] Error in dev fallback:', devError);
          }
        }

        if (order) {
          setOrderData(order);
        } else if (retryCount < 5) {
          setTimeout(() => {
            fetchOrderData(retryCount + 1);
          }, 2000);
          return; 
        } else {
          setError('Order not found. The order may still be processing. Please wait a moment and refresh the page.');
        }
      } catch (error) {
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [sessionId, orderId]);


  if (error) {
    return (
      <Layout full>
        <div className="min-h-screen bg-[#181818] text-[#fff7dc] flex items-center justify-center">
          <div className="text-center">
            <div className="avant cream-text text-xl mb-4">{error}</div>
            
           
            
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout full>
      <ViewOrderDesktop order={orderData} loading={loading} />
      <ViewOrderMobile order={orderData} loading={loading} />
      
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg text-white avant font-semibold z-50 ${
          toast.type === 'info' ? 'bg-blue-500' :
          toast.type === 'success' ? 'bg-green-500' :
          toast.type === 'error' ? 'bg-red-500' :
          'bg-yellow-500'
        }`}>
          {toast.message}
        </div>
      )}
    </Layout>
  );
}

export default OrderCompleted