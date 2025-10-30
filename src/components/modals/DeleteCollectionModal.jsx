import React from 'react';

const DeleteCollectionModal = ({ 
  show, 
  onClose, 
  onConfirm, 
  selectedCollection, 
  loading 
}) => {
  if (!show || !selectedCollection) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'blur(5px)'
      }}
    >
      <div className="bg-white rounded-2xl border-2 border-red-500 w-full max-w-md mx-4 shadow-2xl">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-red-200">
          <h2 className="text-xl avantbold text-red-600">Delete Collection</h2>
          <button 
            onClick={onClose}
            className="text-2xl text-red-600 hover:text-red-400 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <p className="text-black avant text-sm mb-4">
            Are you sure you want to delete the collection <strong>"{selectedCollection.name}"</strong>?
          </p>
          <p className="text-red-600 avant text-xs mb-6">
            This action cannot be undone. All products in this collection will need to be reassigned.
          </p>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-transparent border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors avant text-sm font-medium"
            >
              CANCEL
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors avant text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'DELETING...' : 'DELETE COLLECTION'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteCollectionModal;