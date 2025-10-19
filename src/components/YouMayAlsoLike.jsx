import React from 'react';

const YouMayAlsoLike = ({
  youMayAlsoLike,
  carouselIndex,
  maxVisible,
  handlePrev,
  handleNext,
  canPrev,
  canNext,
  TryOnIcon,
  AddFavorite,
  PrevIcon,
  NextIcon,
  AddBag,
  AddBagHover,
  hoveredCardId,
  setHoveredCardId,
  hoveredImageIndexes,
  setHoveredImageIndexes,
  handleImageChange,
  hoveredButtonId,
  setHoveredButtonId,
}) => {
  return (
    <div className="mt-20">
      <div className="flex justify-between items-center pb-8">
        <h2 className="font-bold bebas text-3xl lg:text-3xl xl:text-5xl tracking-wide text-[#FFF7DC]">
          YOU MAY ALSO LIKE
        </h2>
        <div className="hidden lg:flex space-x-4">
          <div
            onClick={handlePrev}
            role="button"
            tabIndex={0}
            aria-label="Previous Products"
            className={`flex items-center justify-center px-2 py-1 cursor-pointer hover:opacity-70 transition select-none ${
              !canPrev ? 'opacity-30 cursor-not-allowed' : ''
            }`}
          >
            <img
              src={PrevIcon}
              alt="Previous"
              className="w-8 h-8 lg:w-10 lg:h-10"
              draggable={false}
            />
          </div>
          <div
            onClick={handleNext}
            role="button"
            tabIndex={0}
            aria-label="Next Products"
            className={`flex items-center justify-center px-2 py-1 cursor-pointer hover:opacity-70 transition select-none ${
              !canNext ? 'opacity-30 cursor-not-allowed' : ''
            }`}
          >
            <img
              src={NextIcon}
              alt="Next"
              className="w-8 h-8 lg:w-10 lg:h-10"
              draggable={false}
            />
          </div>
        </div>
      </div>

      {/* Mobile Carousel */}
      <div className="block lg:hidden">
        <div
          className="flex overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-mandatory flex-nowrap"
          style={{
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {youMayAlsoLike.map((item) => (
            <div
              key={`mobile-you-may-like-${item.id}`}
              className="relative bg-[#222] flex-shrink-0 transition-all duration-300 ease-in-out snap-center"
              style={{
                width: '65vw',
                margin: '0 6px',
              }}
            >
              <div className="relative w-full h-[260px] flex items-center justify-center overflow-hidden bg-black">
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                  <img
                    src={TryOnIcon}
                    alt="Try On"
                    className="w-6 h-6 cursor-pointer hover:opacity-80"
                    draggable={false}
                  />
                  <img
                    src={AddFavorite}
                    alt="Favorite"
                    className="w-6 h-6 cursor-pointer hover:opacity-80"
                    draggable={false}
                  />
                </div>
                <img src={item.images[0]} alt={item.name} className="object-cover w-full h-full" draggable={false} />
              </div>

              <div
                style={{
                  background: 'linear-gradient(90deg, #000000 46%, #666666 100%)',
                }}
                className="py-3 px-2 text-center flex flex-col items-center"
              >
                <span className="uppercase text-[#FFF7DC] tracking-widest text-sm avantbold">{item.name}</span>
                <span className="text-xs tracking-widest text-[#FFF7DC] avant mt-1">{item.collection}</span>
                <div className="flex justify-center items-center gap-2 text-sm avantbold mt-1">
                  <span className="line-through text-[#FFF7DC] opacity-50">{item.oldPrice}</span>
                  <span className="text-[#FFF7DC]">{item.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Grid  */}
      <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10">
        {youMayAlsoLike
          .slice(carouselIndex, carouselIndex + maxVisible)
          .map((item) => {
            const isHovered = hoveredCardId === item.id;
            const currentImageIndex = hoveredImageIndexes[item.id] ?? 0;
            return (
              <div
                key={`desktop-you-may-like-${item.id}`}
                onMouseEnter={() => {
                  setHoveredCardId(item.id);
                  setHoveredImageIndexes((prev) => ({
                    ...prev,
                    [item.id]: 0,
                  }));
                }}
                onMouseLeave={() => {
                  setHoveredCardId(null);
                  setHoveredButtonId(null);
                }}
                className={`relative bg-[#222] rounded-none overflow-hidden drop-shadow-[0_10px_15px_rgba(0,0,0,1)] group transition-all transform ${
                  isHovered ? 'lg:scale-105 z-10' : ''
                }`}
                style={{
                  height: isHovered ? '440px' : '375px',
                  transition: 'height 0.3s ease, transform 0.3s ease',
                }}
              >
                <div className="w-full flex justify-between items-center px-3 lg:px-6 pt-2 lg:pt-3 absolute top-0 left-0 z-10">
                  <img src={TryOnIcon} alt="Try On" className="w-4 h-4 lg:w-6 lg:h-6 cursor-pointer hover:opacity-80" draggable={false} />
                  <img src={AddFavorite} alt="Favorite" className="w-4 h-4 lg:w-6 lg:h-6 cursor-pointer hover:opacity-80" draggable={false} />
                </div>
                <div className="relative w-full h-[200px] lg:h-[300px] flex items-center justify-center overflow-hidden bg-black">
                  <img src={isHovered ? item.images[currentImageIndex] : item.images[0]} alt={item.name} className="object-cover w-full h-full rounded-none transition-all duration-300" draggable={false} />
                  {isHovered && item.images.length > 1 && (
                    <>
                      <img onClick={(e) => { e.stopPropagation(); handleImageChange(item.id, 'prev'); }} src={PrevIcon} alt="Previous" className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-6 lg:h-6 cursor-pointer hover:opacity-80" draggable={false} />
                      <img onClick={(e) => { e.stopPropagation(); handleImageChange(item.id, 'next'); }} src={NextIcon} alt="Next" className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-6 lg:h-6 cursor-pointer hover:opacity-80" draggable={false} />
                    </>
                  )}
                </div>
                <div style={{ background: 'linear-gradient(90deg, #000000 46%, #666666 100%)' }} className="relative py-1 lg:py-2 px-1 lg:px-2 text-center flex flex-col items-center rounded-none min-h-[80px] lg:min-h-[140px]">
                  <span className="uppercase text-[#FFF7DC] tracking-widest text-[10px] lg:text-[13px] avantbold">{item.name}</span>
                  <span className="text-[10px] lg:text-[13px] tracking-widest text-[#FFF7DC] avant">{item.collection}</span>
                  <div className="flex justify-center items-center gap-1 lg:gap-2 text-[11px] lg:text-[14px] avantbold mt-1">
                    <span className="line-through text-[#FFF7DC] opacity-50">{item.oldPrice}</span>
                    <span className="text-[#FFF7DC]">{item.price}</span>
                  </div>
                  {isHovered && (
                    <button
                      style={{
                        backgroundColor: hoveredButtonId === item.id ? '#FFF7DC' : 'transparent',
                        color: hoveredButtonId === item.id ? '#1F1F21' : '#FFF7DC',
                      outline: '1px solid #FFF7DC',
                      borderRadius: 5,
                      }}
                      onMouseEnter={() => setHoveredButtonId(item.id)}
                      onMouseLeave={() => setHoveredButtonId(null)}
                      className="mt-2 lg:mt-4 w-full flex items-center justify-center gap-1 lg:gap-2 border border-[#FFF7DC] py-1 lg:py-2 px-2 lg:px-4 font-bold text-xs lg:text-md tracking-wide rounded-5 transition-all duration-300"
                    >
                      <img src={hoveredButtonId === item.id ? AddBagHover : AddBag} alt="Bag Icon" className="w-3 h-3 lg:w-4 lg:h-4" />
                      ADD TO BAG
                    </button>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default YouMayAlsoLike;
