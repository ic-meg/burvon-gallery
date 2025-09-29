import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Link } from 'react-router-dom';

import {
  wishlistBG,
  TryOnIcon,
  AddedFavorites,
  AddBag,
  AddBagHover,
  PrevIcon,
  NextIcon,
  PrevFacts,
  NextFacts,
  LyricImage,
  LyricWebp,
  AgathaImage,
  AgathaWebp,
  RiomImage,
  RiomWebp,
  CelineImage,
  CelineWebp,
  ClashCollectionBanner,
  KidsCollectionBanner,
  ClashCollectionWebp,
  KidsCollectionWebp,
} from "../../assets/index.js";

const wishlistCards = [
  {
    id: 1,
    images: [LyricImage, ClashCollectionBanner],
    webpImages: [LyricWebp, ClashCollectionWebp],
    name: "LYRIC",
    collection: "LOVE LANGUAGE COLLECTION",
    originalPrice: "₱790.00",
    salePrice: "₱711.00",
  },
  {
    id: 2,
    images: [AgathaImage, KidsCollectionBanner],
    webpImages: [AgathaWebp, KidsCollectionWebp],
    name: "AGATHA",
    collection: "CLASH COLLECTION",
    originalPrice: "₱790.00",
    salePrice: "₱711.00",
  },
  {
    id: 3,
    images: [RiomImage, ClashCollectionBanner],
    webpImages: [RiomWebp, ClashCollectionWebp],
    name: "RIOM",
    collection: "THE REBELLION COLLECTION",
    originalPrice: "₱790.00",
    salePrice: "₱711.00",
  },
  {
    id: 4,
    images: [CelineImage, KidsCollectionBanner],
    webpImages: [CelineWebp, KidsCollectionWebp],
    name: "CELINE",
    collection: "THE REBELLION COLLECTION",
    originalPrice: "₱790.00",
    salePrice: "₱711.00",
  },
  {
    id: 5,
    images: [LyricImage, ClashCollectionBanner],
    webpImages: [LyricWebp, ClashCollectionWebp],
    name: "LYRIC",
    collection: "LOVE LANGUAGE COLLECTION",
    originalPrice: "₱790.00",
    salePrice: "₱711.00",
  },
  {
    id: 6,
    images: [AgathaImage, KidsCollectionBanner],
    webpImages: [AgathaWebp, KidsCollectionWebp],
    name: "AGATHA",
    collection: "CLASH COLLECTION",
    originalPrice: "₱790.00",
    salePrice: "₱711.00",
  },
];

const MAX_VISIBLE = 4;

const Wishlist = () => {
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [hoveredImageIndex, setHoveredImageIndex] = useState(0);
  const [hoveredButtonId, setHoveredButtonId] = useState(null);
  const [startIndex, setStartIndex] = useState(0);

  const visibleCards = wishlistCards.slice(startIndex, startIndex + MAX_VISIBLE);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - MAX_VISIBLE, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      Math.min(prev + MAX_VISIBLE, wishlistCards.length - MAX_VISIBLE)
    );
  };

  return (
    <Layout full>
      <div
        className="relative w-full h-[430px] flex items-center"
        style={{
          backgroundImage: `url(${wishlistBG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'left'
        }}
      >
        {/* overlay of "wishlist" and "subtitle" */}
        <div className="absolute inset-0" />
        <div className="relative z-10 flex flex-col justify-center pl-12">
          <Link to="/user/Wishlist-Empty">
            <h1
              className="bebas text-[#fff7dc] leading-none hover:underline cursor-pointer"
              style={{ fontSize: "6rem" }}
              title="Go to empty wishlist"
            >
              WISHLIST
            </h1>
          </Link>
          <p className="avant text-[#fff7dc] mt-[-10px] max-w-xs" style={{ fontSize: "1.1rem" }}>
            Add to your Burvon Wishlist to easily save and buy favorites later.
          </p>
        </div>
      </div>

      {/* Rebel's Top Picks Section */}
      <section className="bg-[#181818] py-20">
        <div className="max-w-7xl mx-auto px-5 relative">
          <div className="flex justify-end items-center mb-8">
            <div className="flex space-x-4">
              <button
                onClick={handlePrev}
                disabled={startIndex === 0}
                className={`flex items-center justify-center px-2 py-1 hover:opacity-70 transition ${
                  startIndex === 0 ? "opacity-30 cursor-not-allowed" : ""
                }`}
                aria-label="Previous Picks"
              >
                <img src={PrevIcon} alt="Previous" className="w-10 h-10" />
              </button>
              <button
                onClick={handleNext}
                disabled={startIndex + MAX_VISIBLE >= wishlistCards.length}
                className={`flex items-center justify-center px-2 py-1 hover:opacity-70 transition ${
                  startIndex + MAX_VISIBLE >= wishlistCards.length
                    ? "opacity-30 cursor-not-allowed"
                    : ""
                }`}
                aria-label="Next Picks"
              >
                <img src={NextIcon} alt="Next" className="w-10 h-10" />
              </button>
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
                  onMouseLeave={() => {
                    setHoveredCardId(null);
                  }}
                  className={`relative bg-[#222] rounded-none overflow-hidden drop-shadow-[0_10px_15px_rgba(0,0,0,1)] group transition-all transform ${
                    isHovered ? "scale-105 z-10" : ""
                  }`}
                  style={{
                    height: isHovered ? "440px" : "375px",
                    transition: "height 0.3s ease, transform 0.3s ease",
                  }}
                >
                  {/* Top icons */}
                  <div className="w-full flex justify-between items-center px-6 pt-6 absolute top-0 left-0 z-10">
                    <img
                      src={TryOnIcon}
                      alt="Try On"
                      className="w-6 h-6 cursor-pointer hover:opacity-80"
                      draggable={false}
                    />
                    <img
                      src={AddedFavorites}
                      alt="Favorite"
                      className="w-6 h-6 cursor-pointer hover:opacity-80"
                      draggable={false}
                    />
                  </div>

                  {/* Product Image */}
                  <div className="relative w-full h-[300px] flex items-center justify-center overflow-hidden bg-black">
                    <picture className="w-full h-full">
                      {item.webpImages[isHovered ? hoveredImageIndex : 0] && (
                        <source
                          srcSet={item.webpImages[isHovered ? hoveredImageIndex : 0]}
                          type="image/webp"
                        />
                      )}
                      <img
                        src={
                          isHovered
                            ? item.images[hoveredImageIndex]
                            : item.images[0]
                        }
                        alt={item.name}
                        className="object-cover w-full h-full rounded-none transition-all duration-300"
                        loading="lazy"
                      />
                    </picture>
                    {isHovered && item.images.length > 1 && (
                      <>
                        <img
                          onClick={(e) => {
                            e.stopPropagation();
                            setHoveredImageIndex((idx) =>
                              (idx - 1 + item.images.length) % item.images.length
                            );
                          }}
                          src={PrevIcon}
                          alt="Previous"
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer hover:opacity-80"
                          draggable={false}
                        />
                        <img
                          onClick={(e) => {
                            e.stopPropagation();
                            setHoveredImageIndex((idx) =>
                              (idx + 1) % item.images.length
                            );
                          }}
                          src={NextIcon}
                          alt="Next"
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer hover:opacity-80"
                          draggable={false}
                        />
                      </>
                    )}
                  </div>

                  {/* Text + Price + Button */}
                  <div
                    style={{
                      background: "linear-gradient(90deg, #000000 46%, #666666 100%)",
                    }}
                    className="relative py-2 px-2 text-center flex flex-col items-center rounded-none min-h-[140px]"
                  >
                    <span className="uppercase text-[#FFF7DC] tracking-widest text-[13px] avantbold">
                      {item.name}
                    </span>
                    <span className="text-[13px] tracking-widest text-[#FFF7DC] avant">
                      {item.collection}
                    </span>
                    <div className="flex justify-center items-center gap-2 text-[14px] avantbold mt-1">
                      <span className="line-through text-[#FFF7DC] opacity-50">
                        {item.originalPrice}
                      </span>
                      <span className="text-[#FFF7DC]">{item.salePrice}</span>
                    </div>

                    {/* Add to Bag Button */}
                    {isHovered && (
                      <button
                        style={{
                          backgroundColor:
                            hoveredButtonId === item.id
                              ? "#FFF7DC"
                              : "transparent",
                          color:
                            hoveredButtonId === item.id
                              ? "#1F1F21"
                              : "#FFF7DC",
                          outline: "1px solid #FFF7DC",
                          borderRadius: 5,
                        }}
                        onMouseEnter={() => setHoveredButtonId(item.id)}
                        onMouseLeave={() => setHoveredButtonId(null)}
                        className="mt-4 w-full flex items-center justify-center gap-2 border border-[#FFF7DC] py-2 px-4 font-bold text-md tracking-wide rounded-5 transition-all duration-300"
                      >
                        <img
                          src={
                            hoveredButtonId === item.id ? AddBagHover : AddBag
                          }
                          alt="Bag Icon"
                          className="w-4 h-4"
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

export default Wishlist;