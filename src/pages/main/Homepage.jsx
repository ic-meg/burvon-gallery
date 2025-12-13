import { useState, useEffect, useRef, useMemo } from "react";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import { useContent } from "../../contexts/ContentContext";
import { useCollection } from "../../contexts/CollectionContext";
import { useProduct } from "../../contexts/ProductContext";
import ProductCard from "../../components/ProductCard";
import HomepageSkeleton from "../../components/HomepageSkeleton";
import ServerDownError from "../../components/ServerDownError";

import {
  NextIcon,
  PrevIcon,
  LyricImage,
  LyricWebp,
  AgathaImage,
  AgathaWebp,
  RiomImage,
  RiomWebp,
  CelineImage,
  CelineWebp,
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


// Placeholder data for when server is down - will be replaced with dynamic content
const rebelsTopPicks = [
  {
    id: 1,
    images: ["PRODUCT IMAGE ", "PRODUCT IMAGE "],
    webpImages: ["PRODUCT IMAGE ", "PRODUCT IMAGE "],
    name: "PRODUCT NAME ",
    collection: "COLLECTION NAME ",
    originalPrice: "ORIGINAL PRICE ",
    salePrice: "SALE PRICE ",
  },
  {
    id: 2,
    images: ["PRODUCT IMAGE ", "PRODUCT IMAGE "],
    webpImages: ["PRODUCT IMAGE ", "PRODUCT IMAGE "],
    name: "PRODUCT NAME ",
    collection: "COLLECTION NAME ",
    originalPrice: "ORIGINAL PRICE ",
    salePrice: "SALE PRICE ",
  },
  {
    id: 3,
    images: ["PRODUCT IMAGE ", "PRODUCT IMAGE "],
    webpImages: ["PRODUCT IMAGE ", "PRODUCT IMAGE "],
    name: "PRODUCT NAME ",
    collection: "COLLECTION NAME ",
    originalPrice: "ORIGINAL PRICE ",
    salePrice: "SALE PRICE ",
  },
  {
    id: 4,
    images: ["PRODUCT IMAGE ", "PRODUCT IMAGE "],
    webpImages: ["PRODUCT IMAGE", "PRODUCT IMAGE "],
    name: "PRODUCT NAME ",
    collection: "COLLECTION NAME ",
    originalPrice: "ORIGINAL PRICE ",
    salePrice: "SALE PRICE ",
  },
  {
    id: 5,
    images: ["PRODUCT IMAGE ", "PRODUCT IMAGE "],
    webpImages: ["PRODUCT IMAGE", "PRODUCT IMAGE "],
    name: "PRODUCT NAME ",
    collection: "COLLECTION NAME ",
    originalPrice: "ORIGINAL PRICE ",
    salePrice: "SALE PRICE ",
  },
  {
    id: 6,
    images: ["PRODUCT IMAGE ", "PRODUCT IMAGE "],
    webpImages: ["PRODUCT IMAGE ", "PRODUCT IMAGE "],
    name: "PRODUCT NAME ",
    collection: "COLLECTION NAME ",
    originalPrice: "ORIGINAL PRICE ",
    salePrice: "SALE PRICE",
  },
];

// Placeholder data for when server is down - will be replaced with dynamic content
const burvonsCollections = [
  { id: 1, image: "COLLECTION IMAGE ", webp: "COLLECTION IMAGE ", path: "/collections/collection" },
  { id: 2, image: "COLLECTION IMAGE ", webp: "COLLECTION IMAGE ", path: "/collections/collection" },
  { id: 3, image: "COLLECTION IMAGE ", webp: "COLLECTION IMAGE ", path: "/collections/collection" },
  { id: 4, image: "COLLECTION IMAGE ", webp: "COLLECTION IMAGE ", path: "/collections/collection" },
  { id: 5, image: "COLLECTION IMAGE ", webp: "COLLECTION IMAGE ", path: "/collections/collection" },
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

const SCROLL_STEP = 320; 

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

  const [isMobile, setIsMobile] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [dynamicCollections, setDynamicCollections] = useState([]);
  const [serverDown, setServerDown] = useState(false);
  const [serverDownRetrying, setServerDownRetrying] = useState(false);

  // Hero drag/swipe state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);
  const heroRef = useRef(null);

  // Homepage content from admin context
  const { homepageContent, loading: contentLoading, error: contentError, refreshContent } = useContent();

  // Collections from admin context
  const { collections, loading: collectionsLoading, error: collectionsError, fetchAllCollections } = useCollection();

  // Products from admin context
  const { products, loading: productsLoading, error: productsError, fetchAllProducts } = useProduct();
  const [topPicksProducts, setTopPicksProducts] = useState([]);

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
    const heroImages = getDynamicHeroImages();
    if (heroImages.length === 0) return; // Don't run carousel if no images
    
    const interval = setInterval(() => {
      const totalImages = heroImages.length;
      setCurrentIndex((prev) => (prev + 1) % totalImages);
    }, 4000);
    return () => clearInterval(interval);
  }, [homepageContent]);

  // Fetch collections on component mount
  useEffect(() => {
    const loadCollections = async () => {
      try {
        // console.log('Starting to fetch collections for homepage...');
        const collectionsData = await fetchAllCollections();
        // console.log('Fetched collections for homepage:', collectionsData);
        // console.log('Collections data type:', typeof collectionsData);
        // console.log('Is collections array?', Array.isArray(collectionsData));

        if (collectionsData && Array.isArray(collectionsData) && collectionsData.length > 0) {
          // Transform collections data to match homepage format
          const transformedCollections = collectionsData.map((collection, index) => {
            // console.log(`Processing collection ${index}:`, collection);
            return {
              id: collection.collection_id || collection.id || index + 1,
              name: collection.name || `Collection ${index + 1}`,
              image: collection.collection_image || "COLLECTION IMAGE PLACEHOLDER",
              webp: collection.collection_image || "COLLECTION IMAGE PLACEHOLDER",
              path: `/collections/${collection.name?.toLowerCase().replace(/\s+/g, '-') || 'placeholder'}`
            };
          });

          // console.log('Transformed collections:', transformedCollections);
          setDynamicCollections(transformedCollections);
        } else {
          // console.log('No collections data or empty array, using fallback');
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

  // Fetch products and filter for top picks
  useEffect(() => {
    const loadTopPicks = async () => {
      try {
        await fetchAllProducts();
      } catch (error) {
        console.error('Error loading products for top picks:', error);
      }
    };

    loadTopPicks();
  }, [fetchAllProducts]);

  // Filter products for top picks (Lyric, Tiana, Espoir, Soleil)
  useEffect(() => {
    if (products && Array.isArray(products) && products.length > 0) {
      const targetNames = ['lyric', 'tiana', 'espoir', 'soleil'];
      const filtered = products.filter(product =>
        targetNames.some(name => product.name?.toLowerCase().includes(name))
      );

      // Transform to match ProductCard component format
      const transformedProducts = filtered.map((product, index) => {
        // Determine price display
        const hasOriginalPrice = product.original_price && product.original_price > 0;
        const hasSalePrice = product.sale_price && product.sale_price > 0;
        const hasRegularPrice = product.price && product.price > 0;

        let showStrikethrough = false;
        let oldPrice = "";
        let price = "";

        if (hasSalePrice && hasOriginalPrice) {
          // Product is on sale - show both prices
          showStrikethrough = true;
          oldPrice = `PHP${product.original_price}`;
          price = `PHP${product.sale_price}`;
        } else if (hasOriginalPrice) {
          // Has original price but no sale - show original price
          price = `PHP${product.original_price}`;
        } else if (hasRegularPrice) {
          // Regular price only
          price = `PHP${product.price}`;
        } else {
          // Fallback
          price = "PRICE NOT SET";
        }

        return {
          id: product.product_id || product.id || index + 1,
          images: product.images && product.images.length > 0 ? product.images : ["PRODUCT IMAGE PLACEHOLDER"],
          name: product.name || "PRODUCT NAME",
          collection: product.collection?.name || product.collection_name || "COLLECTION NAME",
          price,
          oldPrice,
          showStrikethrough,
          stock: product.stock || 0,
          variant: product.variant || null,
          category: product.category?.name || product.category_name || "N/A",
          category_id: product.category_id || product.category?.id || null,
          slug: product.slug || null,
        };
      });

      setTopPicksProducts(transformedProducts);
    }
  }, [products]);

  // Detect server-down state when all APIs timeout
  useEffect(() => {
    // Only check after initial load attempt
    if (!contentLoading && !collectionsLoading && !productsLoading && !serverDownRetrying) {
      const hasAnyData =
        homepageContent !== null ||
        dynamicCollections.length > 0 ||
        topPicksProducts.length > 0 ||
        collections.length > 0 ||
        products.length > 0;

      const hasErrors = contentError || collectionsError || productsError;

  
      if (hasErrors && !hasAnyData && !serverDown) {
        // Check if all errors are timeouts or network errors
        const errors = [contentError, collectionsError, productsError].filter(Boolean);
     
        const allTimeouts = errors.length > 0 && errors.every(err =>
          err.includes("timeout") || err.includes("Network error") || err.includes("Failed to fetch")
        );

        if (allTimeouts) {
         
          setServerDown(true);
        }
      } else if (hasAnyData && serverDown) {
        // Only reset server down if we actually have data
       
        setServerDown(false);
      }
    }
  }, [contentLoading, collectionsLoading, productsLoading, contentError, collectionsError, productsError, homepageContent, dynamicCollections, topPicksProducts, collections, products, serverDown, serverDownRetrying]);

  // Handle retry when server is down
  const handleRetry = async () => {
    setServerDownRetrying(true);
    setServerDown(false);

    try {
      // Re-fetch all data sources in parallel
      await Promise.all([
        refreshContent(),
        fetchAllProducts(),
        fetchAllCollections()
      ]);
    } catch (err) {
      console.error("Retry failed:", err);
    } finally {
      setServerDownRetrying(false);
    }
  };

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


  const handleImageChangeDesktop = (cardId, direction) => {
    if (hoveredCardId !== cardId) return;
    const topPicks = getDynamicTopPicks();
    const images = topPicks.find((item) => item.id === cardId)?.images || [];
    setHoveredImageIndex((idx) =>
      direction === "next"
        ? (idx + 1) % images.length
        : (idx - 1 + images.length) % images.length
    );
  };

  const nextRebelDesktop = () => {
    const topPicks = getDynamicTopPicks();
    if (!atEndRebel) {
      setStartIndex((prev) =>
        Math.min(prev + 1, topPicks.length - MAX_VISIBLE_REBELS)
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
    const topPicks = getDynamicTopPicks();
    let visibleCount = isMobile
      ? HOMEPAGE_COLLECTION_VISIBLE_MOBILE
      : HOMEPAGE_COLLECTION_VISIBLE_DESKTOP;
    const visible = [];
    const start = isMobile ? 0 : startIndex; // mobile handled by scroll not index
    for (let i = 0; i < visibleCount; i++) {
      if (topPicks.length > 0) {
        visible.push(topPicks[(start + i) % topPicks.length]);
      }
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

  // Hero drag/swipe handlers
  const getPositionX = (event) => {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  };

  const handleDragStart = (e) => {
    const heroImages = getDynamicHeroImages();
    if (heroImages.length <= 1) return; // Don't allow drag if only one image

    setIsDragging(true);
    setStartX(getPositionX(e));
    setPrevTranslate(currentIndex * -100);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;

    const currentPosition = getPositionX(e);
    const diff = currentPosition - startX;
    const heroImages = getDynamicHeroImages();
    const containerWidth = heroRef.current?.offsetWidth || 1;
    const percentMoved = (diff / containerWidth) * 100;

    const newTranslate = prevTranslate + percentMoved;
    const maxTranslate = 0; // First slide
    const minTranslate = -(heroImages.length - 1) * 100; // Last slide

    const constrainedTranslate = Math.max(minTranslate, Math.min(maxTranslate, newTranslate));

    setCurrentTranslate(constrainedTranslate);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);
    const movedBy = currentTranslate - prevTranslate;
    const heroImages = getDynamicHeroImages();

    let newIndex = currentIndex;

    if (movedBy < -20 && currentIndex < heroImages.length - 1) {
      newIndex = currentIndex + 1;
    } else if (movedBy > 20 && currentIndex > 0) {
      newIndex = currentIndex - 1;
    }

    setCurrentIndex(newIndex);

    setCurrentTranslate(newIndex * -100);
    setPrevTranslate(newIndex * -100);
  };

  

  const getDynamicHeroImages = () => {
    if (homepageContent?.hero_images && Array.isArray(homepageContent.hero_images) && homepageContent.hero_images.length > 0) {
      return homepageContent.hero_images.map(url => ({ src: url, webp: url }));
    }
    return []; 
  };

  const getDynamicCollections = () => {
    // console.log('getDynamicCollections called');
    // console.log('dynamicCollections:', dynamicCollections);
    // console.log('dynamicCollections length:', dynamicCollections?.length);
    // console.log('collectionsLoading:', collectionsLoading);

    if (dynamicCollections && dynamicCollections.length > 0) {
      // console.log('Using dynamic collections:', dynamicCollections);
      return dynamicCollections;
    }
    // console.log('Using fallback placeholder data');
    return burvonsCollections; 
  };

  
  const getDynamicTopPicks = () => {
    if (topPicksProducts && topPicksProducts.length > 0) {
      return topPicksProducts;
    }
    return rebelsTopPicks; 
  };

  const MAX_VISIBLE_REBELS = HOMEPAGE_COLLECTION_VISIBLE_DESKTOP; // 4
  const atStartRebel = startIndex === 0;
  const atEndRebel = useMemo(() => {
    const topPicks = getDynamicTopPicks();
    if (topPicks.length <= MAX_VISIBLE_REBELS) return true;
    return startIndex >= topPicks.length - MAX_VISIBLE_REBELS;
  }, [startIndex, topPicksProducts]);

  const MAX_VISIBLE_BURVON = HOMEPAGE_COLLECTION_VISIBLE_DESKTOP; // 4
  const atStartBurvon = collectionIndex === 0;

  // Calculate atEndBurvon after getDynamicCollections is defined
  const atEndBurvon = useMemo(() => {
    const collections = getDynamicCollections();
    // If we have fewer collections than max visible, we're always at the end
    if (collections.length <= MAX_VISIBLE_BURVON) return true;
    return collectionIndex >= collections.length - MAX_VISIBLE_BURVON;
  }, [collectionIndex, dynamicCollections]);

  // Show skeleton only on initial load when we don't have data yet
  // Don't show skeleton if we already have data (even if loading is true for refetch)
  // Check if we have any data to display
  const hasAnyData =
    homepageContent !== null ||
    dynamicCollections.length > 0 ||
    topPicksProducts.length > 0 ||
    collections.length > 0 ||
    products.length > 0;

  // Show skeleton during initial load or retry
  const isInitialLoad = (contentLoading || collectionsLoading || productsLoading) && !hasAnyData;

  if (isInitialLoad || serverDownRetrying) {
    return (
      <Layout full>
        <HomepageSkeleton />
      </Layout>
    );
  }

  // Show server down error
  if (serverDown) {
    return (
      <Layout full>
        <ServerDownError onRetry={handleRetry} retrying={serverDownRetrying} />
      </Layout>
    );
  }

  return (
    <Layout full>
      <style>{scrollbarHideStyle}</style>
      {/* Hero Section */}
      {getDynamicHeroImages().length > 0 && (
        <section
          id="hero"
          ref={heroRef}
          className="relative w-full h-[450px] lg:h-[550px] xl:h-[730px] overflow-hidden bg-black flex items-center justify-center select-none"
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          <div
            className="flex h-full w-full transition-transform"
            style={{
              transform: isDragging
                ? `translateX(${currentTranslate}%)`
                : `translateX(-${currentIndex * 100}%)`,
              transitionDuration: isDragging ? '0ms' : '700ms',
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
            aria-live="polite"
          >
            {getDynamicHeroImages().map((image, index) => (
              <picture key={index} className="flex-shrink-0 w-full h-full">
                <source src={image.webp} type="image/webp" />
                <img
                  src={image.src}
                  alt={`Burvon homepage banner collection ${index + 1}`}
                  className="w-full h-full object-cover object-center pointer-events-none"
                  draggable={false}
                />
              </picture>
            ))}
          </div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1 z-20">
            {getDynamicHeroImages().map((_, index) => (
              <span
                key={index}
                className={`w-2 h-2 rounded-full border border-[#FFF7DC] cursor-pointer ${
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
      )}

      

      {/* Rebels Top Picks */}
      <section className="bg-[#1f1f21] py-14">
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="flex justify-between items-center pb-8">
            <h2 className="font-bold bebas text-3xl lg:text-5xl tracking-wide text-[#FFF7DC]">
              REBEL'S TOP PICKS
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
        className="flex overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-mandatory flex-nowrap md:grid md:grid-cols-4 md:gap-5 md:overflow-visible -mx-5 px-6"
        style={{
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {getDynamicTopPicks().map((item, index) => (
          <div
            key={item.id}
            className="flex-shrink-0"
            style={{
              width: "65vw",
              marginLeft: index === 0 ? "0" : "8px",
              marginRight: "8px",
              scrollSnapAlign: "center",
            }}
          >
            <ProductCard
              item={item}
              layout="mobile"
              mobileImageHeight="250px"
            />
          </div>
        ))}
      </div>
    ) : (
      /* Desktop Grid */
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {rebelsVisibleCards().map((item) => {
          const isHovered = hoveredCardId === item.id;
          return (
            <ProductCard
              key={item.id}
              item={item}
              layout="desktop"
              isHovered={isHovered}
              currentImageIndex={hoveredImageIndex}
              onMouseEnter={() => {
                setHoveredCardId(item.id);
                setHoveredImageIndex(0);
              }}
              onMouseLeave={() => {
                setHoveredCardId(null);
              }}
              onImageChange={handleImageChangeDesktop}
              hoveredButtonId={hoveredButtonId}
              setHoveredButtonId={setHoveredButtonId}
            />
          );
        })}
      </div>
    )}
        </div>
      </section>

      {/* Burvons Collection Section */}
      <section className="w-full bg-black py-14" style={{ overflow: "visible" }}>
        <div className="max-w-7xl mx-auto px-6" style={{ overflow: "visible" }}>
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
                    width: "65vw",
                    height: "300px", 
                    margin: "0 8px", 
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
                      <source src={col.webp} type="image/webp" />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-center px-4 py-16" style={{ overflow: "visible" }}>
              {burvonVisibleCards().map((col) => {
                const isHovered = burvonHoveredId === col.id;
                return (
                  <div
                    key={col.id}
                    className="flex justify-center items-center"
                    style={{ overflow: "visible" }}
                  >
                    <div
                      onMouseEnter={() => setBurvonHoveredId(col.id)}
                      onMouseLeave={() => setBurvonHoveredId(null)}
                      onClick={() => navigate(col.path)}
                      className="shadow-lg transition-all duration-300 cursor-pointer relative"
                      style={{
                        width: "100%",
                        maxWidth: 320,
                        boxShadow: isHovered
                          ? "0 2px 6px rgba(255, 247, 220, 0.3)"
                          : "0 1px 3px rgba(0,0,0,0.2)",
                        backgroundColor: "transparent",
                        transformOrigin: "center",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        transform: isHovered ? "scale(1.05)" : "scale(1)",
                        borderRadius: 0,
                        zIndex: isHovered ? 30 : 1,
                      }}
                    >
                      {col.image.includes('PLACEHOLDER') ? (
                        <div className="w-full h-[200px] bg-[#1F1F21] flex items-center justify-center p-4">
                          <span className="text-[#FFF7DC] text-sm avant text-center leading-tight">
                            {col.image}
                          </span>
                        </div>
                      ) : (
                        <picture className="w-full block">
                          <source src={col.webp} type="image/webp" />
                          <img
                            src={col.image}
                            alt={`Burvon Collection ${col.id}`}
                            className="object-cover select-none transition-transform duration-300"
                            draggable={false}
                            style={{ display: "block", borderRadius: 3, height: "370px", width: "380px" }}
                          />
                        </picture>
                      )}
                    </div>
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
                  onClick={() => navigate("/tryon")}
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
