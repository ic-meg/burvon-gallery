import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";

// Hero Images
import {
  KidsCollHeroNeck,
  ClashCollHeroNeck,
  DropDownIcon,
  DropUpIcon,
  TryOnIcon,
  AddFavorite,
  LyricImage,
  AgathaImage,
  RiomImage,
  CelineImage,
  AddBag,
  AddBagHover,
  NextIcon,
  PrevIcon,
} from "../../assets/index.js";

// Product Data
const rebelsTopPicks = [
  {
    id: 1,
    name: "LYRIC",
    collection: "LOVE LANGUAGE COLLECTION",
    oldPrice: "₱790.00",
    price: "₱711.00",
    images: [LyricImage, ClashCollHeroNeck],
  },
  {
    id: 2,
    name: "AGATHA",
    collection: "CLASH COLLECTION",
    oldPrice: "₱790.00",
    price: "₱711.00",
    images: [AgathaImage, ClashCollHeroNeck],
  },
  {
    id: 3,
    name: "RIOM",
    collection: "THE REBELLION COLLECTION",
    oldPrice: "₱790.00",
    price: "₱711.00",
    images: [RiomImage, ClashCollHeroNeck],
  },
  {
    id: 4,
    name: "CELINE",
    collection: "THE REBELLION COLLECTION",
    oldPrice: "₱790.00",
    price: "₱711.00",
    images: [CelineImage, ClashCollHeroNeck],
  },
    {
    id: 5,
    name: "LYRIC",
    collection: "LOVE LANGUAGE COLLECTION",
    oldPrice: "₱790.00",
    price: "₱711.00",
    images: [LyricImage, ClashCollHeroNeck],
  },
  {
    id: 6,
    name: "AGATHA",
    collection: "CLASH COLLECTION",
    oldPrice: "₱790.00",
    price: "₱711.00",
    images: [AgathaImage, ClashCollHeroNeck],
  },
  {
    id: 7,
    name: "RIOM",
    collection: "THE REBELLION COLLECTION",
    oldPrice: "₱790.00",
    price: "₱711.00",
    images: [RiomImage, ClashCollHeroNeck],
  },
  {
    id: 8,
    name: "CELINE",
    collection: "THE REBELLION COLLECTION",
    oldPrice: "₱790.00",
    price: "₱711.00",
    images: [CelineImage, ClashCollHeroNeck],
  },
];



const heroImages = [
  { src: KidsCollHeroNeck },
  { src: ClashCollHeroNeck },
];

const collectionOptions = [
  { label: "Select a Collection...", value: "none" },
  { label: "Kids Collection", value: "kids" },
  { label: "Clash Collection", value: "clash" },
];

const sortOptions = [
  { label: "Latest", value: "latest" },
  { label: "Price: Low to High", value: "priceLowHigh" },
  { label: "Price: High to Low", value: "priceHighLow" },
];

const CustomDropdown = ({ options, value, onChange, placeholder = "Select...", isOpen, onToggle }) => {
  return (
    <div className="custom-dropdown relative w-full">
      <button
        type="button"
        onClick={onToggle}
        className="avant w-full bg-transparent border border-[#FFF7DC]/70 text-[#FFF7DC] px-4 py-2 rounded-md flex justify-between items-center focus:outline-none focus:border-[#FFF7DC]"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {value && value !== "none"
          ? options.find((o) => o.value === value)?.label
          : placeholder}
        <img
          src={isOpen ? DropUpIcon : DropDownIcon}
          alt="dropdown arrow"
          className="w-4 h-4 opacity-80 pointer-events-none"
        />
      </button>
      {isOpen && (
        <ul
          role="listbox"
          tabIndex={-1}
          className="avant absolute top-full left-0 w-full bg-[#181818] border border-[#FFF7DC] rounded-md mt-2 shadow-lg max-h-60 overflow-auto z-50"
        >
          {options.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={value === option.value}
              onClick={() => {
                onChange(option.value);
                onToggle();
              }}
              tabIndex={0}
              className={`px-4 py-2 cursor-pointer select-none hover:bg-[#232323] ${
                value === option.value ? "bg-[#232323]" : ""
              }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Necklaces = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(null);

  const [collectionValue, setCollectionValue] = useState("none");
  const [sortValue, setSortValue] = useState(sortOptions[0].value);

  const [minPrice, setMinPrice] = useState(300);
  const [maxPrice, setMaxPrice] = useState(1200);

  // Track hovered card and hovered button for styles
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [hoveredButtonId, setHoveredButtonId] = useState(null);

  // Track hovered image index independently per card by id
  const [hoveredImageIndexes, setHoveredImageIndexes] = useState({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".custom-dropdown")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleImageChange = (cardId, direction) => {
    const card = rebelsTopPicks.find((item) => item.id === cardId);
    if (!card) return;
    const len = card.images.length;
    setHoveredImageIndexes((prev) => {
      let currentIndex = prev[cardId] ?? 0;
      currentIndex =
        direction === "next"
          ? (currentIndex + 1) % len
          : (currentIndex - 1 + len) % len;
      return { ...prev, [cardId]: currentIndex };
    });
  };

  return (
    <Layout full noPadding>
      {/* Hero Section */}
      <section
        id="hero"
        className="relative w-full h-[450px] lg:h-[550px] xl:h-[730px] overflow-hidden bg-black"
      >
        <div
          className="flex h-full w-full transition-transform duration-700"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {heroImages.map((image, index) => (
            <picture key={index} className="flex-shrink-0 w-full h-full">
              <img
                src={image.src}
                alt={`Burvon homepage banner collection ${index + 1}`}
                className={`w-full h-full object-cover ${
                  image.src === ClashCollHeroNeck
                    ? "object-[70%_center]"
                    : "object-center"
                }`}
                draggable={false}
              />
            </picture>
          ))}
        </div>

        {/* Dots navigation */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {heroImages.map((_, index) => (
            <span
              key={index}
              className={`w-3 h-3 rounded-full border border-[#FFF7DC] ${
                index === currentIndex
                  ? "bg-[#FFF7DC]"
                  : "bg-gray-400 opacity-40"
              } transition-colors duration-300 cursor-pointer`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </section>

      {/* Necklaces Section */}
      <section className="bg-[#1f1f21] text-[#FFF7DC] pt-14 pb-1 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Heading + Filters */}
          <div className="flex items-center gap-12 pb-10">
            <h2 className="text-6xl font-bold bebas tracking-wide whitespace-nowrap">
              NECKLACES
            </h2>

            {/* Filters */}
            <div className="flex flex-row flex-wrap items-center gap-8 flex-1 min-w-0">
              {/* Collection */}
              <div className="flex flex-col w-56 min-w-[14rem]">
                <label className="text-xl bebas mb-1 uppercase tracking-wide">
                  Collection Name
                </label>
                <CustomDropdown
                  options={collectionOptions}
                  value={collectionValue}
                  onChange={setCollectionValue}
                  placeholder="Select a Collection..."
                  isOpen={openDropdown === "collection"}
                  onToggle={() =>
                    setOpenDropdown(openDropdown === "collection" ? null : "collection")
                  }
                />
              </div>

              {/* Sort */}
              <div className="flex flex-col w-50 min-w-[12rem]">
                <label className="text-xl bebas mb-1 uppercase tracking-wide">
                  Sort
                </label>
                <CustomDropdown
                  options={sortOptions}
                  value={sortValue}
                  onChange={setSortValue}
                  isOpen={openDropdown === "sort"}
                  onToggle={() =>
                    setOpenDropdown(openDropdown === "sort" ? null : "sort")
                  }
                />
              </div>

              {/* Price Range */}
              <div className="flex flex-col w-full max-w-[200px]">
                <label className="text-xl bebas -mb-1 uppercase tracking-wide">
                  Price
                </label>
                <div className="relative w-full h-8 flex items-center">
                  {/* Track */}
                  <div className="absolute top-1/2 left-0 w-full h-[3px] bg-[#FFF7DC]/30 rounded-full -translate-y-1/2"></div>

                  {/* Highlighted Range */}
                  <div
                    className="absolute top-1/2 h-[3px] bg-[#FFF7DC] rounded-full -translate-y-1/2"
                    style={{
                      left: `${((minPrice - 300) / (1200 - 300)) * 100}%`,
                      right: `${100 - ((maxPrice - 300) / (1200 - 300)) * 100}%`,
                    }}
                  ></div>

                  {/* Min Slider */}
                  <input
                    type="range"
                    min="300"
                    max="1200"
                    step="10"
                    value={minPrice}
                    onChange={(e) =>
                      setMinPrice(Math.min(Number(e.target.value), maxPrice - 10))
                    }
                    className="absolute w-full appearance-none bg-transparent pointer-events-none
                      [&::-webkit-slider-thumb]:appearance-none 
                      [&::-webkit-slider-thumb]:h-3 
                      [&::-webkit-slider-thumb]:w-3 
                      [&::-webkit-slider-thumb]:rounded-full 
                      [&::-webkit-slider-thumb]:bg-[#FFF7DC] 
                      [&::-webkit-slider-thumb]:cursor-pointer 
                      [&::-webkit-slider-thumb]:relative 
                      [&::-webkit-slider-thumb]:z-20"
                    style={{ pointerEvents: "auto" }}
                  />

                  {/* Max Slider */}
                  <input
                    type="range"
                    min="300"
                    max="1200"
                    step="10"
                    value={maxPrice}
                    onChange={(e) =>
                      setMaxPrice(Math.max(Number(e.target.value), minPrice + 10))
                    }
                    className="absolute w-full appearance-none bg-transparent pointer-events-none
                      [&::-webkit-slider-thumb]:appearance-none 
                      [&::-webkit-slider-thumb]:h-3 
                      [&::-webkit-slider-thumb]:w-3 
                      [&::-webkit-slider-thumb]:rounded-full 
                      [&::-webkit-slider-thumb]:bg-[#FFF7DC] 
                      [&::-webkit-slider-thumb]:cursor-pointer 
                      [&::-webkit-slider-thumb]:relative 
                      [&::-webkit-slider-thumb]:z-30"
                    style={{ pointerEvents: "auto" }}
                  />
                </div>

                {/* Values */}
                <div className="flex justify-between text-sm avant text-[#FFF7DC]/90 -mt-1">
                  <span>₱{minPrice}</span>
                  <span>₱{maxPrice}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Note: Product Cards section removed per your request */}
        </div>
      </section>

      {/* Rebels Top Picks Cards (no heading) */}
      <section className="bg-[#1f1f21] pt-1 pb-14 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            {rebelsTopPicks.map((item) => {
              const isHovered = hoveredCardId === item.id;
              const currentImageIndex = hoveredImageIndexes[item.id] ?? 0;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => {
                    setHoveredCardId(item.id);
                    setHoveredImageIndexes((prev) => ({ ...prev, [item.id]: 0 }));
                  }}
                  onMouseLeave={() => {
                    setHoveredCardId(null);
                    setHoveredButtonId(null);
                  }}
                  className={`relative bg-[#222] rounded-none overflow-hidden drop-shadow-[0_10px_15px_rgba(0,0,0,1)] group transition-all transform ${
                    isHovered ? "scale-105 z-10" : ""
                  }`}
                  style={{
                    height: isHovered ? "440px" : "375px",
                    transition: "height 0.3s ease, transform 0.3s ease",
                  }}
                >
                  {/* Top icons with padding */}
                  <div className="w-full flex justify-between items-center px-6 pt-3 absolute top-0 left-0 z-10">
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

                  {/* Product Image */}
                  <div className="relative w-full h-[300px] flex items-center justify-center overflow-hidden bg-black">
                    <img
                      src={isHovered ? item.images[currentImageIndex] : item.images[0]}
                      alt={item.name}
                      className="object-cover w-full h-full rounded-none transition-all duration-300"
                      draggable={false}
                    />
{isHovered && item.images.length > 1 && (
  <>
    <img
      onClick={(e) => {
        e.stopPropagation();
        handleImageChange(item.id, "prev");
      }}
      src={PrevIcon}
      alt="Previous"
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
                        {item.oldPrice}
                      </span>
                      <span className="text-[#FFF7DC]">{item.price}</span>
                    </div>

                    {isHovered && (
                      <button
                        style={{
                          backgroundColor:
                            hoveredButtonId === item.id ? "#FFF7DC" : "transparent",
                          color:
                            hoveredButtonId === item.id ? "#1F1F21" : "#FFF7DC",
                          outline: "2px solid #FFF7DC",
                          borderRadius: 5,
                        }}
                        onMouseEnter={() => setHoveredButtonId(item.id)}
                        onMouseLeave={() => setHoveredButtonId(null)}
                        className="mt-4 w-full flex items-center justify-center gap-2 border border-[#FFF7DC] py-2 px-4 font-bold text-md tracking-wide rounded-5 transition-all duration-300"
                      >
                        <img
                          src={hoveredButtonId === item.id ? AddBagHover : AddBag}
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

export default Necklaces;
