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
} from "../../assets/index.js";

const heroImages = [KidsCollectionBanner, ClashCollectionBanner];

const rebelsTopPicks = [
  {
    id: 1,
    image: LyricImage,
    name: "LYRIC",
    collection: "LOVE LANGUAGE COLLECTION",
    originalPrice: "₱790.00",
    salePrice: "₱711.00",
  },
  {
    id: 2,
    image: AgathaImage,
    name: "AGATHA",
    collection: "CLASH COLLECTION",
    originalPrice: "₱790.00",
    salePrice: "₱711.00",
  },
  {
    id: 3,
    image: RiomImage,
    name: "RIOM",
    collection: "THE REBELLION COLLECTION",
    originalPrice: "₱790.00",
    salePrice: "₱711.00",
  },
  {
    id: 4,
    image: CelineImage,
    name: "CELINE",
    collection: "THE REBELLION COLLECTION",
    originalPrice: "₱790.00",
    salePrice: "₱711.00",
  },
  {
    id: 5,
    image: LyricImage,
    name: "LYRIC 2",
    collection: "LOVE LANGUAGE COLLECTION",
    originalPrice: "₱790.00",
    salePrice: "₱711.00",
  },
];

// Constants for card width and gap
const CARD_WIDTH = 320;
const GAP = 40;

const Homepage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
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

  // Calculate 4 visible cards, wrapping around the list
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
            {visibleCards.map((item) => (
              <div
                key={item.id}
                className="relative bg-[#222] rounded-none overflow-hidden drop-shadow-[0_10px_15px_rgba(0,0,0,1)] group"
              >
                {/* Overlay Buttons */}
                <div className="w-full flex justify-between items-center px-6 pt-6 absolute top-0 left-0 z-10">
                  <img
                    src={TryOnIcon}
                    alt="Try On"
                    className="w-6 h-6 cursor-pointer hover:opacity-80"
                    draggable={false}
                    onClick={() => {
                      // Try on logic
                    }}
                  />
                  <img
                    src={AddFavorite}
                    alt="Favorite"
                    className="w-6 h-6 cursor-pointer hover:opacity-80"
                    draggable={false}
                    onClick={() => {
                      // Favorite toggle logic
                    }}
                  />
                </div>

                {/* Product Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="object-cover w-full h-[300px] rounded-none"
                />

                {/* Details with gradient background */}
                <div
                  style={{
                    background: "linear-gradient(90deg, #000000 46%, #666666 100%)",
                  }}
                  className="py-1 px-2 text-center flex flex-col items-center rounded-none"
                >
                  <span className="uppercase text-[#FFF7DC] tracking-widest text-[13px] avantbold">
                    {item.name}
                  </span>
                  <span className="text-[13px] tracking-widest text-[#FFF7DC] avant">
                    {item.collection}
                  </span>
                  <div className="flex justify-center items-center gap-2 text-[14px] avantbold">
                    <span className="line-through text-[#FFF7DC] opacity-50">{item.originalPrice}</span>
                    <span className="text-[#FFF7DC]">{item.salePrice}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Homepage;
