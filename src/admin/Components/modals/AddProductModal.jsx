import React from 'react';
import { Add3D, AddImage, DropDownIconBlack, DropUpIconBlack, Remove } from '../../../assets';

const AddProductModal = ({
  showModal,
  onClose,
  newProduct,
  onProductChange,
  modalCollectionOptions,
  showCollectionDropdown,
  setShowCollectionDropdown,
  modalCategoryOptions,
  showCategoryDropdown,
  setShowCategoryDropdown,
  sizeOptions,
  onSizeToggle,
  onImageUpload,
  on3DModelUpload,
  onRemove3DModel,
  onTryOnImageUpload,
  onRemoveTryOnImage,
  onAddProduct,
  saving,
  uploading
}) => {
  if (!showModal) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'blur(5px)'
      }}
    >
      <div className="bg-white rounded-2xl border-2 border-black w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl avantbold text-black">Add New Product</h2>
          <button 
            onClick={onClose}
            className="text-2xl text-black hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Row 1: Product Name and Collection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm avantbold text-black mb-2">PRODUCT NAME</label>
              <input
                type="text"
                placeholder="Enter Product Name"
                value={newProduct.name}
                onChange={(e) => onProductChange('name', e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black placeholder:text-gray-400"
              />
            </div>
            <div className="relative dropdown-container">
              <label className="block text-sm avantbold text-black mb-2">COLLECTION</label>
              <button
                type="button"
                onClick={() => setShowCollectionDropdown(!showCollectionDropdown)}
                className="w-full flex items-center justify-between px-3 py-2 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:border-black avant text-sm"
              >
                <span className={newProduct.collection_id ? 'text-black' : 'text-gray-400'}>
                  {modalCollectionOptions.find(col => col.value === newProduct.collection_id)?.label || 'Select Collection'}
                </span>
                <img
                  src={showCollectionDropdown ? DropUpIconBlack : DropDownIconBlack}
                  alt="dropdown"
                  className="w-4 h-4 opacity-70"
                />
              </button>
              {showCollectionDropdown && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                  {modalCollectionOptions.slice(1).length > 0 ? (
                    modalCollectionOptions.slice(1).map((option, index) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          if (!option.disabled) {
                            onProductChange('collection_id', option.value);
                            setShowCollectionDropdown(false);
                          }
                        }}
                        disabled={option.disabled}
                        className={`w-full px-4 py-2 text-left text-sm avant transition-colors hover:bg-gray-100 text-black ${
                          index === 0 ? "rounded-t-lg" : ""
                        } ${
                          index === modalCollectionOptions.length - 2 ? "rounded-b-lg" : ""
                        } ${
                          option.disabled ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        type="button"
                      >
                        {option.label}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-center text-sm avant text-gray-500">
                      No collections available
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Pricing and Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm avantbold text-black mb-2">ORIGINAL PRICE</label>
              <input
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={newProduct.original_price}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || (!isNaN(value) && parseFloat(value) >= 0)) {
                    onProductChange('original_price', value);
                  }
                }}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm avantbold text-black mb-2">
                CURRENT PRICE <span className="text-gray-500 font-normal">(Optional)</span>
              </label>
              <input
                type="number"
                placeholder="0.00 (Leave empty for no discount)"
                min="0"
                step="0.01"
                value={newProduct.current_price}
                onChange={(e) => {
                  const value = e.target.value;
                  const originalPrice = parseFloat(newProduct.original_price) || 0;
                  const currentPrice = parseFloat(value) || 0;
                  
                  if (value === '' || (!isNaN(value) && currentPrice >= 0 && currentPrice !== originalPrice)) {
                    onProductChange('current_price', value);
                  }
                }}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black placeholder:text-gray-400"
              />
            </div>
            <div className="relative dropdown-container">
              <label className="block text-sm avantbold text-black mb-2">CATEGORY</label>
              <button
                type="button"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="w-full flex items-center justify-between px-3 py-2 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:border-black avant text-sm"
              >
                <span className={newProduct.category ? 'text-black' : 'text-gray-400'}>
                  {modalCategoryOptions.find(cat => cat.value === newProduct.category)?.label || 'Select Category'}
                </span>
                <img
                  src={showCategoryDropdown ? DropUpIconBlack : DropDownIconBlack}
                  alt="dropdown"
                  className="w-4 h-4 opacity-70"
                />
              </button>
              {showCategoryDropdown && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                  {modalCategoryOptions.slice(1).map((option, index) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onProductChange('category', option.value);
                        setShowCategoryDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm avant transition-colors hover:bg-gray-100 text-black ${
                        index === 0 ? "rounded-t-lg" : ""
                      } ${
                        index === modalCategoryOptions.length - 2 ? "rounded-b-lg" : ""
                      }`}
                      type="button"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

        
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sizes - Only visible for rings */}
            {(() => {
              const selectedCategory = modalCategoryOptions.find(cat => cat.value === newProduct.category);
              const isRings = selectedCategory?.slug === 'rings';
              return isRings && (
              <div>
                <label className="block text-sm avantbold text-black mb-3">SIZES</label>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {sizeOptions.map((size) => (
                    <label key={size} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newProduct.sizes.includes(size)}
                        onChange={() => onSizeToggle(size)}
                        className="w-4 h-4 border-2 border-gray-300 rounded focus:ring-0 focus:ring-offset-0 checked:bg-black checked:border-black text-black"
                        style={{
                          accentColor: '#000000'
                        }}
                      />
                      <span className="text-sm avant text-black">{size}</span>
                    </label>
                  ))}
                </div>
              </div>
              );
            })()}

            {/* Images - Takes full width if no sizes */}
            <div className={(() => {
              // Check if selected category is rings by looking at the slug  
              const selectedCategory = modalCategoryOptions.find(cat => cat.value === newProduct.category);
              const isRings = selectedCategory?.slug === 'rings';
              return !isRings ? 'lg:col-span-2' : '';
            })()}>
              <label className="block text-sm avantbold text-black mb-3">IMAGES</label>
              <div className="grid grid-cols-5 gap-2">
                {newProduct.images.map((image, index) => (
                  <label key={index} className="cursor-pointer">
                    <div className="w-16 h-16 border-2 border-dashed border-black rounded-lg flex items-center justify-center bg-white hover:bg-gray-50 transition-colors">
                      {image ? (
                        <img 
                          src={typeof image === 'string' ? image : URL.createObjectURL(image)} 
                          alt={`Product ${index + 1}`} 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <img 
                          src={AddImage} 
                          alt="Add image" 
                          className="w-6 h-6 opacity-60"
                        />
                      )}
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => onImageUpload(index, e.target.files[0])}
                    />
                  </label>
                ))}
                {/* 3D Model Upload Box */}
                <div className="relative">
                  <label className="cursor-pointer">
                    <div className="w-16 h-16 border-2 border-dashed border-black rounded-lg flex items-center justify-center bg-white hover:bg-gray-50 transition-colors relative overflow-visible">
                      {newProduct.model3DFile ? (
                        <>
                          <div className="flex flex-col items-center justify-center">
                            <img src={Add3D} alt="3D" className="w-5 h-5 opacity-80" />
                            <span className="text-[8px] text-gray-600 mt-0.5 truncate w-14 text-center">
                              {newProduct.model3DFile.name.slice(0, 8)}...
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onRemove3DModel?.();
                            }}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 z-10"
                          >
                            <img src={Remove} alt="Remove" className="w-3 h-3 invert" />
                          </button>
                        </>
                      ) : (
                        <img src={Add3D} alt="3D model" className="w-6 h-6 opacity-60" />
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".glb,.gltf"
                      onChange={(e) => on3DModelUpload?.(e.target.files[0])}
                    />
                  </label>
                </div>
                {/* Try-On Image Upload Box */}
                <div className="relative">
                  <label className="cursor-pointer">
                    <div className="w-16 h-16 border-2 border-dashed border-black rounded-lg flex items-center justify-center bg-white hover:bg-gray-50 transition-colors relative overflow-visible">
                      {newProduct.tryOnImageFile ? (
                        <>
                          <div className="flex flex-col items-center justify-center">
                            <span className="text-lg">👗</span>
                            <span className="text-[8px] text-gray-600 mt-0.5 truncate w-14 text-center">
                              {newProduct.tryOnImageFile.name.slice(0, 8)}...
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onRemoveTryOnImage?.();
                            }}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 z-10"
                          >
                            <img src={Remove} alt="Remove" className="w-3 h-3 invert" />
                          </button>
                        </>
                      ) : (
                        <span className="text-xl opacity-60">👗</span>
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".png,.webp"
                      onChange={(e) => onTryOnImageUpload?.(e.target.files[0])}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm avantbold text-black mb-2">DESCRIPTION</label>
            <textarea
              placeholder="Enter Description"
              value={newProduct.description}
              onChange={(e) => onProductChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm resize-none text-black placeholder:text-gray-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-transparent border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors avant text-sm font-medium"
            >
              CANCEL
            </button>
            <button
              onClick={onAddProduct}
              disabled={saving || uploading}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors avant text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'SAVING...' : uploading ? 'UPLOADING...' : 'ADD PRODUCT'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;