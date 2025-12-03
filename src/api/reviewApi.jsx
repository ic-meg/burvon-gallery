import apiRequest from "./apiRequest";

const API_URL = import.meta.env.VITE_API_URL;

const missing = (field) => {
  return { error: `${field} is required`, status: null, data: null };
};

const baseUrl = API_URL
  ? (API_URL.endsWith("/") ? `${API_URL}review/` : `${API_URL}/review/`)
  : "";


const getAuthHeaders = () => {
  // Check for both user and admin tokens
  const token = localStorage.getItem('authToken') || localStorage.getItem('adminAuthToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// ------------------- Customer API -------------------


export const createReview = async (reviewData) => {
  if (!API_URL) return missing("VITE_API_URL");
  if (!reviewData.product_id) return missing("product_id");
  if (!reviewData.rating) return missing("rating");

  return await apiRequest(baseUrl, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(reviewData)
  });
};


export const getProductReviews = async (productId, status) => {
  if (!API_URL) return missing("VITE_API_URL");
  if (!productId) return missing("product id");

  
  const statusParam = status === '' || status === undefined
    ? ''
    : status || 'APPROVED';

  const url = `${baseUrl}product/${productId}${statusParam ? `?status=${statusParam}` : ''}`;
  return await apiRequest(url, null);
};

export const getProductRatingStats = async (productId) => {
  if (!API_URL) return missing("VITE_API_URL");
  if (!productId) return missing("product id");

  return await apiRequest(`${baseUrl}product/${productId}/stats`, null);
};


export const getMyReviews = async () => {
  if (!API_URL) return missing("VITE_API_URL");

  return await apiRequest(`${baseUrl}my-reviews`, {
    headers: getAuthHeaders()
  });
};


export const updateReview = async (reviewId, updateData) => {
  if (!API_URL) return missing("VITE_API_URL");
  if (!reviewId) return missing("review id");

  return await apiRequest(`${baseUrl}${reviewId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData)
  });
};


export const deleteReview = async (reviewId) => {
  if (!API_URL) return missing("VITE_API_URL");
  if (!reviewId) return missing("review id");

  return await apiRequest(`${baseUrl}${reviewId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
};

// ------------------- Admin API -------------------

/**
 * Admin: Get all pending reviews
 * @returns {Promise<Object>}
 */
export const getPendingReviews = async () => {
  if (!API_URL) return missing("VITE_API_URL");

  return await apiRequest(`${baseUrl}admin/pending`, {
    headers: getAuthHeaders()
  });
};

/**
 * Admin: Get all reviews (any status)
 * @returns {Promise<Object>}
 */
export const getAllReviews = async () => {
  if (!API_URL) return missing("VITE_API_URL");

  return await apiRequest(`${baseUrl}admin/all`, {
    headers: getAuthHeaders()
  });
};

/**
 * Admin: Approve a review
 * @param {number} reviewId
 * @returns {Promise<Object>}
 */
export const approveReview = async (reviewId) => {
  if (!API_URL) return missing("VITE_API_URL");
  if (!reviewId) return missing("review id");

  return await apiRequest(`${baseUrl}admin/${reviewId}/approve`, {
    method: 'PATCH',
    headers: getAuthHeaders()
  });
};

/**
 * Admin: Reject a review
 * @param {number} reviewId
 * @returns {Promise<Object>}
 */
export const rejectReview = async (reviewId) => {
  if (!API_URL) return missing("VITE_API_URL");
  if (!reviewId) return missing("review id");

  return await apiRequest(`${baseUrl}admin/${reviewId}/reject`, {
    method: 'PATCH',
    headers: getAuthHeaders()
  });
};

// ------------------- Helper Functions -------------------

/**
 * Submit a complete review with media uploads
 * @param {Object} params - { userId, productId, orderItemId?, rating, reviewText?, imageFiles?, videoFiles?, showUsername }
 * @returns {Promise<Object>}
 */
export const submitReviewWithMedia = async ({
  userId,
  productId,
  orderItemId = null,
  rating,
  reviewText = '',
  imageFiles = [],
  videoFiles = [],
  showUsername = false
}) => {
  try {
    const { default: storageService } = await import('../services/storageService');

    // Upload images to Supabase
    let imageUrls = [];
    if (imageFiles && imageFiles.length > 0) {
      imageUrls = await storageService.uploadMultipleReviewImages(
        imageFiles,
        userId,
        productId
      );
    }

    // Upload videos to Supabase
    let videoUrls = [];
    if (videoFiles && videoFiles.length > 0) {
      videoUrls = await storageService.uploadMultipleReviewVideos(
        videoFiles,
        userId,
        productId
      );
    }

    // Submit review with URLs
    const reviewData = {
      product_id: productId,
      order_item_id: orderItemId,
      rating,
      review_text: reviewText,
      images: imageUrls,
      videos: videoUrls,
      show_username: showUsername
    };

    return await createReview(reviewData);
  } catch (error) {
    return {
      error: error.message || 'Failed to submit review',
      status: null,
      data: null
    };
  }
};

export default {
  createReview,
  getProductReviews,
  getProductRatingStats,
  getMyReviews,
  updateReview,
  deleteReview,
  getPendingReviews,
  getAllReviews,
  approveReview,
  rejectReview,
  submitReviewWithMedia
};
