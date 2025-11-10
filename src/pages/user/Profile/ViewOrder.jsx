import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '../../../components/Layout'
import orderApi from '../../../api/orderApi'
import { getAuthToken } from '../../../services/authService'
import Toast from '../../../components/Toast'

const ViewOrderDesktop = ({ order, loading, error }) => {
  const navigate = useNavigate()
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  const handleCopyTracking = async (trackingNumber) => {
    try {
      await navigator.clipboard.writeText(trackingNumber)
      setToast({ show: true, message: 'Tracking number copied to clipboard!', type: 'success' })
    } catch (err) {
      setToast({ show: true, message: 'Failed to copy tracking number', type: 'error' })
    }
  }
  
  if (loading) {
    return (
      <div className="hidden md:block min-h-screen bg-[#181818] text-[#fff7dc] px-0 py-0 flex items-center justify-center">
        <div className="avant cream-text text-xl">Loading order details...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="hidden md:block min-h-screen bg-[#181818] text-[#fff7dc] px-0 py-0 flex items-center justify-center">
        <div className="avant cream-text text-xl">{error}</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="hidden md:block min-h-screen bg-[#181818] text-[#fff7dc] px-0 py-0 flex items-center justify-center">
        <div className="avant cream-text text-xl">Order not found</div>
      </div>
    )
  }

  return (
    <div className="hidden md:block min-h-screen bg-[#181818] text-[#fff7dc] px-0 py-0">
      {/* Header */}
      <div className="flex items-center justify-between px-12 pt-28 pb-2">
        <div
          className="avantbold cream-text text-lg cursor-pointer relative z-50"
          onClick={() => navigate('/profile')}
        >
          &larr; GO BACK
        </div>
        <div style={{ width: 120 }}></div>
      </div>
      <div className="bebas cream-text text-center text-5xl mt-15 mb-2">VIEW ORDER</div>
      <div className="avantbold cream-text text-2xl text-center mb-1">ORDER ID : #{order.id}</div>
      <div className="avant cream-text text-center text-sm mb-10">THANK YOU. YOUR ORDER HAS BEEN RECEIVED.</div>
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
      {order.items && order.items.length > 0 ? (
        order.items.map((item, idx) => (
          <div key={`${item.variant || item.name}-${idx}`} className="w-full px-12">
            <div className="flex items-center py-6 border-b border-[#fff7dc]">
              <div className="flex items-center w-[320px] gap-4">
                <img 
                  src={item.image} 
                  alt={item.variant || item.name} 
                  className="w-[160px] h-[160px] object-cover rounded-md"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
                <div>
                  <div className="avantbold text-nowrap cream-text text-lg leading-tight">
                    {item.name}
                    <br />
                    <span className="avantbold cream-text text-md">(Elegant Pendant Jewelry)</span>
                  </div>
                  <div className="bebas cream-text text-md mt-1" style={{ color: '#959595' }}>{item.variant || 'N/A'}</div>
                </div>
              </div>
              <div className="w-[120px] pl-89 text-center avant cream-text text-lg">{item.size || '-'}</div>
              <div className="w-[120px] pl-35 text-nowrap text-center avant cream-text text-lg">₱ {item.price.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
              <div className="w-[120px] pl-45 text-center avant cream-text text-lg">{item.quantity}</div>
              <div className="w-[120px] pl-36 text-nowrap text-center avant cream-text text-lg">
                ₱ {(item.price * item.quantity).toLocaleString(undefined, {minimumFractionDigits:2})}
              </div>
            </div>
            {/* Add extra cream line after each product except last */}
            {idx < order.items.length - 1 && (
              <div className="w-full border-b border-[#fff7dc]" />
            )}
          </div>
        ))
      ) : (
        <div className="w-full px-12 py-6">
          <div className="avant cream-text text-lg">No items found in this order.</div>
        </div>
      )}
      {/* Details Section */}
      <div className="flex flex-row px-12 py-8 gap-12 relative">
        {/* Customer Details */}
        <div className="flex flex-col gap-2 avant cream-text text-md min-w-[220px]">
          <div className="avantbold cream-text text-xl mb-1">Customer Details</div>
          <div>{order.customer?.email || 'N/A'}</div>
          <div>{order.customer?.phone || 'N/A'}</div>
          <div className="mt-2 avantbold cream-text text-xl">Order Date</div>
          <div>{order.date}</div>
          <div className="mt-2 avantbold cream-text text-xl">Payment Method</div>
          <div>{order.customer?.payment || 'N/A'}</div>
        </div>
        {/* Shipping Address */}
        <div className="flex flex-col gap-2 avant cream-text text-md min-w-[220px]">
          <div className="avantbold cream-text text-xl mb-1">Shipping Address</div>
          <div>{order.customer?.name || 'N/A'}</div>
          <div style={{ whiteSpace: 'pre-line' }}>{order.customer?.address || 'N/A'}</div>
          <div className="mt-2 avantbold cream-text text-xl">Expected Delivery</div>
          <div>{order.delivery || 'N/A'}</div>
          {order.trackingNumber && (
            <>
              <div className="mt-2 avantbold cream-text text-xl">Tracking Number</div>
              <div className="flex items-center gap-2">
                <span className="avant cream-text text-md">{order.trackingNumber}</span>
                <button
                  onClick={() => handleCopyTracking(order.trackingNumber)}
                  className="cream-text hover:opacity-80 transition-opacity cursor-pointer"
                  title="Copy tracking number"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
        {/* Totals */}
        <div className="absolute top-9 right-0 flex flex-col gap-2 avant cream-text text-md min-w-[460px] items-end pr-12">
          <div className="flex justify-between w-full">
            <span className="avantbold cream-text text-xl">Subtotal ( {order.items?.reduce((a, b) => a + b.quantity, 0) || 0} items )</span>
            <span className="avantbold cream-text text-xl">₱ {order.subtotal.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
          </div>
          <div className="flex justify-between w-full">
            <span className="avantbold cream-text text-xl">Shipping</span>
            <span className="avantbold cream-text text-xl">₱ {order.shipping.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
          </div>
          <div className="w-full border-b border-[#fff7dc] my-2" />
          <div className="flex justify-between w-full avantbold cream-text text-xl">
            <span>Total</span>
            <span>₱ {order.total.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
          </div>
          <button className="avantbold cream-bg metallic-text px-3 py-2 rounded mt-4 text-md self-end cursor-pointer">CONTACT SELLER</button>
        </div>
      </div>
      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ show: false, message: '', type: 'success' })}
      />
    </div>
  )
}

const ViewOrderMobile = ({ order, loading, error }) => {
  const navigate = useNavigate()
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  const handleCopyTracking = async (trackingNumber) => {
    try {
      await navigator.clipboard.writeText(trackingNumber)
      setToast({ show: true, message: 'Tracking number copied to clipboard!', type: 'success' })
    } catch (err) {
      setToast({ show: true, message: 'Failed to copy tracking number', type: 'error' })
    }
  }
  
  if (loading) {
    return (
      <div className="md:hidden w-full min-h-screen bg-[#181818] text-[#fff7dc] px-2 pt-4 flex items-center justify-center">
        <div className="avant cream-text text-sm">Loading order details...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="md:hidden w-full min-h-screen bg-[#181818] text-[#fff7dc] px-2 pt-4 flex items-center justify-center">
        <div className="avant cream-text text-sm">{error}</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="md:hidden w-full min-h-screen bg-[#181818] text-[#fff7dc] px-2 pt-4 flex items-center justify-center">
        <div className="avant cream-text text-sm">Order not found</div>
      </div>
    )
  }

  return (
    <div className="md:hidden w-full min-h-screen bg-[#181818] text-[#fff7dc] px-2 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mt-15 mb-2">
        <div
          className="avantbold cream-text text-sm cursor-pointer"
          onClick={() => navigate('/profile')}
        >
          &larr; GO BACK
        </div>
        <div style={{ width: 40 }}></div>
      </div>
      <div className="bebas cream-text text-center text-3xl mt-2 mb-1">VIEW ORDER</div>
      <div className="avantbold cream-text text-lg text-center mb-1">ORDER ID : #{order.id}</div>
      <div className="avant cream-text text-center text-xs mb-4">THANK YOU. YOUR ORDER HAS BEEN RECEIVED.</div>
      {/* Items */}
      {order.items && order.items.length > 0 ? (
        order.items.map((item, idx) => (
          <div key={`${item.variant || item.name}-${idx}`} className="flex gap-3 items-center py-3 border-b border-[#fff7dc]">
            <img 
              src={item.image} 
              alt={item.variant || item.name} 
              className="w-20 h-20 object-cover rounded-md"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
            <div className="flex-1">
              <div className="avantbold cream-text text-sm leading-tight">
                {item.name}
                <br />
                <span className="avantbold cream-text text-xs">(Elegant Pendant Jewelry)</span>
              </div>
              <div className="bebas cream-text text-xs mt-1" style={{ color: '#959595' }}>{item.variant || 'N/A'}</div>
              <div className="flex gap-2 mt-1 avant cream-text text-xs">
                <span className="w-[40px]">Size: <br/>{item.size || '-'}</span>
                <span className="w-[70px] text-nowrap">Price: <br/> ₱ {item.price.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
                <span className="w-[40px] text-nowrap">Qty: <br/>{item.quantity}</span>
                <span className="w-[40px] text-nowrap">Subtotal: <br/>₱ {(item.price * item.quantity).toLocaleString(undefined, {minimumFractionDigits:2})}</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="py-6">
          <div className="avant cream-text text-sm">No items found in this order.</div>
        </div>
      )}
      {/* Details Section */}
      <div className="flex flex-col gap-4 py-6">
        <div>
          <div className="avantbold cream-text text-md mb-1">Customer Details</div>
          <div className="avant cream-text text-xs">{order.customer?.email || 'N/A'}</div>
          <div className="avant cream-text text-xs">{order.customer?.phone || 'N/A'}</div>
        </div>
        <div>
          <div className="avantbold cream-text text-md mb-1">Shipping Address</div>
          <div className="avant cream-text text-xs">{order.customer?.name || 'N/A'}</div>
          <div className="avant cream-text text-xs" style={{ whiteSpace: 'pre-line' }}>{order.customer?.address || 'N/A'}</div>
        </div>
        <div>
          <div className="avantbold cream-text text-md mb-1">Order Date</div>
          <div className="avant cream-text text-xs">{order.date}</div>
        </div>
        <div>
          <div className="avantbold cream-text text-md mb-1">Expected Delivery</div>
          <div className="avant cream-text text-xs">{order.delivery || 'N/A'}</div>
        </div>
        {order.trackingNumber && (
          <div>
            <div className="avantbold cream-text text-md mb-1">Tracking Number</div>
            <div className="flex items-center gap-2">
              <span className="avant cream-text text-xs">{order.trackingNumber}</span>
              <button
                onClick={() => handleCopyTracking(order.trackingNumber)}
                className="cream-text hover:opacity-80 transition-opacity cursor-pointer"
                title="Copy tracking number"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        )}
        <div>
          <div className="avantbold cream-text text-md mb-1">Payment Method</div>
          <div className="avant cream-text text-xs">{order.customer?.payment || 'N/A'}</div>
        </div>
        <div className="flex flex-col items-end w-full max-w-[340px] pt-8">
          <div className="w-full flex justify-between items-center mb-4">
              <span className="avantbold cream-text text-md">Subtotal ( {order.items?.reduce((a, b) => a + b.quantity, 0) || 0} items )</span>
              <span className="avantbold cream-text text-md">₱ {order.subtotal.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
          </div>
          <div className="w-full flex justify-between items-center mb-4">
              <span className="avantbold cream-text text-md">Shipping</span>
              <span className="avantbold cream-text text-md">₱ {order.shipping.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
          </div>
          <div className="w-full border-b border-[#fff7dc] my-2" />
          <div className="w-full flex justify-between items-center mb-6">
              <span className="avantbold cream-text text-md">Total</span>
              <span className="avantbold cream-text text-md">₱ {order.total.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
          </div>
          <button className="avantbold cream-bg metallic-text px-4 py-2 rounded text-sm self-end cursor-pointer">CONTACT SELLER</button>
        </div>
      </div>
      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ show: false, message: '', type: 'success' })}
      />
    </div>
  )
}

const ViewOrder = () => {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('Order ID is required')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
     
        const result = await orderApi.getOrderDetails(orderId)
   
        if (result.error) {
          console.error('❌ Error fetching order:', result.error)
          setError(result.error || 'Failed to fetch order details')
          setLoading(false)
          return
        }

        if (!result.data) {
          console.error('❌ No data in result:', result)
          setError('Order not found')
          setLoading(false)
          return
        }

        // Check if backend response indicates failure
        if (result.data.success === false) {
          console.error('❌ Backend returned failure:', result.data)
          setError(result.data.message || 'Order not found')
          setLoading(false)
          return
        }

        // Transform backend order data to component format
        // apiRequest returns { error: null, data: backendResponse, status: 200 }
        // backendResponse is { success: true, data: order, message: '...' }
        // So the actual order is in result.data.data
        let backendOrder = null
        
        // Check different possible response structures
        if (result.data?.data && result.data.data.order_id) {
          // Standard structure: { success: true, data: order, ... }
          backendOrder = result.data.data
         
        } else if (result.data?.order_id) {
          // Order is directly in result.data (flattened)
          backendOrder = result.data
        
        } else {
          // Try to find order in nested structure
          backendOrder = result.data.data || result.data
        
        }
        

        if (!backendOrder) {
          console.error('❌ Could not extract order from response:', result)
          setError('Invalid order data structure')
          setLoading(false)
          return
        }
        
        // Check if items exist and is an array
        if (!backendOrder.items) {
          console.warn('⚠️ No items found in order. BackendOrder structure:', backendOrder)
          console.warn('⚠️ Available keys:', Object.keys(backendOrder))
        } else if (!Array.isArray(backendOrder.items)) {
          console.warn('⚠️ Items is not an array:', typeof backendOrder.items, backendOrder.items)
        } else {
        }
        
        const items = (backendOrder?.items && Array.isArray(backendOrder.items)) 
          ? backendOrder.items.map(item => {
              
              return {
                name: item.product?.name || item.name || 'Product',
                variant: item.product?.collection?.name || item.product?.variant || item.variant || 'N/A',
                price: parseFloat(item.price || item.product?.current_price || 0),
                quantity: item.quantity || 1,
                size: item.size || 'N/A',
                image: item.product?.images?.[0] || item.product?.image || item.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=',
              }
            })
          : []
        
      

        const orderDate = backendOrder.created_at ? new Date(backendOrder.created_at) : new Date()
        const deliveryDate = backendOrder.expected_delivery 
          ? new Date(backendOrder.expected_delivery) 
          : new Date(orderDate.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days from order

        // Calculate subtotal from items
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        const shipping = parseFloat(backendOrder.shipping_cost || 0)
        const total = parseFloat(backendOrder.total_price || subtotal + shipping)

        // Format address
        const addressParts = [
          backendOrder.street_address,
          backendOrder.barangay,
          backendOrder.city_municipality,
          backendOrder.province_region,
          backendOrder.postal_code
        ].filter(Boolean)
        const address = addressParts.join('\n')

        const transformedOrder = {
          id: backendOrder.order_id || backendOrder.id,
          items,
          date: orderDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          delivery: deliveryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          subtotal,
          shipping,
          total,
          trackingNumber: backendOrder.tracking_number || null,
          status: backendOrder.status || null,
          customer: {
            email: backendOrder.email || 'N/A',
            phone: backendOrder.phone || 'N/A',
            name: `${backendOrder.first_name || ''} ${backendOrder.last_name || ''}`.trim() || 'N/A',
            address: address || 'N/A',
            payment: backendOrder.payment_method || 'N/A',
          },
        }


        setOrder(transformedOrder)
      } catch (err) {
        console.error('❌ Exception while fetching order:', err)
        setError(err.message || 'An error occurred while fetching order details')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  return (
    <Layout full>
      <ViewOrderDesktop order={order} loading={loading} error={error} />
      <ViewOrderMobile order={order} loading={loading} error={error} />
    </Layout>
  )
}

export default ViewOrder
