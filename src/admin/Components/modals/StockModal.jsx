import React from 'react';

const StockModal = ({
  showModal,
  onClose,
  selectedProduct,
  stockData,
  sizeOptions,
  handleStockUpdate,
  handleSaveStockChanges
}) => {
  if (!showModal || !selectedProduct) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'blur(5px)'
      }}
    >
      <div className="bg-white rounded-2xl border-2 border-black w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl avantbold text-black">Stock Management</h2>
            <p className="text-sm avant text-gray-600 mt-1">{selectedProduct.name}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-2xl text-black hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Stock Overview - simplified to just total stock */}
          <div className="mb-6">
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 text-center">
              <div className="text-sm avantbold text-gray-600 mb-2">TOTAL STOCK</div>
              <div className="text-3xl bebas text-black">{stockData.totalStock}</div>
            </div>
          </div>

          {/* Stock Details */}
          {selectedProduct.category.toLowerCase() === 'rings' ? (
            // Ring sizes inventory - simplified
            <div>
              <h3 className="text-lg avantbold text-black mb-4">Size Inventory</h3>
              <div className="space-y-3">
                {sizeOptions.map((size) => (
                  <div key={size} className="grid grid-cols-2 gap-4 items-center p-3 bg-gray-50 rounded-lg">
                    <div className="avantbold text-black">{size}</div>
                    <div>
                      <label className="block text-xs avant text-gray-600 mb-1">Stock</label>
                      <input
                        type="number"
                        value={stockData.sizes[size]?.stock || 0}
                        onChange={(e) => handleStockUpdate('size', size, 'stock', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm avant focus:outline-none focus:border-black text-black"
                        min="0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // General inventory - simplified
            <div>
              <h3 className="text-lg avantbold text-black mb-4">Inventory Management</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="max-w-sm mx-auto">
                  <label className="block text-sm avantbold text-black mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    value={stockData.general.stock}
                    onChange={(e) => handleStockUpdate('general', null, 'stock', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg avant focus:outline-none focus:border-black text-black text-center text-lg"
                    min="0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-transparent border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors avant text-sm font-medium"
            >
              CANCEL
            </button>
            <button
              onClick={handleSaveStockChanges}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors avant text-sm font-medium"
            >
              SAVE CHANGES
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockModal;