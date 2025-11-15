import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';

const CartNotification = ({ show, onClose, addedItem, onNavigateToBag }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { cart, getCartTotal, getCartItemCount } = useCart();

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getTotalItems = () => {
    return getCartItemCount();
  };

  const getSubtotal = () => {
    return getCartTotal();
  };

  if (!show) return null;

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ 
        backgroundColor: 'rgba(31, 31, 33, 0.8)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div className={`bg-[#FFF7DC] rounded-2xl border-2 border-[#1F1F21] w-full max-w-lg mx-4 shadow-2xl transform transition-all duration-300 ${
        isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
      }`}>
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b-2 border-[#1F1F21]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#1F1F21] rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-[#FFF7DC]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl avantbold text-[#1F1F21]">
              {addedItem ? addedItem.quantity : 1} Item{addedItem && addedItem.quantity !== 1 ? 's' : ''} added to your bag
            </h2>
          </div>
          <button 
            onClick={handleClose}
            className="text-2xl text-[#1F1F21] hover:text-gray-600 transition-colors avant"
          >
            ×
          </button>
        </div>

        {/* Added Item Display */}
        {addedItem && (
          <div className="p-6 border-b-2 border-[#1F1F21]">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border-2 border-[#1F1F21]">
                <img 
                  src={addedItem.image} 
                  alt={addedItem.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="avantbold text-[#1F1F21] text-sm mb-1">{addedItem.name}</h3>
                <p className="avant text-[#1F1F21] text-xs opacity-70 mb-1">
                  {addedItem.collection}
                </p>
                {addedItem.size && (
                  <p className="avant text-[#1F1F21] text-xs opacity-70">
                    Size: {addedItem.size}
                  </p>
                )}
                <p className="avantbold text-[#1F1F21] text-sm mt-1">
                  PHP{parseFloat(addedItem.price.replace(/[^\d.]/g, '')).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Subtotal */}
        <div className="p-6 border-b-2 border-[#1F1F21]">
          <div className="flex justify-between items-center">
            <span className="avantbold text-[#1F1F21]">Subtotal</span>
            <span className="avantbold text-[#1F1F21] text-lg">
              PHP{getSubtotal().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <p className="avant text-[#1F1F21] text-xs opacity-70 mt-1">
            {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''} in your bag
          </p>
        </div>

        {/* Action Buttons */}
        <div className="p-6">
          <div className="flex space-x-4">
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-3 bg-transparent border-2 border-[#1F1F21] text-[#1F1F21] rounded-lg hover:bg-[#1F1F21] hover:text-[#FFF7DC] transition-all duration-200 avantbold text-sm"
            >
              CONTINUE SHOPPING
            </button>
            <button
              onClick={() => {
                handleClose();
                onNavigateToBag();
              }}
              className="flex-1 px-6 py-3 bg-[#1F1F21] text-[#FFF7DC] rounded-lg hover:bg-gray-800 transition-all duration-200 avantbold text-sm"
            >
              VIEW BAG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartNotification;
