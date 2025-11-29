import React from 'react';
import ProductCard from './ProductCard';
import { PrevIcon, NextIcon } from '../assets/index.js';

const YouMayAlsoLike = ({
  youMayAlsoLike,
  carouselIndex,
  maxVisible,
  handlePrev,
  handleNext,
  canPrev,
  canNext,
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
              className="flex-shrink-0 snap-center"
              style={{
                width: '65vw',
                margin: '0 6px',
              }}
            >
              <ProductCard
                item={item}
                layout="mobile"
                mobileImageHeight="260px"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10">
        {youMayAlsoLike
          .slice(carouselIndex, carouselIndex + maxVisible)
          .map((item) => {
            const isHovered = hoveredCardId === item.id;
            const currentImageIndex = hoveredImageIndexes[item.id] ?? 0;
            return (
              <ProductCard
                key={`desktop-you-may-like-${item.id}`}
                item={item}
                layout="desktop"
                isHovered={isHovered}
                currentImageIndex={currentImageIndex}
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
                onImageChange={(direction) => handleImageChange(item.id, direction)}
                hoveredButtonId={hoveredButtonId}
                setHoveredButtonId={setHoveredButtonId}
              />
            );
          })}
      </div>
    </div>
  );
};

export default YouMayAlsoLike;
