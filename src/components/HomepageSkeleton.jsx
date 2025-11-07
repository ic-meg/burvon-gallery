import React from "react";

const HomepageSkeleton = () => {
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
      <section className="relative w-full h-[450px] lg:h-[550px] xl:h-[730px] overflow-hidden bg-[#1a1a1a] flex items-center justify-center">
        <div className="w-full h-full" style={shimmerStyle}></div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1 z-20">
          {[1, 2].map((index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-gray-600"
            />
          ))}
        </div>
      </section>

      {/* Rebels Top Picks Section Skeleton */}
      <section className="bg-[#1f1f21] py-14">
        <div className="max-w-7xl mx-auto px-5 relative">
          <div className="flex justify-between items-center pb-8">
            <div className="h-12 w-64 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
            <div className="hidden lg:flex space-x-4">
              <div className="w-10 h-10 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
              <div className="w-10 h-10 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
            </div>
          </div>

          {/* Mobile Skeleton */}
          <div className="lg:hidden flex overflow-x-hidden gap-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex-shrink-0"
                style={{ width: "65vw" }}
              >
                <div className="bg-[#2a2a2a] rounded" style={shimmerStyle}>
                  <div className="w-full h-[300px] bg-[#2a2a2a] rounded-t" style={shimmerStyle}></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 w-3/4 bg-[#333] rounded" style={shimmerStyle}></div>
                    <div className="h-4 w-1/2 bg-[#333] rounded" style={shimmerStyle}></div>
                    <div className="h-6 w-1/3 bg-[#333] rounded" style={shimmerStyle}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Grid Skeleton */}
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

      {/* Burvon's Collection Section Skeleton */}
      <section className="w-full bg-black py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-10">
            <div className="h-12 w-72 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
            <div className="hidden lg:flex space-x-4">
              <div className="w-10 h-10 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
              <div className="w-10 h-10 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
            </div>
          </div>

          {/* Mobile Skeleton */}
          <div className="lg:hidden flex overflow-x-hidden gap-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex-shrink-0 bg-[#111] rounded-none"
                style={{ width: "65vw" }}
              >
                <div className="w-full h-[200px] bg-[#2a2a2a]" style={shimmerStyle}></div>
              </div>
            ))}
          </div>

          {/* Desktop Grid Skeleton */}
          <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-center">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden shadow-lg mx-auto"
                style={{ maxWidth: 320 }}
              >
                <div className="w-full h-[200px] bg-[#2a2a2a]" style={shimmerStyle}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Try-On Section Skeleton (if needed) */}
      <section className="relative w-full bg-[#1F1F21] mt-16 md:mt-24 lg:mt-15">
        <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] bg-[#2a2a2a]" style={shimmerStyle}></div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-10 md:px-10 lg:px-5">
            <div className="flex flex-col items-center text-center max-w-md md:items-start md:text-left space-y-4">
              <div className="h-10 w-64 bg-[#333] rounded" style={shimmerStyle}></div>
              <div className="h-6 w-full bg-[#333] rounded" style={shimmerStyle}></div>
              <div className="h-6 w-3/4 bg-[#333] rounded" style={shimmerStyle}></div>
              <div className="h-12 w-32 bg-[#333] rounded" style={shimmerStyle}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Highlights Section Skeleton */}
      <section className="bg-[#1F1F21] py-20 flex justify-center">
        <div className="max-w-4xl w-full px-6 mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 justify-items-center justify-center max-w-3xl mx-auto sm:ml-auto sm:mr-0">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="w-80 sm:w-full mx-auto grid grid-cols-[3rem_1fr] items-center gap-4 text-left">
                <div className="w-11 h-11 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                <div className="space-y-2">
                  <div className="h-5 w-32 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                  <div className="h-4 w-48 bg-[#333] rounded" style={shimmerStyle}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section Skeleton */}
      <section className="bg-transparent pt-2 pb-20">
        <div className="w-full max-w-3xl mx-auto px-6">
          <div className="h-10 w-64 bg-[#2a2a2a] rounded mx-auto mb-8" style={shimmerStyle}></div>
          <div className="border-t border-[#fff7dc]/40 max-w-3xl mx-auto">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="border-b border-[#fff7dc]/40 bg-transparent py-5"
              >
                <div className="flex justify-between items-center">
                  <div className="h-5 w-3/4 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                  <div className="w-4 h-4 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomepageSkeleton;

