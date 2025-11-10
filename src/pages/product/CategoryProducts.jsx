import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import ProductCard from "../../components/ProductCard";
import FilterComponent from "../../components/FilterComponent";
import CategoryProductsSkeleton from "../../components/CategoryProductsSkeleton";
import { useCategory } from "../../contexts/CategoryContext";
import { useProduct } from "../../contexts/ProductContext";
import { useCollection } from "../../contexts/CollectionContext";

import {
  NextIcon,
  PrevIcon,
} from "../../assets/index.js";

const getDynamicHeroImages = (categoryData) => {
  if (!categoryData) {
    return [
      { src: "HERO IMAGE 1" },
      { src: "HERO IMAGE 2" },
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
    { src: "HERO IMAGE 1" },
    { src: "HERO IMAGE 2" },
  ];
};

const sortOptions = [
  { label: "Latest", value: "latest" },
  { label: "Price: Low to High", value: "priceLowHigh" },
  { label: "Price: High to Low", value: "priceHighLow" },
];

const CategoryProducts = () => {
  const navigate = useNavigate();
  const { categorySlug } = useParams();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [collectionValue, setCollectionValue] = useState("none");
  const [sortValue, setSortValue] = useState(sortOptions[0].value);
  

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [hoveredButtonId, setHoveredButtonId] = useState(null);
  const [hoveredImageIndexes, setHoveredImageIndexes] = useState({});
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showMobileCollection, setShowMobileCollection] = useState(false);
  const [showMobileSort, setShowMobileSort] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showMobileCategory, setShowMobileCategory] = useState(false);

  const topScrollRef = React.useRef(null);

  const { getCategoryBySlug, fetchCategoryBySlug, hasCategoryData, categories: allCategories, loading: categoryLoading } =
    useCategory();
  const { collections } = useCollection();
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

  const getCollectionOptions = () => {
    const collections = new Set();
    formattedProducts.forEach(product => {
      if (product.collection && product.collection !== "N/A") {
        collections.add(product.collection);
      }
    });
    
    return [
      { label: "Select a Collection...", value: "none" },
      ...Array.from(collections).map(collection => ({
        label: collection,
        value: collection.toLowerCase()
      }))
    ];
  };


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
    
    let collectionName = null;
    if (product.collection_id && collections) {
      const collection = collections.find(c => c.collection_id === product.collection_id);
      collectionName = collection?.name || null;
    }
    
    let categoryName = null;

    // Use the current page's category slug for all products on category pages
    // This ensures products show correct try-on icons based on the page they're displayed on
    if (categorySlug) {
      categoryName = categorySlug;
    } else if (categoryData) {
      categoryName = categoryData.slug || categoryData.name || categoryData.title;
    } else if (product.category_id && allCategories) {
      if (Array.isArray(allCategories)) {
        const category = allCategories.find(c => c.category_id === product.category_id);
        categoryName = category?.name || category?.title || null;
      } else {
        const category = Object.values(allCategories).find(c => c && c.category_id === product.category_id);
        categoryName = category?.name || category?.title || null;
      }
    }

    let oldPrice = '';
    if (product.original_price) {
      const cleanedOriginal = product.original_price.toString().replace(/[^\d.]/g, '');
      const parsedOriginal = parseFloat(cleanedOriginal);
      if (!isNaN(parsedOriginal) && parsedOriginal > 0) {
        oldPrice = `₱${parsedOriginal.toFixed(2)}`;
      }
    }

    let price = '';
    if (product.current_price) {
      const cleanedCurrent = product.current_price.toString().replace(/[^\d.]/g, '');
      const parsedCurrent = parseFloat(cleanedCurrent);
      if (!isNaN(parsedCurrent) && parsedCurrent > 0) {
        price = `₱${parsedCurrent.toFixed(2)}`;
      }
    } else if (product.price) {
      const cleanedPrice = product.price.toString().replace(/[^\d.]/g, '');
      const parsedPrice = parseFloat(cleanedPrice);
      if (!isNaN(parsedPrice) && parsedPrice > 0) {
        price = `₱${parsedPrice.toFixed(2)}`;
      }
    } else if (product.original_price && !product.current_price) {
      const cleanedOriginal = product.original_price.toString().replace(/[^\d.]/g, '');
      const parsedOriginal = parseFloat(cleanedOriginal);
      if (!isNaN(parsedOriginal) && parsedOriginal > 0) {
        price = `₱${parsedOriginal.toFixed(2)}`;
        oldPrice = ''; // Don't show as crossed out if it's the only price
      }
    }


    const formattedProduct = {
      id: product.product_id || product.id,
      slug: product.slug || generateSlug(productName, collectionName),
      name: productName,
      collection: collectionName || "N/A",
      category: categoryName || "N/A",
      category_id: product.category_id || null,
      oldPrice: oldPrice,
      price: price,
      showStrikethrough: product.current_price && product.original_price, // Show strikethrough when current_price exists
      stock: product.stock || 0,
      sizeStocks: product.sizeStocks || [],
      images:
        Array.isArray(product.images) && product.images.length > 0
          ? product.images
          : ["https://via.placeholder.com/400x400?text=No+Image"],
    };

    return formattedProduct;
  };

  const formattedProducts = useMemo(() => {
    return allProducts.map(formatProductData).filter(Boolean);
  }, [allProducts]);

  const applyFilters = useCallback(() => {
    let filtered = [...formattedProducts];

    if (collectionValue !== "none") {

      filtered = filtered.filter(product => {
        const productCollection = product.collection?.toLowerCase() || '';
        const selectedCollection = collectionValue.toLowerCase();
        const matches = productCollection === selectedCollection || 
                       productCollection.includes(selectedCollection) || 
                       selectedCollection.includes(productCollection);

        return matches;
      });

    }

 
    filtered = filtered.filter(product => {
      const price = parseFloat(product.price?.replace(/[^\d.]/g, '') || '0');
      
      if (price === 0) {

        return false;
      }
      
      const inRange = price >= minPrice && price <= maxPrice;
  
      return inRange;
    });
   
    
    switch (sortValue) {
      case 'priceLowHigh':
        filtered.sort((a, b) => {
          const priceA = parseFloat(a.price?.replace(/[^\d.]/g, '') || '0');
          const priceB = parseFloat(b.price?.replace(/[^\d.]/g, '') || '0');
          
          if (isNaN(priceA) && isNaN(priceB)) return 0;
          if (isNaN(priceA)) return 1;
          if (isNaN(priceB)) return -1;
          const result = priceA - priceB;
         
          return result;
        });
        break;
      case 'priceHighLow':
        filtered.sort((a, b) => {
          const priceA = parseFloat(a.price?.replace(/[^\d.]/g, '') || '0');
          const priceB = parseFloat(b.price?.replace(/[^\d.]/g, '') || '0');
        
          if (isNaN(priceA) && isNaN(priceB)) return 0;
          if (isNaN(priceA)) return 1;
          if (isNaN(priceB)) return -1;
          const result = priceB - priceA;
          
          return result;
        });
        break;
      case 'latest':
      default:
      
        break;
    }
    
    

    setFilteredProducts(filtered);
  }, [formattedProducts, collectionValue, sortValue, minPrice, maxPrice]);

  useEffect(() => {
    if (formattedProducts.length > 0) {
      applyFilters();
    }
  }, [formattedProducts, applyFilters, sortValue, collectionValue, minPrice, maxPrice]);


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

  const handleSortChange = (value) => {
    setSortValue(value);
  };

  const handlePriceChange = (newMinPrice, newMaxPrice) => {
    setMinPrice(newMinPrice);
    setMaxPrice(newMaxPrice);
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

  // Show skeleton only on initial load when we don't have data yet
  // Check if we have any data to display
  const hasAnyData = 
    categoryData !== null ||
    allProducts.length > 0 ||
    formattedProducts.length > 0;

  const isInitialLoad = (categoryLoading || productsLoading) && !hasAnyData;

  if (isInitialLoad) {
    return (
      <Layout full noPadding>
        <CategoryProductsSkeleton />
      </Layout>
    );
  }

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
          <div className="flex items-center justify-between gap-6 pb-6">
            <h2 className="text-5xl sm:text-6xl bebas tracking-wide whitespace-nowrap">
              {categoryDisplayName.toUpperCase()}
            </h2>

            <FilterComponent
              collectionOptions={getCollectionOptions()}
              sortOptions={sortOptions}
              showCategoryFilter={false}
              collectionValue={collectionValue}
              sortValue={sortValue}
              minPrice={minPrice}
              maxPrice={maxPrice}
              priceMin={0}
              priceMax={2000}
              onCollectionChange={handleCollectionChange}
              onSortChange={handleSortChange}
              onPriceChange={handlePriceChange}
              mobileFilterOpen={mobileFilterOpen}
              setMobileFilterOpen={setMobileFilterOpen}
              showMobileCollection={showMobileCollection}
              setShowMobileCollection={setShowMobileCollection}
              showMobileSort={showMobileSort}
              setShowMobileSort={setShowMobileSort}
              showMobileCategory={showMobileCategory}
              setShowMobileCategory={setShowMobileCategory}
            />
          </div>
        </div>

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
          ) : filteredProducts.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-[#FFF7DC] avant text-lg text-center">
                {collectionValue !== "none" || (minPrice !== 0 || maxPrice !== 2000) ? (
                  <div>
                    <div className="text-xl avantbold mb-2">No products match your filters</div>
                    <div className="text-sm opacity-80">
                      {collectionValue !== "none" && `Collection: ${collectionValue}`}
                      {collectionValue !== "none" && (minPrice !== 0 || maxPrice !== 2000) && " • "}
                      {(minPrice !== 0 || maxPrice !== 2000) && `Price: ₱${minPrice} - ₱${maxPrice}`}
                    </div>
                    <div className="text-xs mt-2 opacity-60">
                      Try adjusting your filters to see more products
                    </div>
                  </div>
                ) : (
                  "No products available at the moment."
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Mobile Grid */}
              <div className="grid grid-cols-2 gap-4 md:hidden items-stretch">
                {filteredProducts.map((item) => (
                  <ProductCard
                      key={item.id}
                    item={item}
                    layout="mobile"
                  />
                ))}
              </div>

              {/* Desktop Grid */}
              <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                {filteredProducts.map((item) => {
                  const isHovered = hoveredCardId === item.id;
                  const currentImageIndex = hoveredImageIndexes[item.id] ?? 0;
                  return (
                    <ProductCard
                      key={item.id}
                      item={item}
                      layout="desktop"
                      isHovered={isHovered}
                      currentImageIndex={currentImageIndex}
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
                      onImageChange={handleImageChange}
                      hoveredButtonId={hoveredButtonId}
                      setHoveredButtonId={setHoveredButtonId}
                    />
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
            categoryData.promo_images.trim() !== "" &&
            !categoryData.promo_images.includes("PLACEHOLDER") ? (
              <img
                src={categoryData.promo_images}
                alt="Promotional"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
            ) : (
              <span className="text-[#FFF7DC] text-xl avant font-bold">
                PROMO IMAGE 
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
            categoryData.promo_images.trim() !== "" &&
            !categoryData.promo_images.includes("PLACEHOLDER") ? (
              <img
                src={categoryData.promo_images}
                alt="Promotional"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
            ) : (
              <span className="text-[#FFF7DC] text-lg avant font-bold">
                PROMO IMAGE PLACEHOLDER
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
                  className="flex-shrink-0 transition-all duration-300 ease-in-out snap-center"
                  style={{ width: "65vw", margin: "0 6px" }}
                >
                  <ProductCard
                    item={item}
                    layout="mobile"
                    mobileImageHeight="250px"
                  />
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
                    <ProductCard
                      key={`top-pick-${item.id}`}
                      item={item}
                      layout="desktop"
                      isHovered={isHovered}
                      currentImageIndex={currentImageIndex}
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
                      onImageChange={handleImageChange}
                      hoveredButtonId={hoveredButtonId}
                      setHoveredButtonId={setHoveredButtonId}
                    />
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
