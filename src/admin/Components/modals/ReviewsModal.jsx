import React from 'react';

const ReviewsModal = ({
  showModal,
  onClose,
  selectedProduct,
  reviewFilter,
  setReviewFilter,
  getReviewStats,
  getFilteredReviews,
  getStarDisplay,
  handleReviewStatusChange
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
      <div className="bg-white rounded-2xl border-2 border-black w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl avantbold text-black">Reviews Management</h2>
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
          {/* Review Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-sm avant text-blue-600 mb-1">Total Reviews</div>
              <div className="text-2xl bebas text-blue-800">{getReviewStats().total}</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <div className="text-sm avant text-yellow-600 mb-1">Pending</div>
              <div className="text-2xl bebas text-yellow-800">{getReviewStats().pending}</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-sm avant text-green-600 mb-1">Approved</div>
              <div className="text-2xl bebas text-green-800">{getReviewStats().approved}</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <div className="text-sm avant text-red-600 mb-1">Rejected</div>
              <div className="text-2xl bebas text-red-800">{getReviewStats().rejected}</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <div className="text-sm avant text-purple-600 mb-1">Avg Rating</div>
              <div className="text-2xl bebas text-purple-800">{getReviewStats().avgRating}★</div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setReviewFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors avant text-sm font-medium ${
                reviewFilter === 'all' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
            >
              All Reviews
            </button>
            <button
              onClick={() => setReviewFilter('pending')}
              className={`px-4 py-2 rounded-lg transition-colors avant text-sm font-medium ${
                reviewFilter === 'pending' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
              }`}
            >
              Pending ({getReviewStats().pending})
            </button>
            <button
              onClick={() => setReviewFilter('approved')}
              className={`px-4 py-2 rounded-lg transition-colors avant text-sm font-medium ${
                reviewFilter === 'approved' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              Approved ({getReviewStats().approved})
            </button>
            <button
              onClick={() => setReviewFilter('rejected')}
              className={`px-4 py-2 rounded-lg transition-colors avant text-sm font-medium ${
                reviewFilter === 'rejected' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              Rejected ({getReviewStats().rejected})
            </button>
          </div>

          {/* Reviews List */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {getFilteredReviews().length > 0 ? (
              getFilteredReviews().map((review) => (
                <div key={review.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="avantbold text-black">{review.customerName}</h4>
                        <div className="flex">{getStarDisplay(review.rating)}</div>
                        <span className="text-xs avant text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-xs avant text-gray-600 mb-2">{review.email}</p>
                      <p className="avant text-sm text-black">{review.comment}</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <span className={`px-2 py-1 rounded text-xs avantbold ${ 
                        review.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        review.status === 'approved' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => handleReviewStatusChange(review.id, 'approved')}
                      disabled={review.status === 'approved'}
                      className={`px-4 py-2 text-xs avant font-medium rounded transition-colors ${
                        review.status === 'approved'
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReviewStatusChange(review.id, 'rejected')}
                      disabled={review.status === 'rejected'}
                      className={`px-4 py-2 text-xs avant font-medium rounded transition-colors ${
                        review.status === 'rejected'
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                    >
                      Reject
                    </button>
                    {review.status !== 'pending' && (
                      <button
                        onClick={() => handleReviewStatusChange(review.id, 'pending')}
                        className="px-4 py-2 text-xs avant font-medium bg-yellow-600 text-white hover:bg-yellow-700 rounded transition-colors"
                      >
                        Set Pending
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 avant">
                  {reviewFilter === 'all' 
                    ? 'No reviews found for this product.'
                    : `No ${reviewFilter} reviews found.`
                  }
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors avant text-sm font-medium"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsModal;