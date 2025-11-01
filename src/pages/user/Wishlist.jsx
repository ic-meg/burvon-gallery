import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';
import ProductCard from '../../components/ProductCard';

import {
  wishlistBG,
  wishlistBGMobile,
  PrevIcon,
  NextIcon,
} from "../../assets/index.js";

const MAX_VISIBLE = 4;

const Wishlist = () => {
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [hoveredImageIndex, setHoveredImageIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const navigate = useNavigate();
  const { wishlist, isInitialized } = useWishlist();
  const { addToCart } = useCart();

  const visibleCards = wishlist.slice(startIndex, startIndex + MAX_VISIBLE);

  useEffect(() => {
    if (wishlist.length === 0) {
      navigate('/user/Wishlist-Empty');
    }
  }, [wishlist.length, navigate]);

  if (!isInitialized) {
    return <Layout><div className="bg-[#181818] min-h-screen"></div></Layout>;
  }

  return (
    <Layout full>
      {/* Mobile Wishlist */}
      <div className="block sm:hidden">
        {/* Header */}
        <div
          className="relative w-full h-[260px] flex items-center"
          style={{
            backgroundImage: `url(${wishlistBGMobile})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0" />
          <div className="relative z-10 flex flex-col justify-center pl-4 w-full">
       
              <h1
                className="bebas text-[#fff7dc] leading-none text-[2.2rem] text-center"
                title="Go to empty wishlist"
              >
                WISHLIST
              </h1>
     
            <p className="avant text-[#fff7dc] mt-[-2px] text-center text-[0.9rem] max-w-full">
              Add to your Burvon Wishlist to easily <br />save and buy favorites later.
            </p>
          </div>
        </div>
        {/* Cards Section */}
        <section className="bg-[#181818] py-9">
          <div className="mx-auto px-4 relative">
            <div className="grid grid-cols-2 gap-4 md:hidden items-stretch">
              {wishlist.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  layout="mobile"
                />
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Desktop Wishlist */}
      <div className="hidden sm:block">
        {/* Header */}
        <div
          className="relative w-full h-[430px] flex items-center"
          style={{
            backgroundImage: `url(${wishlistBG})`,
            backgroundSize: 'cover',
            backgroundPosition: 'left'
          }}
        >
          <div className="absolute inset-0" />
          <div className="relative z-10 flex flex-col justify-center pl-12">
          
              <h1
                className="bebas text-[#fff7dc] leading-none  "
                style={{ fontSize: "6rem" }}
                title="Go to empty wishlist"
              >
                WISHLIST
              </h1>
         
            <p className="avant text-[#fff7dc] mt-[-10px] max-w-xs" style={{ fontSize: "1.1rem" }}>
              Add to your Burvon Wishlist to easily save and buy favorites later.
            </p>
          </div>
        </div>
        {/* Cards Section */}
        <section className="bg-[#181818] py-20">
          <div className="max-w-7xl mx-auto px-5 relative">
            <div className="flex justify-end items-center mb-8">
              <div className="flex space-x-4">
                <button
                  onClick={() => setStartIndex((prev) => Math.max(prev - MAX_VISIBLE, 0))}
                  disabled={startIndex === 0}
                  className={`flex items-center justify-center hover:opacity-70 transition ${
                    startIndex === 0 ? "opacity-30 cursor-not-allowed" : ""
                  }`}
                  aria-label="Previous Picks"
                >
                  <img src={PrevIcon} alt="Previous" className="w-10 h-10" />
                </button>
                <button
                  onClick={() =>
                    setStartIndex((prev) =>
                      Math.min(prev + MAX_VISIBLE, wishlist.length - MAX_VISIBLE)
                    )
                  }
                  disabled={startIndex + MAX_VISIBLE >= wishlist.length}
                  className={`flex items-center justify-center hover:opacity-70 transition ${
                    startIndex + MAX_VISIBLE >= wishlist.length
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
              {visibleCards.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  layout="desktop"
                  isHovered={hoveredCardId === item.id}
                  currentImageIndex={hoveredImageIndex}
                  onMouseEnter={() => setHoveredCardId(item.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  onImageChange={(itemId, direction) => {
                    if (direction === "prev") {
                      setHoveredImageIndex((idx) =>
                        (idx - 1 + item.images.length) % item.images.length
                      );
                    } else {
                      setHoveredImageIndex((idx) =>
                        (idx + 1) % item.images.length
                      );
                    }
                  }}
                  hoveredButtonId={hoveredCardId === item.id ? item.id : null}
                  setHoveredButtonId={setHoveredCardId}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Wishlist;