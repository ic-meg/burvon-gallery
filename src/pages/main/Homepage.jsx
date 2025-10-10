import { useState, useEffect, useRef, useMemo } from "react";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import { useContent } from "../../contexts/ContentContext";
import { useCollection } from "../../contexts/CollectionContext";

import {
  KidsCollectionBanner,
  ClashCollectionBanner,
  NextIcon,
  PrevIcon,
  TryOnIcon,
  AddFavorite,
  AddedFavorites,
  LyricImage,
  LyricWebp,
  AgathaImage,
  AgathaWebp,
  RiomImage,
  RiomWebp,
  CelineImage,
  CelineWebp,
  AddBag,
  AddBagHover,
  ClashCollectionWebp,
  KidsCollectionWebp,
  FastShipIcon,
  SecureIcon,
  ReturnIcon,
  SupportIcon,
  DropDown,
  DropUp,
} from "../../assets/index.js";

// CSS to hide scrollbar and optimize images
const scrollbarHideStyle = `
  .scrollbar-hide {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
  }
  
  /* Optimize images for mobile performance */
  img {
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
  }
  
  /* Improve loading animation */
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .animate-spin {
    animation: spin 1s linear infinite;
  }
`;

const heroImages = [
  { src: KidsCollectionBanner, webp: KidsCollectionWebp },
  { src: ClashCollectionBanner, webp: ClashCollectionWebp },
];

// Placeholder data for when server is down - will be replaced with dynamic content
const rebelsTopPicks = [
  {
    id: 1,
    images: ["PRODUCT IMAGE PLACEHOLDER", "PRODUCT IMAGE PLACEHOLDER"],
    webpImages: ["PRODUCT IMAGE PLACEHOLDER", "PRODUCT IMAGE PLACEHOLDER"],
    name: "PRODUCT NAME PLACEHOLDER",
    collection: "COLLECTION NAME PLACEHOLDER",
    originalPrice: "ORIGINAL PRICE PLACEHOLDER",
    salePrice: "SALE PRICE PLACEHOLDER",
  },
  {
    id: 2,
    images: ["PRODUCT IMAGE PLACEHOLDER", "PRODUCT IMAGE PLACEHOLDER"],
    webpImages: ["PRODUCT IMAGE PLACEHOLDER", "PRODUCT IMAGE PLACEHOLDER"],
    name: "PRODUCT NAME PLACEHOLDER",
    collection: "COLLECTION NAME PLACEHOLDER",
    originalPrice: "ORIGINAL PRICE PLACEHOLDER",
    salePrice: "SALE PRICE PLACEHOLDER",
  },
  {
    id: 3,
    images: ["PRODUCT IMAGE PLACEHOLDER", "PRODUCT IMAGE PLACEHOLDER"],
    webpImages: ["PRODUCT IMAGE PLACEHOLDER", "PRODUCT IMAGE PLACEHOLDER"],
    name: "PRODUCT NAME PLACEHOLDER",
    collection: "COLLECTION NAME PLACEHOLDER",
    originalPrice: "ORIGINAL PRICE PLACEHOLDER",
    salePrice: "SALE PRICE PLACEHOLDER",
  },
  {
    id: 4,
    images: ["PRODUCT IMAGE PLACEHOLDER", "PRODUCT IMAGE PLACEHOLDER"],
    webpImages: ["PRODUCT IMAGE PLACEHOLDER", "PRODUCT IMAGE PLACEHOLDER"],
    name: "PRODUCT NAME PLACEHOLDER",
    collection: "COLLECTION NAME PLACEHOLDER",
    originalPrice: "ORIGINAL PRICE PLACEHOLDER",
    salePrice: "SALE PRICE PLACEHOLDER",
  },
  {
    id: 5,
    images: ["PRODUCT IMAGE PLACEHOLDER", "PRODUCT IMAGE PLACEHOLDER"],
    webpImages: ["PRODUCT IMAGE PLACEHOLDER", "PRODUCT IMAGE PLACEHOLDER"],
    name: "PRODUCT NAME PLACEHOLDER",
    collection: "COLLECTION NAME PLACEHOLDER",
    originalPrice: "ORIGINAL PRICE PLACEHOLDER",
    salePrice: "SALE PRICE PLACEHOLDER",
  },
  {
    id: 6,
    images: ["PRODUCT IMAGE PLACEHOLDER", "PRODUCT IMAGE PLACEHOLDER"],
    webpImages: ["PRODUCT IMAGE PLACEHOLDER", "PRODUCT IMAGE PLACEHOLDER"],
    name: "PRODUCT NAME PLACEHOLDER",
    collection: "COLLECTION NAME PLACEHOLDER",
    originalPrice: "ORIGINAL PRICE PLACEHOLDER",
    salePrice: "SALE PRICE PLACEHOLDER",
  },
];

// Placeholder data for when server is down - will be replaced with dynamic content
const burvonsCollections = [
  { id: 1, image: "COLLECTION IMAGE PLACEHOLDER", webp: "COLLECTION IMAGE PLACEHOLDER", path: "/collections/placeholder" },
  { id: 2, image: "COLLECTION IMAGE PLACEHOLDER", webp: "COLLECTION IMAGE PLACEHOLDER", path: "/collections/placeholder" },
  { id: 3, image: "COLLECTION IMAGE PLACEHOLDER", webp: "COLLECTION IMAGE PLACEHOLDER", path: "/collections/placeholder" },
  { id: 4, image: "COLLECTION IMAGE PLACEHOLDER", webp: "COLLECTION IMAGE PLACEHOLDER", path: "/collections/placeholder" },
  { id: 5, image: "COLLECTION IMAGE PLACEHOLDER", webp: "COLLECTION IMAGE PLACEHOLDER", path: "/collections/placeholder" },
];

const BASE_HEIGHT = 320; 
const HOMEPAGE_COLLECTION_VISIBLE_DESKTOP = 4;
const HOMEPAGE_COLLECTION_VISIBLE_MOBILE = 1; // For one card per swipe on mobile

const faqs = [
  {
    question: "What materials are used in BURVON jewelry?",
    answer:
      "Our pieces are crafted from high-quality metals and gemstones, carefully selected for durability and elegance.",
  },
  {
    question: "How do I care for BURVON jewelry?",
    answer:
      "We recommend storing your jewelry in a dry place, avoiding harsh chemicals, and gently polishing with a soft cloth.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping usually takes 5-7 business days. Expedited options are also available at checkout.",
  },
];

const SCROLL_STEP = 320; // Adjust for full card width per swipe

const Homepage = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [expandedRebelCardId, setExpandedRebelCardId] = useState(null);
  const [expandedBurvonCardId, setExpandedBurvonCardId] = useState(null);
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [hoveredImageIndex, setHoveredImageIndex] = useState(0);
  const [hoveredButtonId, setHoveredButtonId] = useState(null);
  const [burvonHoveredId, setBurvonHoveredId] = useState(null);
  const [collectionIndex, setCollectionIndex] = useState(0);
  const [mobileImageIndexes, setMobileImageIndexes] = useState({});
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [imageLoadingStates, setImageLoadingStates] = useState({});

  const [isMobile, setIsMobile] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [dynamicCollections, setDynamicCollections] = useState([]);

  // Homepage content from admin context
  const { homepageContent, loading: contentLoading } = useContent();
  
  // Collections from admin context
  const { collections, loading: collectionsLoading, fetchAllCollections } = useCollection();

  const rebelsScrollRef = useRef(null);
  const burvonScrollRef = useRef(null);

  const isResettingScrollRef = useRef(false);
  const scrollWidthRef = useRef(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setHoveredCardId(null);
      setExpandedRebelCardId(null);
      setExpandedBurvonCardId(null);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const totalImages = getDynamicHeroImages()?.length || heroImages.length;
      setCurrentIndex((prev) => (prev + 1) % totalImages);
    }, 4000);
    return () => clearInterval(interval);
  }, [homepageContent]);

  // Fetch collections on component mount
  useEffect(() => {
    const loadCollections = async () => {
      try {
        console.log('Starting to fetch collections for homepage...');
        const collectionsData = await fetchAllCollections();
        console.log('Fetched collections for homepage:', collectionsData);
        console.log('Collections data type:', typeof collectionsData);
        console.log('Is collections array?', Array.isArray(collectionsData));
        
        if (collectionsData && Array.isArray(collectionsData) && collectionsData.length > 0) {
          // Transform collections data to match homepage format
          const transformedCollections = collectionsData.map((collection, index) => {
            console.log(`Processing collection ${index}:`, collection);
            return {
              id: collection.collection_id || collection.id || index + 1,
              name: collection.name || `Collection ${index + 1}`,
              image: collection.collection_image || "COLLECTION IMAGE PLACEHOLDER",
              webp: collection.collection_image || "COLLECTION IMAGE PLACEHOLDER", 
              path: `/collections/${collection.name?.toLowerCase().replace(/\s+/g, '-') || 'placeholder'}`
            };
          });
          
          console.log('Transformed collections:', transformedCollections);
          setDynamicCollections(transformedCollections);
        } else {
          console.log('No collections data or empty array, using fallback');
          setDynamicCollections([]);
        }
      } catch (error) {
        console.error('Error loading collections for homepage:', error);
        // Keep using placeholder data on error
        setDynamicCollections([]);
      }
    };

    loadCollections();
  }, [fetchAllCollections]);


  useEffect(() => {
    const preloadImages = () => {
      const criticalImages = [
        LyricImage,
        AgathaImage,
        RiomImage,
        CelineImage,
        LyricWebp,
        AgathaWebp,
        RiomWebp,
        CelineWebp,
      ];

      criticalImages.forEach((src) => {
        if (src) {
          const img = new Image();
          img.src = src;
        }
      });
    };

   
    const timer = setTimeout(preloadImages, 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle image loading states
  const handleImageLoad = (imageId) => {
    setLoadedImages((prev) => new Set([...prev, imageId]));
    setImageLoadingStates((prev) => ({ ...prev, [imageId]: "loaded" }));
  };

  const handleImageError = (imageId) => {
    setImageLoadingStates((prev) => ({ ...prev, [imageId]: "error" }));
  };

  const handleImageStart = (imageId) => {
    setImageLoadingStates((prev) => ({ ...prev, [imageId]: "loading" }));
  };

  const handleImageChangeMobile = (cardId, direction) => {
    const images = rebelsTopPicks.find((item) => item.id === cardId).images;
    setMobileImageIndexes((prev) => {
      let currentIndex = prev[cardId] || 0;
      if (direction === "next") {
        currentIndex = (currentIndex + 1) % images.length;
      } else {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
      }
      return {
        ...prev,
        [cardId]: currentIndex,
      };
    });
  };

  const handleImageChangeDesktop = (cardId, direction) => {
    if (hoveredCardId !== cardId) return;
    const images = rebelsTopPicks.find((item) => item.id === cardId).images;
    setHoveredImageIndex((idx) =>
      direction === "next"
        ? (idx + 1) % images.length
        : (idx - 1 + images.length) % images.length
    );
  };

  const nextRebelDesktop = () => {
    if (!atEndRebel) {
      setStartIndex((prev) =>
        Math.min(prev + 1, rebelsTopPicks.length - MAX_VISIBLE_REBELS)
      );
    }
  };

  const prevRebelDesktop = () => {
    if (!atStartRebel) {
      setStartIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  // Mobile navigation - scroll one full card width per swipe
  const nextRebelMobile = () => {
    if (rebelsScrollRef.current) {
      const maxScrollLeft =
        rebelsScrollRef.current.scrollWidth -
        rebelsScrollRef.current.clientWidth;
      const nextScrollLeft = Math.min(
        rebelsScrollRef.current.scrollLeft + SCROLL_STEP,
        maxScrollLeft
      );
      rebelsScrollRef.current.scrollTo({
        left: nextScrollLeft,
        behavior: "smooth",
      });
    }
  };
  const prevRebelMobile = () => {
    if (rebelsScrollRef.current) {
      const prevScrollLeft = Math.max(
        rebelsScrollRef.current.scrollLeft - SCROLL_STEP,
        0
      );
      rebelsScrollRef.current.scrollTo({
        left: prevScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const showNextCollection = () => {
    if (!atEndBurvon) {
      const collections = getDynamicCollections();
      if (collections.length > MAX_VISIBLE_BURVON) {
        setCollectionIndex((prev) =>
          Math.min(prev + 1, collections.length - MAX_VISIBLE_BURVON)
        );
      }
    }
  };

  const showPrevCollection = () => {
    if (!atStartBurvon) {
      setCollectionIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  // Mobile Burvon navigation
  const nextBurvonMobile = () => {
    if (burvonScrollRef.current) {
      burvonScrollRef.current.scrollBy({
        left: 320,
        behavior: "smooth",
      });
    }
  };
  const prevBurvonMobile = () => {
    if (burvonScrollRef.current) {
      burvonScrollRef.current.scrollBy({
        left: -320,
        behavior: "smooth",
      });
    }
  };

  const rebelsVisibleCards = () => {
    let visibleCount = isMobile
      ? HOMEPAGE_COLLECTION_VISIBLE_MOBILE
      : HOMEPAGE_COLLECTION_VISIBLE_DESKTOP;
    const visible = [];
    const start = isMobile ? 0 : startIndex; // mobile handled by scroll not index
    for (let i = 0; i < visibleCount; i++) {
      visible.push(rebelsTopPicks[(start + i) % rebelsTopPicks.length]);
    }
    return visible;
  };

  const burvonVisibleCards = () => {
    const collections = getDynamicCollections();
    let visibleCount = isMobile
      ? HOMEPAGE_COLLECTION_VISIBLE_MOBILE
      : HOMEPAGE_COLLECTION_VISIBLE_DESKTOP;
    
    // Don't show more cards than we have collections
    const actualCount = Math.min(visibleCount, collections.length);
    const visible = [];
    const start = isMobile ? 0 : collectionIndex; // mobile controlled by scroll
    
    for (let i = 0; i < actualCount; i++) {
      const index = start + i;
      if (index < collections.length) {
        visible.push(collections[index]);
      }
    }
    return visible;
  };

  // Swipe logic for Rebels
  const touchStartXRebel = useRef(null);
  const touchEndXRebel = useRef(null);

  const onTouchStartRebel = (e) => {
    touchStartXRebel.current = e.touches[0].clientX;
  };
  const onTouchMoveRebel = (e) => {
    touchEndXRebel.current = e.touches[0].clientX;
  };
  const onTouchEndRebel = () => {
    if (!touchStartXRebel.current || !touchEndXRebel.current) return;
    const diff = touchStartXRebel.current - touchEndXRebel.current;
    if (diff > 50) {
      nextRebelMobile();
    } else if (diff < -50) {
      prevRebelMobile();
    }
    touchStartXRebel.current = null;
    touchEndXRebel.current = null;
  };

  // Swipe logic for Burvon
  const touchStartXBurvon = useRef(null);
  const touchEndXBurvon = useRef(null);

  const onTouchStartBurvon = (e) => {
    touchStartXBurvon.current = e.touches[0].clientX;
  };
  const onTouchMoveBurvon = (e) => {
    touchEndXBurvon.current = e.touches[0].clientX;
  };
  const onTouchEndBurvon = () => {
    if (!touchStartXBurvon.current || !touchEndXBurvon.current) return;
    const diff = touchStartXBurvon.current - touchEndXBurvon.current;
    if (diff > 50) {
      nextBurvonMobile();
    } else if (diff < -50) {
      prevBurvonMobile();
    }
    touchStartXBurvon.current = null;
    touchEndXBurvon.current = null;
  };

  // Infinite scroll effect for rebels top picks on mobile to loop left/right indefinitely
  // Removed because we handle natural scroll snapping now.

  const MAX_VISIBLE_REBELS = HOMEPAGE_COLLECTION_VISIBLE_DESKTOP; // 4
  const atStartRebel = startIndex === 0;
  const atEndRebel = startIndex === rebelsTopPicks.length - MAX_VISIBLE_REBELS;

  const MAX_VISIBLE_BURVON = HOMEPAGE_COLLECTION_VISIBLE_DESKTOP; // 4
  const atStartBurvon = collectionIndex === 0;

  // Get dynamic hero images from admin content or fallback to static
  const getDynamicHeroImages = () => {
    if (homepageContent?.hero_images && Array.isArray(homepageContent.hero_images) && homepageContent.hero_images.length > 0) {
      return homepageContent.hero_images.map(url => ({ src: url, webp: url }));
    }
    return heroImages; // fallback to static images
  };

  // Get dynamic collections from API or fallback to placeholder data
  const getDynamicCollections = () => {
    console.log('getDynamicCollections called');
    console.log('dynamicCollections:', dynamicCollections);
    console.log('dynamicCollections length:', dynamicCollections?.length);
    console.log('collectionsLoading:', collectionsLoading);
    
    if (dynamicCollections && dynamicCollections.length > 0) {
      console.log('Using dynamic collections:', dynamicCollections);
      return dynamicCollections;
    }
    console.log('Using fallback placeholder data');
    return burvonsCollections; // fallback to placeholder data
  };

  // Calculate atEndBurvon after getDynamicCollections is defined
  const atEndBurvon = useMemo(() => {
    const collections = getDynamicCollections();
    // If we have fewer collections than max visible, we're always at the end
    if (collections.length <= MAX_VISIBLE_BURVON) return true;
    return collectionIndex >= collections.length - MAX_VISIBLE_BURVON;
  }, [collectionIndex, dynamicCollections]);

  return (
    <Layout full>
      <style>{scrollbarHideStyle}</style>
      {/* Hero Section */}
      <section
        id="hero"
        className="relative w-full h-[450px] lg:h-[550px] xl:h-[730px] overflow-hidden bg-black flex items-center justify-center"
      >
        <div
          className="flex h-full w-full transition-transform duration-700"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          aria-live="polite"
        >
          {getDynamicHeroImages().map((image, index) => (
            <picture key={index} className="flex-shrink-0 w-full h-full">
              <source srcSet={image.webp} type="image/webp" />
              <img
                src={image.src}
                alt={`Burvon homepage banner collection ${index + 1}`}
                className="w-full h-full object-cover object-center"
                draggable={false}
              />
            </picture>
          ))}
        </div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1 z-20">
          {getDynamicHeroImages().map((_, index) => (
            <span
              key={index}
              className={`w-2 h-2 rounded-full border border-[#FFF7DC] ${
                index === currentIndex
                  ? "bg-[#FFF7DC]"
                  : "bg-gray-400 opacity-40"
              } transition-colors duration-300`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setCurrentIndex(index);
              }}
            />
          ))}
        </div>
      </section>

      

      {/* Rebels Top Picks */}
      <section className="bg-[#1f1f21] py-14">
        <div className="max-w-7xl mx-auto px-5 relative">
          <div className="flex justify-between items-center pb-8">
            <h2 className="font-bold bebas text-3xl lg:text-5xl tracking-wide text-[#FFF7DC]">
              REBEL’S TOP PICKS
            </h2>
            {!isMobile ? (
              <div className="flex space-x-4">
                <div
                  onClick={prevRebelDesktop}
                  role="button"
                  tabIndex={0}
                  aria-label="Previous Picks"
                  className={`flex items-center justify-center px-2 py-1 cursor-pointer hover:opacity-70 transition select-none ${
                    atStartRebel ? "opacity-30 cursor-not-allowed" : ""
                  }`}
                  aria-disabled={atStartRebel}
                >
                  <img
                    src={PrevIcon}
                    alt="Previous"
                    className="w-10 h-10"
                    draggable={false}
                  />
                </div>
                <div
                  onClick={nextRebelDesktop}
                  role="button"
                  tabIndex={0}
                  aria-label="Next Picks"
                  className={`flex items-center justify-center px-2 py-1 cursor-pointer hover:opacity-70 transition select-none ${
                    atEndRebel ? "opacity-30 cursor-not-allowed" : ""
                  }`}
                  aria-disabled={atEndRebel}
                >
                  <img
                    src={NextIcon}
                    alt="Next"
                    className="w-10 h-10"
                    draggable={false}
                  />
                </div>
              </div>
            ) : null}
          </div>

    {/* Mobile Scroll */}
    {isMobile ? (
      <div
        ref={rebelsScrollRef}
        className="flex overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-mandatory flex-nowrap md:grid md:grid-cols-4 md:gap-5 md:overflow-visible"
        style={{
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {rebelsTopPicks.map((item) => (
          <div
            key={item.id}
            className="relative bg-[#222] drop-shadow-lg cursor-pointer flex-shrink-0 transition-all duration-300 ease-in-out md:flex-shrink md:w-auto"
            style={{
              width: "65vw", // slightly smaller on mobile
              margin: "0 6px",
              scrollSnapAlign: "center",
            }}
          >
            {/* Image */}
            <div className="relative w-full min-h-[150px] sm:min-h-[200px] flex items-center justify-center overflow-hidden bg-black">
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

             { /*Hero image */ }
              {item.images[0].includes('PLACEHOLDER') ? (
                <div className="w-full h-full bg-[#1F1F21] flex items-center justify-center p-4">
                  <span className="text-[#FFF7DC] text-sm avant text-center leading-tight">
                    {item.images[0]}
                  </span>
                </div>
              ) : (
                <>
                  {imageLoadingStates[`${item.id}-0`] === "loading" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#1F1F21]">
                      <div className="w-8 h-8 border-2 border-[#FFF7DC] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <picture className="w-full h-full">
                    {item.webpImages[0] && !item.webpImages[0].includes('PLACEHOLDER') && (
                      <source srcSet={item.webpImages[0]} type="image/webp" />
                    )}
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="object-cover w-full h-full rounded-none select-none transition-opacity duration-300"
                      draggable={false}
                      loading="lazy"
                      onLoad={() => handleImageLoad(`${item.id}-0`)}
                      onError={() => handleImageError(`${item.id}-0`)}
                      onLoadStart={() => handleImageStart(`${item.id}-0`)}
                    />
                  </picture>
                </>
              )}
            </div>

                  {/* Text */}
                  <div
                    style={{
                      background:
                        "linear-gradient(90deg, #000000 46%, #666666 100%)",
                    }}
                    className="w-full py-3 px-2 text-center flex flex-col items-center rounded-none"
                  >
                    <span className="uppercase text-[#FFF7DC] tracking-widest text-[13px] avantbold">
                      {item.name}
                    </span>
                    <span className="text-[13px] tracking-widest text-[#FFF7DC] avant text-center break-words">
                      {item.collection}
                    </span>
                    <div className="flex justify-center items-center gap-2 text-[14px] avantbold mt-1">
                      <span className="line-through text-[#FFF7DC] opacity-50">
                        {item.originalPrice}
                      </span>
                      <span className="text-[#FFF7DC]">{item.salePrice}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Desktop Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
              {rebelsVisibleCards().map((item) => {
                const isHovered = hoveredCardId === item.id;
                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => {
                      setHoveredCardId(item.id);
                      setHoveredImageIndex(0);
                    }}
                    onMouseLeave={() => {
                      setHoveredCardId(null);
                    }}
                    className={`relative bg-[#222] rounded-none overflow-hidden drop-shadow-[0_10px_15px_rgba(0,0,0,1)] group transition-all transform ${
                      isHovered ? "scale-105 z-10" : ""
                    }`}
                    style={{
                      height: isHovered ? "440px" : "375px",
                      transition: "height 0.3s ease, transform 0.3s ease",
                    }}
                  >
                    {/* Top icons */}
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

                    {/* Product Image */}
                    <div className="relative w-full h-[300px] flex items-center justify-center overflow-hidden bg-black">
                      {(isHovered ? item.images[hoveredImageIndex] : item.images[0]).includes('PLACEHOLDER') ? (
                        <div className="w-full h-full bg-[#1F1F21] flex items-center justify-center p-4">
                          <span className="text-[#FFF7DC] text-sm avant text-center leading-tight">
                            {isHovered ? item.images[hoveredImageIndex] : item.images[0]}
                          </span>
                        </div>
                      ) : (
                        <>
                          {imageLoadingStates[
                            `${item.id}-${isHovered ? hoveredImageIndex : 0}`
                          ] === "loading" && (
                            <div className="absolute inset-0 flex items-center justify-center bg-[#1F1F21] z-10">
                              <div className="w-8 h-8 border-2 border-[#FFF7DC] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          )}
                          <picture className="w-full h-full">
                            {item.webpImages[isHovered ? hoveredImageIndex : 0] && !item.webpImages[isHovered ? hoveredImageIndex : 0].includes('PLACEHOLDER') && (
                              <source
                                srcSet={
                                  item.webpImages[isHovered ? hoveredImageIndex : 0]
                                }
                                type="image/webp"
                              />
                            )}
                            <img
                              src={
                                isHovered
                                  ? item.images[hoveredImageIndex]
                                  : item.images[0]
                              }
                              alt={item.name}
                              className={`object-cover w-full h-full rounded-none transition-all duration-300 ${
                                loadedImages.has(
                                  `${item.id}-${isHovered ? hoveredImageIndex : 0}`
                                )
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                              loading="lazy"
                              onLoad={() =>
                                handleImageLoad(
                                  `${item.id}-${isHovered ? hoveredImageIndex : 0}`
                                )
                              }
                              onError={() =>
                                handleImageError(
                                  `${item.id}-${isHovered ? hoveredImageIndex : 0}`
                                )
                              }
                              onLoadStart={() =>
                                handleImageStart(
                                  `${item.id}-${isHovered ? hoveredImageIndex : 0}`
                                )
                              }
                            />
                          </picture>
                        </>
                      )}
                      {isHovered && item.images.length > 1 && (
                        <>
                          <img
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageChangeDesktop(item.id, "prev");
                            }}
                            src={PrevIcon}
                            alt="Previous"
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer hover:opacity-80"
                            draggable={false}
                          />
                          <img
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageChangeDesktop(item.id, "next");
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
                        background:
                          "linear-gradient(90deg, #000000 46%, #666666 100%)",
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
                          {item.originalPrice}
                        </span>
                        <span className="text-[#FFF7DC]">{item.salePrice}</span>
                      </div>

                      {/* Add to Bag Button */}
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
                              hoveredButtonId === item.id ? AddBagHover : AddBag
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

      {/* Burvons Collection Section */}
      <section className="w-full bg-black py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-10">
            <h2 className="font-bold bebas text-3xl lg:text-5xl tracking-wide text-[#FFF7DC]">
              BURVON’S COLLECTION
            </h2>
            {!isMobile ? (
              <div className="flex space-x-4">
                <button
                  onClick={showPrevCollection}
                  aria-label="Previous Collection"
                  className={`bg-transparent flex items-center justify-center px-2 py-1 cursor-pointer hover:opacity-70 hover:text-[#222] transition select-none ${
                    atStartBurvon ? "opacity-30 cursor-not-allowed" : ""
                  }`}
                  style={{
                    background: "transparent",
                    boxShadow: "none",
                    border: "none",
                  }}
                  disabled={atStartBurvon}
                >
                  <img
                    src={PrevIcon}
                    alt="Previous"
                    className="w-10 h-10"
                    draggable={false}
                  />
                </button>
                <button
                  onClick={showNextCollection}
                  aria-label="Next Collection"
                  className={`bg-transparent flex items-center justify-center px-2 py-1 cursor-pointer hover:opacity-70 hover:text-[#222] transition select-none ${
                    atEndBurvon ? "opacity-30 cursor-not-allowed" : ""
                  }`}
                  style={{
                    background: "transparent",
                    boxShadow: "none",
                    border: "none",
                  }}
                  disabled={atEndBurvon}
                >
                  <img
                    src={NextIcon}
                    alt="Next"
                    className="w-10 h-10"
                    draggable={false}
                  />
                </button>
              </div>
            ) : null}
          </div>

          {isMobile ? (
            <div
              ref={burvonScrollRef}
              className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory flex-nowrap md:grid md:grid-cols-2 md:gap-5 md:overflow-visible"
              style={{
                scrollBehavior: "smooth",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {getDynamicCollections().map((col) => (
                <div
                  key={col.id}
                  className="bg-[#111] drop-shadow-lg rounded-none flex-shrink-0 md:flex-shrink md:w-auto cursor-pointer"
                  style={{
                    width: "65vw", //  unified size
                    margin: "0 6px", //  same margins
                    scrollSnapAlign: "center",
                  }}
                  onClick={() => navigate(col.path)}
                >
                  {col.image.includes('PLACEHOLDER') ? (
                    <div className="w-full h-full bg-[#1F1F21] flex items-center justify-center p-4">
                      <span className="text-[#FFF7DC] text-sm avant text-center leading-tight">
                        {col.image}
                      </span>
                    </div>
                  ) : (
                    <picture>
                      <source srcSet={col.webp} type="image/webp" />
                      <img
                        src={col.image}
                        alt={`Burvon Collection ${col.id}`}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    </picture>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-center">
              {burvonVisibleCards().map((col) => {
                const isHovered = burvonHoveredId === col.id;
                return (
                  <div
                    key={col.id}
                    onMouseEnter={() => setBurvonHoveredId(col.id)}
                    onMouseLeave={() => setBurvonHoveredId(null)}
                    onClick={() => navigate(col.path)}
                    className={`overflow-hidden shadow-lg mx-auto transition-all duration-300 cursor-pointer
                ${isHovered ? "scale-105 shadow-2xl z-30" : "shadow-lg"}
              `}
                    style={{
                      maxWidth: 320,
                      boxShadow: isHovered
                        ? "0 2px 6px rgba(255, 247, 220, 0.3)"
                        : "0 1px 3px rgba(0,0,0,0.2)",
                      backgroundColor: "transparent",
                      transformOrigin: "center",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      transform: isHovered ? "scale(1.03)" : "scale(1)",
                      borderRadius: 0, //  remove border radius
                    }}
                  >
                    {col.image.includes('PLACEHOLDER') ? (
                      <div className="w-full h-[200px] bg-[#1F1F21] flex items-center justify-center p-4">
                        <span className="text-[#FFF7DC] text-sm avant text-center leading-tight">
                          {col.image}
                        </span>
                      </div>
                    ) : (
                      <picture className="w-full">
                        <source srcSet={col.webp} type="image/webp" />
                        <img
                          src={col.image}
                          alt={`Burvon Collection ${col.id}`}
                          className="w-full h-auto object-cover select-none transition-transform duration-300"
                          draggable={false}
                          style={{ display: "block", borderRadius: 3 }} // remove rounding on img
                        />
                      </picture>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Dynamic Try-On Section */}
      {homepageContent && homepageContent.promo_image && (
        <section className="relative w-full bg-[#1F1F21] mt-16 md:mt-24 lg:mt-15">
          <img
            src={homepageContent.promo_image}
            alt={homepageContent.title || "Try On Feature"}
            className={`w-full object-cover ${
              isMobile ? "h-[400px]" : "h-[500px] md:h-[600px] lg:h-[650px]"
            }`}
            draggable={false}
            style={{
              objectPosition: isMobile ? "center bottom" : "center center",
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-10 md:px-10 lg:px-5">
              <div className="flex flex-col items-center text-center max-w-md md:items-start md:text-left">
                {homepageContent.title && (
                  <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl mb-4 tracking-wide text-[#fff7dc] bebas">
                    {homepageContent.title.toUpperCase()}
                  </h2>
                )}
                {homepageContent.description && (
                  <p className="mb-8 text-sm md:text-base lg:text-lg text-[#fff7dc] opacity-90 avant leading-snug">
                    {homepageContent.description}
                  </p>
                )}
                <button
                  style={{
                    backgroundColor:
                      hoveredButtonId === "try" ? "#FFF7DC" : "transparent",
                    color: hoveredButtonId === "try" ? "#1F1F21" : "#FFF7DC",
                    outline: "2px solid #FFF7DC",
                    borderRadius: 5,
                  }}
                  onMouseEnter={() => setHoveredButtonId("try")}
                  onMouseLeave={() => setHoveredButtonId(null)}
                  className="flex items-center justify-center gap-2 py-3 px-6 avant text-base tracking-wide transition-colors duration-300 outline-none cursor-pointer"
                >
                  TRY NOW
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services Highlights Section */}
      <section className="bg-[#1F1F21] py-20 flex justify-center">
        <div className="max-w-4xl w-full px-6 mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 justify-items-center justify-center max-w-3xl mx-auto sm:ml-auto sm:mr-0">
            <div className="w-80 sm:w-full mx-auto grid grid-cols-[3rem_1fr] items-center gap-4 text-left">
              <div className="flex justify-center">
                <img
                  src={FastShipIcon}
                  alt="Fast Shipping"
                  className="w-11 h-11 drop-shadow-[0_0_2px_#fff7dc]"
                />
              </div>
              <div>
                <h3 className="font-bold text-[#fff7dc] text-lg bebas">
                  FAST SHIPPING
                </h3>
                <p className="text-sm text-gray-300 avant">
                  Quick and reliable delivery.
                </p>
              </div>
            </div>
            <div className="w-80 sm:w-full mx-auto grid grid-cols-[3rem_1fr] items-center gap-4 text-left">
              <div className="flex justify-center">
                <img
                  src={SecureIcon}
                  alt="Secure Payment"
                  className="w-10 h-10 drop-shadow-[0_0_2px_#fff7dc]"
                />
              </div>
              <div>
                <h3 className="font-bold text-[#fff7dc] text-lg bebas">
                  SECURE PAYMENT
                </h3>
                <p className="text-sm text-gray-300 avant">
                  Safe and protected checkout.
                </p>
              </div>
            </div>
            <div className="w-80 sm:w-full mx-auto grid grid-cols-[3rem_1fr] items-center gap-4 text-left">
              <div className="flex justify-center">
                <img
                  src={ReturnIcon}
                  alt="Easy Returns"
                  className="w-10 h-10 drop-shadow-[0_0_2px_#fff7dc]"
                />
              </div>
              <div>
                <h3 className="font-bold text-[#fff7dc] text-lg bebas">
                  EASY RETURNS
                </h3>
                <p className="text-sm text-gray-300 avant">
                  Stress-free return process.
                </p>
              </div>
            </div>
            <div className="w-80 sm:w-full mx-auto grid grid-cols-[3rem_1fr] items-center gap-4 text-left">
              <div className="flex justify-center">
                <img
                  src={SupportIcon}
                  alt="24/7 Support"
                  className="w-10 h-10 drop-shadow-[0_0_2px_#fff7dc]"
                />
              </div>
              <div>
                <h3 className="font-bold text-[#fff7dc] text-lg bebas">
                  24/7 SUPPORT
                </h3>
                <p className="text-sm text-gray-300 avant">
                  We’re here anytime you need.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-transparent pt-2 pb-20">
        <div className="w-full max-w-3xl mx-auto px-6">
          <h2 className="text-center text-[#fff7dc] font-bold text-4xl mb-8 tracking-wide bebas">
            BURVON JEWELRY FAQS
          </h2>
          <div className="border-t border-[#fff7dc]/40 max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-b border-[#fff7dc]/40 bg-transparent"
              >
                <button
                  type="button"
                  className="w-full flex justify-between items-center text-left text-[#fff7dc] font-normal py-5 focus:outline-none bg-transparent border-0 shadow-none rounded-none appearance-none avant cursor-pointer"
                  style={{ background: "transparent" }}
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                >
                  <span
                    className="avantbold"
                    style={{ textTransform: "uppercase" }}
                  >
                    {faq.question}
                  </span>
                  <img
                    src={openIndex === index ? DropUp : DropDown}
                    alt="toggle"
                    className="w-4 h-4"
                    style={{ marginRight: "15px" }} 
                  />
                </button>
                {openIndex === index && (
                  <div className="pb-5 bg-transparent">
                    <p className="text-[#fff7dc] font-normal avant pl-3">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Homepage;
