import React, { useState, useEffect, useMemo } from "react";
import ProductCard from "./ProductCard";
import { NextIcon, PrevIcon } from "../assets/index.js";
import { useCollection } from "../contexts/CollectionContext";

const TopPicks = ({
  categorySlug = null,
  collectionId = null,
  title = "TOP PICKS",
  limit = 8,
  maxVisible = 4,
  categoryContext = null,
  allCategories = []
}) => {
  const [topPicksProducts, setTopPicksProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [hoveredButtonId, setHoveredButtonId] = useState(null);
  const [hoveredImageIndexes, setHoveredImageIndexes] = useState({});
  const topScrollRef = React.useRef(null);

  const { collections } = useCollection();

  useEffect(() => {
    const fetchTopPicks = async () => {
      try {
        setLoading(true);
        let url = '';

        if (categorySlug) {
          url = `${import.meta.env.VITE_API_URL}product/top-picks/category/${categorySlug}?limit=${limit}`;
        } else if (collectionId) {
          url = `${import.meta.env.VITE_API_URL}product/top-picks/collection/${collectionId}?limit=${limit}`;
        } else {
          console.error("Either categorySlug or collectionId must be provided");
          setLoading(false);
          return;
        }

        // console.log('Fetching top picks from:', url);
        const response = await fetch(url);
        // console.log('Response status:', response.status);
        // console.log('Response headers:', response.headers.get('content-type'));

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to fetch top picks: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const responseText = await response.text();
          console.error('Non-JSON response received:', responseText.substring(0, 200));
          throw new Error('Server returned non-JSON response');
        }

        const data = await response.json();
        setTopPicksProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching top picks:', error);
        setTopPicksProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug || collectionId) {
      fetchTopPicks();
    }
  }, [categorySlug, collectionId, limit]);

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
    if (categorySlug) {
      categoryName = categorySlug;
    } else if (categoryContext) {
      categoryName = categoryContext.slug || categoryContext.name || categoryContext.title;
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
        oldPrice = `PHP${parsedOriginal.toFixed(2)}`;
      }
    }

    let price = '';
    if (product.current_price) {
      const cleanedCurrent = product.current_price.toString().replace(/[^\d.]/g, '');
      const parsedCurrent = parseFloat(cleanedCurrent);
      if (!isNaN(parsedCurrent) && parsedCurrent > 0) {
        price = `PHP${parsedCurrent.toFixed(2)}`;
      }
    } else if (product.price) {
      const cleanedPrice = product.price.toString().replace(/[^\d.]/g, '');
      const parsedPrice = parseFloat(cleanedPrice);
      if (!isNaN(parsedPrice) && parsedPrice > 0) {
        price = `PHP${parsedPrice.toFixed(2)}`;
      }
    } else if (product.original_price && !product.current_price) {
      const cleanedOriginal = product.original_price.toString().replace(/[^\d.]/g, '');
      const parsedOriginal = parseFloat(cleanedOriginal);
      if (!isNaN(parsedOriginal) && parsedOriginal > 0) {
        price = `PHP${parsedOriginal.toFixed(2)}`;
        oldPrice = '';
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
      showStrikethrough: product.current_price && product.original_price,
      stock: product.stock || 0,
      sizeStocks: product.sizeStocks || [],
      images:
        Array.isArray(product.images) && product.images.length > 0
          ? product.images
          : ["https://via.placeholder.com/400x400?text=No+Image"],
      totalSales: product.totalSales || 0,
    };

    return formattedProduct;
  };

  const formattedTopPicks = useMemo(() => {
    return topPicksProducts.map(formatProductData).filter(Boolean);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topPicksProducts, collections]);

  const handleImageChange = (cardId, direction) => {
    const card = formattedTopPicks.find((item) => item.id === cardId);
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

  const canPrev = carouselIndex > 0;
  const canNext = carouselIndex < formattedTopPicks.length - maxVisible;
  const isMobile = window.innerWidth < 768;

  const handlePrev = () => {
    if (canPrev) setCarouselIndex(carouselIndex - 1);
  };

  const handleNext = () => {
    if (canNext) setCarouselIndex(carouselIndex + 1);
  };

  if (loading) {
    return (
      <section className="bg-[#1f1f21] py-14">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex justify-center items-center py-20">
            <div className="text-[#FFF7DC] avant text-lg">
              Loading top picks...
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (formattedTopPicks.length === 0) {
    return null; // Don't show section if no products
  }

  return (
    <section className="bg-[#1f1f21] py-14">
      <div className="max-w-7xl mx-auto px-5 relative">
        <div className="flex justify-between items-center pb-8">
          <h2 className="font-bold bebas text-3xl lg:text-5xl tracking-wide text-[#FFF7DC]">
            {title}
          </h2>
          {!isMobile && formattedTopPicks.length > maxVisible && (
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
            {formattedTopPicks.map((item) => (
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
            {formattedTopPicks
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
  );
};

export default TopPicks;
