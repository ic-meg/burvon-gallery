import React from "react";

const CategoryProductsSkeleton = () => {
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

      {/* Hero Section Skeleton */}
      <section className="relative w-full h-[380px] sm:h-[450px] lg:h-[550px] xl:h-[730px] overflow-hidden bg-[#1a1a1a] flex items-center justify-center">
        <div className="w-full h-full" style={shimmerStyle}></div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 z-20">
          {[1, 2].map((index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-gray-600"
            />
          ))}
        </div>
      </section>

      {/* Category Section Skeleton */}
      <section className="bg-[#1f1f21] text-[#FFF7DC] pt-8 pb-1 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between pb-6">
            {/* Category Title Skeleton */}
            <div className="h-16 w-48 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
            
            {/* Filter Component Skeleton */}
            <div className="hidden md:flex items-center gap-4">
              <div className="h-10 w-32 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
              <div className="h-10 w-32 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
              <div className="h-10 w-24 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
            </div>
            
            {/* Mobile Filter Button Skeleton */}
            <div className="md:hidden h-10 w-24 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
          </div>
        </div>
      </section>

      {/* Products Grid Skeleton */}
      <section className="bg-[#1f1f21] pt-1 pb-14 px-4">
        <div className="max-w-7xl mx-auto px-0">
          {/* Mobile Grid Skeleton (2 columns) */}
          <div className="grid grid-cols-2 gap-4 md:hidden">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-[#2a2a2a] rounded overflow-hidden">
                <div className="w-full h-[200px] bg-[#2a2a2a]" style={shimmerStyle}></div>
                <div className="p-3 space-y-2">
                  <div className="h-3 w-3/4 bg-[#333] rounded" style={shimmerStyle}></div>
                  <div className="h-3 w-1/2 bg-[#333] rounded" style={shimmerStyle}></div>
                  <div className="h-4 w-1/3 bg-[#333] rounded" style={shimmerStyle}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Grid Skeleton (4 columns) */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
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
        </div>
      </section>

      {/* Product Highlights Section Skeleton */}
      <section className="relative w-full min-h-[400px] bg-black">
        {/* Desktop Layout Skeleton */}
        <div className="max-w-7xl mx-auto hidden lg:flex flex-col lg:flex-row items-center gap-12 px-6 py-16">
          <div className="flex-1">
            <div className="w-full h-[400px] bg-[#2a2a2a]" style={shimmerStyle}></div>
          </div>
          <div className="flex-1 text-[#FFF7DC] pl-8 md:pl-16 lg:pl-24 space-y-4">
            <div className="h-10 w-64 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
              <div className="h-4 w-full bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
              <div className="h-4 w-3/4 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
            </div>
            <div className="h-12 w-32 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
          </div>
        </div>

        {/* Mobile Layout Skeleton */}
        <div className="lg:hidden absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 w-full h-full bg-[#1F1F21]">
            <div className="w-full h-full bg-[#2a2a2a]" style={shimmerStyle}></div>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-[#FFF7DC] px-6 space-y-3">
            <div className="h-8 w-48 bg-[#333] rounded mx-auto" style={shimmerStyle}></div>
            <div className="space-y-2 max-w-md">
              <div className="h-3 w-full bg-[#333] rounded" style={shimmerStyle}></div>
              <div className="h-3 w-full bg-[#333] rounded" style={shimmerStyle}></div>
              <div className="h-3 w-3/4 bg-[#333] rounded mx-auto" style={shimmerStyle}></div>
            </div>
            <div className="h-10 w-28 bg-[#333] rounded" style={shimmerStyle}></div>
          </div>
        </div>
      </section>

      {/* Top Picks Section Skeleton */}
      <section className="bg-[#1f1f21] py-14">
        <div className="max-w-7xl mx-auto px-5 relative">
          <div className="flex justify-between items-center pb-8">
            <div className="h-12 w-64 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
            <div className="hidden lg:flex space-x-4">
              <div className="w-10 h-10 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
              <div className="w-10 h-10 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
            </div>
          </div>

          {/* Mobile Top Picks Skeleton */}
          <div className="lg:hidden flex overflow-x-hidden gap-3">
            {[1, 2, 3, 4].map((item) => (
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

          {/* Desktop Top Picks Skeleton */}
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
        </div>
      </section>
    </>
  );
};

export default CategoryProductsSkeleton;

