import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { useCategory } from "../../contexts/CategoryContext";
import { useProduct } from "../../contexts/ProductContext";

import {
  DropDownIcon,
  DropDownIconBlack,
  DropUpIconBlack,
  DropUpIcon,
  TryOnIcon,
  AddFavorite,
  AddBag,
  AddBagHover,
  NextIcon,
  PrevIcon,
  FilterIcon,
} from "../../assets/index.js";

const getDynamicHeroImages = (categoryData) => {
  if (!categoryData) {
    return [
      { src: "HERO IMAGE 1 PLACEHOLDER" },
      { src: "HERO IMAGE 2 PLACEHOLDER" },
    ];
  }

  if (categoryData.category_images) {
    try {
      if (Array.isArray(categoryData.category_images)) {
        return categoryData.category_images.map((img) => ({
          src: img.url || img.src || img,
        }));
      }
      if (typeof categoryData.category_images === "string") {
        const parsedImages = JSON.parse(categoryData.category_images);
        if (Array.isArray(parsedImages)) {
          return parsedImages.map((img) => ({
            src: img.url || img.src || img,
          }));
        }
      }
    } catch (error) {
      console.error("Error parsing category_images:", error);
    }
  }

  if (categoryData.content) {
    try {
      const content = JSON.parse(categoryData.content);
      if (content.category_images && Array.isArray(content.category_images)) {
        return content.category_images.map((img) => ({
          src: img.url || img.src || img,
        }));
      }
      if (content.heroImages && Array.isArray(content.heroImages)) {
        return content.heroImages.map((img) => ({
          src: img.url || img.src || img,
        }));
      }
    } catch (error) {
      console.error("Error parsing category content:", error);
    }
  }

  return [
    { src: "HERO IMAGE 1 PLACEHOLDER" },
    { src: "HERO IMAGE 2 PLACEHOLDER" },
  ];
};

const collectionOptions = [
  { label: "Select a Collection...", value: "none" },
  { label: "COLLECTION LABEL 1", value: "collection1" },
  { label: "COLLECTION LABEL 2", value: "collection2" },
  { label: "COLLECTION LABEL 3", value: "collection3" },
];

const sortOptions = [
  { label: "Latest", value: "latest" },
  { label: "Price: Low to High", value: "priceLowHigh" },
  { label: "Price: High to Low", value: "priceHighLow" },
];

const CustomDropdown = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  isOpen,
  onToggle,
}) => {
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

const CategoryProducts = () => {
  const navigate = useNavigate();
  const { categorySlug } = useParams();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [collectionValue, setCollectionValue] = useState("none");
  const [sortValue, setSortValue] = useState(sortOptions[0].value);
  const [minPrice, setMinPrice] = useState(300);
  const [maxPrice, setMaxPrice] = useState(1200);
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [hoveredButtonId, setHoveredButtonId] = useState(null);
  const [hoveredImageIndexes, setHoveredImageIndexes] = useState({});
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [showMobileCollection, setShowMobileCollection] = useState(false);
  const [showMobileSort, setShowMobileSort] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const topScrollRef = React.useRef(null);

  const { getCategoryBySlug, fetchCategoryBySlug, hasCategoryData } =
    useCategory();
  const {
    productsByCategory,
    fetchProductsByCategory,
    loading: productsLoading,
  } = useProduct();

  const categoryData = getCategoryBySlug(categorySlug);
  const allProducts = productsByCategory[categorySlug] || [];
  const heroImages = getDynamicHeroImages(categoryData);

  const categoryDisplayName = categorySlug
    ? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)
    : "Products";

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
  }, [heroImages.length]);

  useEffect(() => {
    if (!hasCategoryData(categorySlug)) {
      fetchCategoryBySlug(categorySlug);
    }
    if (
      !productsByCategory[categorySlug] ||
      productsByCategory[categorySlug].length === 0
    ) {
      fetchProductsByCategory(categorySlug);
    }
  }, [categorySlug]);

  const generateSlug = (name, collectionName) => {
    if (!name) return "unnamed-product";
    const fullName =
      collectionName && collectionName !== "N/A"
        ? `${collectionName}-${name}`
        : name;
    return fullName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const formatProductData = (product) => {
    if (!product) return null;

    const productName = product.name || "Unnamed Product";
    const collectionName = product.collection?.name || null;

    return {
      id: product.product_id || product.id,
      slug: product.slug || generateSlug(productName, collectionName),
      name: productName,
      collection: product.collection?.name || product.collection || "N/A",
      oldPrice: product.original_price
        ? `₱${parseFloat(product.original_price).toFixed(2)}`
        : null,
      price: product.current_price
        ? `₱${parseFloat(product.current_price).toFixed(2)}`
        : product.original_price
        ? `₱${parseFloat(product.original_price).toFixed(2)}`
        : null,
      showStrikethrough: product.current_price && product.original_price, // Show strikethrough when current_price exists
      images:
        Array.isArray(product.images) && product.images.length > 0
          ? product.images
          : ["https://via.placeholder.com/400x400?text=No+Image"],
    };
  };

  const formattedProducts = allProducts.map(formatProductData).filter(Boolean);

  const handleImageChange = (cardId, direction) => {
    const card = formattedProducts.find((item) => item.id === cardId);
    if (!card || !card.images || card.images.length <= 1) return;

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

  const handleCollectionChange = (value) => {
    setCollectionValue(value);
  };

  const topPicks = formattedProducts.slice(0, 8);
  const maxVisible = 4;
  const canPrev = carouselIndex > 0;
  const canNext = carouselIndex < topPicks.length - maxVisible;
  const isMobile = window.innerWidth < 768;

  const handlePrev = () => {
    if (canPrev) setCarouselIndex(carouselIndex - 1);
  };

  const handleNext = () => {
    if (canNext) setCarouselIndex(carouselIndex + 1);
  };

  return (
    <Layout full noPadding>
      {/* Hero Section */}
      <section className="relative w-full h-[380px] sm:h-[450px] lg:h-[550px] xl:h-[730px] overflow-hidden bg-black">
        <div
          className="flex h-full w-full transition-transform duration-700"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {heroImages.map((image, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full h-full bg-[#1F1F21] flex items-center justify-center"
            >
              {image.src && !image.src.includes("PLACEHOLDER") ? (
                <img
                  src={image.src}
                  alt={`Hero ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[#FFF7DC] text-2xl avant font-bold">
                  {image.src}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 z-20">
          {heroImages.map((_, index) => (
            <span
              key={index}
              className={`w-2 h-2 rounded-full border border-[#FFF7DC] ${
                index === currentIndex
                  ? "bg-[#FFF7DC]"
                  : "bg-gray-400 opacity-40"
              } transition-colors duration-300 cursor-pointer`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </section>

      {/* Category Section */}
      <section className="bg-[#1f1f21] text-[#FFF7DC] pt-8 pb-1 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between pb-6">
            <h2 className="text-5xl sm:text-6xl bebas tracking-wide whitespace-nowrap">
              {categoryDisplayName.toUpperCase()}
            </h2>

            {/* Desktop Filters */}
            <div className="hidden sm:flex flex-row flex-wrap items-center gap-8 flex-1 min-w-0">
              <div className="flex flex-col w-56 min-w-[14rem] ml-20">
                <label className="text-xl bebas mb-1 uppercase tracking-wide">
                  Collection Name
                </label>
                <CustomDropdown
                  options={collectionOptions}
                  value={collectionValue}
                  onChange={handleCollectionChange}
                  placeholder="Select a Collection..."
                  isOpen={openDropdown === "collection"}
                  onToggle={() =>
                    setOpenDropdown(
                      openDropdown === "collection" ? null : "collection"
                    )
                  }
                />
              </div>

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

              <div className="flex flex-col w-full max-w-[200px]">
                <label className="text-xl bebas -mb-1 uppercase tracking-wide">
                  Price
                </label>
                <div className="relative w-full h-8 flex items-center">
                  <div className="absolute top-1/2 left-0 w-full h-[3px] bg-[#FFF7DC]/30 rounded-full -translate-y-1/2"></div>
                  <div
                    className="absolute top-1/2 h-[3px] bg-[#FFF7DC] rounded-full -translate-y-1/2"
                    style={{
                      left: `${((minPrice - 300) / (1200 - 300)) * 100}%`,
                      right: `${
                        100 - ((maxPrice - 300) / (1200 - 300)) * 100
                      }%`,
                    }}
                  ></div>
                  <input
                    type="range"
                    min="300"
                    max="1200"
                    step="50"
                    value={minPrice}
                    onChange={(e) =>
                      setMinPrice(
                        Math.min(Number(e.target.value), maxPrice - 50)
                      )
                    }
                    className="absolute w-full appearance-none bg-transparent pointer-events-none
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3
                      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FFF7DC]
                      [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-20"
                    style={{ pointerEvents: "auto" }}
                  />
                  <input
                    type="range"
                    min="300"
                    max="1200"
                    step="50"
                    value={maxPrice}
                    onChange={(e) =>
                      setMaxPrice(
                        Math.max(Number(e.target.value), minPrice + 50)
                      )
                    }
                    className="absolute w-full appearance-none bg-transparent pointer-events-none
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3
                      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FFF7DC]
                      [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-30"
                    style={{ pointerEvents: "auto" }}
                  />
                </div>
                <div className="flex justify-between text-sm avant text-[#FFF7DC]/90 -mt-1">
                  <span>₱{minPrice}</span>
                  <span>₱{maxPrice}</span>
                </div>
              </div>
            </div>

            {/* Mobile Filter Button */}
            <div className="flex sm:hidden">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="flex items-center gap-2 border border-[#FFF7DC] rounded-md px-4 py-2 text-base avant transition focus:outline-none"
              >
                <img src={FilterIcon} alt="Filter" className="w-5 h-5" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Filter Modal */}
        {mobileFilterOpen && (
          <div
            className="fixed bottom-0 left-0 w-full z-50 shadow-2xl rounded-t-[30px] p-6 flex flex-col gap-6 animate-slideUp overflow-y-auto"
            style={{
              minHeight: "70vh",
              backgroundColor: "#FFF7DC",
              color: "#1F1F21",
              height: "60vh",
            }}
          >
            <button
              className="self-end text-2xl focus:outline-none text-[#232323]"
              onClick={() => setMobileFilterOpen(false)}
            >
              &times;
            </button>

            <div>
              <button
                className="w-full flex justify-between items-center cursor-pointer select-none"
                onClick={() => {
                  setShowMobileCollection((prev) => !prev);
                  setShowMobileSort(false);
                }}
              >
                <span
                  className="text-2xl bebas uppercase tracking-wide"
                  style={{ textShadow: "0 2px 6px #0001" }}
                >
                  COLLECTION NAME
                </span>
                <img
                  src={
                    showMobileCollection ? DropUpIconBlack : DropDownIconBlack
                  }
                  alt="dropdown"
                  className="ml-2 w-4 h-4"
                />
              </button>
              {showMobileCollection && (
                <div className="mt-4 space-y-2">
                  {collectionOptions
                    .filter((x) => x.value !== "none")
                    .map((option) => (
                      <div
                        key={option.value}
                        onClick={() => {
                          setCollectionValue(option.value);
                          setShowMobileCollection(false);
                        }}
                        className={`cursor-pointer avant text-[19px] tracking-wide ${
                          collectionValue === option.value
                            ? "font-bold underline"
                            : ""
                        }`}
                        style={{ color: "#232323" }}
                      >
                        {option.label}
                      </div>
                    ))}
                </div>
              )}
            </div>

            <hr style={{ borderColor: "#23232340" }} className="my-2" />

            <div>
              <button
                className="w-full flex justify-between items-center cursor-pointer select-none"
                onClick={() => {
                  setShowMobileSort((prev) => !prev);
                  setShowMobileCollection(false);
                }}
              >
                <span
                  className="text-2xl bebas uppercase tracking-wide"
                  style={{ textShadow: "0 2px 6px #0001" }}
                >
                  SORT
                </span>
                <img
                  src={showMobileSort ? DropUpIconBlack : DropDownIconBlack}
                  alt="dropdown"
                  className="ml-2 w-4 h-4"
                />
              </button>
              {showMobileSort && (
                <div className="mt-4 space-y-2">
                  {sortOptions.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => {
                        setSortValue(option.value);
                        setShowMobileSort(false);
                      }}
                      className={`cursor-pointer avant text-[19px] tracking-wide ${
                        sortValue === option.value ? "font-bold underline" : ""
                      }`}
                      style={{ color: "#232323" }}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <hr style={{ borderColor: "#23232340" }} className="my-2" />

            <div>
              <div
                className="text-2xl bebas uppercase tracking-wide mb-3"
                style={{ color: "#232323", textShadow: "0 2px 6px #0001" }}
              >
                PRICE
              </div>
              <div className="relative w-full h-8 flex items-center">
                <div className="absolute top-1/2 left-0 w-full h-[3px] bg-[#2323232a] rounded-full -translate-y-1/2"></div>
                <div
                  className="absolute top-1/2 h-[3px] bg-[#232] rounded-full -translate-y-1/2"
                  style={{
                    left: `${((minPrice - 300) / (1200 - 300)) * 100}%`,
                    right: `${100 - ((maxPrice - 300) / (1200 - 300)) * 100}%`,
                  }}
                ></div>
                <input
                  type="range"
                  min="300"
                  max="1200"
                  step="50"
                  value={minPrice}
                  onChange={(e) =>
                    setMinPrice(Math.min(Number(e.target.value), maxPrice - 50))
                  }
                  className="absolute w-full appearance-none bg-transparent pointer-events-none
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#1F1F21]
                    [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-20"
                  style={{ pointerEvents: "auto" }}
                />
                <input
                  type="range"
                  min="300"
                  max="1200"
                  step="50"
                  value={maxPrice}
                  onChange={(e) =>
                    setMaxPrice(Math.max(Number(e.target.value), minPrice + 50))
                  }
                  className="absolute w-full appearance-none bg-transparent pointer-events-none
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#1F1F21]
                    [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-30"
                  style={{ pointerEvents: "auto" }}
                />
              </div>
              <div className="flex justify-between text-base avant text-[#1F1F21] mt-1">
                <span>₱{minPrice}</span>
                <span>₱{maxPrice}</span>
              </div>
            </div>

            <button
              className="-mt-2 w-full bg-[#1F1F21] text-[#FFF7DC] avantbold rounded-md py-2 text-lg tracking-wide"
              onClick={() => setMobileFilterOpen(false)}
            >
              APPLY FILTERS
            </button>
          </div>
        )}
      </section>

      {/* Products Grid */}
      <section className="bg-[#1f1f21] pt-1 pb-14 px-4">
        <div className="max-w-7xl mx-auto px-0">
          {productsLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-[#FFF7DC] avant text-lg">
                Loading products...
              </div>
            </div>
          ) : formattedProducts.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-[#FFF7DC] avant text-lg">
                No products available at the moment.
              </div>
            </div>
          ) : (
            <>
              {/* Mobile Grid */}
              <div className="grid grid-cols-2 gap-4 md:hidden items-stretch ">
                {formattedProducts.map((item) => {
                  const mobileCollection = item.collection.replace(
                    / COLLECTION$/i,
                    ""
                  );
                  return (
                    <div
                      key={item.id}
                      onClick={() => navigate(`/product/${item.slug}`)}
                      className="relative bg-[#222] rounded-none overflow-hidden drop-shadow-[0_10px_15px_rgba(0,0,0,1)] cursor-pointer flex flex-col items-center w-full"
                    >
                      <div className="relative w-full h-[185px] overflow-hidden bg-black">
                        <div className="absolute top-2 left-2 right-2 flex justify-between items-center z-10">
                          <img
                            src={TryOnIcon}
                            alt="Try On"
                            className="w-4 h-4 cursor-pointer hover:opacity-80"
                            draggable={false}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <img
                            src={AddFavorite}
                            alt="Favorite"
                            className="w-4 h-4 cursor-pointer hover:opacity-80"
                            draggable={false}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/400x400?text=No+Image";
                          }}
                        />
                      </div>
                      <div
                        className="flex flex-col items-center py-1 px-1"
                        style={{
                          width: "100%",
                          height: "50px",
                          background:
                            "linear-gradient(90deg, #000000 46%, #666666 100%)",
                        }}
                      >
                        <span className="uppercase text-[#FFF7DC] tracking-widest text-[10px] avantbold leading-tight truncate">
                          {item.name}
                        </span>
                        <span className="text-[10px] tracking-widest text-[#FFF7DC] avant truncate mt-[2px] uppercase">
                          {mobileCollection}
                        </span>
                        <div className="flex justify-center items-center gap-1 text-[10px] avantbold mt-1">
                          {item.showStrikethrough && item.oldPrice && (
                            <span className="line-through text-[#FFF7DC] opacity-50 truncate">
                              {item.oldPrice}
                            </span>
                          )}
                          {item.price && (
                            <span className="text-[#FFF7DC] truncate">
                              {item.price}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Grid */}
              <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                {formattedProducts.map((item) => {
                  const isHovered = hoveredCardId === item.id;
                  const currentImageIndex = hoveredImageIndexes[item.id] ?? 0;
                  return (
                    <div
                      key={item.id}
                      onClick={() => navigate(`/product/${item.slug}`)}
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
                      className={`relative bg-[#222] rounded-none overflow-hidden drop-shadow-[0_10px_15px_rgba(0,0,0,1)] group transition-all transform cursor-pointer ${
                        isHovered ? "scale-105 z-10" : ""
                      }`}
                      style={{
                        height: isHovered ? "440px" : "375px",
                        transition: "height 0.3s ease, transform 0.3s ease",
                      }}
                    >
                      <div className="w-full flex justify-between items-center px-6 pt-6 absolute top-0 left-0 z-10">
                        <img
                          src={TryOnIcon}
                          alt="Try On"
                          className="w-6 h-6 cursor-pointer hover:opacity-80"
                          draggable={false}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <img
                          src={AddFavorite}
                          alt="Favorite"
                          className="w-6 h-6 cursor-pointer hover:opacity-80"
                          draggable={false}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="relative w-full h-[300px] overflow-hidden bg-black">
                        <img
                          src={
                            isHovered
                              ? item.images[currentImageIndex]
                              : item.images[0]
                          }
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/400x400?text=No+Image";
                          }}
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
                      <div
                        style={{
                          background:
                            "linear-gradient(90deg, #000000 46%, #666666 100%)",
                        }}
                        className="relative py-2 px-2 text-center flex flex-col items-center rounded-none min-h-[140px]"
                      >
                        <span className="uppercase text-[#FFF7DC] tracking-widest text-[13px] avantbold">
                          {item.name}
                        </span>
                        <span className="uppercase text-[13px] tracking-widest text-[#FFF7DC] avantbold">
                          {item.collection}
                        </span>
                        <div className="flex justify-center items-center gap-2 text-[14px] avantbold mt-1">
                          {item.showStrikethrough && item.oldPrice && (
                            <span className="line-through text-[#FFF7DC] opacity-50">
                              {item.oldPrice}
                            </span>
                          )}
                          {item.price && (
                            <span className="text-[#FFF7DC]">{item.price}</span>
                          )}
                        </div>
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
                                hoveredButtonId === item.id
                                  ? AddBagHover
                                  : AddBag
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
            </>
          )}
        </div>
      </section>

      {/* Product Highlights Section */}
      <section className="relative w-full min-h-[400px] bg-black">
        <div className="max-w-7xl mx-auto hidden lg:flex flex-col lg:flex-row items-center gap-12 px-6 py-16">
          <div className="flex-1">
            {categoryData &&
            categoryData.promo_images &&
            !categoryData.promo_images.includes("PLACEHOLDER") ? (
              <img
                src={categoryData.promo_images}
                alt="Promotional"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[#FFF7DC] text-xl avant font-bold">
                {categoryData && categoryData.promo_images
                  ? categoryData.promo_images
                  : "PROMO IMAGE PLACEHOLDER"}
              </span>
            )}
          </div>
          <div className="flex-1 text-[#FFF7DC] pl-8 md:pl-16 lg:pl-24">
            <h2 className="text-2xl lg:text-5xl font-bold bebas tracking-wide mb-4">
              {categoryData && categoryData.title
                ? categoryData.title.toUpperCase()
                : `${categoryDisplayName.toUpperCase()} COLLECTION`}
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-[#fff7dc] opacity-90 avant leading-snug mb-6">
              {categoryData && categoryData.description
                ? categoryData.description
                : "DESCRIPTION PLACEHOLDER"}
            </p>
            <button className="px-6 py-3 border border-[#FFF7DC] text-[#FFF7DC] hover:bg-[#FFF7DC] hover:text-[#1f1f21] avant tracking-wide rounded transition-all">
              SHOP NOW
            </button>
          </div>
        </div>

        <div className="lg:hidden absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 w-full h-full bg-[#1F1F21] flex items-center justify-center">
            {categoryData &&
            categoryData.promo_images &&
            !categoryData.promo_images.includes("PLACEHOLDER") ? (
              <img
                src={categoryData.promo_images}
                alt="Promotional"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[#FFF7DC] text-lg avant font-bold">
                {categoryData && categoryData.promo_images
                  ? categoryData.promo_images
                  : "PROMO IMAGE PLACEHOLDER"}
              </span>
            )}
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-[#FFF7DC] px-6">
            <h2 className="text-3xl font-bold bebas tracking-wide mb-2 drop-shadow">
              {categoryData && categoryData.title
                ? categoryData.title.toUpperCase()
                : `${categoryDisplayName.toUpperCase()} COLLECTION`}
            </h2>
            <p className="text-sm avant leading-snug mb-3 max-w-md drop-shadow">
              {categoryData && categoryData.description
                ? categoryData.description
                : "DESCRIPTION PLACEHOLDER"}
            </p>
            <button className="px-6 py-3 border border-[#FFF7DC] text-[#FFF7DC] hover:bg-[#FFF7DC] hover:text-[#1f1f21] avant tracking-wide rounded transition-all">
              SHOP NOW
            </button>
          </div>
        </div>
      </section>

      {/* Top Picks Section */}
      <section className="bg-[#1f1f21] py-14">
        <div className="max-w-7xl mx-auto px-5 relative">
          <div className="flex justify-between items-center pb-8">
            <h2 className="font-bold bebas text-3xl lg:text-5xl tracking-wide text-[#FFF7DC]">
              TOP PICKS {categoryDisplayName.toUpperCase()}
            </h2>
            {!isMobile && (
              <div className="flex space-x-4">
                <div
                  onClick={handlePrev}
                  role="button"
                  tabIndex={0}
                  aria-label="Previous Picks"
                  className={`flex items-center justify-center px-2 py-1 cursor-pointer hover:opacity-70 transition select-none ${
                    !canPrev ? "opacity-30 cursor-not-allowed" : ""
                  }`}
                >
                  <img
                    src={PrevIcon}
                    alt="Previous"
                    className="w-10 h-10"
                    draggable={false}
                  />
                </div>
                <div
                  onClick={handleNext}
                  role="button"
                  tabIndex={0}
                  aria-label="Next Picks"
                  className={`flex items-center justify-center px-2 py-1 cursor-pointer hover:opacity-70 transition select-none ${
                    !canNext ? "opacity-30 cursor-not-allowed" : ""
                  }`}
                >
                  <img
                    src={NextIcon}
                    alt="Next"
                    className="w-10 h-10"
                    draggable={false}
                  />
                </div>
              </div>
            )}
          </div>

          {isMobile && (
            <div
              ref={topScrollRef}
              className="flex overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-mandatory flex-nowrap md:grid md:grid-cols-4 md:gap-5 md:overflow-visible"
              style={{
                scrollBehavior: "smooth",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {topPicks.map((item) => (
                <div
                  key={`top-pick-${item.id}`}
                  className="relative bg-[#222] flex-shrink-0 transition-all duration-300 ease-in-out snap-center"
                  style={{ width: "65vw", margin: "0 6px" }}
                >
                  <div className="relative w-full h-[260px] overflow-hidden bg-black">
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
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
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/400x400?text=No+Image";
                      }}
                    />
                  </div>
                  <div
                    style={{
                      background:
                        "linear-gradient(90deg, #000000 46%, #666666 100%)",
                    }}
                    className="py-3 px-2 text-center flex flex-col items-center"
                  >
                    <span className="uppercase text-[#FFF7DC] tracking-widest text-sm avantbold">
                      {item.name}
                    </span>
                    <span className="text-xs tracking-widest text-[#FFF7DC] avant mt-1">
                      {item.collection}
                    </span>
                    <div className="flex justify-center items-center gap-2 text-sm avantbold mt-1">
                      {item.showStrikethrough && item.oldPrice && (
                        <span className="line-through text-[#FFF7DC] opacity-50">
                          {item.oldPrice}
                        </span>
                      )}
                      {item.price && (
                        <span className="text-[#FFF7DC]">{item.price}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isMobile && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
              {topPicks
                .slice(carouselIndex, carouselIndex + maxVisible)
                .map((item) => {
                  const isHovered = hoveredCardId === item.id;
                  const currentImageIndex = hoveredImageIndexes[item.id] ?? 0;
                  return (
                    <div
                      key={`top-pick-${item.id}`}
                      onClick={() => navigate(`/product/${item.slug}`)}
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
                      className={`relative bg-[#222] rounded-none overflow-hidden drop-shadow-[0_10px_15px_rgba(0,0,0,1)] group transition-all transform cursor-pointer ${
                        isHovered ? "scale-105 z-10" : ""
                      }`}
                      style={{
                        height: isHovered ? "440px" : "375px",
                        transition: "height 0.3s ease, transform 0.3s ease",
                      }}
                    >
                      <div className="w-full flex justify-between items-center px-6 pt-3 absolute top-0 left-0 z-10">
                        <img
                          src={TryOnIcon}
                          alt="Try On"
                          className="w-6 h-6 cursor-pointer hover:opacity-80"
                          draggable={false}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <img
                          src={AddFavorite}
                          alt="Favorite"
                          className="w-6 h-6 cursor-pointer hover:opacity-80"
                          draggable={false}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="relative w-full h-[300px] flex items-center justify-center overflow-hidden bg-black">
                        <img
                          src={
                            isHovered
                              ? item.images[currentImageIndex]
                              : item.images[0]
                          }
                          alt={item.name}
                          className="object-cover w-full h-full rounded-none transition-all duration-300"
                          draggable={false}
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/400x400?text=No+Image";
                          }}
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
                      <div
                        style={{
                          background:
                            "linear-gradient(90deg, #000000 46%, #666666 100%)",
                        }}
                        className="relative py-2 px-2 text-center flex flex-col items-center rounded-none min-h-[140px]"
                      >
                        <span className="uppercase text-[#FFF7DC] tracking-widest text-[13px] avantbold">
                          {item.name}
                        </span>
                        <span className="text-[13px] tracking-widest text-[#FFF7DC] avantbold">
                          {item.collection}
                        </span>
                        <div className="flex justify-center items-center gap-2 text-[14px] avantbold mt-1">
                          {item.showStrikethrough && item.oldPrice && (
                            <span className="line-through text-[#FFF7DC] opacity-50">
                              {item.oldPrice}
                            </span>
                          )}
                          {item.price && (
                            <span className="text-[#FFF7DC]">{item.price}</span>
                          )}
                        </div>
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
                                hoveredButtonId === item.id
                                  ? AddBagHover
                                  : AddBag
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
          )}
        </div>
      </section>
    </Layout>
  );
};

export default CategoryProducts;
