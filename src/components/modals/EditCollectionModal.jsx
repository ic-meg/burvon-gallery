import React from 'react';
import { AddImage } from '../../assets/index.js';

const EditCollectionModal = ({ 
  show, 
  onClose, 
  editCollection, 
  onCollectionChange, 
  onImageUpload, 
  onSubmit, 
  loading 
}) => {
  if (!show) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'blur(5px)'
      }}
    >
      <div className="bg-white rounded-2xl border-2 border-black w-full max-w-md mx-4 shadow-2xl">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl avantbold text-black">Edit Collection</h2>
          <button 
            onClick={onClose}
            className="text-2xl text-black hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm avantbold text-black mb-2">COLLECTION NAME *</label>
            <input
              type="text"
              placeholder="Enter Collection Name"
              value={editCollection.name}
              onChange={(e) => onCollectionChange('name', e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm text-black placeholder:text-gray-400"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm avantbold text-black mb-2">DESCRIPTION *</label>
            <textarea
              placeholder="Enter Collection Description"
              value={editCollection.description}
              onChange={(e) => onCollectionChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black avant text-sm resize-none text-black placeholder:text-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm avantbold text-black mb-2">COLLECTION IMAGE</label>
            <label className="cursor-pointer">
              <div className="w-full h-32 border-2 border-dashed border-black rounded-lg flex items-center justify-center bg-white hover:bg-gray-50 transition-colors">
                {editCollection.image ? (
                  <img 
                    src={URL.createObjectURL(editCollection.image)} 
                    alt="Collection" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <img 
                      src={AddImage} 
                      alt="Add image" 
                      className="w-8 h-8 mx-auto mb-2 opacity-60"
                    />
                    <span className="text-sm avant text-gray-500">Click to upload new image</span>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={(e) => onImageUpload(e.target.files[0])}
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-transparent border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors avant text-sm font-medium"
            >
              CANCEL
            </button>
            <button
              onClick={onSubmit}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors avant text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'UPDATING...' : 'UPDATE COLLECTION'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCollectionModal;