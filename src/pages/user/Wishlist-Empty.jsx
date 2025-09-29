import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Link, useNavigate } from 'react-router-dom';

import { 
  wishlistBG,
  wishlistBGMobile,
  AddBag, 
  AddBagHover, 
  NextIcon, 
  PrevIcon, 
  TryOnIcon, 
  AddFavorite,
  wishlistEmpty,
  AgathaImage,
  AgathaWebp,
  RiomImage,
  RiomWebp,
  CelineImage,
  CelineWebp,
  LyricImage,
  LyricWebp,
  ClashCollectionBanner,
  ClashCollectionWebp
} from "../../assets/index.js";

// product for "you may also like"
const recommendedProducts = [
  {
    id: 1,
    name: 'LYRIC',
    collection: 'LOVE LANGUAGE COLLECTION',
    images: [LyricImage, ClashCollectionBanner],
    webpImages: [LyricWebp, ClashCollectionWebp],
    priceOld: 790.00,
    priceNew: 711.00,
    type: 'necklaces',
  },
  {
    id: 2,
    name: 'AGATHA',
    collection: 'CLASH COLLECTION',
    images: [AgathaImage, ClashCollectionBanner],
    webpImages: [AgathaWebp, ClashCollectionWebp],
    priceOld: 790.00,
    priceNew: 711.00,
    type: 'earrings',
  },
  {
    id: 3,
    name: 'RIOM',
    collection: 'THE REBELLION COLLECTION',
    images: [RiomImage, ClashCollectionBanner],
    webpImages: [RiomWebp, ClashCollectionWebp],
    priceOld: 790.00,
    priceNew: 711.00,
    type: 'necklaces',
  },
  {
    id: 4,
    name: 'CELINE',
    collection: 'THE REBELLION COLLECTION',
    images: [CelineImage, ClashCollectionBanner],
    webpImages: [CelineWebp, ClashCollectionWebp],
    priceOld: 790.00,
    priceNew: 711.00,
    type: 'bracelets',
  },
  {
    id: 5,
    name: 'LYRIC',
    collection: 'LOVE LANGUAGE COLLECTION',
    images: [LyricImage, ClashCollectionBanner],
    webpImages: [LyricWebp, ClashCollectionWebp],
    priceOld: 790.00,
    priceNew: 711.00,
    type: 'necklaces',
  },
];

const WishlistEmpty = () => {
  const [imageIndex, setImageIndex] = useState({});
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [hoveredButtonId, setHoveredButtonId] = useState(null);
  const navigate = useNavigate();

  // Next image handler
  const handleNextImage = (id, images) => {
    setImageIndex(prev => ({
      ...prev,
      [id]: ((prev[id] || 0) + 1) % images.length
    }));
  };

  // Prev image handler
  const handlePrevImage = (id, images) => {
    setImageIndex(prev => ({
      ...prev,
      [id]: ((prev[id] || 0) - 1 + images.length) % images.length
    }));
  };

  return (
    <Layout full>
      {/* Mobile Layout */}
      <div className="block sm:hidden">
        {/* Header */}
        <div
          className="relative w-full h-[260px] flex items-center "
          style={{
            backgroundImage: `url(${wishlistBGMobile})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0" />
          <div className="relative z-10 flex flex-col justify-center pl-4 w-full">
            <h1 className="bebas text-[#fff7dc] leading-none text-[2.2rem] text-center">WISHLIST</h1>
            <p className="avant text-[#fff7dc] mt-[-2px] text-center text-[0.9rem] max-w-full">
              Add to your Burvon Wishlist to easily <br />save and buy favorites later.
            </p>
          </div>
        </div>
        {/* Empty Section */}
        <div className="bg-[#181818] py-27 px-4 flex flex-col items-center justify-center">
          <img
            src={wishlistEmpty}
            alt="Empty Wishlist"
            className="mx-auto mb-4"
            style={{ width: 80, height: 80 }}
          />
          <p className="avant text-[#fff7dc] text-sm mb-2 text-center">
            Your wishlist is empty. Start adding now!
          </p>
          <Link
            to="/"
            className="avantbold text-[#fff7dc] text-md mb-11 hover:underline"
            style={{ display: "inline-block" }}
          >
            CONTINUE SHOPPING...
          </Link>
        </div>
        {/* You May Also Like text */}
        <div className="bg-[#181818] px-4 pb-8">
          <h2 className="bebas text-[#fff7dc] text-3xl mb-4">YOU MAY ALSO LIKE</h2>
          <div className="flex overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-mandatory flex-nowrap pb-2" style={{ scrollBehavior: "smooth" }}>
            {recommendedProducts.map(product => (
              <div
                key={product.id}
                className="relative bg-[#222] drop-shadow-lg cursor-pointer flex-shrink-0 transition-all duration-300 ease-in-out"
                style={{
                  width: "65vw",
                  margin: "0 6px",
                  scrollSnapAlign: "center"
                }}
                onClick={() => navigate(`/product/${product.type}`)}
              >
                {/* Try-on and Heart Icons */}
                <div className="absolute top-4 left-2 right-2 flex justify-between items-center z-10">
                  <img
                    src={TryOnIcon}
                    alt="Try On"
                    className="w-5 h-5"
                    draggable={false}
                  />
                  <img
                    src={AddFavorite}
                    alt="Favorite"
                    className="w-5 h-5"
                    draggable={false}
                  />
                </div>
                {/* Product Image */}
                <div className="relative w-full min-h-[150px] sm:min-h-[200px] flex items-center justify-center overflow-hidden bg-black">
                  <picture className="w-full h-full">
                    {product.webpImages[0] && (
                      <source srcSet={product.webpImages[0]} type="image/webp" />
                    )}
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="object-cover w-full h-full rounded-none select-none transition-opacity duration-300"
                      draggable={false}
                      loading="lazy"
                    />
                  </picture>
                </div>
                {/* Info Section */}
                <div
                  className="w-full py-3 px-2 text-center flex flex-col items-center rounded-none"
                  style={{
                    background: "linear-gradient(90deg, #000000 46%, #666666 100%)"
                  }}
                >
                  <span className="uppercase text-[#FFF7DC] tracking-widest text-[13px] avantbold">
                    {product.name}
                  </span>
                  <span className="text-[13px] tracking-widest text-[#FFF7DC] avant text-center break-words">
                    {product.collection}
                  </span>
                  <div className="flex justify-center items-center gap-2 text-[14px] avantbold mt-1">
                    <span className="line-through text-[#FFF7DC] opacity-50">
                      ₱{product.priceOld.toFixed(2)}
                    </span>
                    <span className="text-[#FFF7DC]">
                      ₱{product.priceNew.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
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
            <h1 className="bebas text-[#fff7dc] leading-none" style={{ fontSize: "6rem" }}>WISHLIST</h1>
            <p className="avant text-[#fff7dc] mt-[-10px] max-w-xs" style={{ fontSize: "1.1rem" }}>
              Add to your Burvon Wishlist to easily save and buy favorites later.
            </p>
          </div>
        </div>
        {/* Empty Section */}
        <div className="bg-[#181818] py-24 px-4 flex flex-col items-center justify-center min-h-[400px]">
          <img
            src={wishlistEmpty}
            alt="Empty Wishlist"
            className="mx-auto mb-8"
            style={{ width: 120, height: 120 }}
          />
          <p className="avant text-[#fff7dc] text-lg mb-4 text-center">
            Your wishlist is empty. Start adding now!
          </p>
          <Link
            to="/"
            className="avantbold text-[#fff7dc] text-2xl mb-2 hover:underline"
            style={{ display: "inline-block" }}
          >
            Continue Shopping...
          </Link>
        </div>
        {/* You May Also Like text */}
        <div className="bg-[#181818] px-12 pb-16">
          <h2 className="bebas text-[#fff7dc] text-5xl mb-8">YOU MAY ALSO LIKE</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">
            {recommendedProducts.map(product => {
              const isHovered = hoveredCardId === product.id;
              const currentImageIndex = imageIndex[product.id] || 0;

              return (
                <div
                  key={product.id}
                  onMouseEnter={() => {
                    setHoveredCardId(product.id);
                    setImageIndex({ ...imageIndex, [product.id]: 0 });
                  }}
                  onMouseLeave={() => setHoveredCardId(null)}
                  className={`relative bg-[#222] rounded-none overflow-hidden drop-shadow-[0_10px_15px_rgba(0,0,0,1)] group transition-all transform ${
                    isHovered ? "scale-105 z-10" : ""
                  }`}
                  style={{
                    height: isHovered ? "440px" : "375px",
                    transition: "height 0.3s ease, transform 0.3s ease",
                  }}
                >
                  {/* Try-on and Heart Icons */}
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
                  {/* product image */}
                  <div className="relative w-full h-[300px] flex items-center justify-center overflow-hidden bg-black">
                    <picture className="w-full h-full">
                      {product.webpImages[currentImageIndex] && (
                        <source
                          srcSet={product.webpImages[currentImageIndex]}
                          type="image/webp"
                        />
                      )}
                      <img
                        src={product.images[currentImageIndex]}
                        alt={product.name}
                        className="object-cover w-full h-full rounded-none transition-all duration-300"
                        loading="lazy"
                      />
                    </picture>
                    {isHovered && product.images.length > 1 && (
                      <>
                        <img
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePrevImage(product.id, product.images);
                          }}
                          src={PrevIcon}
                          alt="Previous"
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer hover:opacity-80"
                          draggable={false}
                        />
                        <img
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNextImage(product.id, product.images);
                          }}
                          src={NextIcon}
                          alt="Next"
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer hover:opacity-80"
                          draggable={false}
                        />
                      </>
                    )}
                  </div>
                  {/* names + price + add to bag button */}
                  <div
                    style={{
                      background: "linear-gradient(90deg, #000000 46%, #666666 100%)",
                    }}
                    className="relative py-2 px-2 text-center flex flex-col items-center rounded-none min-h-[140px]"
                  >
                    <span className="uppercase text-[#FFF7DC] tracking-widest text-[13px] avantbold">
                      {product.name}
                    </span>
                    <span className="text-[13px] tracking-widest text-[#FFF7DC] avant">
                      {product.collection}
                    </span>
                    <div className="flex justify-center items-center gap-2 text-[14px] avantbold mt-1">
                      <span className="line-through text-[#FFF7DC] opacity-50">
                        ₱{product.priceOld.toFixed(2)}
                      </span>
                      <span className="text-[#FFF7DC]">₱{product.priceNew.toFixed(2)}</span>
                    </div>
                    {/* Add to Bag Button */}
                    {isHovered && (
                      <button
                        style={{
                          backgroundColor:
                            hoveredButtonId === product.id
                              ? "#FFF7DC"
                              : "transparent",
                          color:
                            hoveredButtonId === product.id
                              ? "#1F1F21"
                              : "#FFF7DC",
                          outline: "1px solid #FFF7DC",
                          borderRadius: 5,
                        }}
                        onMouseEnter={() => setHoveredButtonId(product.id)}
                        onMouseLeave={() => setHoveredButtonId(null)}
                        className="mt-4 w-full flex items-center justify-center gap-2 border border-[#FFF7DC] py-2 px-4 font-bold text-md tracking-wide rounded-5 transition-all duration-300"
                      >
                        <img
                          src={
                            hoveredButtonId === product.id ? AddBagHover : AddBag
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
      </div>
    </Layout>
  );
};

export default WishlistEmpty;