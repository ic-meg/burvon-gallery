import React, { useState, useMemo } from "react";
import AdminHeader from "../../components/admin/AdminHeader";

import {
NextIConBlack,
PrevIConBlack,  
DropDownIconBlack,
DropUpIconBlack 
} from '../../assets/index.js'

// Single Modal Component that handles all statuses
const ViewDetailsModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  // Handle click outside modal to close
  const handleOverlayClick = (e) => {
    // Only close if the click is on the overlay, not on the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Dynamic order details based on status
  const getOrderDetails = (status) => {
    const baseOrder = {
      id: "#38940123",
      orderDate: "Sep 26, 2025",
      items: [
        {
          id: 1,
          image: "/api/placeholder/80/80",
          name: "Clash Collection Necklaces",
          sku: "NCK-CLSH-ODV-GLD-001",
          quantity: 1,
          size: "One Size",
          price: "₱ 590.00",
          subtotal: "₱ 590.00"
        }
      ],
      pricing: {
        subtotal: "₱ 590.00",
        shipping: "₱ 80.00",
        discount: "-",
        total: "₱ 670.00"
      },
      customer: {
        name: "Giuliani Calais",
        email: "gilcalais@gmail.com",
        phone: "+63926484997"
      },
      shipping: {
        name: "Giuliani Calais",
        address: "Blk 2 Lot 37 Greenfields",
        barangay: "Mambog 2",
        city: "Bacoor City",
        province: "Cavite",
        postalCode: "4102"
      },
      payment: {
        method: "Gcash",
        status: "PAID",
        transactionId: "GC-789456123",
        paymentDate: "2025-09-26 10:30 AM"
      },
      notes: "Please avoid putting the price tag inside the package (it's a gift)."
    };

    // Add status-specific fields
    switch (status) {
      case 'Processing':
        return {
          ...baseOrder,
          status: 'Processing',
          processing: {
            currentStage: "Packaging",
            estimatedShipping: "Oct 08, 2025",
            courier: "JnT Express"
          }
        };
      case 'Shipped':
        return {
          ...baseOrder,
          status: 'Shipped',
          shipping: {
            ...baseOrder.shipping,
            trackingNumber: "JT789456123",
            courier: "JnT Express",
            shippedDate: "Oct 08, 2025",
            estimatedDelivery: "Oct 12, 2025"
          }
        };
      case 'Completed':
        return {
          ...baseOrder,
          status: 'Completed',
          completion: {
            deliveredDate: "Oct 10, 2025",
            receivedBy: "Giuliani Calais"
          }
        };
      case 'Return/Refund':
        return {
          ...baseOrder,
          status: 'Return/Refund',
          returnRefund: {
            deliveredDate: "Oct 10, 2025 2:30 PM",
            requestDate: "Oct 15, 2025 9:15 AM",
            reason: "Product defect - necklace chain broke after first wear",
            refundAmount: "₱ 590.00"
          },
          returnItems: [
            {
              id: 1,
              name: "Clash Collection Necklaces",
              subtitle: "(Elegant Pendant Jewelry)",
              quantity: 1,
              size: "One Size", 
              sku: "NCK-CLSH-ODV-GLD-001",
              subtotal: "₱ 590.00"
            }
          ],
          returnDescription: "The necklace chain broke after wearing it for the first time. Customer reported that the clasp mechanism was faulty and came apart during normal use. Product shows signs of manufacturing defect.",
          returnProof: {
            images: [
              "/api/placeholder/150/150",
              "/api/placeholder/150/150", 
              "/api/placeholder/150/150"
            ],
            videos: [
              "/api/placeholder/video1.mp4"
            ]
          }
        };
      case 'Cancellation':
        return {
          ...baseOrder,
          status: 'Cancellation',
          cancellation: {
            reason: "Customer request",
            cancelledDate: "Sep 27, 2025"
          }
        };
      default:
        return { ...baseOrder, status: 'Pending' };
    }
  };

  const orderDetails = getOrderDetails(order.status);

  // Get status-specific styling
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

  // Render status-specific right column
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

  // Render action buttons based on status
  const renderActionButtons = () => {
    switch (orderDetails.status) {
      case 'Pending':
        return (
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-transparent border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors avant text-sm font-medium"
            >
              CANCEL ORDER
            </button>
            <button 
              onClick={onClose}
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
              onClick={onClose}
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
              onClick={onClose}
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
              onClick={onClose}
              className="px-6 py-2 bg-transparent border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors avant text-sm font-medium"
            >
              Reject
            </button>
            <button 
              onClick={onClose}
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

  // Render Return/Refund specific layout
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

            {orderDetails.items.map((item) => (
              <div key={item.id} className="grid grid-cols-6 gap-4 items-center py-4 border-b border-gray-100">
                <div className="col-span-2 flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-black avant">{item.name}</h4>
                    {item.size && <p className="text-sm text-gray-500 avant uppercase">SIZE: {item.size}</p>}
                  </div>
                </div>
                <div className="text-center text-sm text-gray-600 avant uppercase">{item.sku}</div>
                <div className="text-center font-medium text-black avant">{item.quantity}</div>
                <div className="text-center font-medium text-black avant">{item.price}</div>
                <div className="text-center font-medium text-black avant">{item.subtotal}</div>
              </div>
            ))}
          </div>

          {/* Dynamic layout based on status */}
          {renderReturnRefundLayout()}

          {/* Action Buttons */}
          {renderActionButtons()}

        </div>
      </div>
    </div>
  );
};

const AdminOrders = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [dateSort, setDateSort] = useState('newest');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Single modal state
  const [showViewDetailsModal, setShowViewDetailsModal] = useState(false);
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState(null);

  const itemsPerPage = 5;

  // Simplified orders data - only one per status
  const allOrders = [
    {
      id: "#38940123",
      customer: "Giuliani Calais",
      amount: "₱ 670.00",
      status: "Pending",
      date: "Sep 26, 2025"
    },
    {
      id: "#38940124", 
      customer: "John Doe",
      amount: "₱ 670.00",
      status: "Processing",
      date: "Sep 25, 2025"
    },
    {
      id: "#38940125",
      customer: "Jane Smith", 
      amount: "₱ 670.00",
      status: "Shipped",
      date: "Sep 24, 2025"
    },
    {
      id: "#38940126",
      customer: "Mike Johnson",
      amount: "₱ 670.00", 
      status: "Completed",
      date: "Sep 23, 2025"
    },
    {
      id: "#38940127",
      customer: "Sarah Wilson",
      amount: "₱ 670.00",
      status: "Return/Refund", 
      date: "Sep 22, 2025"
    },
    {
      id: "#38940128",
      customer: "Tom Brown",
      amount: "₱ 670.00",
      status: "Cancellation",
      date: "Sep 21, 2025"
    }
  ];

  // Handle view details click - now uses single modal
  const handleViewDetails = (order) => {
    setSelectedOrderForDetails(order);
    setShowViewDetailsModal(true);
  };

  // Filter and sort orders based on active tab, search query, and date sort
  const filteredOrders = useMemo(() => {
    let filtered = allOrders;

    // Filter by status (tab)
    if (activeTab !== 'all') {
      const statusMap = {
        'pending': 'Pending',
        'processing': 'Processing', 
        'shipped': 'Shipped',
        'completed': 'Completed',
        'return': 'Return/Refund',
        'cancellation': 'Cancellation'
      };
      filtered = filtered.filter(order => order.status === statusMap[activeTab]);
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

    return filtered;
  }, [activeTab, searchQuery, dateSort]);

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

  // Calculate counts for each tab
  const getTabCounts = () => {
    return {
      all: allOrders.length,
      pending: allOrders.filter(o => o.status === 'Pending').length,
      processing: allOrders.filter(o => o.status === 'Processing').length,
      shipped: allOrders.filter(o => o.status === 'Shipped').length,
      completed: allOrders.filter(o => o.status === 'Completed').length,
      return: allOrders.filter(o => o.status === 'Return/Refund').length,
      cancellation: allOrders.filter(o => o.status === 'Cancellation').length,
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
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when tab, search, or sort changes
  React.useEffect(() => {
    setCurrentPage(1);
    setSelectAll(false);
    setSelectedOrders([]);
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
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  // Handle accept order functionality
  const handleAcceptOrder = () => {
    console.log('Accepting orders:', selectedOrders);
  };

  // Handle print waybill functionality
  const handlePrintWaybill = () => {
    console.log('Printing waybills for orders:', selectedOrders);
  };

  // Handle mark as shipped functionality
  const handleMarkAsShipped = () => {
    console.log('Marking orders as shipped:', selectedOrders);
  };

  // Handle mark as delivered functionality
  const handleMarkAsDelivered = () => {
    console.log('Marking orders as delivered:', selectedOrders);
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
                  className="flex items-center justify-between px-4 py-2 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:border-black avant text-sm select-none w-36"
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
                      className={`w-full px-4 py-2 text-left text-sm avant hover:bg-gray-50 transition-colors rounded-t-lg ${
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
                      className={`w-full px-4 py-2 text-left text-sm avant hover:bg-gray-50 transition-colors rounded-b-lg ${
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
                  className="w-80 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant"
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
                    onClick={() => setActiveTab(tab.id)}
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
                    disabled={selectedOrders.length === 0}
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
                      disabled={selectedOrders.length === 0}
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
                        disabled={selectedOrders.length === 0}
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
                    disabled={selectedOrders.length === 0}
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
              {paginatedOrders.length > 0 ? (
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
                            checked={selectedOrders.includes(order.id)}
                            onChange={() => handleOrderSelect(order.id)}
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
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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
      />
    </div>
  );
};

export default AdminOrders;