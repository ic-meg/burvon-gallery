import { useState, useEffect } from 'react';
import { getProductReviews, approveReview, rejectReview } from '../../../api/reviewApi';
import Toast from '../../../components/Toast';

const ReviewsModal = ({
  showModal,
  onClose,
  selectedProduct,
  reviewFilter,
  setReviewFilter
}) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    if (showModal && selectedProduct?.product_id) {
      fetchReviews();
    }
  }, [showModal, selectedProduct?.product_id]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const result = await getProductReviews(selectedProduct.product_id, '');

      if (result.error) {
        setToast({ show: true, message: result.error || 'Failed to fetch reviews', type: 'error' });
        setReviews([]);
      } else {
        setReviews(result.data || []);
      }
    } catch (error) {
      setToast({ show: true, message: 'Failed to fetch reviews', type: 'error' });
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewStatusChange = async (reviewId, newStatus) => {
    try {
      const token = localStorage.getItem('adminAuthToken') || localStorage.getItem('authToken');
      if (!token) {
        setToast({ show: true, message: 'Please login as admin to manage reviews', type: 'error' });
        return;
      }

      let result;

      if (newStatus === 'approved' || newStatus === 'APPROVED') {
        result = await approveReview(reviewId);
      } else if (newStatus === 'rejected' || newStatus === 'REJECTED') {
        result = await rejectReview(reviewId);
      } else {
        setToast({ show: true, message: 'Invalid status', type: 'error' });
        return;
      }

      if (result.error) {
        const errorMsg = result.error === 'Missing authorization header'
          ? 'Session expired. Please login again as admin.'
          : result.error || 'Failed to update review status';
        setToast({ show: true, message: errorMsg, type: 'error' });
      } else {
        setToast({ show: true, message: 'Review status updated successfully', type: 'success' });
        // Refresh reviews after status change
        await fetchReviews();
      }
    } catch (error) {
      setToast({ show: true, message: 'An error occurred while updating review status', type: 'error' });
    }
  };

  const getFilteredReviews = () => {
    if (!reviews || reviews.length === 0) return [];

    const filterMap = {
      'all': null,
      'pending': 'PENDING',
      'approved': 'APPROVED',
      'rejected': 'REJECTED'
    };

    const statusFilter = filterMap[reviewFilter.toLowerCase()];
    if (!statusFilter) return reviews;

    return reviews.filter(review => review.status === statusFilter);
  };

  const getReviewStats = () => {
    if (!reviews || reviews.length === 0) {
      return { total: 0, pending: 0, approved: 0, rejected: 0, avgRating: 0 };
    }

    const approvedReviews = reviews.filter(r => r.status === 'APPROVED');
    const avgRating = approvedReviews.length > 0
      ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1)
      : 0;

    return {
      total: reviews.length,
      pending: reviews.filter(r => r.status === 'PENDING').length,
      approved: reviews.filter(r => r.status === 'APPROVED').length,
      rejected: reviews.filter(r => r.status === 'REJECTED').length,
      avgRating: avgRating,
    };
  };

  const getStarDisplay = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < rating ? "text-yellow-400" : "text-gray-300"}
      >
        ★
      </span>
    ));
  };

  const formatReviewData = (review) => {
    return {
      id: review.review_id,
      customerName: review.show_username && review.user?.full_name
        ? review.user.full_name
        : 'Anonymous',
      email: review.user?.email || 'N/A',
      rating: review.rating,
      comment: review.review_text || 'No comment provided',
      date: new Date(review.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      status: review.status.toLowerCase(),
      images: review.images || [],
      videos: review.videos || []
    };
  };

  if (!showModal || !selectedProduct) return null;

  return (
    <>
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
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500 avant">Loading reviews...</p>
              </div>
            ) : getFilteredReviews().length > 0 ? (
              getFilteredReviews().map((review) => {
                const formattedReview = formatReviewData(review);
                return (
                  <div key={formattedReview.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="avantbold text-black">{formattedReview.customerName}</h4>
                          <div className="flex">{getStarDisplay(formattedReview.rating)}</div>
                          <span className="text-xs avant text-gray-500">{formattedReview.date}</span>
                        </div>
                        <p className="text-xs avant text-gray-600 mb-2">{formattedReview.email}</p>
                        <p className="avant text-sm text-black">{formattedReview.comment}</p>

                        {/* Display images if any */}
                        {formattedReview.images && formattedReview.images.length > 0 && (
                          <div className="flex gap-2 mt-3 flex-wrap">
                            {formattedReview.images.map((img, idx) => (
                              <img
                                key={idx}
                                src={img}
                                alt={`Review ${idx + 1}`}
                                className="w-16 h-16 object-cover rounded border border-gray-300"
                              />
                            ))}
                          </div>
                        )}

                        {/* Display videos if any */}
                        {formattedReview.videos && formattedReview.videos.length > 0 && (
                          <div className="flex gap-2 mt-3 flex-wrap">
                            {formattedReview.videos.map((vid, idx) => (
                              <video
                                key={idx}
                                src={vid}
                                controls
                                className="w-32 h-20 object-cover rounded border border-gray-300"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className={`px-2 py-1 rounded text-xs avantbold ${
                          formattedReview.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          formattedReview.status === 'approved' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {formattedReview.status.charAt(0).toUpperCase() + formattedReview.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => handleReviewStatusChange(formattedReview.id, 'approved')}
                        disabled={formattedReview.status === 'approved'}
                        className={`px-4 py-2 text-xs avant font-medium rounded transition-colors ${
                          formattedReview.status === 'approved'
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReviewStatusChange(formattedReview.id, 'rejected')}
                        disabled={formattedReview.status === 'rejected'}
                        className={`px-4 py-2 text-xs avant font-medium rounded transition-colors ${
                          formattedReview.status === 'rejected'
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })
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

      {toast.show && (
        <div style={{ zIndex: 9999, position: 'fixed', top: '1rem', right: '1rem' }}>
          <Toast
            show={toast.show}
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
            duration={3000}
          />
        </div>
      )}
    </>
  );
};

export default ReviewsModal;