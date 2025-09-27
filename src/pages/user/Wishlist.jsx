import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { Link } from 'react-router-dom';

import { 
  wishlistBG,
  AddBag, 
  AddBagHover, 
  NextIcon, 
  PrevIcon, 
  TryOnIcon, 
  AddedFavorites,
  trashBlack,
  trash,
  AgathaImage,
  AgathaWebp,
  CelineImage,
  CelineWebp,
  LyricImage,
  LyricWebp,
  ClashCollectionBanner,
  ClashCollectionWebp
} from "../../assets/index.js";

// product
const products = [
  {
    id: 1,
    name: 'LYRIC',
    collection: 'LOVE LANGUAGE COLLECTION',
    images: [
      LyricImage,
      ClashCollectionBanner
    ],
    webpImages: [LyricWebp, ClashCollectionWebp],
    priceOld: 790.00,
    priceNew: 711.00,
    type: 'necklaces',
  },
  {
    id: 2,
    name: 'LYRIC',
    collection: 'LOVE LANGUAGE COLLECTION',
    images: [
      LyricImage,
      ClashCollectionBanner
    ],
    webpImages: [LyricWebp, ClashCollectionWebp],
    priceOld: 790.00,
    priceNew: 711.00,
    type: 'necklaces',
  },
  {
    id: 3,
    name: 'AGATHA',
    collection: 'CLASH COLLECTION',
    images: [
      AgathaImage,
      ClashCollectionBanner
    ],
    webpImages: [AgathaWebp, ClashCollectionWebp],
    priceOld: 790.00,
    priceNew: 711.00,
    type: 'earrings',
  },
  {
    id: 4,
    name: 'CELINE',
    collection: 'THE REBELLION COLLECTION',
    images: [
      CelineImage,
      ClashCollectionBanner
    ],
    webpImages: [CelineWebp, ClashCollectionWebp],
    priceOld: 790.00,
    priceNew: 711.00,
    type: 'bracelets',
  },
  
]

const filters = ['necklaces', 'earrings', 'rings', 'bracelets']
const sorts = ['latest', 'oldest']

const CustomDropdown = ({ label, options, value, onChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-[220px]">
      <label className="bebas text-[#fff7dc] mb-2 block tracking-wide uppercase" style={{ fontSize: "1.4rem" }}>
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          className="avant bg-[#232323] text-[#fff7dc] border border-[#fff7dc] rounded-[5px] px-4 py-2 w-full flex justify-between items-center"
          onClick={() => setOpen(!open)}
        >
          {options.find(o => o.value === value)?.label}
          <img
            src="/src/assets/icons/dropdown.png"
            alt="Dropdown"
            className="w-5 h-5 ml-2"
          />
        </button>
        {open && (
          <div
            className="absolute left-0 right-0 mt-2 bg-[#232323] border border-[#fff7dc] rounded-[5px] z-20"
          >
            {options.map(o => (
              <div
                key={o.value}
                className="avant text-[#fff7dc] px-4 py-2 cursor-pointer hover:bg-[#181818] rounded-[5px]"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
              >
                {o.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Wishlist = () => {
  const [filter, setFilter] = useState('necklaces')
  const [sort, setSort] = useState('latest')
  const [selected, setSelected] = useState([])
  const [imageIndex, setImageIndex] = useState({})
  const [hoveredCardId, setHoveredCardId] = useState(null)
  const [hoveredButtonId, setHoveredButtonId] = useState(null)

  // Filter and sort products
  const filteredProducts = products
    .filter(p => p.type === filter)
    .sort((a, b) => sort === 'latest' ? b.id - a.id : a.id - b.id)

  // Select all handler
  const handleSelectAll = () => {
    setSelected(filteredProducts.map(p => p.id))
  }

  // Next image handler
  const handleNextImage = (id, images) => {
    setImageIndex(prev => ({
      ...prev,
      [id]: ((prev[id] || 0) + 1) % images.length
    }))
  }

  // Prev image handler
  const handlePrevImage = (id, images) => {
    setImageIndex(prev => ({
      ...prev,
      [id]: ((prev[id] || 0) - 1 + images.length) % images.length
    }))
  }

  // Remove handler
  const handleRemove = id => {
    setSelected(selected.filter(sid => sid !== id))
  }

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

      <div className="bg-[#181818] py-8 px-12">
        <div className="flex justify-between items-center mb-8">
          {/* filter and sort */}
          <div className="flex gap-8">
            <CustomDropdown
              label="FILTER"
              options={filters.map(f => ({ value: f, label: f.charAt(0).toUpperCase() + f.slice(1) }))}
              value={filter}
              onChange={setFilter}
            />
            <CustomDropdown
              label="SORT"
              options={sorts.map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))}
              value={sort}
              onChange={setSort}
            />
          </div>
          
          {/* buttons */}
          <div className="flex gap-6 items-start">
            <button
              className="avantbold flex items-center gap-3 border border-[#fff7dc] rounded-[5px] px-5 py-2 text-[#fff7dc] uppercase bg-transparent transition"
              style={{
                minWidth: 150,
                backgroundColor: hoveredButtonId === "action-bag" ? "#FFF7DC" : "transparent",
                color: hoveredButtonId === "action-bag" ? "#1F1F21" : "#FFF7DC",
                outline: "2px solid #FFF7DC",
                borderRadius: 5,
                whiteSpace: "nowrap",
              }}
              onMouseEnter={() => setHoveredButtonId("action-bag")}
              onMouseLeave={() => setHoveredButtonId(null)}
              onClick={() => {
                // Add all selected products to bag here
                // Example: console.log(selected);
                // Implement your add-to-bag logic
              }}
              disabled={selected.length === 0}
            >
              <img
                src={hoveredButtonId === "action-bag" ? AddBagHover : AddBag}
                alt="Add to Bag"
                className="w-5 h-5"
              />
              ADD TO BAG
            </button>
            <button
              className="avantbold flex items-center gap-3 border border-[#fff7dc] rounded-[5px] px-5 py-2 text-[#fff7dc] uppercase bg-transparent transition"
              style={{
                minWidth: 150,
                backgroundColor: hoveredButtonId === "action-remove" ? "#FFF7DC" : "transparent",
                color: hoveredButtonId === "action-remove" ? "#1F1F21" : "#FFF7DC",
                outline: "2px solid #FFF7DC",
                borderRadius: 5,
                whiteSpace: "nowrap",
              }}
              onClick={() => setSelected([])}
              onMouseEnter={() => setHoveredButtonId("action-remove")}
              onMouseLeave={() => setHoveredButtonId(null)}
            >
              <img 
                src={hoveredButtonId === "action-remove" ? trashBlack : trash}
                alt="Remove" 
                className="w-5 h-5" 
              />
              REMOVE
            </button>
            <label className="flex items-center gap-3 cursor-pointer avantbold text-[#fff7dc] uppercase select-none">
              <span className="relative">
                <input
                  type="checkbox"
                  checked={selected.length === filteredProducts.length && filteredProducts.length > 0}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelected(filteredProducts.map(p => p.id));
                    } else {
                      setSelected([]);
                    }
                  }}
                  className="appearance-none w-5 h-5 border border-[#fff7dc] rounded-[5px] bg-transparent focus:outline-none transition mb-[-13px]"
                />
                {/* Checkmark only when checked */}
                {selected.length === filteredProducts.length && filteredProducts.length > 0 && (
                  <span className="absolute left-0 top-0 w-5 h-5 flex items-center justify-center pointer-events-none mt-2.5">
                    <svg width="16" height="16" viewBox="0 0 16 16" className="text-[#fff7dc]" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 8.5L7 11.5L12 5.5" stroke="#fff7dc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                )}
              </span>
              <div className="mt-4">SELECT ALL</div>
            </label>
          </div>
        </div>

        {/* products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 min-h-[220px]">
          {filteredProducts.length === 0 ? (
            <div className="col-span-5 flex items-center justify-center h-full w-full">
              <span className="avant text-[#fff7dc] text-center">
                No items found in {filter}.
              </span>
            </div>
          ) : (
            filteredProducts.map(product => {
              const isHovered = hoveredCardId === product.id;
              const currentImageIndex = imageIndex[product.id] || 0;
              const isSelected = selected.includes(product.id);

              return (
                <div
                  key={product.id}
                  onMouseEnter={() => setHoveredCardId(product.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  onClick={() => {
                    if (isSelected) {
                      setSelected(prev => prev.filter(id => id !== product.id));
                    }
                  }}
                  className={`relative bg-[#222] rounded-none overflow-hidden drop-shadow-[0_10px_15px_rgba(0,0,0,1)] group transition-all transform ${
                    isHovered ? "scale-105 z-10" : ""
                  }`}
                  style={{
                    height: isHovered ? "460px" : "410px",
                    transition: "height 0.3s ease, transform 0.3s ease",
                    cursor: isSelected ? "pointer" : "default"
                  }}
                >
                  {/* overlay when selected */}
                  {isSelected && (
                    <div
                      className="absolute inset-0 bg-white z-[99] pointer-events-none transition-all duration-100"
                      style={{ opacity: 0.20 }}
                    ></div>
                  )}

                  {/* tryon and fav icons */}
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

                  {/* product Image */}
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

                  {/* text + price + buttons */}
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

                    {/* buttons */}
                    <div className="flex gap-2 w-full">
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
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-4 font-bold text-sm tracking-wide transition-all duration-300"
                      >
                        <img
                          src={hoveredButtonId === `${product.id}-bag` ? AddBagHover : AddBag}
                          alt="Bag Icon"
                          className="w-5 h-5"
                        />
                        ADD TO BAG
                      </button>

                      {/* remove */}
                      <button
                        onClick={() => handleRemove(product.id)}
                        style={{
                          backgroundColor: hoveredButtonId === `${product.id}-remove` ? "#FFF7DC" : "transparent",
                          color: hoveredButtonId === `${product.id}-remove` ? "#1F1F21" : "#FFF7DC",
                          outline: "2px solid #FFF7DC",
                          borderRadius: 5,
                        }}
                        onMouseEnter={() => setHoveredButtonId(`${product.id}-remove`)}
                        onMouseLeave={() => setHoveredButtonId(null)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-2 font-bold text-sm tracking-wide transition-all duration-300"
                      >
                        <img 
                          src={hoveredButtonId === `${product.id}-remove` ? trashBlack : trash}
                          alt="Remove" 
                          className="w-5 h-5" 
                        />
                        REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Wishlist