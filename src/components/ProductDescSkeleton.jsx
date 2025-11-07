import React from "react";

const ProductDescSkeleton = () => {
  // Skeleton animation styles
  const shimmerStyle = {
    background: "linear-gradient(90deg, #2a2a2a 25%, #333 50%, #2a2a2a 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
  };

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>

      <div className="bg-[#1f1f21] text-[#FFF7DC] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 pt-20 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* MOBILE LAYOUT - Visible only on mobile */}
            <div className="block lg:hidden">
              {/* Mobile Image Section */}
              <div className="w-full bg-black rounded-lg overflow-hidden aspect-square mb-2 relative">
                <div className="w-full h-full bg-[#2a2a2a]" style={shimmerStyle}></div>
              </div>

              {/* Thumbnails Skeleton */}
              <div className="flex flex-row gap-3 justify-center mb-4">
                {[1, 2, 3, 4].map((index) => (
                  <div
                    key={index}
                    className="w-20 aspect-square bg-black rounded-lg overflow-hidden border border-transparent"
                  >
                    <div className="w-full h-full bg-[#2a2a2a]" style={shimmerStyle}></div>
                  </div>
                ))}
              </div>

              {/* Mobile Product Info Skeleton */}
              <div className="space-y-4">
                {/* Product Name */}
                <div className="h-6 w-3/4 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>

                {/* Price and Icons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-24 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                    <div className="h-8 w-32 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                    <div className="w-6 h-6 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                  </div>
                </div>

                {/* Stocks */}
                <div className="h-4 w-32 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>

                {/* Divider Line */}
                <div className="w-full h-px bg-[#FFF7DC]/20 my-4"></div>

                {/* Quantity */}
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-4 w-24 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                  <div className="w-[80px] h-[32px] bg-[#2a2a2a] rounded-full" style={shimmerStyle}></div>
                </div>

                {/* Size Section Skeleton */}
                <div className="space-y-2 mb-4">
                  <div className="h-4 w-16 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((size) => (
                      <div
                        key={size}
                        className="w-8 h-8 rounded-md bg-[#2a2a2a] border-2 border-[#444]"
                        style={shimmerStyle}
                      ></div>
                    ))}
                  </div>
                  <div className="h-4 w-32 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                </div>

                {/* Add to Bag Button */}
                <div className="w-full h-12 bg-[#2a2a2a] rounded-lg" style={shimmerStyle}></div>

                {/* Product Description */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                    <div className="h-4 w-full bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                    <div className="h-4 w-3/4 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                    <div className="h-4 w-5/6 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* DESKTOP LAYOUT - Hidden on mobile, visible on lg+ */}
            {/* Left Side: Images */}
            <div className="hidden lg:block space-y-4 pt-10">
              {/* Product Image Skeleton */}
              <div className="relative bg-black rounded-lg overflow-hidden aspect-square max-w-[600px] mx-auto">
                <div className="w-full h-full bg-[#2a2a2a]" style={shimmerStyle}></div>
                {/* Navigation dots skeleton */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1">
                  {[1, 2, 3, 4].map((index) => (
                    <div
                      key={index}
                      className="w-2 h-2 rounded-full bg-gray-600"
                    />
                  ))}
                </div>
                {/* Navigation arrows skeleton */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#2a2a2a] rounded-full opacity-50" style={shimmerStyle}></div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#2a2a2a] rounded-full opacity-50" style={shimmerStyle}></div>
              </div>
            </div>

            {/* Right Side - Product Info (Sticky) - Desktop Only */}
            <div className="hidden lg:block lg:sticky lg:top-8 lg:self-start space-y-6 pt-10">
              {/* Header with Product Name and Icons */}
              <div className="flex items-start justify-between">
                <div className="h-10 w-3/4 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                  <div className="w-8 h-8 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                </div>
              </div>

              {/* Price Skeleton */}
              <div className="flex items-center gap-4">
                <div className="h-10 w-32 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                <div className="h-12 w-40 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
              </div>

              {/* Quantity and Size Container */}
              <div className="flex items-start gap-36">
                {/* Quantity Section */}
                <div className="w-[120px] space-y-2">
                  <div className="h-6 w-24 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                  <div className="w-full h-[40px] bg-[#2a2a2a] rounded-full" style={shimmerStyle}></div>
                </div>

                {/* Size Section */}
                <div className="flex-1 space-y-2">
                  <div className="h-6 w-16 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5, 6].map((size) => (
                      <div
                        key={size}
                        className="w-10 h-10 rounded-md bg-[#2a2a2a] border-2 border-[#444]"
                        style={shimmerStyle}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stocks and Check Size */}
              <div className="flex flex-row items-center justify-between">
                <div className="h-6 w-32 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                <div className="h-6 w-40 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
              </div>

              {/* Product Description Skeleton */}
              <div className="space-y-4 mb-10">
                <div className="space-y-2">
                  <div className="h-5 w-full bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                  <div className="h-5 w-full bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                  <div className="h-5 w-4/5 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                </div>
                <div className="space-y-2">
                  <div className="h-5 w-full bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                  <div className="h-5 w-5/6 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                </div>
              </div>

              {/* Add to Bag Button */}
              <div className="w-full h-16 bg-[#2a2a2a] rounded-lg" style={shimmerStyle}></div>

              {/* Thumbnail Images Skeleton */}
              <div className="grid grid-cols-4 gap-3 mt-6">
                {[1, 2, 3, 4].map((index) => (
                  <div
                    key={index}
                    className="aspect-square bg-black rounded-lg overflow-hidden border border-transparent"
                  >
                    <div className="w-full h-full bg-[#2a2a2a]" style={shimmerStyle}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Reviews Carousel Skeleton */}
          <section className="mt-16 mb-12">
            <div className="flex items-center justify-between mb-8">
              <div className="h-10 w-64 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                <div className="h-6 w-6 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
              </div>
            </div>
            <div className="flex gap-4 overflow-x-hidden">
              {[1, 2, 3].map((review) => (
                <div
                  key={review}
                  className="flex-shrink-0 w-[85%] sm:w-[70%] md:w-[50%] lg:w-[40%] bg-[#2a2a2a] rounded-lg p-6 space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#333]"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-32 bg-[#333] rounded" style={shimmerStyle}></div>
                      <div className="h-3 w-24 bg-[#333] rounded" style={shimmerStyle}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-[#333] rounded" style={shimmerStyle}></div>
                    <div className="h-4 w-full bg-[#333] rounded" style={shimmerStyle}></div>
                    <div className="h-4 w-3/4 bg-[#333] rounded" style={shimmerStyle}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* You May Also Like Skeleton */}
          <section className="mt-16">
            <div className="flex justify-between items-center mb-8">
              <div className="h-10 w-64 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
              <div className="hidden lg:flex space-x-4">
                <div className="w-10 h-10 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                <div className="w-10 h-10 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
              </div>
            </div>

            {/* Mobile You May Also Like Skeleton */}
            <div className="lg:hidden flex overflow-x-hidden gap-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex-shrink-0"
                  style={{ width: "65vw" }}
                >
                  <div className="bg-[#2a2a2a] rounded overflow-hidden">
                    <div className="w-full h-[300px] bg-[#2a2a2a]" style={shimmerStyle}></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 w-3/4 bg-[#333] rounded" style={shimmerStyle}></div>
                      <div className="h-4 w-1/2 bg-[#333] rounded" style={shimmerStyle}></div>
                      <div className="h-6 w-1/3 bg-[#333] rounded" style={shimmerStyle}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop You May Also Like Skeleton */}
            <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-[#2a2a2a] rounded overflow-hidden">
                  <div className="w-full h-[400px] bg-[#2a2a2a]" style={shimmerStyle}></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 w-3/4 bg-[#333] rounded" style={shimmerStyle}></div>
                    <div className="h-4 w-1/2 bg-[#333] rounded" style={shimmerStyle}></div>
                    <div className="h-6 w-1/3 bg-[#333] rounded" style={shimmerStyle}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ProductDescSkeleton;

