import React, { useState } from 'react';
import Layout from '../../../components/Layout';
import { Link } from 'react-router-dom';

import { 
  AddBag, 
  AddBagHover, 
  NextIcon, 
  PrevIcon, 
  TryOnIcon, 
  AddFavorite,
  shoppingEmpty,
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
} from "../../../assets/index.js";

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

const ShoppingBagEmpty = () => {
  const [imageIndex, setImageIndex] = useState({});
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [hoveredButtonId, setHoveredButtonId] = useState(null);

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
      <div className="relative w-full h-[430px] flex items-center">
        <div className="relative z-10 flex flex-col justify-center text-center pb-14 w-full">
          <h1 className="bebas text-[#fff7dc] text-center mb-2 tracking-wide mt-36" style={{ fontSize: "80px" }}>
            SHOPPING BAG
          </h1>
          <p className="avant text-center text-md mt-[-18px]">
            ALMOST YOURS, READY TO MAKE THEIR WAY TO YOU.
          </p>
        </div>
      </div>

      {/* empty bag section, no background */}
      <div className="pb-19 px-4 flex flex-col items-center justify-center min-h-[300px]">
        <img
          src={shoppingEmpty}
          alt="Empty Shopping Bag"
          className="mx-auto mb-4"
          style={{ width: 90, height: 90 }}
        />
        <p className="avant text-[#fff7dc] text-md mb-4 text-center">
          Your bag is empty. Start adding now!
        </p>
        <Link
          to="/"
          className="avantbold text-[#fff7dc] text-xl mb-2 hover:underline"
          style={{ display: "inline-block" }}
        >
          Continue Shopping...
        </Link>
      </div>

      {/* you may also like text */}
      <div className="px-12 py-15 pb-16">
        <h2 className="bebas text-[#fff7dc] text-5xl mb-8">YOU MAY ALSO LIKE</h2>
        
        {/* reco products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
          {recommendedProducts.map(product => {
            const isHovered = hoveredCardId === product.id;
            const currentImageIndex = imageIndex[product.id] || 0;
            
            return (
              <div
                key={product.id}
                onMouseEnter={() => setHoveredCardId(product.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                className={`relative bg-[#222] rounded-none overflow-hidden drop-shadow-[0_10px_15px_rgba(0,0,0,1)] group transition-all transform ${
                  isHovered ? "scale-105 z-10" : ""
                }`}
                style={{
                  height: isHovered ? "460px" : "410px",
                  transition: "height 0.3s ease, transform 0.3s ease",
                }}
              >
                {/* tryon and fav icons */}
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
                  <img
                    src={product.images[currentImageIndex]}
                    alt={product.name}
                    className="object-cover w-full h-full rounded-none transition-all duration-300"
                  />
                  
                  {/* arrows */}
                  {isHovered && product.images.length > 1 && (
                    <>
                      <img
                        onClick={e => {
                          e.stopPropagation();
                          handlePrevImage(product.id, product.images);
                        }}
                        src={PrevIcon}
                        alt="Previous"
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer hover:opacity-80"
                        draggable={false}
                      />
                      <img
                        onClick={e => {
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
                  className="relative py-4 px-4 text-center flex flex-col items-center rounded-none"
                >
                  {/* product name */}
                  <span className="uppercase text-[#FFF7DC] tracking-widest text-lg bebas mb-1">
                    {product.name}
                  </span>
                  
                  {/* collection name */}
                  <span className="text-sm tracking-widest text-[#FFF7DC] avant mb-2">
                    {product.collection}
                  </span>
                  
                  {/* price */}
                  <div className="flex justify-center items-center gap-2 text-base avantbold mb-3">
                    <span className="line-through text-[#FFF7DC] opacity-50">
                      ₱{product.priceOld.toFixed(2)}
                    </span>
                    <span className="text-[#FFF7DC]">₱{product.priceNew.toFixed(2)}</span>
                  </div>

                  {/* add to bag */}
                  <button
                    style={{
                      backgroundColor: hoveredButtonId === `${product.id}-bag` ? "#FFF7DC" : "transparent",
                      color: hoveredButtonId === `${product.id}-bag` ? "#1F1F21" : "#FFF7DC",
                      outline: "2px solid #FFF7DC",
                      borderRadius: 5,
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={() => setHoveredButtonId(`${product.id}-bag`)}
                    onMouseLeave={() => setHoveredButtonId(null)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-2 font-bold text-sm tracking-wide transition-all duration-300"
                  >
                    <img
                      src={hoveredButtonId === `${product.id}-bag` ? AddBagHover : AddBag}
                      alt="Bag Icon"
                      className="w-4 h-4"
                    />
                    ADD TO BAG
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

export default ShoppingBagEmpty;