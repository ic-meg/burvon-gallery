import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import AdminHeader from "../../components/admin/AdminHeader";
import orderApi from "../../api/orderApi";
import Toast from "../../components/Toast";

import {
NextIConBlack,
PrevIConBlack,  
DropDownIconBlack,
DropUpIconBlack 
} from '../../assets/index.js'


const ViewDetailsModal = ({ isOpen, onClose, order, showToast }) => {
  if (!isOpen || !order) return null;


  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Dynamic order details heree
  const getOrderDetails = (order) => {
    if (!order) return null;

    const baseOrder = {
      id: order.id,
      orderDate: order.date,
      items: (order.items || []).map(item => ({
        id: item.order_item_id || item.id,
        image: item.product?.images?.[0] || "/api/placeholder/80/80",
        name: item.name || "Product Name",
        sku: item.product?.sku || item.sku || "N/A",
        quantity: item.quantity || 1,
        size: item.size || "One Size",
        price: `₱ ${parseFloat(item.price || 0).toFixed(2)}`,
        subtotal: `₱ ${(parseFloat(item.price || 0) * (item.quantity || 1)).toFixed(2)}`
      })),
      pricing: {
        subtotal: `₱ ${parseFloat(order.rawTotalPrice || 0).toFixed(2)}`,
        shipping: `₱ 80.00`,
        discount: "-",
        total: order.amount || "₱ 0.00"
      },
      customer: {
        name: order.customer,
        email: order.email || "N/A",
        phone: order.phone || "N/A"
      },
      shipping: {
        name: order.shipping?.name || order.customer,
        address: order.shipping?.address || "N/A",
        barangay: order.shipping?.barangay || "N/A",
        city: order.shipping?.city || "N/A",
        province: order.shipping?.province || "N/A",
        postalCode: order.shipping?.postalCode || "N/A"
      },
      payment: {
        method: order.payment?.method || "N/A",
        status: order.payment?.status || "PAID",
        transactionId: order.payment?.transactionId || "N/A",
        paymentDate: order.payment?.paymentDate || order.date
      },
      notes: order.notes || "No special instructions"
    };

    const orderStatus = order.status?.toLowerCase();
    
    switch (orderStatus) {
      case 'processing':
        return {
          ...baseOrder,
          status: 'Processing',
          processing: {
            currentStage: "Packaging",
            estimatedShipping: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric'
            }),
            courier: "Standard Shipping"
          }
        };
      case 'shipped':
        return {
          ...baseOrder,
          status: 'Shipped',
          shipping: {
            ...baseOrder.shipping,
            trackingNumber: order.shipping?.trackingNumber || 'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            courier: order.shipping?.courier || "Standard Shipping",
            shippedDate: order.shipping?.shippedDate || new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric'
            }),
            estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric'
            })
          }
        };
      case 'completed':
      case 'delivered':
        return {
          ...baseOrder,
          status: 'Completed',
          completion: {
            deliveredDate: order.deliveredDate || new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric'
            }),
            receivedBy: order.receivedBy || order.customer
          }
        };
      case 'return':
      case 'refund':
        return {
          ...baseOrder,
          status: 'Return/Refund',
          returnRefund: {
            deliveredDate: order.returnRefund?.deliveredDate || "N/A",
            requestDate: order.returnRefund?.requestDate || "N/A",
            reason: order.returnRefund?.reason || "No reason provided",
            refundAmount: order.returnRefund?.refundAmount || baseOrder.pricing.total
          },
          returnItems: order.returnItems || baseOrder.items,
          returnDescription: order.returnDescription || "No description provided",
          returnProof: {
            images: order.returnProof?.images || [],
            videos: order.returnProof?.videos || []
          }
        };
      case 'cancellation':
      case 'cancelled':
        return {
          ...baseOrder,
          status: 'Cancellation',
          cancellation: {
            reason: order.cancellation?.reason || "Customer request",
            cancelledDate: order.cancellation?.cancelledDate || order.date
          }
        };
      default:
        return { ...baseOrder, status: 'Pending' };
    }
  };

  const orderDetails = getOrderDetails(order);

  const getStatusStyle = (status) => {
    const styles = {
      'Pending': 'bg-gray-100 text-gray-800 border border-gray-300',
      'Processing': 'bg-blue-100 text-blue-800 border border-blue-300',
      'Shipped': 'bg-purple-100 text-purple-800 border border-purple-300',
      'Completed': 'bg-green-100 text-green-800 border border-green-300',
      'Return/Refund': 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      'Cancellation': 'bg-red-100 text-red-800 border border-red-300'
    };
    return styles[status] || styles['Pending'];
  };

  const renderRightColumn = () => {
    switch (orderDetails.status) {
      case 'Processing':
        return (
          <div>
            <h3 className="text-xl bebas text-black mb-3">PROCESSING INFORMATION</h3>
            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-xl avantbold text-black mb-1">Current Stage</label>
                <div>
                  <span className="bg-blue-100 text-blue-800 border border-blue-300 px-6 py-1 rounded-2xl text-lg font-medium avant">
                    {orderDetails.processing.currentStage}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-xl avantbold text-black mb-1">Estimated Shipping</label>
                <div className="text-lg text-black avant">{orderDetails.processing.estimatedShipping}</div>
              </div>
              <div>
                <label className="block text-xl avantbold text-black mb-1">Courier</label>
                <div className="text-lg text-black avant">{orderDetails.processing.courier}</div>
              </div>
            </div>
            {renderPricingSummary()}
          </div>
        );

      case 'Shipped':
        return (
          <div>
            <h3 className="text-xl bebas text-black mb-3">SHIPPING INFORMATION</h3>
            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-xl avantbold text-black mb-1">Tracking Number</label>
                <div className="text-lg text-black avant">{orderDetails.shipping.trackingNumber}</div>
              </div>
              <div>
                <label className="block text-xl avantbold text-black mb-1">Courier</label>
                <div className="text-lg text-black avant">{orderDetails.shipping.courier}</div>
              </div>
              <div>
                <label className="block text-xl avantbold text-black mb-1">Shipped Date</label>
                <div className="text-lg text-black avant">{orderDetails.shipping.shippedDate}</div>
              </div>
              <div>
                <label className="block text-xl avantbold text-black mb-1">Estimated Delivery</label>
                <div className="text-lg text-black avant">{orderDetails.shipping.estimatedDelivery}</div>
              </div>
            </div>
            {renderPricingSummary()}
          </div>
        );

      case 'Completed':
        return (
          <div>
            <h3 className="text-xl bebas text-black mb-3">DELIVERY INFORMATION</h3>
            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-xl avantbold text-black mb-1">Delivered Date</label>
                <div className="text-lg text-black avant">{orderDetails.completion.deliveredDate}</div>
              </div>
              <div>
                <label className="block text-xl avantbold text-black mb-1">Received By</label>
                <div className="text-lg text-black avant">{orderDetails.completion.receivedBy}</div>
              </div>
            </div>
            {renderPricingSummary()}
          </div>
        );

      case 'Cancellation':
        return (
          <div>
            <h3 className="text-xl bebas text-black mb-3">CANCELLATION DETAILS</h3>
            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-xl avantbold text-black mb-1">Reason</label>
                <div className="text-lg text-black avant">{orderDetails.cancellation.reason}</div>
              </div>
              <div>
                <label className="block text-xl avantbold text-black mb-1">Cancelled Date</label>
                <div className="text-lg text-black avant">{orderDetails.cancellation.cancelledDate}</div>
              </div>
            </div>
            {renderPricingSummary()}
          </div>
        );

      default: // Pending
        return (
          <div>
            <h3 className="text-xl bebas text-black mb-3">PAYMENT DETAILS</h3>
            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-xl avantbold text-black mb-1">Payment Method</label>
                <div className="text-lg text-black avant">{orderDetails.payment.method}</div>
              </div>
              <div>
                <label className="block text-xl avantbold text-black mb-1">Payment Status</label>
                <div>
                  <span className="bg-green-100 text-green-800 border border-green-300 px-6 py-1 rounded-2xl text-lg font-medium avant">
                    {orderDetails.payment.status}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-xl avantbold text-black mb-1">Transaction ID</label>
                <div className="text-lg text-black avant">{orderDetails.payment.transactionId}</div>
              </div>
              <div>
                <label className="block text-xl avantbold text-black mb-1">Payment Date</label>
                <div className="text-lg text-black avant">{orderDetails.payment.paymentDate}</div>
              </div>
            </div>
            {renderPricingSummary()}
          </div>
        );
    }
  };

  // Pricing summary component
  const renderPricingSummary = () => (
    <div className="bg-gray-50 border-2 border-black rounded-lg p-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 avantbold">Subtotal ( {orderDetails.items.length} items )</span>
          <span className="text-sm font-medium text-black avant">{orderDetails.pricing.subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 avantbold">Shipping</span>
          <span className="text-sm font-medium text-black avant">{orderDetails.pricing.shipping}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 avantbold">Discount</span>
          <span className="text-sm font-medium text-black avant">{orderDetails.pricing.discount}</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between">
            <span className="text-base font-medium text-black avantbold">TOTAL</span>
            <span className="text-base font-bold text-black avantbold">{orderDetails.pricing.total}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActionButtons = () => {
    const handleStatusUpdate = async (newStatus) => {
      try {
        const response = await orderApi.updateOrderStatus(order.orderId, newStatus);
        if (response.error) {
          if (newStatus === 'Shipped' && response.error.includes('tracking')) {
            showToast(`Cannot mark as shipped: ${response.error}`, 'error');
          } else {
            showToast(`Failed to update order: ${response.error}`, 'error');
          }
        } else {
          showToast(`Order marked as ${newStatus}`, 'success');
          setTimeout(() => {
            onClose(); 
          }, 500);
        }
      } catch (error) {
        showToast('Error updating order status', 'error');
      }
    };

    switch (orderDetails.status) {
      case 'Pending':
        return (
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <button 
              onClick={() => handleStatusUpdate('Cancelled')}
              className="px-6 py-2 bg-transparent border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors avant text-sm font-medium"
            >
              CANCEL ORDER
            </button>
            <button 
              onClick={() => handleStatusUpdate('Processing')}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors avant text-sm font-medium"
            >
              ACCEPT ORDER
            </button>
          </div>
        );

      case 'Processing':
        return (
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-transparent border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors avant text-sm font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={() => console.log('Print waybill')}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors avant text-sm font-medium"
            >
              Print Waybill
            </button>
            <button 
              onClick={() => handleStatusUpdate('Shipped')}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors avant text-sm font-medium"
            >
              MARK AS SHIPPED
            </button>
          </div>
        );

      case 'Shipped':
        return (
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-transparent border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors avant text-sm font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={() => handleStatusUpdate('Delivered')}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors avant text-sm font-medium"
            >
              MARK AS DELIVERED
            </button>
          </div>
        );

      case 'Return/Refund':
        return (
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <button 
              onClick={() => handleStatusUpdate('Rejected')}
              className="px-6 py-2 bg-transparent border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors avant text-sm font-medium"
            >
              Reject
            </button>
            <button 
              onClick={() => handleStatusUpdate('Refunded')}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors avant text-sm font-medium"
            >
              Approve
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  const renderReturnRefundLayout = () => {
    if (orderDetails.status !== 'Return/Refund') {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Customer Details */}
          <div>
            <h3 className="text-xl bebas text-black mb-3">CUSTOMER DETAILS</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-lg avantbold text-black mb-1">Name</label>
                <div className="text-lg text-black avant">{orderDetails.customer.name}</div>
              </div>
              <div>
                <label className="block text-lg avantbold text-black mb-1">Email</label>
                <div className="text-lg text-black avant">{orderDetails.customer.email}</div>
              </div>
              <div>
                <label className="block text-lg avantbold text-black mb-1">Phone</label>
                <div className="text-lg text-black avant">{orderDetails.customer.phone}</div>
              </div>
            </div>
            {/* Notes section for non-return/refund statuses */}
            {orderDetails.status !== 'Return/Refund' && orderDetails.status !== 'Cancellation' && (
              <div className="mt-4" style={{ maxWidth: '600px' }}>
                <h3 className="text-xl bebas text-black mb-3">NOTES</h3>
                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                  <p className="text-lg text-black avant">{orderDetails.notes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Middle Column - Shipping Address */}
          <div>
            <h3 className="text-xl bebas text-black mb-3">SHIPPING ADDRESS</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xl avantbold text-black mb-1">Name</label>
                <div className="text-lg text-black avant">{orderDetails.shipping.name}</div>
              </div>
              <div>
                <label className="block text-xl avantbold text-black mb-1">Address</label>
                <div className="text-lg text-black avant">
                  {orderDetails.shipping.address}, {orderDetails.shipping.barangay}, {orderDetails.shipping.city}, {orderDetails.shipping.province}, {orderDetails.shipping.postalCode}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Status-specific content */}
          {renderRightColumn()}
        </div>
      );
    }

    // Special layout for Return/Refund
    return (
      <>
        {/* First Row - Customer Details, Shipping Address, Payment Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Customer Details */}
          <div>
            <h3 className="text-xl bebas text-black mb-3">CUSTOMER DETAILS</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-lg avantbold text-black mb-1">Name</label>
                <div className="text-lg text-black avant">{orderDetails.customer.name}</div>
              </div>
              <div>
                <label className="block text-lg avantbold text-black mb-1">Email</label>
                <div className="text-lg text-black avant">{orderDetails.customer.email}</div>
              </div>
              <div>
                <label className="block text-lg avantbold text-black mb-1">Phone</label>
                <div className="text-lg text-black avant">{orderDetails.customer.phone}</div>
              </div>
            </div>
          </div>

          {/* Middle Column - Shipping Address */}
          <div>
            <h3 className="text-xl bebas text-black mb-3">SHIPPING ADDRESS</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xl avantbold text-black mb-1">Name</label>
                <div className="text-lg text-black avant">{orderDetails.shipping.name}</div>
              </div>
              <div>
                <label className="block text-xl avantbold text-black mb-1">Address</label>
                <div className="text-lg text-black avant">
                  {orderDetails.shipping.address}, {orderDetails.shipping.barangay}, {orderDetails.shipping.city}, {orderDetails.shipping.province}, {orderDetails.shipping.postalCode}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Details */}
          <div>
            <h3 className="text-xl bebas text-black mb-3">PAYMENT DETAILS</h3>
            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-xl avantbold text-black mb-1">Payment Method</label>
                <div className="text-lg text-black avant">{orderDetails.payment.method}</div>
              </div>
              <div>
                <label className="block text-xl avantbold text-black mb-1">Payment Status</label>
                <div>
                  <span className="bg-green-100 text-green-800 border border-green-300 px-6 py-1 rounded-2xl text-lg font-medium avant">
                    {orderDetails.payment.status}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-xl avantbold text-black mb-1">Transaction ID</label>
                <div className="text-lg text-black avant">{orderDetails.payment.transactionId}</div>
              </div>
              <div>
                <label className="block text-xl avantbold text-black mb-1">Payment Date</label>
                <div className="text-lg text-black avant">{orderDetails.payment.paymentDate}</div>
              </div>
            </div>
            {renderPricingSummary()}
          </div>
        </div>

        {/* Second Row - Return/Refund Information and Return Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Return/Refund Information */}
          <div>
            <h3 className="text-xl bebas text-black mb-3">RETURN/REFUND INFORMATION</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xl avantbold text-black mb-1">Delivered Date</label>
                <div className="text-lg text-black avant">{orderDetails.returnRefund.deliveredDate}</div>
              </div>
              <div>
                <label className="block text-xl avantbold text-black mb-1">Request Date</label>
                <div className="text-lg text-black avant">{orderDetails.returnRefund.requestDate}</div>
              </div>
              <div>
                <label className="block text-xl avantbold text-black mb-1">Return Reason</label>
                <div className="text-lg text-black avant">{orderDetails.returnRefund.reason}</div>
              </div>
              <div>
                <label className="block text-xl avantbold text-black mb-1">Refund Amount</label>
                <div className="text-lg text-black avant">{orderDetails.returnRefund.refundAmount}</div>
              </div>
            </div>
          </div>

          {/* Right Column - Return Items with image layout */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl bebas text-black">RETURN ITEMS</h3>
              <span className="bebas text-xl text-black">SUBTOTAL</span>
            </div>
            {orderDetails.returnItems.map((item) => (
              <div key={item.sku} className="flex items-start justify-between mb-6">
                <div>
                  <div className="avantbold text-lg text-black mb-1">{item.name}</div>
                  <div className="avant text-base text-black mb-1" style={{ fontWeight: 500 }}>
                    {item.subtitle}
                  </div>
                  <div className="avant text-sm text-black">
                    <span className="block mb-1">
                      SKU: <span className="avantbold">{item.sku}</span>
                    </span>
                    <span className="block opacity-60 avantbold">
                      QUANTITY: {item.quantity}
                    </span>
                  </div>
                </div>
                <div className="avantbold text-2xl text-black flex-shrink-0" style={{ minWidth: 110, textAlign: "right" }}>
                  {item.subtotal}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Third Row - Return Description */}
        <div className="mb-8">
          <h3 className="text-xl bebas text-black mb-3">RETURN DESCRIPTION</h3>
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
            <p className="text-lg text-black avant">{orderDetails.returnDescription}</p>
          </div>
        </div>

        {/* Fourth Row - Images and Video Proof */}
        <div className="mb-8">
          <h3 className="text-xl bebas text-black mb-3">IMAGES AND VIDEO PROOF</h3>

          {/* Images */}
          <div className="mb-6">
            <h4 className="text-lg avantbold text-black mb-3">Images</h4>
            <div className="grid grid-cols-3 gap-4">
              {orderDetails.returnProof.images.map((image, index) => (
                <div key={index} className="w-full h-40 bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={image} 
                    alt={`Return proof ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Videos */}
          <div>
            <h4 className="text-lg avantbold text-black mb-3">Videos</h4>
            <div className="grid grid-cols-2 gap-4">
              {orderDetails.returnProof.videos.map((video, index) => (
                <div key={index} className="w-full h-40 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">▶️</div>
                    <div className="text-sm avant text-gray-600">Video {index + 1}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'blur(5px)'
      }}
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl border-2 border-black w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl avantbold text-black">ORDER ID: {orderDetails.id}</h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-3 py-1 rounded-full text-xs font-medium avant ${getStatusStyle(orderDetails.status)}`}>
                {orderDetails.status}
              </span>
              <span className="text-sm avant text-gray-600">Order Date: {orderDetails.orderDate}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-2xl text-black hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">

          {/* Items Section */}
          <div>
            <div className="grid grid-cols-6 gap-4 text-lg font-medium text-black bebas uppercase mb-4 pb-2 border-b border-gray-200">
              <div className="col-span-2">ITEM/S</div>
              <div className="text-center">SKU</div>
              <div className="text-center">QUANTITY</div>
              <div className="text-center">PRICE</div>
              <div className="text-center">SUBTOTAL</div>
            </div>

            {orderDetails.items && orderDetails.items.length > 0 ? (
              orderDetails.items.map((item, index) => (
                <div key={item.id || index} className="grid grid-cols-6 gap-4 items-center py-4 border-b border-gray-100">
                <div className="col-span-2 flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0">
                    <img 
                        src={item.image || item.product?.image || "/api/placeholder/80/80"} 
                        alt={item.name || item.product?.name || "Product"}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div>
                      <h4 className="font-medium text-black avant">{item.name || item.product?.name || "Product Name"}</h4>
                    {item.size && <p className="text-sm text-gray-500 avant uppercase">SIZE: {item.size}</p>}
                  </div>
                </div>
                  <div className="text-center text-sm text-gray-600 avant uppercase">{item.sku || item.product?.sku || "N/A"}</div>
                  <div className="text-center font-medium text-black avant">{item.quantity || 1}</div>
                  <div className="text-center font-medium text-black avant">{item.price || item.product?.price || "₱ 0.00"}</div>
                  <div className="text-center font-medium text-black avant">{item.subtotal || item.total || "₱ 0.00"}</div>
              </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-500 avant">
                No items found for this order
              </div>
            )}
          </div>

          {/* Dynamic layout based on status */}
          {renderReturnRefundLayout()}

          {renderActionButtons()}

        </div>
      </div>
    </div>
  );
};

const AdminOrders = ({ hasAccess = true }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFromUrl = searchParams.get('status');
  
  // Map URL status to tab ID
  const getTabFromStatus = (status) => {
    if (!status) return 'all';
    const statusLower = status.toLowerCase();
    if (statusLower === 'pending') return 'pending';
    if (statusLower.includes('return') || statusLower.includes('refund')) return 'return';
    if (statusLower.includes('cancel')) return 'cancellation';
    return 'all';
  };
  
  const [activeTab, setActiveTab] = useState(statusFromUrl ? getTabFromStatus(statusFromUrl) : 'all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [dateSort, setDateSort] = useState('newest');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  
  // Update activeTab when URL status changes
  useEffect(() => {
    if (statusFromUrl) {
      const tab = getTabFromStatus(statusFromUrl);
      setActiveTab(tab);
    }
  }, [statusFromUrl]);

  // Single modal state
  const [showViewDetailsModal, setShowViewDetailsModal] = useState(false);
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState(null);

  // Dynamic data state
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0
  });

  // Toast state
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  const itemsPerPage = 5;

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: 'success' });
  };

  const fetchOrders = async (status = 'all', page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      if (status === 'all') {
        response = await orderApi.fetchAllOrders();
      } else {
        response = await orderApi.fetchOrdersByStatus(status);
      }

      if (response.error) {
        setError(response.error);
        setOrders([]);
        showToast(`Failed to fetch orders: ${response.error}`, 'error');
      } else {
        let allOrders = [];
        
        if (Array.isArray(response.data)) {
          allOrders = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          allOrders = response.data.data;
        } else if (response.data && Array.isArray(response.data.orders)) {
          allOrders = response.data.orders;
        }
        
        const transformedOrders = allOrders.map(order => transformOrderData(order));
        
        setOrders(transformedOrders);
        setPagination({
          page: 1,
          limit: itemsPerPage,
          total: transformedOrders.length,
          totalPages: Math.ceil(transformedOrders.length / itemsPerPage)
        });
       
      }
    } catch (err) {
      setError('Failed to fetch orders');
      setOrders([]);
      showToast('Network error: Failed to fetch orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders('all', 1);
  }, [activeTab, currentPage]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders('all', currentPage);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [currentPage]);

  // Handle tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1); // Reset to first page when changing tabs
   
  };

  // Transform order data for display
  const transformOrderData = (order) => {
    
    const itemsArray = Array.isArray(order.items) ? order.items : [];
    const computedSubtotal = itemsArray.reduce((sum, item) => {
      const price = parseFloat(item?.price ?? 0);
      const qty = parseInt(item?.quantity ?? 1);
      return sum + (isNaN(price) ? 0 : price) * (isNaN(qty) ? 1 : qty);
    }, 0);

    const totalPriceFromOrder = parseFloat(order.total_price || 0);
    const subtotalToUse = computedSubtotal > 0 ? computedSubtotal : totalPriceFromOrder;

    const shippingCost = parseFloat(order.shipping_cost || 0);
    const totalAmount = subtotalToUse + shippingCost;
    
    const customerName = order.user ? 
      `${order.user.first_name || ''} ${order.user.last_name || ''}`.trim() : 
      `${order.first_name || ''} ${order.last_name || ''}`.trim();
    
    const orderId = order.order_id || order.id || 'N/A';
    const transformedOrder = {
      id: `#${orderId}`,
      customer: customerName || 'N/A',
      amount: `₱ ${totalAmount.toFixed(2)}`,
      status: order.status || 'Pending',
      date: new Date(order.created_at || Date.now()).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      }),
      orderId: orderId,
      email: order.email || 'N/A',
      phone: order.phone || 'N/A',
      items: itemsArray,
      shipping: {
        name: `${order.first_name || ''} ${order.last_name || ''}`.trim() || 'N/A',
        address: order.street_address || 'N/A',
        barangay: order.barangay || 'N/A',
        city: order.city_municipality || 'N/A',
        province: order.province_region || 'N/A',
        postalCode: order.postal_code || 'N/A',
        cost: shippingCost.toFixed(2),
        trackingNumber: order.tracking_number || 'N/A',
        shippedDate: order.shipped_date ? new Date(order.shipped_date).toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric'
        }) : 'N/A',
        courier: order.courier || 'Standard Shipping'
      },
      notes: order.notes || 'No special instructions',
      payment: {
        method: order.payment_method || 'N/A',
        status: 'PAID',
        transactionId: order.checkout_session_id || 'N/A',
        paymentDate: new Date(order.created_at || Date.now()).toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      },
     rawTotalPrice: subtotalToUse.toFixed(2)
    };
    
    return transformedOrder;
  };

  const handleViewDetails = (order) => {
    setSelectedOrderForDetails(order);
    setShowViewDetailsModal(true);
    showToast(`Viewing details for order ${order.id}`, 'success');
  };

  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    // Filter by active tab status
    if (activeTab !== 'all') {
      filtered = filtered.filter(order => {
        const orderStatus = order.status?.toLowerCase();
        if (activeTab === 'pending') return orderStatus === 'pending';
        if (activeTab === 'processing') return orderStatus === 'processing';
        if (activeTab === 'shipped') return orderStatus === 'shipped';
        if (activeTab === 'completed') return orderStatus === 'completed' || orderStatus === 'delivered';
        if (activeTab === 'return') return orderStatus === 'return' || orderStatus === 'refund';
        if (activeTab === 'cancellation') return orderStatus === 'cancellation' || orderStatus === 'cancelled';
        return true;
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.amount.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by date
    filtered = [...filtered].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (dateSort === 'newest') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedFiltered = filtered.slice(startIndex, endIndex);

    return paginatedFiltered;
  }, [orders, activeTab, searchQuery, dateSort, currentPage]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Calculate counts for each tab based on all orders (not filtered)
  const getTabCounts = () => {
    if (!orders || orders.length === 0) {
    return {
        all: 0,
        pending: 0,
        processing: 0,
        shipped: 0,
        completed: 0,
        return: 0,
        cancellation: 0,
      };
    }

    // Count orders by status (orders are already transformed)
    const counts = orders.reduce((acc, order) => {
      const status = order.status?.toLowerCase();
      if (status === 'pending') acc.pending++;
      else if (status === 'processing') acc.processing++;
      else if (status === 'shipped') acc.shipped++;
      else if (status === 'completed' || status === 'delivered') acc.completed++;
      else if (status === 'return' || status === 'refund') acc.return++;
      else if (status === 'cancellation' || status === 'cancelled') acc.cancellation++;
      return acc;
    }, {
      pending: 0,
      processing: 0,
      shipped: 0,
      completed: 0,
      return: 0,
      cancellation: 0,
    });

    return {
      all: orders.length,
      ...counts
    };
  };

  const tabCounts = getTabCounts();

  // Tab configuration with dynamic counts
  const tabs = [
    { id: 'all', label: 'ALL ORDERS', count: tabCounts.all },
    { id: 'pending', label: 'PENDING', count: tabCounts.pending },
    { id: 'processing', label: 'PROCESSING', count: tabCounts.processing },
    { id: 'shipped', label: 'SHIPPED', count: tabCounts.shipped },
    { id: 'completed', label: 'COMPLETED', count: tabCounts.completed },
    { id: 'return', label: 'RETURN/REFUND', count: tabCounts.return },
    { id: 'cancellation', label: 'CANCELLATION', count: tabCounts.cancellation }
  ];

  // Pagination calculations
  const allFilteredOrders = useMemo(() => {
    let filtered = [...orders];

    // Filter by active tab status
    if (activeTab !== 'all') {
      filtered = filtered.filter(order => {
        const orderStatus = order.status?.toLowerCase();
        if (activeTab === 'pending') return orderStatus === 'pending';
        if (activeTab === 'processing') return orderStatus === 'processing';
        if (activeTab === 'shipped') return orderStatus === 'shipped';
        if (activeTab === 'completed') return orderStatus === 'completed' || orderStatus === 'delivered';
        if (activeTab === 'return') return orderStatus === 'return' || orderStatus === 'refund';
        if (activeTab === 'cancellation') return orderStatus === 'cancellation' || orderStatus === 'cancelled';
        return true;
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.amount.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [orders, activeTab, searchQuery]);

  const totalPages = Math.ceil(allFilteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders;

  // Reset to page 1 when tab, search, or sort changes
  React.useEffect(() => {
    setCurrentPage(1);
    setSelectAll(false);
    setSelectedOrders([]);
    
    // Show toast for search changes
    if (searchQuery.trim()) {
    }
  }, [activeTab, searchQuery, dateSort]);

  // Handle select all functionality
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedOrders(paginatedOrders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  // Handle individual order selection
  const handleOrderSelect = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
      showToast('Order deselected', 'success');
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
      showToast('Order selected', 'success');
    }
  };

  // Handle accept order functionality
  const handleAcceptOrder = async () => {
    try {
      const selectedCount = selectedOrders.length;
      for (const orderId of selectedOrders) {
        const response = await orderApi.updateOrderStatus(orderId, 'Processing');
        if (response.error) {
          showToast(`Failed to update order ${orderId}: ${response.error}`, 'error');
          return;
        }
      }
      setSelectedOrders([]);
      setSelectAll(false);
      showToast(`Successfully accepted ${selectedCount} order(s)`, 'success');
      
      // Add a small delay to ensure database update is complete, then refresh
      setTimeout(async () => {
        await fetchOrders('all', 1);
      }, 500);
    } catch (error) {
      console.error('Error accepting orders:', error);
      showToast('Error accepting orders', 'error');
    }
  };

  // Handle print waybill functionality
  const handlePrintWaybill = () => {
    showToast(`Printing waybills for ${selectedOrders.length} order(s)`, 'success');
  };

  // Handle mark as shipped functionality
  const handleMarkAsShipped = async () => {
    try {
      const selectedCount = selectedOrders.length;
      for (const orderId of selectedOrders) {
        const response = await orderApi.updateOrderStatus(orderId, 'Shipped');
        if (response.error) {
          showToast(`Failed to update order ${orderId}: ${response.error}`, 'error');
          return;
        }
      }
      setSelectedOrders([]);
      setSelectAll(false);
      showToast(`Successfully marked ${selectedCount} order(s) as shipped`, 'success');
      
      // Add a small delay to ensure database update is complete, then refresh
      setTimeout(async () => {
        await fetchOrders('all', 1);
      }, 500);
    } catch (error) {
      console.error('Error marking orders as shipped:', error);
      showToast('Error marking orders as shipped', 'error');
    }
  };

  // Handle mark as delivered functionality
  const handleMarkAsDelivered = async () => {
    try {
      const selectedCount = selectedOrders.length;
      for (const orderId of selectedOrders) {
        const response = await orderApi.updateOrderStatus(orderId, 'Delivered');
        if (response.error) {
          showToast(`Failed to update order ${orderId}: ${response.error}`, 'error');
          return;
        }
      }
      setSelectedOrders([]);
      setSelectAll(false);
      showToast(`Successfully marked ${selectedCount} order(s) as delivered`, 'success');
      
      // Add a small delay to ensure database update is complete, then refresh
      setTimeout(async () => {
        await fetchOrders('all', 1);
      }, 500);
    } catch (error) {
      console.error('Error marking orders as delivered:', error);
      showToast('Error marking orders as delivered', 'error');
    }
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusStyles = {
      'Pending': 'bg-gray-100 text-gray-800 border border-gray-300',
      'Processing': 'bg-blue-100 text-blue-800 border border-blue-300',
      'Shipped': 'bg-purple-100 text-purple-800 border border-purple-300',
      'Completed': 'bg-green-100 text-green-800 border border-green-300',
      'Return/Refund': 'bg-yellow-100 text-yellow-800 border border-yellow-300 text-xs',
      'Cancellation': 'bg-red-100 text-red-800 border border-red-300'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium avant ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader />

      {/* Page Header */}
      <div className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-5xl bebas text-black">
              ORDERS MANAGEMENT
            </h1>

            {/* Search Bar and Date Sort */}
            <div className="flex items-center space-x-4">
              {/* Date Sort Dropdown */}
              <div className="relative dropdown-container">
                <button
                  type="button"
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center justify-between px-4 py-2 border-2 metallic-text border-gray-300 rounded-lg bg-white focus:outline-none focus:border-black avant text-sm select-none w-36"
                >
                  <span>{dateSort === "newest" ? "Newest First" : "Oldest First"}</span>
                  <img
                    src={showSortDropdown ? DropUpIconBlack : DropDownIconBlack}
                    alt="dropdown"
                    className="w-4 h-4 opacity-70"
                  />
                </button>
                {showSortDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50">
                    <button
                      onClick={() => {
                        setDateSort("newest");
                        setShowSortDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm avant metallic-text hover:bg-gray-50 transition-colors rounded-t-lg ${
                        dateSort === "newest" ? "bg-gray-100 font-medium" : ""
                      }`}
                      type="button"
                    >
                      Newest First
                    </button>
                    <button
                      onClick={() => {
                        setDateSort("oldest");
                        setShowSortDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm avant metallic-text hover:bg-gray-50 transition-colors rounded-b-lg ${
                        dateSort === "oldest" ? "bg-gray-100 font-medium" : ""
                      }`}
                      type="button"
                    >
                      Oldest First
                    </button>
                  </div>
                )}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Orders"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 px-4 py-2 border-2 metallic-text border-gray-300 rounded-lg focus:outline-none focus:border-black avant"
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Orders Content */}
      <div className="px-6 pb-6">
        <div className="max-w-7xl mx-auto">

          {/* Status Tabs with horizontal line and conditional buttons */}
          <div className="relative mb-6">
            {/* Long horizontal line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-300"></div>

            {/* Tabs and Buttons Container */}
            <div className="flex justify-between items-end">
              {/* Tabs */}
              <div className="flex space-x-8 relative">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center space-x-2 pb-3 relative transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'text-black'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span className="avant font-medium text-sm">{tab.label}</span>
                    <span className={`px-2 py-1 rounded-full text-xs avant ${
                      activeTab === tab.id
                        ? 'bg-black text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>

                    {/* Active tab indicator line */}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
                    )}
                  </button>
                ))}
              </div>

              {/* Conditional Buttons for Pending Tab */}
              {activeTab === 'pending' && (
                <div className="flex items-center space-x-4 pb-3">
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center space-x-2 px-4 py-2 transition-colors avant text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="w-4 h-4 border-2 border-black rounded checked:bg-black checked:border-black checked:accent-black cursor-pointer transition"
                    />
                    <span>SELECT ALL</span>
                  </button>
                  <button
                    onClick={handleAcceptOrder}
                    disabled={selectedOrders.length === 0 || !hasAccess}
                    title={!hasAccess ? 'You do not have permission to perform this action' : ''}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors avantbold text-sm"
                  >
                    ACCEPT ORDER
                  </button>
                </div>
              )}

              {/* Conditional Buttons for Processing Tab */}
              {activeTab === 'processing' && (
                <div className="flex items-end pb-3">
                  <div className="flex flex-col items-end">
                    <button
                      onClick={handlePrintWaybill}
                      disabled={selectedOrders.length === 0 || !hasAccess}
                      title={!hasAccess ? 'You do not have permission to perform this action' : ''}
                      className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors avantbold text-sm whitespace-nowrap mb-2"
                    >
                      PRINT WAYBILL
                    </button>
                    <div className="flex flex-row items-center space-x-4">
                      <button
                        onClick={handleSelectAll}
                        className="flex items-center space-x-2 px-4 py-2 transition-colors avant text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          className="w-4 h-4 border-2 border-black rounded checked:bg-black checked:border-black checked:accent-black cursor-pointer transition"
                        />
                        <span>SELECT ALL</span>
                      </button>
                      <button
                        onClick={handleMarkAsShipped}
                        disabled={selectedOrders.length === 0 || !hasAccess}
                        title={!hasAccess ? 'You do not have permission to perform this action' : ''}
                        className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors avantbold text-sm whitespace-nowrap"
                      >
                        MARK AS SHIPPED
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Conditional Buttons for Shipped Tab */}
              {activeTab === 'shipped' && (
                <div className="flex items-center space-x-4 pb-3">
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center space-x-2 px-4 py-2 transition-colors avant text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="w-4 h-4 border-2 border-black rounded checked:bg-black checked:border-black checked:accent-black cursor-pointer transition"
                    />
                    <span>SELECT ALL</span>
                  </button>
                  <button
                    onClick={handleMarkAsDelivered}
                    disabled={selectedOrders.length === 0 || !hasAccess}
                    title={!hasAccess ? 'You do not have permission to perform this action' : ''}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors avantbold text-sm font-medium"
                  >
                    MARK AS DELIVERED
                  </button>
                </div>
              )}

            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white border-2 border-[#000000] rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 px-6 py-4">
              <div className={`grid gap-4 text-sm font-medium text-[#000000] avantbold uppercase ${
                (activeTab === 'pending' || activeTab === 'processing' || activeTab === 'shipped') ? 'grid-cols-7' : 'grid-cols-6'
              }`}>
                {(activeTab === 'pending' || activeTab === 'processing' || activeTab === 'shipped') && <div>SELECT</div>}
                <div>ORDER ID</div>
                <div>CUSTOMER</div>
                <div>AMOUNT</div>
                <div>STATUS</div>
                <div>ORDER DATE</div>
                <div>ACTIONS</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {loading ? (
                <div className="px-6 py-8 text-center text-gray-500 avant">
                  Loading orders...
                </div>
              ) : error ? (
                <div className="px-6 py-8 text-center text-red-500 avant">
                  Error: {error}
                </div>
              ) : paginatedOrders.length > 0 ? (
                paginatedOrders.map((order, index) => (
                  <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className={`grid gap-4 items-center ${
                      (activeTab === 'pending' || activeTab === 'processing' || activeTab === 'shipped') ? 'grid-cols-7' : 'grid-cols-6'
                    }`}>
                      {/* Checkbox for Pending, Processing, and Shipped Tabs */}
                      {(activeTab === 'pending' || activeTab === 'processing' || activeTab === 'shipped') && (
                        <div>
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order.orderId)}
                            onChange={() => handleOrderSelect(order.orderId)}
                            className="w-4 h-4 border-2 border-black rounded checked:bg-black checked:border-black checked:accent-black cursor-pointer transition"
                          />
                        </div>
                      )}

                      {/* Order ID */}
                      <div className="font-medium text-black avant">
                        {order.id}
                      </div>

                      {/* Customer */}
                      <div className="text-gray-900 avant">
                        {order.customer}
                      </div>

                      {/* Amount */}
                      <div className="font-medium text-black avant">
                        {order.amount}
                      </div>

                      {/* Status */}
                      <div>
                        {getStatusBadge(order.status)}
                      </div>

                      {/* Order Date */}
                      <div className="text-gray-900 avant">
                        {order.date}
                      </div>

                      {/* Actions */}
                      <div>
                        <button 
                          onClick={() => handleViewDetails(order)}
                          className="px-4 py-2 bg-transparent border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors avantbold text-sm"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center text-gray-500 avant">
                  No orders found matching your criteria.
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 w-full">
              <div
                className="inline-flex items-stretch border border-black rounded-full overflow-hidden bg-white"
                style={{ height: 44 }}
              >
                <button
                  onClick={() => {
                    setCurrentPage(Math.max(1, currentPage - 1));
                    showToast(`Navigated to page ${Math.max(1, currentPage - 1)}`, 'success');
                  }}
                  disabled={currentPage === 1}
                  aria-label="Previous Page"
                  className="flex items-center justify-center border-r border-black bg-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    width: 44,
                    height: 44,
                    borderTopLeftRadius: 22,
                    borderBottomLeftRadius: 22,
                  }}
                >
                  <img src={PrevIConBlack} alt="Prev" className="w-5 h-5" />
                </button>
                <div
                  className="flex items-center justify-center text-black avantbold font-bold text-base select-none whitespace-nowrap px-6"
                  style={{
                    letterSpacing: 2,
                    height: 44,
                  }}
                >
                  {currentPage} OF {totalPages}
                </div>
                <button
                  onClick={() => {
                    setCurrentPage(Math.min(totalPages, currentPage + 1));
                    showToast(`Navigated to page ${Math.min(totalPages, currentPage + 1)}`, 'success');
                  }}
                  disabled={currentPage === totalPages}
                  aria-label="Next Page"
                  className="flex items-center justify-center border-l border-black bg-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    width: 44,
                    height: 44,
                    borderTopRightRadius: 22,
                    borderBottomRightRadius: 22,
                  }}
                >
                  <img src={NextIConBlack} alt="Next" className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Single Modal for all statuses */}
      <ViewDetailsModal 
        isOpen={showViewDetailsModal}
        onClose={() => setShowViewDetailsModal(false)}
        order={selectedOrderForDetails}
        showToast={showToast}
      />

      {/* Toast Component */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
        duration={3000}
      />
    </div>
  );
};

export default AdminOrders;