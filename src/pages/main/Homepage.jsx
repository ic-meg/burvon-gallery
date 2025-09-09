import React, { useState, useEffect, useRef } from "react";
import Layout from "../../components/Layout";

import {
  KidsCollectionBanner,
  ClashCollectionBanner,
  NextIcon,
  PrevIcon,
  TryIcon,
  AddFavorite,
  LyricImage,
  AgathaImage,
  RiomImage,
  Celine,
  AddBag,
} from "../../assets/index.js";

const heroImages = [KidsCollectionBanner, ClashCollectionBanner];

const rebelsTopicks = [
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
    images: [Celine, KidsCollectionBanner],
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
    setStartIndex((prev) => (prev + 1) % rebelsTopicks.length);
  };

  const prev = () => {
    setStartIndex((prev) =>
      prev === 0 ? rebelsTopicks.length - 1 : prev - 1
    );
  };

  const handleImageChange = (cardId, direction) => {
    if (hoveredCardId !== cardId) return;

    const images = rebelsTopicks.find((item) => item.id === cardId).images;
    setHoveredImageIndex((idx) => {
      if (direction === "next") return (idx + 1) % images.length;
      else return (idx - 1 + images.length) % images.length;
    });
  };

  const visibleCards = [];
  for (let i = 0; i < 4; i++) {
    visibleCards.push(rebelsTopicks[(startIndex + i) % rebelsTopicks.length]);
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
              alt={`Burvin homepage collection banner ${index + 1}`}
              className="flex-shrink-0 w-full h-full object-cover"
              draggable={false}
            />
          ))}
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {heroImages.map((_, index) => (
            <span
              key={index}
              className={`w-3 h-3 rounded-full border border-[#e2c39c] ${
                currentIndex === index
                  ? "bg-[#e2c39c]"
                  : "bg-gray-400 opacity-40"
              } transition-colors duration-300`}
              onClick={() => setCurrentIndex(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setCurrentIndex(index);
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Rebel's Top Picks */}
      <section className="bg-[#222] py-14">
        <div className="max-w-7xl mx-auto px-5 relative">
          <div className="flex justify-between items-center pb-8">
            <h2 className="font-bold bebas text-5xl tracking-wide text-[#e2c39c]">
              REBEL'S TOP PICKS
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
                className="flex items-center justify-center px-2 py-1 cursor-pointer hover:opacity-70 text-[#222] transition select-none"
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
                className="flex items-center justify-center px-2 py-1 cursor-pointer hover:opacity-70 text-[#222] transition select-none"
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

              return (
                <div
                  key={item.id}
                  onMouseEnter={() => {
                    setHoveredCardId(item.id);
                    setHoveredImageIndex(0);
                  }}
                  onMouseLeave={() => setHoveredCardId(null)}
                  className={`relative bg-[#222] rounded-none overflow-hidden drop-shadow-[0_10px_15px_rgba(0,0,0,1)] group transition-transform duration-300 ${
                    isHovered ? "scale-105 z-20" : "scale-100"
                  }`}
                  style={{
                    height: isHovered ? EXPANDED_HEIGHT : BASE_HEIGHT,
                    transition: "height 0.3s ease",
                  }}
                >
                  <div className="absolute top-4 right-4 z-10">
                    <img
                      src={AddFavorite}
                      alt="Add to favorite"
                      className="w-6 h-6 cursor-pointer"
                      draggable={false}
                    />
                  </div>

                  <div className="absolute top-4 left-4 z-10">
                    <img
                      src={TryIcon}
                      alt="Try Icon"
                      className="w-6 h-6 cursor-pointer"
                      draggable={false}
                    />
                  </div>

                  <div className="relative w-full h-[300px] flex items-center justify-center">
                    <img
                      src={
                        isHovered
                          ? item.images[hoveredImageIndex]
                          : item.images[0]
                      }
                      alt={item.name}
                      className="object-cover w-full h-full rounded-none transition-transform duration-300"
                    />

                    {isHovered && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageChange(item.id, "prev");
                          }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#222]/80 text-white w-10 h-10 rounded-full flex items-center justify-center border border-[#e2c39c] hover:bg-[#e2c39c] hover:text-[#222] transition"
                        >
                          <img src={PrevIcon} alt="Prev" className="w-6 h-6" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageChange(item.id, "next");
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#222]/80 text-white w-10 h-10 rounded-full flex items-center justify-center border border-[#e2c39c] hover:bg-[#e2c39c] hover:text-[#222] transition"
                        >
                          <img src={NextIcon} alt="Next" className="w-6 h-6" />
                        </button>
                      </>
                    )}
                  </div>

                  <div
                    style={{
                      background:
                        "linear-gradient(90deg, #000000 46%, #666666 100%)",
                    }}
                    className="relative py-6 px-2 h-[130px] flex flex-col items-center justify-center rounded-none"
                  >
                    <h3 className="avantbold uppercase text-[#e2c39c] tracking-wide text-xl mb-1">
                      {item.name}
                    </h3>
                    <p className="avant text-[#e2c39c] tracking-wide text-sm mb-1">
                      {item.collection}
                    </p>
                    <div className="flex gap-3 items-center">
                      <p className="line-through avant text-[#e2c39c] opacity-50">
                        {item.originalPrice}
                      </p>
                      <p className="avantbold text-[#e2c39c]">{item.salePrice}</p>
                    </div>

                    {isHovered && (
                      <button className="absolute bottom-4 left-4 right-4 border border-[#e2c39c] rounded-md text-[#e2c39c] font-semibold py-3 flex justify-center gap-1 items-center transition hover:bg-[#e2c39c] hover:text-[#222]">
                        <img
                          src={AddBag}
                          alt="Add to bag"
                          className="w-5 h-5"
                        />
                        ADD TO BAG
                      </button>
                    )}
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
