import React from 'react';

const ProductReviewsCarousel = ({
  formattedProduct,
  overallRating,
  reviewCount,
  renderStars,
  renderOverallStars,
  scrollRef,
  currentReviewIndex,
  setCurrentReviewIndex,
  handleReviewsTouchStart,
  handleReviewsTouchMove,
  handleReviewsTouchEnd,
}) => {
  return (
    <div className="mt-16">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <h2 className="text-3xl lg:text-5xl bebas tracking-wider uppercase">PRODUCT REVIEWS</h2>
        <div className="flex items-left gap-1">
          <div className="flex gap-1">{renderOverallStars(parseFloat(overallRating))}</div>
          <span className="text-sm lg:text-lg avant font-medium text-[#FFF7DC]">{overallRating}</span>
          <span className="text-sm lg:text-lg avant text-[#959595]">({reviewCount})</span>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 lg:gap-8 overflow-x-scroll scrollbar-hide select-none"
        style={{ scrollSnapType: 'x mandatory', paddingBottom: '24px' }}
        onTouchStart={handleReviewsTouchStart}
        onTouchMove={handleReviewsTouchMove}
        onTouchEnd={handleReviewsTouchEnd}
      >
        {formattedProduct.reviews && formattedProduct.reviews.length > 0 ? (
          formattedProduct.reviews.map((review) => (
            <div
              key={review.id}
              className="bg-[#181818] rounded-xl shadow-lg p-4 lg:p-6 min-w-[280px] lg:min-w-[350px] max-w-[320px] lg:max-w-[400px] flex flex-col items-start avant"
              style={{ color: '#FFF7DC', scrollSnapAlign: 'start' }}
            >
              <div className="flex w-full items-center justify-between mb-1">
                <span className="bebas" style={{ fontSize: '16px', letterSpacing: '1px', color: '#FFF7DC' }}>
                  {review.name}
                </span>
                <span className="flex gap-1">{renderStars(review.rating)}</span>
              </div>

              <div className="mb-2 avant" style={{ fontSize: '13px', color: '#FFF7DC' }}>
                {review.collection}
              </div>

              <div className="mb-4 avant text-sm" style={{ color: '#FFF7DC' }}>
                "{review.comment}"
              </div>

              <div className="flex gap-2">
                {review.images && review.images.map((img, i) => (
                  <img key={i} src={img} alt="customer" className="w-12 h-12 lg:w-14 lg:h-14 object-cover border-2 border-white rounded-[5px]" />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center w-full min-h-[200px]">
            <p className="text-[#959595] avant text-lg">No reviews yet</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center -mt-1 gap-1">
        <button
          onClick={() => {
            if (!scrollRef.current) return;
            scrollRef.current.scrollBy({ left: -scrollRef.current.offsetWidth, behavior: 'smooth' });
          }}
          aria-label="Previous"
          className="flex items-center justify-center p-2 hover:opacity-70"
          style={{ background: 'none', border: 'none' }}
        >
          <svg width="20" height="20" className="lg:w-6 lg:h-6" viewBox="0 0 32 32" fill="none">
            <path d="M20 8L12 16L20 24" stroke="#FFF7DC" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex gap-1">
          {formattedProduct.reviews && formattedProduct.reviews.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to review ${i + 1}`}
              onClick={() => {
                if (!scrollRef.current) return;
                scrollRef.current.scrollTo({ left: i * scrollRef.current.offsetWidth, behavior: 'smooth' });
                setCurrentReviewIndex(i);
              }}
              className="w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center"
              style={{ background: 'none', border: 'none' }}
            >
              <span className={`rounded-full block ${currentReviewIndex === i ? 'bg-[#FFF7DC]' : 'border-2 border-[#FFF7DC] bg-transparent'}`} style={{ width: '12px', height: '12px' }} />
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            if (!scrollRef.current) return;
            scrollRef.current.scrollBy({ left: scrollRef.current.offsetWidth, behavior: 'smooth' });
          }}
          aria-label="Next"
          className="flex items-center justify-center p-2 hover:opacity-70"
          style={{ background: 'none', border: 'none' }}
        >
          <svg width="20" height="20" className="lg:w-6 lg:h-6" viewBox="0 0 32 32" fill="none">
            <path d="M12 8L20 16L12 24" stroke="#FFF7DC" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductReviewsCarousel;
