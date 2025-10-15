import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { useProduct } from "../../contexts/ProductContext";
import productApi from "../../api/productApi";

import {
  TryOnIcon,
  AddFavorite,
  AddedFavorites,
  NextIcon,
  PrevIcon,
  MinusIcon,
  PlusIcon,
  LyricImage,
  AgathaImage,
  RiomImage,
  CelineImage,
  ClashCollHeroNeck,
  StarFilled,
  StarEmpty,
  AddBag,
  AddBagHover,
  Ruler,
} from "../../assets/index.js";

const fallbackImages = [
  ClashCollHeroNeck,
  LyricImage,
  AgathaImage,
  RiomImage,
  CelineImage,
];

const ProductDesc = () => {
  const { productSlug } = useParams();
  const { products } = useProduct();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedSize, setSelectedSize] = useState(5);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Reviews carousel scroll & active index
  const scrollRef = useRef(null);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  // You May Also Like carousel states
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [hoveredButtonId, setHoveredButtonId] = useState(null);
  const [hoveredImageIndexes, setHoveredImageIndexes] = useState({});

  // Touch/swipe functionality for product images
  const imageRef = useRef(null);
  const [imageTouch, setImageTouch] = useState({
    startX: 0,
    startY: 0,
    startTime: 0,
  });

  // Touch/swipe functionality for reviews
  const [reviewsTouch, setReviewsTouch] = useState({
    startX: 0,
    startY: 0,
    startTime: 0,
  });

  useEffect(() => {
    const fetchProductData = async () => {
      if (!productSlug) return;

      setLoading(true);
      try {
        const result = await productApi.fetchProductBySlug(productSlug);
        console.log("=== FULL API RESPONSE DEBUG ===");
        console.log("Complete result object:", result);
        console.log("result.data structure:", result.data);
        console.log("result.data type:", typeof result.data);
        if (result.data && typeof result.data === "object") {
          console.log("Keys in result.data:", Object.keys(result.data));
        }
        console.log("=== END DEBUG ===");

        if (result.error) {
          console.error("API error:", result.error, "Status:", result.status);
          setError(result.error);
        } else {
          let productData = result.data;

          if (productData && productData.data) {
            productData = productData.data;
          }

          if (!productData && result.product) {
            productData = result.product;
          }
          if (!productData) {
            productData = result;
          }

          console.log("Final productData before formatting:", productData);
          console.log("All properties:", Object.keys(productData || {}));
          console.log("Price fields check:", {
            current_price: productData?.current_price,
            original_price: productData?.original_price,
            price: productData?.price,
            currentPrice: productData?.currentPrice,
            originalPrice: productData?.originalPrice,
          });

          console.log("SIZE DEBUGGING:", {
            sizes: productData?.sizes,
            sizeType: typeof productData?.sizes,
            sizeStocks: productData?.sizeStocks,
            sizeStocksLength: productData?.sizeStocks?.length,
            category: productData?.category?.name,
            productName: productData?.name,
          });

          const formattedProduct = formatProductData(productData);
          console.log("Formatted product result:", formattedProduct);
          console.log("Formatted sizes:", formattedProduct?.sizes);
          setProduct(formattedProduct);
          setQuantity(1);

          if (productData.sizes && productData.sizes.length > 0) {
            const availableSizes = productData.sizes
              .split(",")
              .map((s) => parseInt(s.trim()))
              .filter((s) => !isNaN(s));
            if (availableSizes.length > 0) {
              setSelectedSize(availableSizes[0]);
            }
          }
        }
      } catch (err) {
        setError("Failed to fetch product data");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productSlug]);

  useEffect(() => {
    if (product && products.length > 0) {
      const related = products
        .filter(
          (p) =>
            p.id !== product.id &&
            (p.category?.id === product.category?.id ||
              p.collection?.id === product.collection?.id)
        )
        .slice(0, 6);
      setRelatedProducts(related);
    }
  }, [product, products]);

  const generateSlug = (name, collectionName) => {
    if (!name) return "unnamed-product";
    const fullName = collectionName ? `${collectionName}-${name}` : name;
    return fullName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const formatProductData = (productData) => {
    if (!productData) return null;

    const productName = productData.name || "Unnamed Product";
    const collectionName = productData.collection?.name || null;

    // Debug price values
    // console.log('Price debugging:', {
    //   current_price: productData.current_price,
    //   original_price: productData.original_price,
    //   current_price_type: typeof productData.current_price,
    //   original_price_type: typeof productData.original_price
    // });

    return {
      id: productData.product_id || productData.id,
      slug: productData.slug || generateSlug(productName, collectionName),
      name: productName,
      collectionName: `${collectionName || "Collection"}:`,
      description: productData.description || "No description available.",
      oldPrice: productData.original_price
        ? `₱${parseFloat(productData.original_price).toFixed(2)}`
        : null,
      newPrice:
        productData.current_price &&
        productData.current_price !== "null" &&
        productData.current_price !== null
          ? `₱${parseFloat(productData.current_price).toFixed(2)}`
          : null,
      price:
        productData.current_price &&
        productData.current_price !== "null" &&
        productData.current_price !== null
          ? `₱${parseFloat(productData.current_price).toFixed(2)}`
          : productData.original_price &&
            productData.original_price !== "null" &&
            productData.original_price !== null
          ? `₱${parseFloat(productData.original_price).toFixed(2)}`
          : "₱0.00",
      stock: productData.stock || 0,
      images:
        Array.isArray(productData.images) && productData.images.length > 0
          ? productData.images
          : fallbackImages,
      sizes: (() => {
        if (
          productData.sizes &&
          typeof productData.sizes === "string" &&
          productData.sizes.trim() !== ""
        ) {
          return productData.sizes
            .split(",")
            .map((s) => parseInt(s.trim()))
            .filter((s) => !isNaN(s));
        }

        if (
          productData.sizeStocks &&
          Array.isArray(productData.sizeStocks) &&
          productData.sizeStocks.length > 0
        ) {
          return productData.sizeStocks
            .map((sizeStock) => {
              const sizeMatch = sizeStock.size?.match(/\d+/);
              return sizeMatch ? parseInt(sizeMatch[0]) : null;
            })
            .filter((size) => size !== null)
            .sort((a, b) => a - b); 
        }
        return [];
      })(),
      reviews: productData.reviews || [],
      sizeStocks: productData.sizeStocks || [],
    };
  };

  const formattedProduct = product; 

  const calculateOverallRating = () => {
    if (!formattedProduct?.reviews || formattedProduct.reviews.length === 0)
      return 0;
    const totalRating = formattedProduct.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    return (totalRating / formattedProduct.reviews.length).toFixed(1);
  };

  const overallRating = calculateOverallRating();
  const reviewCount = formattedProduct?.reviews?.length || 0;

  const formatRelatedProduct = (productData) => ({
    id: productData.id,
    name: productData.name || "Unnamed Product",
    collection: productData.collection?.name?.toUpperCase() || "COLLECTION",
    oldPrice: productData.original_price
      ? `₱${parseFloat(productData.original_price).toFixed(2)}`
      : null,
    price: productData.current_price
      ? `₱${parseFloat(productData.current_price).toFixed(2)}`
      : productData.original_price
      ? `₱${parseFloat(productData.original_price).toFixed(2)}`
      : "₱0.00",
    images:
      Array.isArray(productData.images) && productData.images.length > 0
        ? productData.images
        : fallbackImages.slice(0, 2),
  });

  const youMayAlsoLike = relatedProducts.map(formatRelatedProduct);

  // You May Also Like carousel logic
  const maxVisible = 4;
  const canPrev = carouselIndex > 0;
  const canNext = carouselIndex < youMayAlsoLike.length - maxVisible;

  const handlePrev = () => {
    if (canPrev) setCarouselIndex(carouselIndex - 1);
  };

  const handleNext = () => {
    if (canNext) setCarouselIndex(carouselIndex + 1);
  };

  const handleImageChange = (cardId, direction) => {
    const card = youMayAlsoLike.find((item) => item.id === cardId);
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

  const onScrollReviews = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const containerWidth = scrollRef.current.offsetWidth;
    const index = Math.round(scrollLeft / (containerWidth * 0.85));
    setCurrentReviewIndex(index);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", onScrollReviews);
    onScrollReviews();
    return () => el.removeEventListener("scroll", onScrollReviews);
  }, []);

  // Image swipe handlers
  const handleImageTouchStart = (e) => {
    const touch = e.touches[0];
    setImageTouch({
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
    });
  };

  const handleImageTouchMove = (e) => {
    e.preventDefault(); 
  };

  const handleImageTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;
    const deltaX = endX - imageTouch.startX;
    const deltaY = endY - imageTouch.startY;
    const deltaTime = Date.now() - imageTouch.startTime;

    // Check if it's a valid swipe (horizontal movement > vertical, within time limit)
    if (
      Math.abs(deltaX) > Math.abs(deltaY) &&
      Math.abs(deltaX) > 50 &&
      deltaTime < 300
    ) {
      if (deltaX > 0) {
        // Swipe right - previous image
        handlePrevImage();
      } else {
        // Swipe left - next image
        handleNextImage();
      }
    }
  };

  // Reviews swipe handlers
  const handleReviewsTouchStart = (e) => {
    const touch = e.touches[0];
    setReviewsTouch({
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
    });
  };

  const handleReviewsTouchMove = (e) => {
    // Allow normal scroll behavior for reviews
  };

  const handleReviewsTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;
    const deltaX = endX - reviewsTouch.startX;
    const deltaY = endY - reviewsTouch.startY;
    const deltaTime = Date.now() - reviewsTouch.startTime;

  
    if (
      Math.abs(deltaX) > Math.abs(deltaY) &&
      Math.abs(deltaX) > 50 &&
      deltaTime < 300
    ) {
      if (deltaX > 0) {
        // Swipe right - scroll left (previous)
        scrollLeft();
      } else {
        // Swipe left - scroll right (next)
        scrollRight();
      }
    }
  };

  const scrollLeft = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
  };

  const handlePrevImage = () => {
    const imageCount =
      formattedProduct?.images?.length || fallbackImages.length;
    setCurrentImageIndex((prev) => (prev === 0 ? imageCount - 1 : prev - 1));
  };

  const handleNextImage = () => {
    const imageCount =
      formattedProduct?.images?.length || fallbackImages.length;
    setCurrentImageIndex((prev) => (prev === imageCount - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleQuantityChange = (action) => {
    const maxStock =
      formattedProduct?.sizeStocks?.length > 0
        ? getSelectedSizeStock()
        : getAvailableStock();
    if (action === "increase" && quantity < maxStock) {
      setQuantity((prev) => prev + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const getAvailableStock = () => {
    if (!formattedProduct) return 0;

    // For products with size stocks (like rings), return total stock across all sizes
    if (formattedProduct.sizeStocks && formattedProduct.sizeStocks.length > 0) {
      return formattedProduct.sizeStocks.reduce((total, sizeStock) => {
        return total + (sizeStock.stock || 0);
      }, 0);
    }

    return formattedProduct.stock || 0;
  };

  const getSelectedSizeStock = () => {
    if (!formattedProduct) return 0;

    if (formattedProduct.sizeStocks && formattedProduct.sizeStocks.length > 0) {
      const sizeStock = formattedProduct.sizeStocks.find((ss) => {
        const sizeMatch = ss.size?.match(/\d+/);
        return sizeMatch ? parseInt(sizeMatch[0]) === selectedSize : false;
      });
      return sizeStock ? sizeStock.stock : 0;
    }

    return formattedProduct.stock || 0;
  };

  const getAvailableSizes = () => {
    if (!formattedProduct) return [];

    if (formattedProduct.sizeStocks && formattedProduct.sizeStocks.length > 0) {
      return formattedProduct.sizeStocks
        .filter((ss) => ss.stock > 0)
        .map((ss) => {
          const sizeMatch = ss.size?.match(/\d+/);
          return sizeMatch ? parseInt(sizeMatch[0]) : null;
        })
        .filter((size) => size !== null)
        .sort((a, b) => a - b);
    }

    return formattedProduct.sizes || [3, 4, 5, 6, 7, 8, 9];
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <img
        key={i}
        src={i < rating ? StarFilled : StarEmpty}
        alt={i < rating ? "Filled Star" : "Empty Star"}
        className="w-4 h-4"
        draggable={false}
      />
    ));
  };

  const renderOverallStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <img
        key={i}
        src={i < Math.floor(rating) ? StarFilled : StarEmpty}
        alt={i < Math.floor(rating) ? "Filled Star" : "Empty Star"}
        className="w-5 h-5"
        draggable={false}
      />
    ));
  };

  if (loading) {
    return (
      <Layout full noPadding>
        <div className="bg-[#1f1f21] text-[#FFF7DC] min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FFF7DC] mx-auto mb-4"></div>
            <p className="text-xl avant">Loading product...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !formattedProduct) {
    return (
      <Layout full noPadding>
        <div className="bg-[#1f1f21] text-[#FFF7DC] min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl avantbold mb-4">Product Not Found</h2>
            <p className="text-lg avant">
              {error || "This product does not exist or has been removed."}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout full noPadding>
      <div className="bg-[#1f1f21] text-[#FFF7DC] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 pt-20 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* MOBILE LAYOUT - Visible only on mobile */}
            <div className="block lg:hidden">
              {/* Mobile Image Section with Thumbnails */}
              {/* Product Image Display */}
              <div
                ref={imageRef}
                className="w-full bg-black rounded-lg overflow-hidden aspect-square select-none mb-2"
                onTouchStart={handleImageTouchStart}
                onTouchMove={handleImageTouchMove}
                onTouchEnd={handleImageTouchEnd}
              >
                <img
                  src={formattedProduct.images[currentImageIndex]}
                  alt={formattedProduct.name}
                  className="w-full h-full object-cover pointer-events-none"
                  draggable={false}
                />
              </div>

              {/* Thumbnails in a row below */}
              <div className="flex flex-row gap-3 justify-center mb-4">
                {formattedProduct.images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`w-20 aspect-square bg-black rounded-lg overflow-hidden border ${
                      currentImageIndex === index
                        ? "border-[#FFF7DC]"
                        : "border-transparent"
                    } transition-all`}
                  >
                    <img
                      src={image}
                      alt={`${formattedProduct.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </button>
                ))}
              </div>

              {/* Mobile Product Info */}
              <div className="space-y-4">
                {/* Product Name and Collection */}
                <div>
                  <h2 className="text-lg avantbold tracking-wide uppercase">
                    {formattedProduct.collectionName} {formattedProduct.name}
                  </h2>
                </div>

                {/* Price and Icons */}
                <div className="flex items-center justify-between -mt-2">
                  <div className="flex items-center gap-3">
                    {formattedProduct.oldPrice && formattedProduct.newPrice && (
                      <span className="text-lg text-[#959595] line-through avant">
                        {formattedProduct.oldPrice}
                      </span>
                    )}
                    <span className="text-2xl avantbold text-[#FFF7DC]">
                      {formattedProduct.newPrice || formattedProduct.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="p-1.5 opacity-100 hover:opacity-80 transition-opacity">
                      <img src={TryOnIcon} alt="Try On" className="w-6 h-6" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsFavorited(!isFavorited);
                      }}
                      className="w-6 h-6 p-0 opacity-100 hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={isFavorited ? AddedFavorites : AddFavorite}
                        alt={
                          isFavorited
                            ? "Added to Favorites"
                            : "Add to Favorites"
                        }
                        className="w-full h-full object-contain block"
                      />
                    </button>
                  </div>
                </div>

                {/* Stocks */}
                <div className="flex justify-start -mt-2">
                  <span className="text-sm text-[#959595] avantbold tracking-wider uppercase ">
                    STOCKS: {getAvailableStock()}
                  </span>
                </div>

                {/* Divider Line */}
                <div className="w-full h-px bg-[#FFF7DC] my-4"></div>

                {/* Quantity */}
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-sm text-[#959595] avantbold tracking-wider uppercase">
                    QUANTITY
                  </span>
                  <div className="relative flex items-center justify-between bg-[#464647] bg-opacity-75 rounded-full w-[80px] h-[32px]">
                    <button
                      onClick={() => handleQuantityChange("decrease")}
                      disabled={quantity <= 1}
                      type="button"
                      className="flex items-center justify-center w-[24px] h-full z-20"
                    >
                      <img src={MinusIcon} alt="Minus" className="w-2 h-2" />
                    </button>

                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[36px] h-[36px] bg-[#FFF7DC] text-[#1f1f21] rounded-full flex items-center justify-center text-sm avantbold z-30 shadow">
                      {quantity}
                    </span>

                    <button
                      onClick={() => handleQuantityChange("increase")}
                      disabled={
                        quantity >=
                        (formattedProduct?.sizeStocks?.length > 0
                          ? getSelectedSizeStock()
                          : getAvailableStock())
                      }
                      type="button"
                      className="flex items-center justify-center w-[24px] h-full z-20"
                    >
                      <img src={PlusIcon} alt="Plus" className="w-2 h-2" />
                    </button>
                  </div>
                </div>

                {/* Show SIZE section only if product has sizes (e.g., rings) */}
                {formattedProduct?.sizes &&
                  formattedProduct.sizes.length > 0 && (
                    <div className="space-y-2 mb-4">
                      <span className="block text-sm text-[#959595] avantbold tracking-wider uppercase">
                        SIZE
                      </span>
                      <div className="flex gap-1.5">
                        {getAvailableSizes().map((size) => (
                          <button
                            key={size}
                            onClick={() => handleSizeSelect(size)}
                            className={`w-8 h-8 rounded-md border-2 transition-all duration-200 flex items-center justify-center text-xs avantbold ${
                              selectedSize === size
                                ? "bg-[#FFF7DC] text-[#1f1f21] border-[#FFF7DC]"
                                : "bg-transparent text-[#FFF7DC] border-[#959595] hover:border-[#FFF7DC]"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                      <button className="flex items-center gap-1.5 text-[#959595] hover:opacity-80 transition-opacity">
                        <img src={Ruler} alt="Ruler" className="w-4 h-4" />
                        <span className="text-xs avantbold tracking-wider uppercase">
                          CHECK MY SIZE
                        </span>
                      </button>
                    </div>
                  )}

                {/* Add to Bag Button */}
                <button className="w-full py-3 rounded-lg avantbold tracking-wider flex items-center justify-center gap-2 text-lg bg-[#FFF7DC] text-[#1f1f21] mb-6">
                  ADD TO BAG
                </button>

                {/* Product Description */}
                <div className="space-y-4">
                  {formattedProduct.description
                    .split("\n\n")
                    .map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-sm text-[#FFF7DC]/90 leading-relaxed text-justify avant"
                      >
                        {paragraph}
                      </p>
                    ))}
                </div>
              </div>
            </div>

            {/* DESKTOP LAYOUT - Hidden on mobile, visible on lg+ */}
            {/* Left Side: Images */}
            <div className="hidden lg:block space-y-4 pt-10">
              {/* Product Images */}
              <div
                ref={imageRef}
                className="relative bg-black rounded-lg overflow-hidden aspect-square max-w-[600px] mx-auto select-none"
                onTouchStart={handleImageTouchStart}
                onTouchMove={handleImageTouchMove}
                onTouchEnd={handleImageTouchEnd}
              >
                <img
                  src={formattedProduct.images[currentImageIndex]}
                  alt={formattedProduct.name}
                  className="w-full h-full object-cover pointer-events-none"
                  draggable={false}
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {formattedProduct.images.slice(0, 4).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleThumbnailClick(index)}
                      className={`w-3 h-3 rounded-full border-2 transition-colors ${
                        index === currentImageIndex
                          ? "bg-[#FFF7DC] border-[#FFF7DC]"
                          : "bg-transparent border-[#FFF7DC]/50 hover:border-[#FFF7DC]"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity z-10"
                >
                  <img src={PrevIcon} alt="Previous" className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity z-10"
                >
                  <img src={NextIcon} alt="Next" className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Right Side - Product Info (Sticky) - Desktop Only */}
            <div className="hidden lg:block lg:sticky lg:top-8 lg:self-start space-y-6 pt-10">
              {/* Header with Collection and Product Name */}
              <div className="flex items-start justify-between">
                <h2 className="text-3xl tracking-wide uppercase avantbold leading-none">
                  {formattedProduct.collectionName} {formattedProduct.name}
                </h2>
                <div className="flex items-center gap-3">
                  <button className="p-2 opacity-100 hover:opacity-80 transition-opacity">
                    <img src={TryOnIcon} alt="Try On" className="w-8 h-8" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsFavorited(!isFavorited);
                    }}
                    className="w-8 h-8 p-0 opacity-100 hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={isFavorited ? AddedFavorites : AddFavorite}
                      alt={
                        isFavorited ? "Added to Favorites" : "Add to Favorites"
                      }
                      className="w-full h-full object-contain block"
                    />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                {formattedProduct.oldPrice && formattedProduct.newPrice && (
                  <span className="text-2xl text-[#959595] line-through avant">
                    {formattedProduct.oldPrice}
                  </span>
                )}
                <span className="text-4xl avant">
                  {formattedProduct.newPrice || formattedProduct.price}
                </span>
              </div>

              {/* Quantity and Size Container */}
              <div className="flex items-start gap-36">
                {/* Quantity Section */}
                <div className="w-[120px] space-y-2">
                  <h3 className="text-lg avantbold tracking-wider text-[#959595] uppercase">
                    QUANTITY
                  </h3>
                  <div className="relative flex items-center justify-between bg-[#464647] bg-opacity-75 rounded-full w-full h-[40px]">
                    <button
                      onClick={() => handleQuantityChange("decrease")}
                      disabled={quantity <= 1}
                      type="button"
                      className="flex items-center justify-center w-[30px] h-full z-20"
                    >
                      <img
                        src={MinusIcon}
                        alt="Minus"
                        className="w-2.5 h-2.5"
                      />
                    </button>

                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[45px] h-[45px] bg-[#FFF7DC] text-[#1f1f21] rounded-full flex items-center justify-center text-lg avantbold z-30 shadow">
                      {quantity}
                    </span>

                    <button
                      onClick={() => handleQuantityChange("increase")}
                      disabled={
                        quantity >=
                        (formattedProduct?.sizeStocks?.length > 0
                          ? getSelectedSizeStock()
                          : getAvailableStock())
                      }
                      type="button"
                      className="flex items-center justify-center w-[30px] h-full z-20"
                    >
                      <img src={PlusIcon} alt="Plus" className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>

                {/* Size Section - Show only if product has sizes (e.g., rings) */}
                {formattedProduct?.sizes &&
                  formattedProduct.sizes.length > 0 && (
                    <div className="flex-1 space-y-2">
                      <h3 className="text-lg avantbold tracking-wider text-[#959595] uppercase">
                        SIZE
                      </h3>
                      <div className="flex flex-wrap gap-2 justify-start">
                        {getAvailableSizes().map((size) => (
                          <button
                            key={size}
                            onClick={() => handleSizeSelect(size)}
                            className={`w-10 h-10 rounded-md border-2 transition-all duration-200 flex items-center justify-center text-lg avantbold ${
                              selectedSize === size
                                ? "bg-[#FFF7DC] text-[#1f1f21] border-[#FFF7DC]"
                                : "bg-transparent text-[#FFF7DC] border-[#959595] hover:border-[#FFF7DC]"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              <div className="flex flex-row items-center justify-between mt-6 mb-8">
                <h3 className="text-lg avantbold tracking-wider text-[#959595] uppercase">
                  STOCKS: {getAvailableStock()}
                </h3>
                {/* Show CHECK MY SIZE button only if product has sizes */}
                {formattedProduct?.sizes &&
                  formattedProduct.sizes.length > 0 && (
                    <button className="flex items-center gap-2 text-[#959595] hover:opacity-80 transition-opacity">
                      <img src={Ruler} alt="Ruler" className="w-5 h-5" />
                      <span className="text-lg avantbold tracking-wider uppercase">
                        CHECK MY SIZE
                      </span>
                    </button>
                  )}
              </div>

              {/* Product Description */}
              <div className="space-y-8 mb-10">
                {formattedProduct.description
                  .split("\n\n")
                  .map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-lg text-[#FFF7DC]/90 leading-relaxed text-justify avant"
                    >
                      {paragraph}
                    </p>
                  ))}
              </div>

              {/* Add to Bag Button */}
              <button className="w-full py-4 rounded-lg avantbold tracking-wider flex items-center justify-center gap-3 text-2xl bg-[#FFF7DC] text-[#1f1f21]">
                ADD TO BAG
              </button>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-3 mt-6">
                {formattedProduct.images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`aspect-square bg-black rounded-lg overflow-hidden border ${
                      currentImageIndex === index
                        ? "border-[#FFF7DC]"
                        : "border-transparent"
                    } transition-all hover:bg-[#333] hover:shadow-lg`}
                  >
                    <img
                      src={image}
                      alt={`${formattedProduct.name} view ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      draggable={false}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Reviews Full Width Carousel */}
          <div className="mt-16">
            {/* Title and Overall Rating side by side or stacked */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
              <h2 className="text-3xl lg:text-5xl bebas tracking-wider uppercase">
                PRODUCT REVIEWS
              </h2>
              <div className="flex items-left gap-1">
                <div className="flex gap-1">
                  {renderOverallStars(parseFloat(overallRating))}
                </div>
                <span className="text-sm lg:text-lg avant font-medium text-[#FFF7DC]">
                  {overallRating}
                </span>
                <span className="text-sm lg:text-lg avant text-[#959595]">
                  ({reviewCount})
                </span>
              </div>
            </div>

            {/* Reviews Carousel */}
            <div
              ref={scrollRef}
              className="flex gap-4 lg:gap-8 overflow-x-scroll scrollbar-hide select-none"
              style={{ scrollSnapType: "x mandatory", paddingBottom: "24px" }}
              onTouchStart={handleReviewsTouchStart}
              onTouchMove={handleReviewsTouchMove}
              onTouchEnd={handleReviewsTouchEnd}
            >
              {formattedProduct.reviews &&
              formattedProduct.reviews.length > 0 ? (
                formattedProduct.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-[#181818] rounded-xl shadow-lg p-4 lg:p-6 min-w-[280px] lg:min-w-[350px] max-w-[320px] lg:max-w-[400px] flex flex-col items-start avant"
                    style={{ color: "#FFF7DC", scrollSnapAlign: "start" }}
                  >
                    <div className="flex w-full items-center justify-between mb-1">
                      <span
                        className="bebas"
                        style={{
                          fontSize: "16px",
                          letterSpacing: "1px",
                          color: "#FFF7DC",
                        }}
                      >
                        {review.name}
                      </span>
                      <span className="flex gap-1">
                        {renderStars(review.rating)}
                      </span>
                    </div>
                    <div
                      className="mb-2 avant"
                      style={{ fontSize: "13px", color: "#FFF7DC" }}
                    >
                      {review.collection}
                    </div>
                    <div
                      className="mb-4 avant text-sm"
                      style={{ color: "#FFF7DC" }}
                    >
                      "{review.comment}"
                    </div>
                    <div className="flex gap-2">
                      {review.images &&
                        review.images.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt="customer"
                            className="w-12 h-12 lg:w-14 lg:h-14 object-cover border-2 border-white rounded-[5px]"
                          />
                        ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center w-full min-h-[200px]">
                  <p className="text-[#959595] avant text-lg">No reviews yet</p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-center -mt-1 gap-1">
              <button
                onClick={() => {
                  if (!scrollRef.current) return;
                  scrollRef.current.scrollBy({
                    left: -scrollRef.current.offsetWidth,
                    behavior: "smooth",
                  });
                }}
                aria-label="Previous"
                className="flex items-center justify-center p-2 hover:opacity-70"
                style={{ background: "none", border: "none" }}
              >
                <svg
                  width="20"
                  height="20"
                  className="lg:w-6 lg:h-6"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    d="M20 8L12 16L20 24"
                    stroke="#FFF7DC"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div className="flex gap-1">
                {formattedProduct.reviews &&
                  formattedProduct.reviews.map((_, i) => (
                    <button
                      key={i}
                      aria-label={`Go to review ${i + 1}`}
                      onClick={() => {
                        if (!scrollRef.current) return;
                        scrollRef.current.scrollTo({
                          left: i * scrollRef.current.offsetWidth,
                          behavior: "smooth",
                        });
                        setCurrentReviewIndex(i);
                      }}
                      className="w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center"
                      style={{ background: "none", border: "none" }}
                    >
                      <span
                        className={`rounded-full block ${
                          currentReviewIndex === i
                            ? "bg-[#FFF7DC]"
                            : "border-2 border-[#FFF7DC] bg-transparent"
                        }`}
                        style={{ width: "12px", height: "12px" }}
                      />
                    </button>
                  ))}
              </div>

              <button
                onClick={() => {
                  if (!scrollRef.current) return;
                  scrollRef.current.scrollBy({
                    left: scrollRef.current.offsetWidth,
                    behavior: "smooth",
                  });
                }}
                aria-label="Next"
                className="flex items-center justify-center p-2 hover:opacity-70"
                style={{ background: "none", border: "none" }}
              >
                <svg
                  width="20"
                  height="20"
                  className="lg:w-6 lg:h-6"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    d="M12 8L20 16L12 24"
                    stroke="#FFF7DC"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* You May Also Like Section */}
          <div className="mt-20">
            <div className="flex justify-between items-center pb-8">
              <h2 className="font-bold bebas text-3xl lg:text-3xl xl:text-5xl tracking-wide text-[#FFF7DC]">
                YOU MAY ALSO LIKE
              </h2>
              {/* Desktop navigation arrows - hidden on mobile */}
              <div className="hidden lg:flex space-x-4">
                <div
                  onClick={handlePrev}
                  role="button"
                  tabIndex={0}
                  aria-label="Previous Products"
                  className={`flex items-center justify-center px-2 py-1 cursor-pointer hover:opacity-70 transition select-none ${
                    !canPrev ? "opacity-30 cursor-not-allowed" : ""
                  }`}
                >
                  <img
                    src={PrevIcon}
                    alt="Previous"
                    className="w-8 h-8 lg:w-10 lg:h-10"
                    draggable={false}
                  />
                </div>
                <div
                  onClick={handleNext}
                  role="button"
                  tabIndex={0}
                  aria-label="Next Products"
                  className={`flex items-center justify-center px-2 py-1 cursor-pointer hover:opacity-70 transition select-none ${
                    !canNext ? "opacity-30 cursor-not-allowed" : ""
                  }`}
                >
                  <img
                    src={NextIcon}
                    alt="Next"
                    className="w-8 h-8 lg:w-10 lg:h-10"
                    draggable={false}
                  />
                </div>
              </div>
            </div>

            {/* Mobile Carousel */}
            <div className="block lg:hidden">
              <div
                className="flex overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-mandatory flex-nowrap"
                style={{
                  scrollBehavior: "smooth",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {youMayAlsoLike.map((item) => (
                  <div
                    key={`mobile-you-may-like-${item.id}`}
                    className="relative bg-[#222] flex-shrink-0 transition-all duration-300 ease-in-out snap-center"
                    style={{
                      width: "65vw",
                      margin: "0 6px",
                    }}
                  >
                    {/* Product Image */}
                    <div className="relative w-full h-[260px] flex items-center justify-center overflow-hidden bg-black">
                      {/* Overlay Icons */}
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
                        className="object-cover w-full h-full"
                        draggable={false}
                      />
                    </div>

                    {/* Text + Price */}
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
                        <span className="line-through text-[#FFF7DC] opacity-50">
                          {item.oldPrice}
                        </span>
                        <span className="text-[#FFF7DC]">{item.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Grid  */}
            <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10">
              {youMayAlsoLike
                .slice(carouselIndex, carouselIndex + maxVisible)
                .map((item) => {
                  const isHovered = hoveredCardId === item.id;
                  const currentImageIndex = hoveredImageIndexes[item.id] ?? 0;
                  return (
                    <div
                      key={`desktop-you-may-like-${item.id}`}
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
                      className={`relative bg-[#222] rounded-none overflow-hidden drop-shadow-[0_10px_15px_rgba(0,0,0,1)] group transition-all transform ${
                        isHovered ? "lg:scale-105 z-10" : ""
                      }`}
                      style={{
                        height: isHovered ? "440px" : "375px",
                        transition: "height 0.3s ease, transform 0.3s ease",
                      }}
                    >
                      {/* Top icons */}
                      <div className="w-full flex justify-between items-center px-3 lg:px-6 pt-2 lg:pt-3 absolute top-0 left-0 z-10">
                        <img
                          src={TryOnIcon}
                          alt="Try On"
                          className="w-4 h-4 lg:w-6 lg:h-6 cursor-pointer hover:opacity-80"
                          draggable={false}
                        />
                        <img
                          src={AddFavorite}
                          alt="Favorite"
                          className="w-4 h-4 lg:w-6 lg:h-6 cursor-pointer hover:opacity-80"
                          draggable={false}
                        />
                      </div>
                      {/* Product Image */}
                      <div className="relative w-full h-[200px] lg:h-[300px] flex items-center justify-center overflow-hidden bg-black">
                        <img
                          src={
                            isHovered
                              ? item.images[currentImageIndex]
                              : item.images[0]
                          }
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
                              className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-6 lg:h-6 cursor-pointer hover:opacity-80"
                              draggable={false}
                            />
                            <img
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImageChange(item.id, "next");
                              }}
                              src={NextIcon}
                              alt="Next"
                              className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-6 lg:h-6 cursor-pointer hover:opacity-80"
                              draggable={false}
                            />
                          </>
                        )}
                      </div>
                      {/* Text + Price + Button */}
                      <div
                        style={{
                          background:
                            "linear-gradient(90deg, #000000 46%, #666666 100%)",
                        }}
                        className="relative py-1 lg:py-2 px-1 lg:px-2 text-center flex flex-col items-center rounded-none min-h-[80px] lg:min-h-[140px]"
                      >
                        <span className="uppercase text-[#FFF7DC] tracking-widest text-[10px] lg:text-[13px] avantbold">
                          {item.name}
                        </span>
                        <span className="text-[10px] lg:text-[13px] tracking-widest text-[#FFF7DC] avant">
                          {item.collection}
                        </span>
                        <div className="flex justify-center items-center gap-1 lg:gap-2 text-[11px] lg:text-[14px] avantbold mt-1">
                          <span className="line-through text-[#FFF7DC] opacity-50">
                            {item.oldPrice}
                          </span>
                          <span className="text-[#FFF7DC]">{item.price}</span>
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
                            className="mt-2 lg:mt-4 w-full flex items-center justify-center gap-1 lg:gap-2 border border-[#FFF7DC] py-1 lg:py-2 px-2 lg:px-4 font-bold text-xs lg:text-md tracking-wide rounded-5 transition-all duration-300"
                          >
                            <img
                              src={
                                hoveredButtonId === item.id
                                  ? AddBagHover
                                  : AddBag
                              }
                              alt="Bag Icon"
                              className="w-3 h-3 lg:w-4 lg:h-4"
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
      </div>
    </Layout>
  );
};

export default ProductDesc;
