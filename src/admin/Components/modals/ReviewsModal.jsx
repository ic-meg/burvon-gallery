import { useState, useEffect } from 'react';
import { getProductReviews } from '../../../api/reviewApi';
import Toast from '../../../components/Toast';
import { moderateContent } from '../../../utils/profanityFilter';

const ReviewsModal = ({
  showModal,
  onClose,
  selectedProduct
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

  const getFilteredReviews = () => {
    if (!reviews || reviews.length === 0) return [];
    return reviews;
  };

  const getReviewStats = () => {
    if (!reviews || reviews.length === 0) {
      return { total: 0, avgRating: 0 };
    }

    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    return {
      total: reviews.length,
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
    const moderation = moderateContent(review.review_text || 'No comment provided');
    
    return {
      id: review.review_id,
      customerName: review.show_username && review.user?.full_name
        ? review.user.full_name
        : 'Anonymous',
      email: review.user?.email || 'N/A',
      rating: review.rating,
      comment: moderation.filtered,
      flagged: moderation.flagged,
      date: new Date(review.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
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
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-sm avant text-blue-600 mb-1">Total Reviews</div>
              <div className="text-2xl bebas text-blue-800">{getReviewStats().total}</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <div className="text-sm avant text-purple-600 mb-1">Avg Rating</div>
              <div className="text-2xl bebas text-purple-800">{getReviewStats().avgRating}★</div>
            </div>
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
                        {formattedReview.flagged && (
                          <div className="mt-2 px-2 py-1 bg-orange-100 border border-orange-300 rounded text-xs avant text-orange-700">
                            Content filtered for inappropriate language
                          </div>
                        )}

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
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 avant">
                  No reviews found for this product.
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