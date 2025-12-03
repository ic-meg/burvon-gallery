import React, { useState, useRef } from 'react'
import { AddImageCream, AddVideoCream } from '../assets/index.js'
import { submitReviewWithMedia } from '../api/reviewApi'
import { getUser } from '../services/authService'
import Toast from './Toast'

const ReviewModalMobile = ({ open, onClose, products, orderItemId, productId, onSuccess }) => {
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [showUsername, setShowUsername] = useState(false)
  const [imageFiles, setImageFiles] = useState([])
  const [videoFiles, setVideoFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [videoPreviews, setVideoPreviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  const imageInputRef = useRef(null)
  const videoInputRef = useRef(null)

  const ratingLabels = ['Poor', 'Fair', 'Good', 'Great', 'Excellent']

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + imageFiles.length > 5) {
      setToast({ show: true, message: 'Maximum 5 images allowed', type: 'error' })
      return
    }

    setImageFiles(prev => [...prev, ...files])

    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleVideoSelect = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + videoFiles.length > 2) {
      setToast({ show: true, message: 'Maximum 2 videos allowed', type: 'error' })
      return
    }

    setVideoFiles(prev => [...prev, ...files])

    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setVideoPreviews(prev => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const removeVideo = (index) => {
    setVideoFiles(prev => prev.filter((_, i) => i !== index))
    setVideoPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    const user = getUser()
    if (!user || !user.user_id) {
      setToast({ show: true, message: 'Please login to submit a review', type: 'error' })
      return
    }

    if (rating < 1 || rating > 5) {
      setToast({ show: true, message: 'Please select a rating', type: 'error' })
      return
    }

    setLoading(true)
    try {

      const result = await submitReviewWithMedia({
        userId: user.user_id,
        productId: products[0]?.product_id,
        orderItemId: products[0]?.order_item_id,
        rating,
        reviewText: reviewText.trim(),
        imageFiles,
        videoFiles,
        showUsername
      })

      if (result.error) {
        setToast({ show: true, message: result.error || 'Failed to submit review', type: 'error' })
      } else {
        setToast({ show: true, message: 'Review submitted successfully!', type: 'success' })
        setTimeout(() => {
          if (onSuccess) onSuccess()
          onClose()
          // Reset form
          setRating(5)
          setReviewText('')
          setShowUsername(false)
          setImageFiles([])
          setVideoFiles([])
          setImagePreviews([])
          setVideoPreviews([])
        }, 2000)
      }
    } catch (error) {
      setToast({ show: true, message: 'An error occurred. Please try again.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
        <div
          className="bg-[#181818] rounded-2xl p-4 w-[95vw] max-w-[420px] max-h-[90vh] overflow-y-auto flex flex-col gap-4"
          style={{ boxShadow: '0 0 32px #000' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="bebas cream-text text-xl">RATE PRODUCT</div>
            <button className="text-2xl cream-text" onClick={onClose}>&times;</button>
          </div>
          {/* Product List */}
          <div className="flex flex-col gap-3">
            {products.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-center">
                <img src={item.image} alt={item.variant} className="w-16 h-16 object-cover rounded-md" />
                <div>
                  <div className="avantbold cream-text text-sm leading-tight">{item.name}</div>
                  <div className="bebas text-xs" style={{ color: '#959595' }}>{item.variant}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Rating */}
          <div className="flex items-center justify-between mt-2">
            <span className="avantbold cream-text text-sm">YOUR RATING:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  className={`text-xl cursor-pointer ${star <= rating ? 'cream-text' : 'text-[#959595]'}`}
                  onClick={() => setRating(star)}
                >★</span>
              ))}
              <span className="avantbold cream-text ml-1 text-xs italic">{ratingLabels[rating - 1]}</span>
            </div>
          </div>
          {/* Review */}
          <textarea
            className="w-full h-30 rounded-lg bg-transparent border-1 border-[#FFF7DC] avant cream-text text-sm p-2 mt-2"
            placeholder="Share your experience (optional)"
            value={reviewText}
            onChange={e => setReviewText(e.target.value)}
            maxLength={1000}
          />
          {/* Upload buttons */}
          <div className="flex gap-2 mt-2 flex-wrap">
            {/* Image previews */}
            {imagePreviews.map((preview, idx) => (
              <div key={`img-${idx}`} className="relative w-12 h-12 rounded-lg overflow-hidden border-2 border-[#FFF7DC]">
                <img src={preview} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                <button
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                  onClick={() => removeImage(idx)}
                >
                  ×
                </button>
              </div>
            ))}

            {/* Video previews */}
            {videoPreviews.map((preview, idx) => (
              <div key={`vid-${idx}`} className="relative w-12 h-12 rounded-lg overflow-hidden border-2 border-[#FFF7DC]">
                <video src={preview} className="w-full h-full object-cover" />
                <button
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                  onClick={() => removeVideo(idx)}
                >
                  ×
                </button>
              </div>
            ))}

            {/* Add Image Button */}
            {imageFiles.length < 5 && (
              <button
                className="w-12 h-12 border-2 border-dashed border-[#FFF7DC] rounded-lg flex items-center justify-center"
                onClick={() => imageInputRef.current?.click()}
              >
                <img src={AddImageCream} alt="Add Image" className="w-6 h-6" />
              </button>
            )}

            {/* Add Video Button */}
            {videoFiles.length < 2 && (
              <button
                className="w-12 h-12 border-2 border-dashed border-[#FFF7DC] rounded-lg flex items-center justify-center"
                onClick={() => videoInputRef.current?.click()}
              >
                <img src={AddVideoCream} alt="Add Video" className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Hidden file inputs */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageSelect}
          />
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            multiple
            className="hidden"
            onChange={handleVideoSelect}
          />

          {/* Show username */}
          <label className="flex items-center gap-2 mt-2 avant cream-text text-sm">
            <input
              type="checkbox"
              checked={showUsername}
              onChange={e => setShowUsername(e.target.checked)}
              className="accent-[#FFF7DC] w-4 h-4"
            />
            Show username
          </label>
          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <button
              className="avantbold px-4 py-2 rounded-lg text-sm border-2 border-[#FFF7DC] cream-text bg-transparent flex-1 disabled:opacity-50"
              onClick={onClose}
              disabled={loading}
            >
              CANCEL
            </button>
            <button
              className="avantbold cream-bg metallic-text px-4 py-2 rounded-lg text-sm flex-1 disabled:opacity-50"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'SUBMITTING...' : 'CONFIRM'}
            </button>
          </div>
        </div>
      </div>
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
        duration={3000}
      />
    </>
  )
}

export default ReviewModalMobile
