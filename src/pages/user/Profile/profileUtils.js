// Shared utilities for profile pages

// Map backend order status to tab names
export const statusToTab = {
  'Pending': 'TO SHIP',
  'Processing': 'TO SHIP', // Processing orders are also pending shipment
  'Shipped': 'TO RECEIVED',
  'Delivered': 'DELIVERED',
  'Refunded': 'RETURN/REFUND',
  'Cancelled': 'CANCELLED',
}

// Transform backend order to component format
export const transformOrder = (order) => {
  const items = order.items?.map(item => ({
    name: item.product?.name || 'Product',
    variant: item.product?.collection?.name || item.product?.variant || 'N/A',
    price: parseFloat(item.price || item.product?.current_price || 0),
    oldPrice: item.product?.original_price ? parseFloat(item.product.original_price) : null,
    quantity: item.quantity || 1,
    size: item.size || 'N/A',
    image: item.product?.images?.[0] || item.product?.image || 'https://via.placeholder.com/200',
  })) || []

  const orderDate = order.created_at ? new Date(order.created_at) : new Date()
  const deliveryDate = order.expected_delivery ? new Date(order.expected_delivery) : new Date(orderDate.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days from order

  return {
    id: order.order_id || order.id,
    items,
    date: orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    delivery: deliveryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    totalQty: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: parseFloat(order.total_amount || order.subtotal || 0),
    status: order.status,
  }
}

// Group orders by tab
export const groupOrdersByTab = (orders) => {
  const grouped = {
    'TO SHIP': [],
    'TO RECEIVED': [],
    'DELIVERED': [],
    'RETURN/REFUND': [],
    'CANCELLED': [],
  }

  if (!orders || !Array.isArray(orders)) {
    console.warn('groupOrdersByTab: orders is not an array', orders)
    return grouped
  }

  orders.forEach(order => {
    // Normalize status to handle case variations
    const status = order.status ? String(order.status).trim() : 'Pending'
    const normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1)
    
    const tab = statusToTab[normalizedStatus] || statusToTab[status] || 'TO SHIP'
    
    if (grouped[tab]) {
      const transformedOrder = transformOrder(order)
      grouped[tab].push(transformedOrder)
    } else {
      console.warn(`Unknown order status: "${status}" (normalized: "${normalizedStatus}"), defaulting to TO SHIP`)
      grouped['TO SHIP'].push(transformOrder(order))
    }
  })

  // Debug: Log grouped orders count
  // console.log('Orders grouped by tab:', {
  //   'TO SHIP': grouped['TO SHIP'].length,
  //   'TO RECEIVED': grouped['TO RECEIVED'].length,
  //   'DELIVERED': grouped['DELIVERED'].length,
  //   'RETURN/REFUND': grouped['RETURN/REFUND'].length,
  //   'CANCELLED': grouped['CANCELLED'].length,
  // })

  return grouped
}

