import React from 'react';
import { Add3D, AddImage, DropDownIconBlack, DropUpIconBlack } from '../../../assets';

const EditProductModal = ({
  showModal,
  onClose,
  editProduct,
  onEditProductChange,
  modalCollectionOptions,
  showEditModalCollectionDropdown,
  setShowEditModalCollectionDropdown,
  modalCategoryOptions,
  showEditModalCategoryDropdown,
  setShowEditModalCategoryDropdown,
  sizeOptions,
  onEditSizeToggle,
  onEditImageUpload,
  onUpdateProduct,
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
          <h2 className="text-xl avantbold text-black">Edit Product</h2>
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
                value={editProduct.name}
                onChange={(e) => onEditProductChange('name', e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black placeholder:text-gray-400"
              />
            </div>
            <div className="relative dropdown-container">
              <label className="block text-sm avantbold text-black mb-2">COLLECTION</label>
              <button
                type="button"
                onClick={() => setShowEditModalCollectionDropdown(!showEditModalCollectionDropdown)}
                className="w-full flex items-center justify-between px-3 py-2 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:border-black avant text-sm"
              >
                <span className={editProduct.collection_id ? 'text-black' : 'text-gray-400'}>
                  {modalCollectionOptions.find(col => col.value === editProduct.collection_id)?.label || 'Select Collection'}
                </span>
                <img
                  src={showEditModalCollectionDropdown ? DropUpIconBlack : DropDownIconBlack}
                  alt="dropdown"
                  className="w-4 h-4 opacity-70"
                />
              </button>
              {showEditModalCollectionDropdown && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                  {modalCollectionOptions.slice(1).length > 0 ? (
                    modalCollectionOptions.slice(1).map((option, index) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          if (!option.disabled) {
                            onEditProductChange('collection_id', option.value);
                            setShowEditModalCollectionDropdown(false);
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
                type="text"
                value={editProduct.original_price}
                readOnly
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg bg-gray-100 avant text-sm text-gray-600 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1 avant">Original price cannot be edited</p>
            </div>
            <div>
              <label className="block text-sm avantbold text-black mb-2">
                CURRENT PRICE <span className="text-gray-500 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="₱0.00 (Leave empty for no discount)"
                value={editProduct.current_price}
                onChange={(e) => onEditProductChange('current_price', e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black placeholder:text-gray-400"
              />
            </div>
            <div className="relative dropdown-container">
              <label className="block text-sm avantbold text-black mb-2">CATEGORY</label>
              <button
                type="button"
                onClick={() => setShowEditModalCategoryDropdown(!showEditModalCategoryDropdown)}
                className="w-full flex items-center justify-between px-3 py-2 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:border-black avant text-sm"
              >
                <span className={editProduct.category ? 'text-black' : 'text-gray-400'}>
                  {modalCategoryOptions.find(cat => cat.value === editProduct.category)?.label || 'Select Category'}
                </span>
                <img
                  src={showEditModalCategoryDropdown ? DropUpIconBlack : DropDownIconBlack}
                  alt="dropdown"
                  className="w-4 h-4 opacity-70"
                />
              </button>
              {showEditModalCategoryDropdown && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                  {modalCategoryOptions.slice(1).map((option, index) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onEditProductChange('category', option.value);
                        setShowEditModalCategoryDropdown(false);
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

          {/* Row 3: Conditional Sizes and Images */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sizes - Only visible for rings */}
            {(() => {
              // Check if selected category is rings by looking at the slug
              const selectedCategory = modalCategoryOptions.find(cat => cat.value === editProduct.category);
              const isRings = selectedCategory?.slug === 'rings';
              
              return isRings && (
                <div>
                  <label className="block text-sm avantbold text-black mb-3">SIZES</label>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {sizeOptions.map((size) => (
                      <label key={size} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editProduct.sizes.includes(size)}
                          onChange={() => onEditSizeToggle(size)}
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
              const selectedCategory = modalCategoryOptions.find(cat => cat.value === editProduct.category);
              const isRings = selectedCategory?.slug === 'rings';
              return !isRings ? 'lg:col-span-2' : '';
            })()}>
              <label className="block text-sm avantbold text-black mb-3">IMAGES</label>
              <div className="grid grid-cols-5 gap-2">
                {editProduct.images.map((image, index) => {
                  // Check if there's a new uploaded image or existing image URL
                  const imageUrl = image 
                    ? URL.createObjectURL(image) 
                    : (editProduct.imageUrls && editProduct.imageUrls[index]);
                  
                  return (
                    <label key={index} className="cursor-pointer">
                      <div className="w-16 h-16 border-2 border-dashed border-black rounded-lg flex items-center justify-center bg-white hover:bg-gray-50 transition-colors overflow-hidden">
                        {imageUrl ? (
                          <img 
                            src={imageUrl} 
                            alt={`Product ${index + 1}`} 
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = AddImage;
                              e.target.className = "w-6 h-6 opacity-60";
                            }}
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
                        onChange={(e) => onEditImageUpload(index, e.target.files[0])}
                      />
                    </label>
                  );
                })}
                {/* Additional single box */}
                <div className="w-16 h-16 border-2 border-dashed border-black rounded-lg flex items-center justify-center bg-white">
                  <img 
                    src={Add3D} 
                    alt="3D model" 
                    className="w-6 h-6 opacity-60"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm avantbold text-black mb-2">DESCRIPTION</label>
            <textarea
              placeholder="Enter Description"
              value={editProduct.description}
              onChange={(e) => onEditProductChange('description', e.target.value)}
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
              onClick={onUpdateProduct}
              disabled={saving || uploading}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors avant text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'UPDATING...' : uploading ? 'UPLOADING...' : 'UPDATE PRODUCT'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;