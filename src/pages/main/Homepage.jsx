import React, { useState, useEffect, useRef } from "react";
import Layout from "../../components/Layout";

import {
  KidsCollectionBanner,
  ClashCollectionBanner,
  NextIcon,
  PrevIcon,
  TryOnIcon,
  AddFavorite,
  LyricImage,
  AgathaImage,
  RiomImage,
  CelineImage,
  AddBag,
  AddBagHover
} from "../../assets/index.js";

const heroImages = [KidsCollectionBanner, ClashCollectionBanner];

const rebelsTopPicks = [
  {
    id: 1,
    images: [LyricImage, ClashCollectionBanner],
    name: "LYRIC",
    collection: "LOVE LANGUAGE COLLECTION",
    originalPrice: "₱790.00",
    salePrice: "₱711.00",
  },
  {
    id: 2,
    images: [AgathaImage, KidsCollectionBanner],
    name: "AGATHA",
    collection: "CLASH COLLECTION",
    originalPrice: "₱790.00",
    salePrice: "₱711.00",
  },
  {
    id: 3,
    images: [RiomImage, ClashCollectionBanner],
    name: "RIOM",
    collection: "THE REBELLION COLLECTION",
    originalPrice: "₱790.00",
    salePrice: "₱711.00",
  },
  {
    id: 4,
    images: [CelineImage, KidsCollectionBanner],
    name: "CELINE",
    collection: "THE REBELLION COLLECTION",
    originalPrice: "₱790.00",
    salePrice: "₱711.00",
  },
  {
    id: 5,
    images: [LyricImage, ClashCollectionBanner],
    name: "LYRIC 2",
    collection: "LOVE LANGUAGE COLLECTION",
    originalPrice: "₱790.00",
    salePrice: "₱711.00",
  },
];

const BASE_HEIGHT = 400;
const EXPANDED_HEIGHT = 530;

const Homepage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [hoveredImageIndex, setHoveredImageIndex] = useState(0);

  const slideRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const next = () => {
    setStartIndex((prev) => (prev + 1) % rebelsTopPicks.length);
  };

  const prev = () => {
    setStartIndex((prev) =>
      prev === 0 ? rebelsTopPicks.length - 1 : prev - 1
    );
  };

  const handleImageChange = (cardId, direction) => {
    if (hoveredCardId !== cardId) return;
    const images = rebelsTopPicks.find((item) => item.id === cardId).images;
    setHoveredImageIndex((idx) =>
      direction === "next"
        ? (idx + 1) % images.length
        : (idx - 1 + images.length) % images.length
    );
  };

  const visibleCards = [];
  for (let i = 0; i < 4; i++) {
    visibleCards.push(rebelsTopPicks[(startIndex + i) % rebelsTopPicks.length]);
  }

  return (
    <Layout full>
      {/* Hero Section */}
      <section className="relative w-full h-[420px] lg:h-[650px] overflow-hidden bg-black flex items-center justify-center">
        <div
          ref={slideRef}
          className="flex h-full w-full transition-transform duration-700"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          aria-live="polite"
        >
          {heroImages.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Burvon homepage banner collection ${index + 1}`}
              className="flex-shrink-0 w-full h-full object-cover"
              draggable={false}
            />
          ))}
        </div>
        {/* Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {heroImages.map((_, index) => (
            <span
              key={index}
              className={`w-3 h-3 rounded-full border border-[#e3c296] ${
                index === currentIndex
                  ? "bg-[#e3c296]"
                  : "bg-gray-400 opacity-40"
              } transition-colors duration-300`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setCurrentIndex(index);
              }}
            />
          ))}
        </div>
      </section>

      {/* Rebels Top Picks Carousel */}
      <section className="bg-[#222] py-14">
        <div className="max-w-7xl mx-auto px-5 relative">
          <div className="flex justify-between items-center pb-8">
            <h2 className="font-bold bebas text-[50px] tracking-wide text-[#FFF7DC]">
              REBEL’S TOP PICKS
            </h2>
            <div className="flex space-x-4">
              <div
                onClick={prev}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") prev();
                }}
                aria-label="Previous Picks"
                className="flex items-center justify-center px-2 py-1 cursor-pointer hover:opacity-70 hover:text-[#222] transition select-none"
              >
                <img
                  src={PrevIcon}
                  alt="Previous"
                  className="w-10 h-10"
                  draggable={false}
                />
              </div>
              <div
                onClick={next}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") next();
                }}
                aria-label="Next Picks"
                className="flex items-center justify-center px-2 py-1 cursor-pointer hover:opacity-70 hover:text-[#222] transition select-none"
              >
                <img
                  src={NextIcon}
                  alt="Next"
                  className="w-10 h-10"
                  draggable={false}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            {visibleCards.map((item) => {
              const isHovered = hoveredCardId === item.id;
              const [isButtonHovered, setIsButtonHovered] = React.useState(false);

              return (
                <div
                  key={item.id}
                  onMouseEnter={() => {
                    setHoveredCardId(item.id);
                    setHoveredImageIndex(0);
                  }}
                  onMouseLeave={() => {
                    setHoveredCardId(null);
                    setIsButtonHovered(false);
                  }}
                  className={`relative bg-[#222] rounded-none overflow-hidden drop-shadow-[0_10px_15px_rgba(0,0,0,1)] group transition-transform duration-300 transform ${
                    isHovered ? "scale-105 z-10" : ""
                  }`}
                >
                  {/* Overlay Buttons */}
                  <div className="w-full flex justify-between items-center px-6 pt-6 absolute top-0 left-0 z-10">
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

                  {/* Image plus navigation buttons */}
                  <div className="relative w-full h-[300px] flex items-center justify-center">
                    <img
                      src={isHovered ? item.images[hoveredImageIndex] : item.images[0]}
                      alt={item.name}
                      className="object-cover w-full h-full rounded-none transition-all duration-300"
                    />
                    {isHovered && (
                      <>
                        <img
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageChange(item.id, "prev");
                          }}
                          src={PrevIcon}
                          alt="Prev"
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer hover:opacity-80"
                          draggable={false}
                        />
                        <img
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageChange(item.id, "next");
                          }}
                          src={NextIcon}
                          alt="Next"
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer hover:opacity-80"
                          draggable={false}
                        />
                      </>
                    )}
                  </div>

                  {/* Details with gradient background */}
                  <div
                    style={{
                      background: "linear-gradient(90deg, #000000 46%, #666666 100%)",
                    }}
                    className="relative py-6 px-2 text-center flex flex-col items-center rounded-none min-h-[150px]"
                  >
                    <span className="uppercase text-[#FFF7DC] tracking-widest text-[13px] avantbold">
                      {item.name}
                    </span>
                    <span className="text-[13px] tracking-widest text-[#FFF7DC] avant">
                      {item.collection}
                    </span>
                    <div className="flex justify-center items-center gap-2 text-[14px] avantbold mb-10">
                      <span className="line-through text-[#FFF7DC] opacity-50">{item.originalPrice}</span>
                      <span className="text-[#FFF7DC]">{item.salePrice}</span>
                    </div>
                    <button
                      style={{
                        backgroundColor: isButtonHovered ? "#FFF7DC" : "transparent",
                        color: isButtonHovered ? "#1F1F21" : "#FFF7DC",
                        outline: "2px solid #FFF7DC",
                        outlineOffset: "0px",
                        borderRadius: 0,
                      }}
                      onMouseEnter={() => setIsButtonHovered(true)}
                      onMouseLeave={() => setIsButtonHovered(false)}
                      className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 border border-[#FFF7DC] py-2 px-4 font-bold text-md tracking-wide rounded-none transition-all duration-300 outline-none"
                    >
                      <img
                        src={isButtonHovered ? AddBagHover : AddBag}
                        alt="Bag Icon"
                        className="w-5 h-5 transition-colors duration-300"
                      />
                      ADD TO BAG
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Homepage;
