import React, { useState, useEffect, useRef } from "react";
import Layout from "../../components/Layout";
import {
  KidsCollectionBanner,
  ClashCollectionBanner,
  NextIcon,
  PrevIcon,
  TryOnIcon,
  AddFavorite,
  LyricImage,
  AgathaImage,
  RiomImage,
  CelineImage,
  AddBag,
  AddBagHover,
  ClassicCollectionImg,
  RebellionCollectionImg,
  LoveLanguageCollectionImg,
  PearlCollectionImg,
  StyleItImg,
  FastShipIcon,
  SecureIcon,
  ReturnIcon,
  SupportIcon,
  DropDown,
  DropUp,
} from "../../assets/index.js";

const heroImages = [KidsCollectionBanner, ClashCollectionBanner];

const rebelsTopPicks = [
  {
    id: 1,
    images: [LyricImage, ClashCollectionBanner],
    name: "LYRIC",
    collection: "LOVE LANGUAGE COLLECTION",
    originalPrice: "₱790.00",
    salePrice: "₱711.00",
  },
  {
    id: 2,
    images: [AgathaImage, KidsCollectionBanner],
    name: "AGATHA",
    collection: "CLASH COLLECTION",
    originalPrice: "₱790.00",
    salePrice: "₱711.00",
  },
  {
    id: 3,
    images: [RiomImage, ClashCollectionBanner],
    name: "RIOM",
    collection: "THE REBELLION COLLECTION",
    originalPrice: "₱790.00",
    salePrice: "₱711.00",
  },
  {
    id: 4,
    images: [CelineImage, KidsCollectionBanner],
    name: "CELINE",
    collection: "THE REBELLION COLLECTION",
    originalPrice: "₱790.00",
    salePrice: "₱711.00",
  },
  {
    id: 5,
    images: [LyricImage, ClashCollectionBanner],
    name: "LYRIC 2",
    collection: "LOVE LANGUAGE COLLECTION",
    originalPrice: "₱790.00",
    salePrice: "₱711.00",
  },
];

const burvonsCollections = [
  { id: 1, image: ClassicCollectionImg },
  { id: 2, image: RebellionCollectionImg },
  { id: 3, image: LoveLanguageCollectionImg },
  { id: 4, image: PearlCollectionImg },
];

const BASE_HEIGHT = 377;
const EXPANDED_HEIGHT = 440;
const HOMEPAGE_COLLECTION_VISIBLE_DESKTOP = 4;
const HOMEPAGE_COLLECTION_VISIBLE_MOBILE = 2;

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

const Homepage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [expandedRebelCardId, setExpandedRebelCardId] = useState(null);
  const [expandedBurvonCardId, setExpandedBurvonCardId] = useState(null);
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [hoveredImageIndex, setHoveredImageIndex] = useState(0);
  const [hoveredButtonId, setHoveredButtonId] = useState(null);
  const [burvonHoveredId, setBurvonHoveredId] = useState(null);
  const [collectionIndex, setCollectionIndex] = useState(0);

  const [mobileRebelStartIndex, setMobileRebelStartIndex] = useState(0);
  const [mobileBurvonStartIndex, setMobileBurvonStartIndex] = useState(0);

  const [isMobile, setIsMobile] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleImageChange = (cardId, direction) => {
    if (hoveredCardId !== cardId) return;
    const images = rebelsTopPicks.find((item) => item.id === cardId).images;
    setHoveredImageIndex((idx) =>
      direction === "next"
        ? (idx + 1) % images.length
        : (idx - 1 + images.length) % images.length
    );
  };

  const nextRebelDesktop = () => {
    setStartIndex((prev) => (prev + 1) % rebelsTopPicks.length);
  };

  const prevRebelDesktop = () => {
    setStartIndex((prev) => (prev === 0 ? rebelsTopPicks.length - 1 : prev - 1));
  };

  const showPrevCollection = () => {
    setCollectionIndex(
      (prev) => (prev - 1 + burvonsCollections.length) % burvonsCollections.length
    );
  };

  const showNextCollection = () => {
    setCollectionIndex((prev) => (prev + 1) % burvonsCollections.length);
  };

  const rebelsVisibleCards = () => {
    let visibleCount = isMobile
      ? HOMEPAGE_COLLECTION_VISIBLE_MOBILE
      : HOMEPAGE_COLLECTION_VISIBLE_DESKTOP;
    const visible = [];
    const start = isMobile ? mobileRebelStartIndex : startIndex;
    for (let i = 0; i < visibleCount; i++) {
      visible.push(rebelsTopPicks[(start + i) % rebelsTopPicks.length]);
    }
    return visible;
  };

  const burvonVisibleCards = () => {
    let visibleCount = isMobile
      ? HOMEPAGE_COLLECTION_VISIBLE_MOBILE
      : HOMEPAGE_COLLECTION_VISIBLE_DESKTOP;
    const visible = [];
    const start = isMobile ? mobileBurvonStartIndex : collectionIndex;
    for (let i = 0; i < visibleCount; i++) {
      visible.push(burvonsCollections[(start + i) % burvonsCollections.length]);
    }
    return visible;
  };

  const handleRebelSwipe = (direction) => {
    setMobileRebelStartIndex((prev) => {
      if (direction === "next") {
        return (prev + 1) % rebelsTopPicks.length;
      } else {
        return (prev - 1 + rebelsTopPicks.length) % rebelsTopPicks.length;
      }
    });
    setExpandedRebelCardId(null);
  };

  const handleBurvonSwipe = (direction) => {
    setMobileBurvonStartIndex((prev) => {
      if (direction === "next") {
        return (prev + 1) % burvonsCollections.length;
      } else {
        return (prev - 1 + burvonsCollections.length) % burvonsCollections.length;
      }
    });
    setExpandedBurvonCardId(null);
  };

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
      handleRebelSwipe("next");
    } else if (diff < -50) {
      handleRebelSwipe("prev");
    }
    touchStartXRebel.current = null;
    touchEndXRebel.current = null;
  };

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
      handleBurvonSwipe("next");
    } else if (diff < -50) {
      handleBurvonSwipe("prev");
    }
    touchStartXBurvon.current = null;
    touchEndXBurvon.current = null;
  };

  return (
    <Layout full>
      {/* Hero Section - unchanged */}
      <section
        id="hero"
        className="relative w-full h-[450px] lg:h-[550px] xl:h-[730px] overflow-hidden bg-black flex items-center justify-center"
      >
        <div
          className="flex h-full w-full transition-transform duration-700"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          aria-live="polite"
        >
          {heroImages.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Burvon homepage banner collection ${index + 1}`}
              className="flex-shrink-0 w-full h-full object-cover object-center"
              draggable={false}
            />
          ))}
        </div>
        {/* Pagination Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1 z-20">
          {heroImages.map((_, index) => (
            <span
              key={index}
              className={`w-2 h-2 rounded-full border border-[#FFF7DC] ${
                index === currentIndex ? "bg-[#FFF7DC]" : "bg-gray-400 opacity-40"
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
      <h2 className="font-bold bebas text-[50px] tracking-wide text-[#FFF7DC]">
        REBEL’S TOP PICKS
      </h2>
      {/* Show prev/next buttons on desktop only */}
      {!isMobile && (
        <div className="flex space-x-4">
          <div
            onClick={prevRebelDesktop}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") prevRebelDesktop();
            }}
            aria-label="Previous Picks"
            className="flex items-center justify-center px-2 py-1 cursor-pointer hover:opacity-70 hover:text-[#222] transition select-none"
          >
            <img src={PrevIcon} alt="Previous" className="w-10 h-10" draggable={false} />
          </div>
          <div
            onClick={nextRebelDesktop}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") nextRebelDesktop();
            }}
            aria-label="Next Picks"
            className="flex items-center justify-center px-2 py-1 cursor-pointer hover:opacity-70 hover:text-[#222] transition select-none"
          >
            <img src={NextIcon} alt="Next" className="w-10 h-10" draggable={false} />
          </div>
        </div>
      )}
    </div>

    {/* Cards container */}
    {isMobile ? (
      // Mobile horizontal scrolling container, show ~1.3 cards per view for scroll hint
      <div
        className="flex space-x-6 overflow-x-auto scrollbar-hide"
        onTouchStart={onTouchStartRebel}
        onTouchMove={onTouchMoveRebel}
        onTouchEnd={onTouchEndRebel}
      >
        {rebelsVisibleCards().map((item) => {
          const isExpanded = expandedRebelCardId === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setExpandedRebelCardId(isExpanded ? null : item.id)}
              className={`relative bg-[#222] rounded-none drop-shadow-[0_10px_15px_rgba(0,0,0,1)] cursor-pointer transition-transform duration-300 ${
                isExpanded ? "scale-105 z-10" : ""
              }`}
              style={{
                height: isExpanded ? EXPANDED_HEIGHT : BASE_HEIGHT,
                flexBasis: "calc(70% - 1rem)", // approx 1.3 cards visible with spacing
                flexShrink: 0,
                minWidth: "auto",
              }}
            >
              {/* Overlay Buttons */}
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

              {/* Image container with next/prev buttons for mobile */}
              <div className="relative w-full h-[300px] flex items-center justify-center overflow-hidden bg-black">
                <img
                  src={isExpanded ? item.images[hoveredImageIndex] : item.images[0]}
                  alt={item.name}
                  className="object-cover w-full h-full rounded-none transition-all duration-300"
                />
                {isExpanded && (
                  <>
                    <img
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageChange(item.id, "prev");
                      }}
                      src={PrevIcon}
                      alt="Previous"
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer hover:opacity-80"
                      draggable={false}
                    />
                    <img
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageChange(item.id, "next");
                      }}
                      src={NextIcon}
                      alt="Next"
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer hover:opacity-80"
                      draggable={false}
                    />
                  </>
                )}
              </div>

              {/* Details */}
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
                <div className="flex justify-center items-center gap-2 text-[14px] avantbold mb-10">
                  <span className="line-through text-[#FFF7DC] opacity-50">{item.originalPrice}</span>
                  <span className="text-[#FFF7DC]">{item.salePrice}</span>
                </div>
                <button
                  style={{
                    backgroundColor: hoveredButtonId === item.id ? "#FFF7DC" : "transparent",
                    color: hoveredButtonId === item.id ? "#1F1F21" : "#FFF7DC",
                    outline: "2px solid #FFF7DC",
                    outlineOffset: "0px",
                    borderRadius: 0,
                  }}
                  onMouseEnter={() => setHoveredButtonId(item.id)}
                  onMouseLeave={() => setHoveredButtonId(null)}
                  className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 border border-[#FFF7DC] py-2 px-4 font-bold text-md tracking-wide rounded-none transition-all duration-300 outline-none"
                >
                  <img
                    src={hoveredButtonId === item.id ? AddBagHover : AddBag}
                    alt="Bag Icon"
                    className="w-4 h-4 transition-colors duration-300"
                  />
                  ADD TO BAG
                </button>
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      /* Desktop grid with 4 cards */
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
              className={`relative bg-[#222] rounded-none overflow-hidden drop-shadow-[0_10px_15px_rgba(0,0,0,1)] group transition-transform duration-300 transform ${
                isHovered ? "scale-105 z-10" : ""
              }`}
              style={{
                height: isHovered ? EXPANDED_HEIGHT : BASE_HEIGHT,
              }}
            >
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

              {/* Image container with next/prev buttons for desktop */}
              <div className="relative w-full h-[300px] flex items-center justify-center overflow-hidden bg-black">
                <img
                  src={isHovered ? item.images[hoveredImageIndex] : item.images[0]}
                  alt={item.name}
                  className="object-cover w-full h-full rounded-none transition-all duration-300"
                />
                {isHovered && (
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

              {/* Details */}
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
                <div className="flex justify-center items-center gap-2 text-[14px] avantbold mb-10">
                  <span className="line-through text-[#FFF7DC] opacity-50">{item.originalPrice}</span>
                  <span className="text-[#FFF7DC]">{item.salePrice}</span>
                </div>
                <button
                  style={{
                    backgroundColor: hoveredButtonId === item.id ? "#FFF7DC" : "transparent",
                    color: hoveredButtonId === item.id ? "#1F1F21" : "#FFF7DC",
                    outline: "2px solid #FFF7DC",
                    outlineOffset: "0px",
                    borderRadius: 0,
                  }}
                  onMouseEnter={() => setHoveredButtonId(item.id)}
                  onMouseLeave={() => setHoveredButtonId(null)}
                  className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 border border-[#FFF7DC] py-2 px-4 font-bold text-md tracking-wide rounded-none transition-all duration-300 outline-none"
                >
                  <img
                    src={hoveredButtonId === item.id ? AddBagHover : AddBag}
                    alt="Bag Icon"
                    className="w-4 h-4 transition-colors duration-300"
                  />
                  ADD TO BAG
                </button>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
</section>


      {/* Burvon's Collection Section */}
      <section className="w-full bg-black py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-10">
            <h2 className="font-bold bebas text-4xl lg:text-5xl tracking-wide text-[#FFF7DC]">
              BURVON’S COLLECTION
            </h2>
            {!isMobile && (
              <div className="flex space-x-4">
                <div
                  onClick={showPrevCollection}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") showPrevCollection();
                  }}
                  aria-label="Previous Collection"
                  className="flex items-center justify-center px-2 py-1 cursor-pointer hover:opacity-70 hover:text-[#222] transition select-none"
                >
                  <img src={PrevIcon} alt="Previous" className="w-10 h-10" draggable={false} />
                </div>
                <div
                  onClick={showNextCollection}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") showNextCollection();
                  }}
                  aria-label="Next Collection"
                  className="flex items-center justify-center px-2 py-1 cursor-pointer hover:opacity-70 hover:text-[#222] transition select-none"
                >
                  <img src={NextIcon} alt="Next" className="w-10 h-10" draggable={false} />
                </div>
              </div>
            )}
          </div>

          {isMobile ? (
            // Mobile horizontal scroll container with spacing between cards and natural image aspect ratio
            <div
              className="flex space-x-6 overflow-x-auto scrollbar-hide justify-center"
              onTouchStart={onTouchStartBurvon}
              onTouchMove={onTouchMoveBurvon}
              onTouchEnd={onTouchEndBurvon}
            >
              {burvonVisibleCards().map((col) => {
                const isExpanded = expandedBurvonCardId === col.id;
                return (
                  <div
                    key={col.id}
                    onClick={() => setExpandedBurvonCardId(isExpanded ? null : col.id)}
                    className={`bg-[#111] rounded-none overflow-hidden shadow-lg mx-auto transition-all duration-300 cursor-pointer flex-shrink-0 ${
                      isExpanded ? "scale-105 z-10" : ""
                    }`}
                    style={{
                      height: isExpanded ? 460 : 380,
                      flexBasis: "calc(50% - 1.5rem)", // half width minus spacing
                      flexShrink: 0,
                      minWidth: "auto",
                      boxShadow: isExpanded
                        ? "0 8px 32px 0 rgba(0,0,0,0.8)"
                        : "0 4px 16px rgba(0,0,0,0.6)",
                    }}
                    onMouseEnter={() => !isMobile && setBurvonHoveredId(col.id)}
                    onMouseLeave={() => !isMobile && setBurvonHoveredId(null)}
                  >
                    <img
                      src={col.image}
                      alt={`Burvon Collection ${col.id}`}
                      className="max-w-full max-h-full object-contain select-none transition-transform duration-300"
                      draggable={false}
                      style={{
                        height: "100%",
                        width: "100%",
                      }}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-center">
              {burvonVisibleCards().map((col) => (
                <div
                  key={col.id}
                  onMouseEnter={() => setBurvonHoveredId(col.id)}
                  onMouseLeave={() => setBurvonHoveredId(null)}
                  className={`bg-[#111] rounded-none overflow-hidden shadow-lg mx-auto transition-all duration-300 cursor-pointer`}
                  style={{
                    height: burvonHoveredId === col.id ? 460 : 380,
                    maxWidth: 320,
                    boxShadow:
                      burvonHoveredId === col.id
                        ? "0 8px 32px 0 rgba(0,0,0,0.8)"
                        : "0 4px 16px rgba(0,0,0,0.6)",
                  }}
                >
                  <img
                    src={col.image}
                    alt={`Burvon Collection ${col.id}`}
                    className="w-full h-full object-cover select-none transition-transform duration-300"
                    draggable={false}
                    style={{
                      height: "100%",
                      width: "100%",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Style It On You Section */}
      <section className="relative w-full bg-[#1F1F21] mt-16 md:mt-24 lg:mt-15">
        <img
          src={StyleItImg}
          alt="Style It On You"
          className={`w-full object-cover ${
            isMobile ? "h-[400px]" : "h-[500px] md:h-[600px] lg:h-[650px]"
          }`}
          draggable={false}
          style={{
            objectPosition: isMobile ? "center bottom" : "center center",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-10 md:px-10 lg:px-5">
            <div className="flex flex-col items-center text-center max-w-md mx-auto">
              <h2 className="font-bold text-2xl md:text-3xl lg:text-4xl mb-4 tracking-wide text-[#fff7dc] bebas">
                STYLE IT ON YOU
              </h2>
              <p className="mb-8 text-sm md:text-base lg:text-lg text-[#fff7dc] opacity-90 avant leading-snug">
                Experience our virtual try-on feature and see <br />
                how each piece looks on you.
              </p>
              <button
                style={{
                  backgroundColor: hoveredButtonId === "try" ? "#FFF7DC" : "transparent",
                  color: hoveredButtonId === "try" ? "#1F1F21" : "#FFF7DC",
                  outline: "2px solid #FFF7DC",
                  outlineOffset: "0px",
                  borderRadius: 5,
                }}
                onMouseEnter={() => setHoveredButtonId("try")}
                onMouseLeave={() => setHoveredButtonId(null)}
                className="flex items-center justify-center gap-2 py-3 px-10 w-36 avant text-md md:text-base tracking-wide transition-all duration-300 outline-none"
              >
                TRY NOW
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Highlights Section - reverted to original one-row layout on mobile and desktop */}
      <section className="bg-[#1F1F21] py-20 flex justify-center">
        <div className="max-w-4xl w-full px-6 mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 justify-items-center justify-center max-w-3xl mx-auto sm:ml-auto sm:mr-0">
            {/* Fast Shipping */}
            <div className="w-80 sm:w-full mx-auto grid grid-cols-[3rem_1fr] items-center gap-4 text-left">
              <div className="flex justify-center">
                <img
                  src={FastShipIcon}
                  alt="Fast Shipping"
                  className="w-10 h-10"
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

            {/* Secure Payment */}
            <div className="w-80 sm:w-full mx-auto grid grid-cols-[3rem_1fr] items-center gap-4 text-left">
              <div className="flex justify-center">
                <img
                  src={SecureIcon}
                  alt="Secure Payment"
                  className="w-10 h-10"
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

            {/* Easy Returns */}
            <div className="w-80 sm:w-full mx-auto grid grid-cols-[3rem_1fr] items-center gap-4 text-left">
              <div className="flex justify-center">
                <img
                  src={ReturnIcon}
                  alt="Easy Returns"
                  className="w-10 h-10"
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

            {/* 24/7 Support */}
            <div className="w-80 sm:w-full mx-auto grid grid-cols-[3rem_1fr] items-center gap-4 text-left">
              <div className="flex justify-center">
                <img
                  src={SupportIcon}
                  alt="24/7 Support"
                  className="w-10 h-10"
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
                  className="w-full flex justify-between items-center text-left text-[#fff7dc] font-normal py-5 
                       focus:outline-none bg-transparent border-0 shadow-none rounded-none appearance-none avant"
                  style={{ background: "transparent" }}
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                >
                  <span>{faq.question}</span>
                  <img
                    src={openIndex === index ? DropUp : DropDown}
                    alt="toggle"
                    className="w-4 h-4"
                  />
                </button>

                {openIndex === index && (
                  <div className="pb-5 bg-transparent">
                    <p className="text-[#fff7dc] font-normal avant pl-5">
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
