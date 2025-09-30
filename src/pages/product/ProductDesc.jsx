import React, { useState, useRef, useEffect } from 'react';
import Layout from "../../components/Layout";

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
} from "../../assets/index.js";

const sampleProduct = {
  id: 1,
  collectionName: "CLASH COLLECTION",
  name: "NECKLACE: HEIM",
  price: "₱590.00",
  quantity: 2,
  stock: 12,
  description:
    "Elevate your style with the Heim necklace from the Clash Collection—a bold yet elegant statement piece that embodies modern sophistication.\n\nCrafted with meticulous attention to detail, this necklace features interwoven elements of sleek metallic tones and edgy design, symbolizing the perfect balance between strength and grace.",
  images: [
    ClashCollHeroNeck,
    LyricImage,
    AgathaImage,
    RiomImage,
    CelineImage,
  ],
  reviews: [
    {
      id: 1,
      name: "GALLINA",
      collection: "Heim (Clash Collection)",
      rating: 4,
      comment: "Absolutely love how it looks and feels, the packaging was stunning too!",
      images: [LyricImage, AgathaImage],
    },
    {
      id: 2,
      name: "BILLIANA",
      collection: "Heim (Clash Collection)",
      rating: 4,
      comment: "Absolutely love how it looks Heim perfect and stunning too!",
      images: [RiomImage, CelineImage],
    },
  ],
};

const ProductDesc = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(sampleProduct.quantity);
  const [isFavorited, setIsFavorited] = useState(false);
  const [hoveredButtonId, setHoveredButtonId] = useState(null);
  const [likedProducts, setLikedProducts] = useState({});

  // Reviews carousel scroll & active index
  const scrollRef = useRef(null);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

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
    onScrollReviews(); // initial sync
    return () => el.removeEventListener("scroll", onScrollReviews);
  }, []);

  const scrollLeft = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? sampleProduct.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === sampleProduct.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleQuantityChange = (action) => {
    if (action === "increase" && quantity < sampleProduct.stock) {
      setQuantity((prev) => prev + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const toggleProductLike = (productId) => {
    setLikedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${i < rating ? "text-[#FFF7DC]" : "text-[#959595]"}`}
      >
        ★
      </span>
    ));
  };

  return (
    <Layout>
      <div className="bg-[#1f1f21] text-[#FFF7DC] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Left Side: Images + Customer Reviews Carousel */}
            <div className="space-y-4">
              {/* Product Images */}
              <div className="relative bg-black rounded-lg overflow-hidden aspect-square max-w-[600px] mx-auto">
                <img
                  src={sampleProduct.images[currentImageIndex]}
                  alt={sampleProduct.name}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {sampleProduct.images.slice(0, 4).map((_, index) => (
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity"
                >
                  <img src={PrevIcon} alt="Previous" className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity"
                >
                  <img src={NextIcon} alt="Next" className="w-6 h-6" />
                </button>
              </div>

              {/* Reviews Carousel styled like Customer Reviews page */}
              <div className="mt-50">
                <h2 className="text-5xl bebas tracking-wider uppercase mb-6">
                  PRODUCT REVIEWS
                </h2>
                <div
                  ref={scrollRef}
                  className="flex gap-8 overflow-x-scroll scrollbar-hide"
                  style={{ scrollSnapType: "x mandatory", paddingBottom: "24px" }}
                >
                  {sampleProduct.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-[#181818] rounded-xl shadow-lg p-6 min-w-[350px] max-w-[400px] flex flex-col items-start avant"
                      style={{ color: "#FFF7DC", scrollSnapAlign: "start" }}
                    >
                      <div className="flex w-full items-center justify-between mb-1">
                        <span
                          className="bebas"
                          style={{ fontSize: "18px", letterSpacing: "1px", color: "#FFF7DC" }}
                        >
                          {review.name}
                        </span>
                        <span className="flex gap-1">{renderStars(review.rating)}</span>
                      </div>
                      <div className="mb-2 avant" style={{ fontSize: "15px", color: "#FFF7DC" }}>
                        {review.collection}
                      </div>
                      <div className="mb-4 avant" style={{ color: "#FFF7DC" }}>
                        "{review.comment}"
                      </div>
                      <div className="flex gap-2">
                        {review.images.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt="customer"
                            className="w-14 h-14 object-cover border-2 border-white rounded-[5px]"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-center mt-4 gap-1">
                  <button
                    onClick={scrollLeft}
                    aria-label="Previous"
                    className="flex items-center justify-center p-2 hover:opacity-70"
                    style={{ background: "none", border: "none" }}
                  >
                    <svg width="25" height="25" viewBox="0 0 32 32" fill="none">
                      <path
                        d="M20 8L12 16L20 24"
                        stroke="#FFF7DC"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {/* Dots */}
                  <div className="flex gap-1">
                    {sampleProduct.reviews.map((_, i) => (
                      <button
                        key={i}
                        aria-label={`Go to review ${i + 1}`}
                        onClick={() => {
                          if (!scrollRef.current) return;
                          scrollRef.current.scrollTo({
                            left: i * (scrollRef.current.offsetWidth * 0.85),
                            behavior: "smooth",
                          });
                          setCurrentReviewIndex(i);
                        }}
                        className="w-5 h-5 flex items-center justify-center"
                        style={{ background: "none", border: "none" }}
                      >
                        <span
                          className={`rounded-full block ${
                            currentReviewIndex === i
                              ? "bg-[#FFF7DC]"
                              : "border-2 border-[#FFF7DC] bg-transparent"
                          }`}
                          style={{ width: "14px", height: "14px" }}
                        />
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={scrollRight}
                    aria-label="Next"
                    className="flex items-center justify-center p-2 hover:opacity-70"
                    style={{ background: "none", border: "none" }}
                  >
                    <svg width="25" height="25" viewBox="0 0 32 32" fill="none">
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
            </div>

            {/* Right Side - Product Info (Sticky) */}
            <div className="lg:sticky lg:top-8 lg:self-start space-y-6">
              {/* Header with Collection and Product Name */}
              <div className="flex items-start justify-between">
                <h2 className="text-3xl tracking-wide uppercase avantbold leading-none">
                  {sampleProduct.collectionName} {sampleProduct.name}
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
                      alt={isFavorited ? "Added to Favorites" : "Add to Favorites"}
                      className="w-full h-full object-contain block"
                    />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div>
                <span className="text-4xl avant">{sampleProduct.price}</span>
              </div>

              {/* Quantity Section */}
              <div className="space-y-4">
                <h3 className="text-lg avantbold tracking-wider text-[#959595] uppercase">
                  QUANTITY
                </h3>
                <div className="flex items-center">
                  <div className="relative flex items-center justify-between bg-[#464647] bg-opacity-75 rounded-full w-[125px] h-[45px]">
                    <button
                      onClick={() => handleQuantityChange("decrease")}
                      disabled={quantity <= 1}
                      type="button"
                      className="flex items-center justify-center w-[40px] h-full z-20"
                    >
                      <img src={MinusIcon} alt="Minus" className="w-3 h-3" />
                    </button>

                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[55px] h-[55px] bg-[#FFF7DC] text-[#1f1f21] rounded-full flex items-center justify-center text-xl avantbold z-30 shadow">
                      {quantity}
                    </span>

                    <button
                      onClick={() => handleQuantityChange("increase")}
                      disabled={quantity >= sampleProduct.stock}
                      type="button"
                      className="flex items-center justify-center w-[40px] h-full z-20"
                    >
                      <img src={PlusIcon} alt="Plus" className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Stock Info */}
              <div>
                <h3 className="text-lg avantbold tracking-wider text-[#959595] uppercase mb-8">
                  STOCKS: {sampleProduct.stock}
                </h3>
              </div>

              {/* Product Description */}
              <div className="space-y-4 mb-10">
                <p className="text-lg text-[#FFF7DC]/90 leading-relaxed text-justify avant">
                  {sampleProduct.description.split("\n\n")[0]}
                </p>
                <p className="text-lg text-[#FFF7DC]/90 leading-relaxed text-justify avant">
                  {sampleProduct.description.split("\n\n")[1]}
                </p>
              </div>

              {/* Add to Bag Button */}
              <button className="w-full py-4 rounded-lg avantbold tracking-wider flex items-center justify-center gap-3 text-2xl bg-[#FFF7DC] text-[#1f1f21]">
                ADD TO BAG
              </button>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-3 mt-6">
                {sampleProduct.images
                  .slice(0, 4)
                  .map((image, index) => (
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
                        alt={`${sampleProduct.name} view ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        draggable={false}
                      />
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDesc;
