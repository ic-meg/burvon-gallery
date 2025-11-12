import React from "react";

const ProfileSkeleton = () => {
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

      {/* Desktop Skeleton */}
      <div className="hidden md:block min-h-screen bg-[#181818] px-0 py-34 text-[#fff7dc]">
        {/* Title */}
        <div className="h-20 w-64 bg-[#2a2a2a] rounded mx-auto mt-10 mb-2" style={shimmerStyle}></div>
        
        {/* Header row */}
        <div className="flex items-center justify-between px-12 pt-12 pb-2">
          <div className="h-8 w-80 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
          <div className="flex gap-4">
            <div className="h-6 w-32 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
            <div className="h-6 w-20 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
          </div>
        </div>
        
        {/* Cream horizontal line */}
        <div className="w-full px-12">
          <div className="h-[4px] bg-[#FFF7DC] w-full" />
        </div>
        
        <div className="flex flex-row gap-0 px-12 pt-8">
          {/* Sidebar */}
          <div className="relative flex flex-col gap-3 min-w-[140px] pt-2 mr-8">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-12 w-full bg-[#2a2a2a] rounded pl-2"
                style={shimmerStyle}
              ></div>
            ))}
            {/* Vertical Divider */}
            <div className="absolute top-0 right-[-18px] h-full flex flex-col items-center" style={{ width: '32px' }}>
              <div
                className="bg-[#2a2a2a] w-2 h-8 rounded"
                style={{
                  position: 'absolute',
                  left: '50px',
                  top: '0px',
                  zIndex: 2,
                  ...shimmerStyle
                }}
              />
              <div
                className="bg-[#FFF7DC] w-[3px]"
                style={{
                  position: 'absolute',
                  left: '55px',
                  top: '0px',
                  height: '100%',
                  zIndex: 1,
                }}
              />
            </div>
          </div>
          
          {/* Spacer */}
          <div className="flex-shrink-0" style={{ width: '60px' }}></div>
          
          {/* Orders Skeleton */}
          <div className="flex flex-col flex-1 gap-6">
            {[1, 2, 3].map((order) => (
              <div key={order} className="mb-8">
                {/* Order ID */}
                <div className="h-8 w-48 bg-[#2a2a2a] rounded mb-4" style={shimmerStyle}></div>
                
                {/* Order Items */}
                {[1, 2].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-lg px-0 py-2 w-full mb-4">
                    <div className="flex items-center gap-4 min-w-[320px]">
                      {/* Product Image */}
                      <div className="w-25 h-25 bg-[#2a2a2a] rounded-md" style={shimmerStyle}></div>
                      
                      {/* Product Details */}
                      <div className="space-y-2">
                        <div className="h-6 w-48 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                        <div className="h-5 w-32 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                        <div className="h-4 w-24 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                        <div className="h-4 w-40 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                      </div>
                    </div>
                    
                    {/* Order Details and Actions (only for first item) */}
                    {item === 1 && (
                      <div className="flex flex-row items-center justify-between w-full ml-8">
                        <div className="flex flex-col gap-3 ml-45 mr-12">
                          <div className="flex gap-20">
                            <div className="space-y-2">
                              <div className="h-4 w-32 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                              <div className="h-5 w-24 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                            </div>
                            <div className="space-y-2">
                              <div className="h-4 w-40 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                              <div className="h-5 w-24 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                            </div>
                          </div>
                          <div className="flex gap-14 mt-2">
                            <div className="space-y-2">
                              <div className="h-4 w-36 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                              <div className="h-5 w-16 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                            </div>
                            <div className="space-y-2">
                              <div className="h-4 w-24 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                              <div className="h-5 w-28 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mb-17">
                          <div className="h-10 w-32 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                          <div className="h-10 w-36 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Skeleton */}
      <div className="md:hidden w-full min-h-screen px-4 pt-2 text-[#fff7dc] relative">
        {/* Title with Edit Button */}
        <div className="flex items-center justify-between mt-20 mb-2">
          <div className="h-12 w-48 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
          <div className="h-4 w-20 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
        </div>
        
        {/* Shopping History Title */}
        <div className="h-8 w-48 bg-[#2a2a2a] rounded mx-auto mt-9 mb-4" style={shimmerStyle}></div>
        
        {/* Tabs */}
        <div className="w-full px-2 relative mb-2">
          <div className="absolute left-0 right-0 top-1/2 translate-y-3 h-[2px] bg-[#FFF7DC] w-full z-0" />
          <div className="flex flex-row overflow-x-auto scrollbar-hide gap-6 pb-2 relative z-10">
            {[1, 2, 3, 4, 5].map((tab) => (
              <div
                key={tab}
                className="h-6 w-20 bg-[#2a2a2a] rounded"
                style={shimmerStyle}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Orders Skeleton */}
        <div className="mt-4">
          {[1, 2, 3].map((order) => (
            <div key={order} className="mb-6">
              {/* Order Header */}
              <div className="flex justify-between items-center mb-2">
                <div className="h-4 w-32 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                <div className="h-4 w-36 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
              </div>
              
              {/* Order Items */}
              {[1, 2].map((item) => (
                <div key={item} className="flex gap-4 items-start rounded-lg p-2 mb-2">
                  {/* Product Image */}
                  <div className="w-32 h-32 bg-[#2a2a2a] rounded-md" style={shimmerStyle}></div>
                  
                  {/* Product Details */}
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                    <div className="h-4 w-24 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                    <div className="h-3 w-40 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                    <div className="h-4 w-20 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                    {item === 1 && (
                      <div className="h-3 w-24 bg-[#2a2a2a] rounded mt-2" style={shimmerStyle}></div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Action Buttons */}
              <div className="flex justify-end gap-2 mt-4 mb-2">
                <div className="h-10 w-28 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
                <div className="h-10 w-32 bg-[#2a2a2a] rounded" style={shimmerStyle}></div>
              </div>
              
              {/* Divider */}
              {order < 3 && (
                <div className="w-full h-[1px] bg-[#FFF7DC] mt-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProfileSkeleton;

