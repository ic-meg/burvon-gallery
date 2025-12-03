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

// Transform backend order to component format - now returns array of individual items
export const transformOrderToItems = (order) => {
  const orderDate = order.created_at ? new Date(order.created_at) : new Date()
  const deliveryDate = order.expected_delivery ? new Date(order.expected_delivery) : new Date(orderDate.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days from order

  // Transform each item into a separate order entry
  const transformedItems = order.items?.map(item => {
    const itemTotal = parseFloat(item.price || item.product?.current_price || 0) * (item.quantity || 1)
    const currentPrice = parseFloat(item.price || item.product?.current_price || 0)
    const originalPrice = item.product?.original_price ? parseFloat(item.product.original_price) : null

    // Only show old price if it exists AND is different from current price
    const oldPrice = originalPrice && originalPrice !== currentPrice ? originalPrice : null

    return {
      id: `${order.order_id || order.id}-${item.order_item_id || item.id}`, // Unique ID combining order and item
      order_id: order.order_id || order.id,
      items: [{
        name: item.product?.name || 'Product',
        variant: item.product?.collection?.name || item.product?.variant || 'N/A',
        price: currentPrice,
        oldPrice: oldPrice,
        quantity: item.quantity || 1,
        size: item.size || 'N/A',
        image: item.product?.images?.[0] || item.product?.image || 'https://via.placeholder.com/200',
        product_id: item.product_id || item.product?.product_id,
        order_item_id: item.order_item_id || item.id,
      }],
      date: orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      delivery: deliveryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      totalQty: item.quantity || 1,
      subtotal: itemTotal,
      status: order.status,
    }
  }) || []

  return transformedItems
}

// Group orders by tab - flattens items so each item is displayed separately
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

    // Transform order into individual items
    const itemEntries = transformOrderToItems(order)

    // Add each item as a separate entry
    if (grouped[tab]) {
      grouped[tab].push(...itemEntries)
    } else {
      console.warn(`Unknown order status: "${status}" (normalized: "${normalizedStatus}"), defaulting to TO SHIP`)
      grouped['TO SHIP'].push(...itemEntries)
    }
  })

  return grouped
}

