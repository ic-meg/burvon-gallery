import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../../../components/Layout";
import {
  hand, ringThumb, ringIndex, ringMiddle, ringRing, ringPinky,
  sample_image,
  again, bracelet, camera, download, earrings, necklace, NextFacts, PrevFacts, rings,
  necklaceBlack, earringsBlack, ringsBlack, braceletBlack,
} from "../../../assets/index.js";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { useFaceLandmarks } from "../../../contexts/FaceLandmarksContext";
import { useHandLandmarks } from "../../../contexts/HandLandmarksContext";
import { ImageJewelryOverlay } from "../../../components/3Dcomponents/TryOn/ImageJewelryOverlay";
import HandDetectionGuide from "../../../components/3Dcomponents/TryOn/HandDetectionGuide";
import { mapCategoryToTryOn, tryOnProducts as products } from "../../../utils/tryOnUtils";

const categories = [
  { key: "necklace", label: "NECKLACES", icon: necklace, iconBlack: necklaceBlack },
  { key: "earrings", label: "EARRINGS", icon: earrings, iconBlack: earringsBlack },
  { key: "rings", label: "RINGS", icon: rings, iconBlack: ringsBlack },
  { key: "bracelet", label: "BRACELETS", icon: bracelet, iconBlack: braceletBlack },
];


const generateImagePath = (category, productName) => {
  const categoryMap = {
    necklace: "Necklace",
    earrings: "Earrings",
    rings: "Rings",
    bracelet: "Bracelets"
  };

  const titleCase = productName.charAt(0).toUpperCase() + productName.slice(1).toLowerCase();
  return `/image/${categoryMap[category]}/${titleCase}Image.png`;
};

// Products are now imported from tryOnUtils.js

const fingers = ["THUMB", "INDEX", "MIDDLE", "RING", "PINKY"];

const fingerHandMap = {
  THUMB: ringThumb,
  INDEX: ringIndex,
  MIDDLE: ringMiddle,
  RING: ringRing,
  PINKY: ringPinky,
};

// Desktop Layout
const TryOnDesktop = ({
  selectedCategory,
  setSelectedCategory,
  selectedProductIdx,
  setSelectedProductIdx,
  selectedFinger,
  setSelectedFinger,
  photo,
  setPhoto,
  takePhoto,
  downloadPhoto,
  handlePrev,
  handleNext,
  videoRef,
  setVideoRef,
  canvasRef,
  overlayCanvasRef,
  overlayCanvasRefDesktop,
  selectedJewelryImage,
  categoryToJewelryType,
  isCameraOpen,
  videoReady,
  handLandmarks,
  isJewelryLoading,
  isOverlayReady
}) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredPrev, setHoveredPrev] = useState(false);
  const [hoveredNext, setHoveredNext] = useState(false);
  
  // Check if hand detection guide should be shown
  const needsHandDetection = selectedCategory === "rings" || selectedCategory === "bracelet";
  const showHandGuide = needsHandDetection && isCameraOpen && !photo && (!handLandmarks || handLandmarks.length === 0);

  return (
    <div className="hidden lg:block min-h-screen bg-[#181818] px-0 py-20 text-[#fff7dc]">
      <div className="flex flex-col items-center pt-18">
        <h1 className="bebas cream-text mb-8" style={{ fontSize: '70px' }}>BURVON TRY-ON</h1>
        <div className="w-full max-w-[1600px] px-0">
          <div className="flex flex-row gap-8">
            {/* Left Sidebar - Categories */}
            <div className="w-1/4 flex flex-col items-start py-12 bg-[#232323] rounded-xl h-[full]"> 
              <div className="w-full">
                <h3 className="bebas cream-text mb-6 px-4 text-4xl text-left">CATEGORIES</h3>
                <div className="flex flex-col gap-4">
                  {categories.map(cat => {
                    const isActive = selectedCategory === cat.key;
                    const isHovered = hoveredCategory === cat.key;
                    const iconSrc = isActive || isHovered ? cat.iconBlack : cat.icon;

                    return (
                      <button
                        key={cat.key}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all w-full
                          ${isActive
                            ? "bg-[#FFF7DC] text-[#181818]"
                            : isHovered
                              ? "bg-[#FFF7DC] text-[#181818]"
                              : "bg-transparent cream-text"
                          }`}
                        onClick={() => {
                          setSelectedCategory(cat.key);
                          setSelectedProductIdx(0);
                          // Set default finger to MIDDLE when rings category is selected
                          setSelectedFinger(cat.key === "rings" ? "MIDDLE" : null);
                        }}
                        onMouseEnter={() => setHoveredCategory(cat.key)}
                        onMouseLeave={() => setHoveredCategory(null)}
                      >
                        <img src={iconSrc} alt={cat.label} className="w-11 h-11" />
                        <span className="bebas text-2xl">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Finger Selection for Rings */}
              {selectedCategory === "rings" && (
                <div className="mt-7 w-full px-4">
                  <h4 className="bebas cream-text mb-4 text-4xl text-left">SELECT A FINGER</h4>
                  <div className="flex flex-col gap-2">
                    {fingers.map(finger => (
                      <button
                        key={finger}
                        className={`rounded-lg px-3 py-2 text-md avant transition-all w-full ${
                          selectedFinger === finger
                            ? "bg-[#FFF7DC] text-[#181818]"
                            : "bg-transparent cream-text hover:bg-[#FFF7DC] hover:text-[#181818]"
                        }`}
                        onClick={() => setSelectedFinger(finger)}
                      >
                        {finger}
                      </button>
                    ))}
                  </div>
                  {/* Show ring on hand with selected finger */}
                  <div className="mt-6 relative flex flex-col items-center">
                    <img
                      src={selectedFinger ? fingerHandMap[selectedFinger] : hand}
                      alt={selectedFinger || "Hand"}
                      className="w-40"
                    />
                  </div>
                </div>
              )}
            </div>
            {/* Center - Camera and Product Display */}
            <div className="flex-1 flex flex-col items-center justify-center py-8">
              {/* Camera View */}
              <div className="relative bg-[#232323] rounded-2xl flex items-center justify-center w-[800px] h-[500px] mx-auto mb-8 border-2 border-[#FFF7DC] overflow-hidden">
                {!photo ? (
                  <>
                    <video
                      ref={setVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="rounded-2xl w-full h-full object-cover absolute top-0 left-0"
                      style={{ 
                        transform: "scaleX(-1)",
                        opacity: isCameraOpen ? 1 : 0,
                        zIndex: 1
                      }}
                    />
                    <ImageJewelryOverlay
                      videoRef={videoRef}
                      canvasRef={overlayCanvasRefDesktop}
                      useImageOverlay={true}
                      jewelryType={categoryToJewelryType[selectedCategory]}
                      selectedJewelryImage={selectedJewelryImage}
                      videoReady={videoReady}
                      selectedFinger={selectedFinger}
                    />
                    {!isCameraOpen && (
                      <div className="flex flex-col items-center justify-center w-full h-full absolute top-0 left-0 z-10">
                        <p className="avant cream-text text-lg mb-2">Camera initializing...</p>
                        <p className="avant cream-text text-sm">Please allow camera permissions if prompted</p>
                      </div>
                    )}
                    {isCameraOpen && isJewelryLoading && (
                      <div className="flex flex-col items-center justify-center w-full h-full absolute top-0 left-0 z-20 bg-[#232323] bg-opacity-80">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FFF7DC] mb-4"></div>
                        <p className="avant cream-text text-lg">Loading product...</p>
                      </div>
                    )}
                    <HandDetectionGuide isVisible={showHandGuide} />
                    <canvas
                      ref={canvasRef}
                      style={{ display: "none" }}
                    />
                  </>
                ) : (
                  <img src={photo} alt="Try-On Result" className="rounded-2xl w-full h-full object-cover" />
                )}
              </div>

              {/* Product Carousel */}
              <div className="flex items-center justify-center gap-6 mt-8">
                <button
                  onClick={handlePrev}
                  onMouseEnter={() => setHoveredPrev(true)}
                  onMouseLeave={() => setHoveredPrev(false)}
                  className="p-3 rounded-lg border-2 border-[#FFF7DC] bg-transparent hover:bg-[#FFF7DC] hover:text-[#181818] transition"
                  style={{ width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <img src={hoveredPrev ? PrevFacts : PrevFacts} alt="Previous" className="w-6 h-6" style={{ filter: hoveredPrev ? "brightness(0) saturate(100%) invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg)" : "none" }} />
                </button>
                <div className="flex gap-8 items-end">
                  {products[selectedCategory].map((prod, idx) => (
                    <div
                      key={prod.name}
                      className={`flex flex-col items-center transition-all duration-200`}
                      style={{
                        transform: selectedProductIdx === idx ? "scale(1.25)" : "scale(1)",
                        zIndex: selectedProductIdx === idx ? 2 : 1,
                      }}
                    >
                      <img
                        src={generateImagePath(selectedCategory, prod.name)}
                        alt={prod.name}
                        className={`object-contain mb-2 rounded-lg`}
                        style={{
                          width: selectedProductIdx === idx ? 120 : 80,
                          height: selectedProductIdx === idx ? 120 : 80,
                          transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
                        }}
                      />
                      <span
                        className={`bebas`}
                        style={{
                          color: "#FFF7DC",
                          fontSize: selectedProductIdx === idx ? "2rem" : "1.2rem",
                          fontWeight: selectedProductIdx === idx ? "bold" : "normal",
                          letterSpacing: "1px",
                          textAlign: "center",
                          marginTop: selectedProductIdx === idx ? "8px" : "4px",
                        }}
                      >
                        {prod.name}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleNext}
                  onMouseEnter={() => setHoveredNext(true)}
                  onMouseLeave={() => setHoveredNext(false)}
                  className="p-3 rounded-lg border-2 border-[#FFF7DC] bg-transparent hover:bg-[#FFF7DC] hover:text-[#181818] transition"
                  style={{ width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <img src={hoveredNext ? NextFacts : NextFacts} alt="Next" className="w-6 h-6" style={{ filter: hoveredNext ? "brightness(0) saturate(100%) invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg)" : "none" }} />
                </button>
              </div>
            </div>

            {/* Right Sidebar - Camera Controls */}
            <div className="w-1/5 flex flex-col items-center justify-center py-8 bg-[#232323] rounded-xl">
              <button 
                onClick={takePhoto} 
                className="mb-6 bg-[#232323] border-2 border-[#FFF7DC] p-4 rounded-lg hover:bg-[#FFF7DC] transition group"
                disabled={!isCameraOpen}
              >
                <img src={camera} alt="Take Photo" className="w-8 h-8 group-hover:invert" />
              </button>
              <button 
                onClick={() => setPhoto(null)} 
                className="mb-6 bg-[#232323] border-2 border-[#FFF7DC] p-4 rounded-lg hover:bg-[#FFF7DC] transition group"
              >
                <img src={again} alt="Take Again" className="w-8 h-8 group-hover:invert" />
              </button>
              <button 
                onClick={downloadPhoto} 
                className="bg-[#232323] border-2 border-[#FFF7DC] p-4 rounded-lg hover:bg-[#FFF7DC] transition group"
                disabled={!photo}
              >
                <img src={download} alt="Download" className="w-8 h-8 group-hover:invert" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mobile Layout
const TryOnMobile = ({
  selectedCategory,
  setSelectedCategory,
  selectedProductIdx,
  setSelectedProductIdx,
  selectedFinger,
  setSelectedFinger,
  photo,
  setPhoto,
  takePhoto,
  downloadPhoto,
  handlePrev,
  handleNext,
  videoRef,
  setVideoRef,
  canvasRef,
  overlayCanvasRef,
  overlayCanvasRefMobile,
  selectedJewelryImage,
  categoryToJewelryType,
  isCameraOpen,
  videoReady,
  handLandmarks,
  isJewelryLoading,
  isOverlayReady
}) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  
  // Check if hand detection guide should be shown
  const needsHandDetection = selectedCategory === "rings" || selectedCategory === "bracelet";
  const showHandGuide = needsHandDetection && isCameraOpen && !photo && (!handLandmarks || handLandmarks.length === 0);

  return (
    <div className="lg:hidden w-full min-h-screen bg-[#181818] px-4 pt-22 text-[#fff7dc]">
      <h1 className="bebas cream-text text-center text-4xl mb-6">BURVON TRY-ON</h1>
      {/* Categories */}
      <div className="flex justify-between items-center mb-6 bg-[#232323] rounded-xl p-4">
        {categories.map(cat => {
          const isActive = selectedCategory === cat.key;
          const isHovered = hoveredCategory === cat.key;
          const iconSrc = isActive || isHovered ? cat.iconBlack : cat.icon;

          return (
            <button
              key={cat.key}
              className={`flex flex-col items-center px-2 py-2 rounded-lg transition-all ${
                isActive
                  ? "bg-[#FFF7DC] text-[#181818]"
                  : "bg-transparent cream-text"
              }`}
              onClick={() => {
                setSelectedCategory(cat.key);
                setSelectedProductIdx(0);
                // Set default finger to MIDDLE when rings category is selected
                setSelectedFinger(cat.key === "rings" ? "MIDDLE" : null);
              }}
              onMouseEnter={() => setHoveredCategory(cat.key)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <img src={iconSrc} alt={cat.label} className="w-6 h-6 mb-1" />
              <span className="bebas text-xs">{cat.label}</span>
            </button>
          );
        })}
      </div>
      {/* Finger Selection for Rings */}
      {selectedCategory === "rings" && (
        <div className="bg-[#232323] rounded-xl p-4 mb-6">
          <h4 className="bebas cream-text mb-3 text-xl text-left">SELECT A FINGER</h4>
          <div className="flex justify-between gap-1 mb-4">
            {fingers.map(finger => (
              <button
                key={finger}
                className={`rounded-lg px-2 py-1 text-xs avant transition-all flex-1 ${
                  selectedFinger === finger
                    ? "bg-[#FFF7DC] text-[#181818]"
                    : "bg-transparent cream-text"
                }`}
                onClick={() => setSelectedFinger(finger)}
              >
                {finger}
              </button>
            ))}
          </div>
          {/* Show ring on hand with selected finger */}
          <div className="relative flex flex-col items-center">
            <img
              src={selectedFinger ? fingerHandMap[selectedFinger] : hand}
              alt={selectedFinger || "Hand"}
              className="w-30"
            />
          </div>
        </div>
      )}
      {/* Camera View */}
      <div className="relative bg-[#232323] rounded-2xl flex items-center justify-center w-full h-[300px] mx-auto mb-6 border-2 border-[#FFF7DC] overflow-hidden">
        {!photo ? (
          <>
            <video
              ref={setVideoRef}
              autoPlay
              playsInline
              muted
              className="rounded-2xl w-full h-full object-cover absolute top-0 left-0"
              style={{ 
                transform: "scaleX(-1)",
                opacity: isCameraOpen ? 1 : 0,
                zIndex: 1
              }}
            />
            <ImageJewelryOverlay
              videoRef={videoRef}
              canvasRef={overlayCanvasRefMobile}
              useImageOverlay={true}
              jewelryType={categoryToJewelryType[selectedCategory]}
              selectedJewelryImage={selectedJewelryImage}
              videoReady={videoReady}
              selectedFinger={selectedFinger}
            />
            {!isCameraOpen && (
              <div className="flex flex-col items-center justify-center w-full h-full absolute top-0 left-0 z-10">
                <p className="avant cream-text text-sm mb-1">Camera initializing...</p>
                <p className="avant cream-text text-xs">Allow camera permissions if prompted</p>
              </div>
            )}
            {isCameraOpen && isJewelryLoading && (
              <div className="flex flex-col items-center justify-center w-full h-full absolute top-0 left-0 z-20 bg-[#232323] bg-opacity-80">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFF7DC] mb-3"></div>
                <p className="avant cream-text text-sm">Loading product...</p>
              </div>
            )}
            <HandDetectionGuide isVisible={showHandGuide} />
            <canvas
              ref={canvasRef}
              style={{ display: "none" }}
            />
          </>
        ) : (
          <img src={photo} alt="Try-On Result" className="rounded-2xl w-full h-full object-cover" />
        )}
        
        {/* Mobile Camera Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
          <button 
            onClick={takePhoto} 
            className="bg-[#232323] border-2 border-[#FFF7DC] p-2 rounded-lg hover:bg-[#FFF7DC] transition group"
            disabled={!isCameraOpen}
          >
            <img src={camera} alt="Camera" className="w-5 h-5 group-hover:invert" />
          </button>
          <button 
            onClick={() => setPhoto(null)} 
            className="bg-[#232323] border-2 border-[#FFF7DC] p-2 rounded-lg hover:bg-[#FFF7DC] transition group"
          >
            <img src={again} alt="Again" className="w-5 h-5 group-hover:invert" />
          </button>
          <button 
            onClick={downloadPhoto} 
            className="bg-[#232323] border-2 border-[#FFF7DC] p-2 rounded-lg hover:bg-[#FFF7DC] transition group"
            disabled={!photo}
          >
            <img src={download} alt="Download" className="w-5 h-5 group-hover:invert" />
          </button>
        </div>
      </div>

      {/* Product Carousel */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button 
          onClick={handlePrev} 
          className="p-2 rounded-lg bg-[#232323] border border-[#FFF7DC] hover:bg-[#FFF7DC] transition group"
        >
          <img src={PrevFacts} alt="Previous" className="w-5 h-5 group-hover:invert" />
        </button>
        
        <div className="flex gap-4">
          {products[selectedCategory].map((prod, idx) => (
            <div
              key={prod.name}
              className={`flex flex-col items-center transition-all ${
                selectedProductIdx === idx ? "scale-125" : "scale-100"
              }`}
            >
              <img
                src={generateImagePath(selectedCategory, prod.name)}
                alt={prod.name}
                className={`object-contain mb-1 rounded-lg ${
                  selectedProductIdx === idx ? "w-22 h-22" : "w-20 h-20"
                }`}
              />
              <span className="bebas cream-text text-sm">{prod.name}</span>
            </div>
          ))}
        </div>
        
        <button 
          onClick={handleNext} 
          className="p-2 rounded-lg bg-[#232323] border border-[#FFF7DC] hover:bg-[#FFF7DC] transition group"
        >
          <img src={NextFacts} alt="Next" className="w-5 h-5 group-hover:invert" />
        </button>
      </div>
    </div>
  );
};

// Helper function to position ring on hand based on selected finger
const getRingPosition = (finger) => {
  switch (finger) {
    case "THUMB":
      return "translate(5px, 10px) scale(0.8)";
    case "INDEX":
      return "translate(-2px, 15px) scale(0.9)";
    case "MIDDLE":
      return "translate(-8px, 18px) scale(0.9)";
    case "RING":
      return "translate(-14px, 15px) scale(0.9)";
    case "PINKY":
      return "translate(-20px, 10px) scale(0.8)";
    default:
      return "translate(0px, 15px) scale(0.9)";
  }
};

const TryOn = () => {
  const [searchParams] = useSearchParams();
  
  // Get category and product from URL parameters
  const urlCategory = searchParams.get("category");
  const urlProduct = searchParams.get("product");
  
  // Map URL category to try-on category and validate
  const mappedCategory = urlCategory ? mapCategoryToTryOn(urlCategory) : null;
  const initialCategory = mappedCategory && categories.find(c => c.key === mappedCategory) 
    ? mappedCategory 
    : "necklace";
  
  // Find product index if product name is provided
  const findProductIndex = (category, productName) => {
    if (!productName || !products[category]) return 0;
    const index = products[category].findIndex(
      p => p.name.toLowerCase() === productName.toLowerCase()
    );
    return index >= 0 ? index : 0;
  };
  
  const initialProductIdx = urlProduct && mappedCategory 
    ? findProductIndex(mappedCategory, urlProduct)
    : 0;
  
  // Ensure we have a valid product array and index
  const safeProductIdx = products[initialCategory] && products[initialCategory].length > 0
    ? Math.min(initialProductIdx, products[initialCategory].length - 1)
    : 0;
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedProductIdx, setSelectedProductIdx] = useState(safeProductIdx);
  const [selectedFinger, setSelectedFinger] = useState(initialCategory === "rings" ? "MIDDLE" : null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [photo, setPhoto] = useState(null);
  const initialImagePath = products[initialCategory] && products[initialCategory][safeProductIdx]
    ? generateImagePath(initialCategory, products[initialCategory][safeProductIdx].name)
    : generateImagePath("necklace", products.necklace[0].name);

  const [selectedJewelryImage, setSelectedJewelryImage] = useState(initialImagePath);
  const [videoReady, setVideoReady] = useState(false);
  const [isJewelryLoading, setIsJewelryLoading] = useState(true);
  const [isOverlayReady, setIsOverlayReady] = useState(false);

  const videoRef = useRef(null);
  const videoRefCallback = useRef(null);
  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const overlayCanvasRefDesktop = useRef(null);
  const overlayCanvasRefMobile = useRef(null);
  
  // Callback ref to handle multiple video elements (desktop/mobile)
  // Prioritize the visible element (not hidden by CSS)
  const setVideoRef = (element) => {
    if (element) {
      const isVisible = element.offsetParent !== null || 
                       window.getComputedStyle(element).display !== 'none';
      
      // Only set ref if this element is visible, or if no ref is set yet
      if (isVisible || !videoRef.current) {
        videoRef.current = element;
        videoRefCallback.current = element;
        setVideoReady(true); // Notify that video element is ready
        
        // Ensure stream is attached to the new video element
        if (streamRef.current) {
          if (!element.srcObject || element.srcObject !== streamRef.current) {
            element.srcObject = streamRef.current;
          }
          
          // Ensure video is playing if camera is open
          if (isCameraOpen && element.paused) {
            element.play().catch(err => {
              console.error('[TryOn] Error playing video in setVideoRef:', err);
            });
          }
        }
      }
    } else {
      setVideoReady(false);
    }
  };
  const faceMeshRef = useRef(null);
  const handsRef = useRef(null);
  const cameraRef = useRef(null);
  const lastFrameTime = useRef(0);
  const isProcessing = useRef(false);
  const lastHandFrameTime = useRef(0);
  const isHandProcessing = useRef(false);
  const streamRef = useRef(null);
  const timeoutRefs = useRef([]);
  const selectedCategoryRef = useRef(selectedCategory);

  const { setFaceLandmarks } = useFaceLandmarks();
  const { handLandmarks, setHandLandmarks } = useHandLandmarks();

  // Map category keys to jewelry types for ImageJewelryOverlay
  const categoryToJewelryType = {
    necklace: "necklace",
    earrings: "earrings",
    rings: "ring",
    bracelet: "bracelet"
  };

  // Comprehensive cleanup function using useRef to avoid stale closures
  const stopAllMediaRef = useRef();
  stopAllMediaRef.current = () => {
    console.log('[TryOn] stopAllMedia called');

    // Stop MediaPipe Camera
    if (cameraRef.current) {
      try {
        cameraRef.current.stop();
        console.log('[TryOn] MediaPipe camera stopped');
      } catch (err) {
        console.error('[TryOn] Error stopping camera:', err);
      }
      cameraRef.current = null;
    }

    // Close MediaPipe models
    if (faceMeshRef.current) {
      try {
        faceMeshRef.current.close();
        console.log('[TryOn] FaceMesh closed');
      } catch (err) {
        console.error('[TryOn] Error closing face mesh:', err);
      }
      faceMeshRef.current = null;
    }

    if (handsRef.current) {
      try {
        handsRef.current.close();
        console.log('[TryOn] Hands closed');
      } catch (err) {
        console.error('[TryOn] Error closing hands:', err);
      }
      handsRef.current = null;
    }

    // Stop all video tracks
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => {
        track.stop();
        console.log('[TryOn] Stopped video track:', track.label, track.readyState);
      });
      videoRef.current.srcObject = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('[TryOn] Stopped stream track:', track.label, track.readyState);
      });
      streamRef.current = null;
    }

    // Clear state
    setIsCameraOpen(false);
    setFaceLandmarks(null);
    setHandLandmarks(null);

    console.log('[TryOn] All media stopped');
  };

  const stopAllMedia = () => stopAllMediaRef.current();

  // Handle initial image load
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setIsJewelryLoading(false);
      setTimeout(() => setIsOverlayReady(true), 300);
    };
    img.onerror = () => {
      setIsJewelryLoading(false);
      setIsOverlayReady(true);
    };
    img.src = initialImagePath;
  }, []);

  // Add page visibility and navigation listeners for cleanup
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('[TryOn] Page hidden, stopping media');
        stopAllMedia();
      }
    };

    const handleBeforeUnload = () => {
      console.log('[TryOn] Before unload, stopping media');
      stopAllMedia();
    };

    // Listen for page visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Listen for page unload
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Webcam initialization - runs only ONCE on mount
  useEffect(() => {
    let isActive = true;

    const startWebcam = async () => {
      try {
        // Wait a bit to ensure video element is in DOM
        if (!videoRef.current) {
          await new Promise(resolve => {
            const timeout = setTimeout(resolve, 100);
            timeoutRefs.current.push(timeout);
          });
          if (!videoRef.current || !isActive) return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: false,
        });

        if (!isActive) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          const video = videoRef.current;

          const handleLoadedMetadata = () => {
            if (!isActive) return;
            video.play().then(() => {
              if (isActive) setIsCameraOpen(true);
            }).catch((err) => {
              console.error('[TryOn] Error playing video:', err);
              if (isActive) setIsCameraOpen(true);
            });
          };

          video.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
          video.srcObject = stream;

          if (video.readyState >= 1) {
            video.play().then(() => {
              if (isActive) setIsCameraOpen(true);
            }).catch((err) => {
              console.error('[TryOn] Error playing video (immediate):', err);
              if (isActive) setIsCameraOpen(true);
            });
          }
        }
      } catch (error) {
        console.error("[TryOn] Error accessing webcam:", error);
        if (isActive) setIsCameraOpen(false);
      }
    };

    startWebcam();

    return () => {
      isActive = false;
      // Clear timeouts
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
      timeoutRefs.current = [];
      // Use comprehensive cleanup
      stopAllMedia();
      console.log('[TryOn] Component unmount cleanup finished');
    };
  }, []); 

  // Update category ref whenever it changes
  useEffect(() => {
    selectedCategoryRef.current = selectedCategory;
  }, [selectedCategory]);

  // Detect if user is on mobile device
  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  // Detect Android specifically for more aggressive optimization
  const isAndroid = /Android/i.test(navigator.userAgent);

  // MediaPipe models initialization - changes when category changes
  useEffect(() => {
    const needsFaceMesh = selectedCategory === "necklace" || selectedCategory === "earrings";
    const needsHands = selectedCategory === "rings" || selectedCategory === "bracelet";

    const onFaceResults = (results) => {
      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        setFaceLandmarks(results.multiFaceLandmarks[0]);
      } else {
        setFaceLandmarks(null);
      }
    };

    const onHandResults = (results) => {
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        setHandLandmarks(landmarks);
      } else {
        setHandLandmarks(null);
      }
    };

    const initializeModels = async () => {
      // Wait for webcam to be ready
      if (!videoRef.current) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      if (!videoRef.current) return;

      // Initialize FaceMesh if needed
      if (needsFaceMesh && !faceMeshRef.current) {
        const faceMesh = new FaceMesh({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });
        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
        faceMesh.onResults(onFaceResults);
        faceMeshRef.current = faceMesh;
      }

      // Initialize Hands if needed
      if (needsHands) {
        if (!handsRef.current) {
          try {
            const hands = new Hands({
              locateFile: (file) => {
                // Try jsdelivr first (most common)
                const baseUrl = `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
                return baseUrl;
              },
            });
            hands.setOptions({
              maxNumHands: 2,
              // Use lower complexity on Android (0 = lite model), iOS uses standard
              modelComplexity: isAndroid ? 0 : (isMobileDevice ? 1 : 1),
              // Lower confidence thresholds on Android for faster processing
              minDetectionConfidence: isAndroid ? 0.3 : (isMobileDevice ? 0.5 : 0.5),
              minTrackingConfidence: isAndroid ? 0.3 : (isMobileDevice ? 0.5 : 0.5),
            });
            hands.onResults(onHandResults);
            
            // Add error handler
            if (hands.onError) {
              hands.onError = (error) => {
                console.error('[TryOn] Hands model error:', error);
              };
            }
            
            handsRef.current = hands;
          } catch (error) {
            console.error('[TryOn] Failed to initialize Hands model:', error);
            // Try alternative CDN (unpkg)
            try {
              const hands = new Hands({
                locateFile: (file) => `https://unpkg.com/@mediapipe/hands@0.4.1675469404/${file}`,
              });
              hands.setOptions({
                maxNumHands: 2,
                // Use lower complexity on Android (0 = lite model), iOS uses standard
                modelComplexity: isAndroid ? 0 : (isMobileDevice ? 1 : 1),
                // Lower confidence thresholds on Android for faster processing
                minDetectionConfidence: isAndroid ? 0.3 : (isMobileDevice ? 0.5 : 0.5),
                minTrackingConfidence: isAndroid ? 0.3 : (isMobileDevice ? 0.5 : 0.5),
              });
              hands.onResults(onHandResults);
              if (hands.onError) {
                hands.onError = (error) => {
                  console.error('[TryOn] Hands model error (alternative):', error);
                };
              }
              handsRef.current = hands;
            } catch (altError) {
              console.error('[TryOn] Alternative Hands model initialization also failed:', altError);
              console.error('[TryOn] This may be a network/CDN issue. Please check your internet connection.');
            }
          }
        }
      }

      // Start MediaPipe Camera if not already started
      if (videoRef.current && !cameraRef.current) {
        // Set frame rate based on device type
        // Android: 50ms = 20fps (more aggressive throttle), iOS: 33ms = 30fps, Desktop: 33ms = ~30fps
        const frameInterval = isAndroid ? 50 : (isMobileDevice ? 33 : 33);

        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            const now = performance.now();

            // Check current category using ref to get latest value
            const currentCategory = selectedCategoryRef.current;
            const currentNeedsFaceMesh = currentCategory === "necklace" || currentCategory === "earrings";
            const currentNeedsHands = currentCategory === "rings" || currentCategory === "bracelet";

            // Process FaceMesh if needed for current category
            if (currentNeedsFaceMesh && faceMeshRef.current && videoRef.current) {
              if (now - lastFrameTime.current >= frameInterval && !isProcessing.current) {
                lastFrameTime.current = now;
                isProcessing.current = true;
                try {
                  await faceMeshRef.current.send({ image: videoRef.current });
                } catch (err) {
                  console.error('[TryOn] Error processing face mesh:', err);
                } finally {
                  isProcessing.current = false;
                }
              }
            }

            // Process Hands if needed for current category
            if (currentNeedsHands && handsRef.current && videoRef.current) {
              if (now - lastHandFrameTime.current >= frameInterval && !isHandProcessing.current) {
                lastHandFrameTime.current = now;
                isHandProcessing.current = true;
                try {
                  if (handsRef.current && videoRef.current.readyState >= 2) {
                    await handsRef.current.send({ image: videoRef.current });
                  } else {
                    if (Math.random() < 0.1) {
                      console.warn('[TryOn] Video not ready for hand processing:', {
                        videoReadyState: videoRef.current?.readyState
                      });
                    }
                  }
                } catch (err) {
                  console.error('[TryOn] Error processing hands:', err);
                  console.error('[TryOn] Error details:', {
                    message: err.message,
                    stack: err.stack,
                    name: err.name
                  });
                  if (err.message && (err.message.includes('undefined') || err.message.includes('not loaded'))) {
                    console.warn('[TryOn] Hands model may not be fully loaded, will retry...');
                    handsRef.current = null;
                  }
                } finally {
                  isHandProcessing.current = false;
                }
              }
            } else if (currentNeedsHands) {
              if (Math.random() < 0.05) {
                console.warn('[TryOn] Cannot process hands:', {
                  hasHandsModel: !!handsRef.current,
                  hasVideo: !!videoRef.current,
                  currentCategory
                });
              }
            }
          },
          width: 640,
          height: 480,
        });
        camera.start();
        cameraRef.current = camera;
      } else {
        if (!videoRef.current) {
          console.warn('[TryOn] Cannot start camera: videoRef.current is null');
        }
        if (cameraRef.current) {
          // Verify that the Hands model is available for the current category
          if (needsHands && !handsRef.current) {
            console.warn('[TryOn] WARNING: Hands model not initialized but needed for category:', selectedCategory);
          }
        }
      }
    };

    initializeModels();

    return () => {
      // Cleanup unused models when switching categoriesz
      if (!needsFaceMesh && faceMeshRef.current) {
        try {
          faceMeshRef.current.close();
        } catch (err) {
          console.error('[TryOn] Error closing face mesh:', err);
        }
        faceMeshRef.current = null;
        setFaceLandmarks(null);
      }

      // Close Hands if we don't need it for the new category
      if (!needsHands && handsRef.current) {
        try {
          handsRef.current.close();
        } catch (err) {
          console.error('[TryOn] Error closing hands:', err);
        }
        handsRef.current = null;
        setHandLandmarks(null);
      }
    };
  }, [selectedCategory]); // Re-initialize when category changes

  // Reattach video stream and recreate MediaPipe Camera when photo is cleared (retry button clicked)
  useEffect(() => {
    if (!photo && videoRef.current && streamRef.current && isCameraOpen) {
      // Photo was cleared, ensure video stream is attached and playing
      const video = videoRef.current;
      
      // Check if stream is already attached
      if (!video.srcObject || video.srcObject !== streamRef.current) {
        video.srcObject = streamRef.current;
      }
      
      // Ensure video is playing
      const playVideo = async () => {
        if (video.paused) {
          try {
            await video.play();
          } catch (err) {
            console.error('[TryOn] Error playing video after photo cleared:', err);
          }
        }
        
        // Wait for video to be ready, then recreate MediaPipe Camera if needed
        const checkAndRecreateCamera = () => {
          if (!videoRef.current || !isCameraOpen) return;
          
          // Check if video is ready
          if (video.readyState >= 2 && video.videoWidth > 0) {
            // Always recreate MediaPipe Camera when photo is cleared
            if (cameraRef.current) {
              // Stop old camera
              try {
                cameraRef.current.stop();
              } catch (err) {
                // Ignore errors if already stopped
              }
              cameraRef.current = null;
            }
            
            // Recreate MediaPipe Camera with the new video element
            if (videoRef.current) {
              const currentCategory = selectedCategoryRef.current;
              const currentNeedsFaceMesh = currentCategory === "necklace" || currentCategory === "earrings";
              const currentNeedsHands = currentCategory === "rings" || currentCategory === "bracelet";

              // Set frame rate based on device type
              // Android: 50ms = 20fps (more aggressive throttle), iOS: 33ms = 30fps, Desktop: 33ms = ~30fps
              const frameInterval = isAndroid ? 50 : (isMobileDevice ? 33 : 33);

              const camera = new Camera(videoRef.current, {
                onFrame: async () => {
                  const now = performance.now();
                  const currentCategory = selectedCategoryRef.current;
                  const currentNeedsFaceMesh = currentCategory === "necklace" || currentCategory === "earrings";
                  const currentNeedsHands = currentCategory === "rings" || currentCategory === "bracelet";

                  if (currentNeedsFaceMesh && faceMeshRef.current && videoRef.current) {
                    if (now - lastFrameTime.current >= frameInterval && !isProcessing.current) {
                      lastFrameTime.current = now;
                      isProcessing.current = true;
                      try {
                        await faceMeshRef.current.send({ image: videoRef.current });
                      } catch (err) {
                        console.error('[TryOn] Error processing face mesh:', err);
                      } finally {
                        isProcessing.current = false;
                      }
                    }
                  }

                  if (currentNeedsHands && handsRef.current && videoRef.current) {
                    if (now - lastHandFrameTime.current >= frameInterval && !isHandProcessing.current) {
                      lastHandFrameTime.current = now;
                      isHandProcessing.current = true;
                      try {
                        if (handsRef.current && videoRef.current.readyState >= 2) {
                          await handsRef.current.send({ image: videoRef.current });
                        }
                      } catch (err) {
                        console.error('[TryOn] Error processing hands:', err);
                      } finally {
                        isHandProcessing.current = false;
                      }
                    }
                  }
                },
                width: 640,
                height: 480,
              });
              camera.start();
              cameraRef.current = camera;
            }
          } else {
            setTimeout(checkAndRecreateCamera, 50);
          }
        };
        
        setTimeout(checkAndRecreateCamera, 100);
      };
      
      playVideo();
      
      if (video.style.opacity === '0') {
        video.style.opacity = '1';
      }
    }
  }, [photo, isCameraOpen]);

  useEffect(() => {
    const checkVisibleVideo = () => {
      const allVideos = document.querySelectorAll('video');
      if (allVideos.length > 0) {
        // Find the visible video element
        for (const video of allVideos) {
          const style = window.getComputedStyle(video);
          const isVisible = style.display !== 'none' && 
                           style.visibility !== 'hidden' &&
                           style.opacity !== '0';
          
          if (isVisible && video !== videoRef.current) {
            const oldVideo = videoRef.current;
            videoRef.current = video;
            setVideoReady(true); 
            
            if (streamRef.current) {
              if (!video.srcObject || video.srcObject !== streamRef.current) {
                video.srcObject = streamRef.current;
              }
              
              // Ensure video is playing
              if (video.paused) {
                video.play().catch(err => {
                  console.error('[TryOn] Error playing visible video:', err);
                });
              }
            } else if (oldVideo && oldVideo.srcObject && !video.srcObject) {
              // Fallback: transfer stream from old video if streamRef is not available
              video.srcObject = oldVideo.srcObject;
              video.play().then(() => {
                // Video started
              }).catch(err => {
                console.error('[TryOn] Error playing visible video:', err);
              });
            }
            break;
          }
        }
      }
    };
    
    const timer = setTimeout(checkVisibleVideo, 100);
    return () => clearTimeout(timer);
  }, [isCameraOpen, photo]); // Also trigger when photo changes

  // Handle URL parameter changes (e.g., when navigating from different products)
  useEffect(() => {
    const urlCategory = searchParams.get("category");
    const urlProduct = searchParams.get("product");
    
    if (urlCategory) {
      const mappedCategory = mapCategoryToTryOn(urlCategory);
      if (mappedCategory && categories.find(c => c.key === mappedCategory)) {
        if (mappedCategory !== selectedCategory) {
          setSelectedCategory(mappedCategory);
        }
        
        if (urlProduct) {
          const productIdx = findProductIndex(mappedCategory, urlProduct);
          if (productIdx >= 0 && products[mappedCategory] && products[mappedCategory][productIdx]) {
            if (productIdx !== selectedProductIdx || mappedCategory !== selectedCategory) {
              setSelectedProductIdx(productIdx);
              setSelectedJewelryImage(
                generateImagePath(mappedCategory, products[mappedCategory][productIdx].name)
              );
            }
            return;
          }
        }
      }
    }
  }, [searchParams]); 

  useEffect(() => {
    const currentProduct = products[selectedCategory]?.[selectedProductIdx];
    if (currentProduct) {
      setIsJewelryLoading(true);
      setIsOverlayReady(false);
      const imagePath = generateImagePath(selectedCategory, currentProduct.name);

      // Preload the image
      const img = new Image();
      img.onload = () => {
        setSelectedJewelryImage(imagePath);
        setIsJewelryLoading(false);
        // Give a small delay for the overlay to render
        setTimeout(() => setIsOverlayReady(true), 300);
      };
      img.onerror = () => {
        // Even on error, update the image path and mark as not loading
        setSelectedJewelryImage(imagePath);
        setIsJewelryLoading(false);
        setIsOverlayReady(true);
      };
      img.src = imagePath;
    }
  }, [selectedCategory, selectedProductIdx]);

  const takePhoto = () => {
    if (videoRef.current && isCameraOpen) {
      const video = videoRef.current;
      const overlayCanvas = overlayCanvasRefDesktop.current || overlayCanvasRefMobile.current;

      if (video.videoWidth > 0 && video.videoHeight > 0) {
        const captureCanvas = document.createElement('canvas');
        captureCanvas.width = video.videoWidth;
        captureCanvas.height = video.videoHeight;
        const ctx = captureCanvas.getContext('2d');

        // Draw video (flipped horizontally to match display)
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -captureCanvas.width, 0, captureCanvas.width, captureCanvas.height);
        ctx.restore();

        // Draw jewelry overlay on top if it exists
 
        if (overlayCanvas && overlayCanvas.width > 0 && overlayCanvas.height > 0) {
          ctx.save();
          ctx.scale(-1, 1);
          // Draw overlay at the same dimensions as the capture canvas
          ctx.drawImage(
            overlayCanvas, 
            -captureCanvas.width, 
            0, 
            captureCanvas.width, 
            captureCanvas.height
          );
          ctx.restore();
        }

        setPhoto(captureCanvas.toDataURL("image/png"));
      }
    }
  };

  const downloadPhoto = () => {
    if (photo) {
      const link = document.createElement("a");
      link.href = photo;
      link.download = "burvon-tryon.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePrev = () => {
    setSelectedProductIdx(idx => 
      idx === 0 ? products[selectedCategory].length - 1 : idx - 1
    );
  };

  const handleNext = () => {
    setSelectedProductIdx(idx => 
      idx === products[selectedCategory].length - 1 ? 0 : idx + 1
    );
  };

  return (
    <Layout full>
      <TryOnDesktop
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedProductIdx={selectedProductIdx}
        setSelectedProductIdx={setSelectedProductIdx}
        selectedFinger={selectedFinger}
        setSelectedFinger={setSelectedFinger}
        photo={photo}
        setPhoto={setPhoto}
        takePhoto={takePhoto}
        downloadPhoto={downloadPhoto}
        handlePrev={handlePrev}
        handleNext={handleNext}
        videoRef={videoRef}
        setVideoRef={setVideoRef}
        canvasRef={canvasRef}
        handLandmarks={handLandmarks}
        overlayCanvasRef={overlayCanvasRef}
        overlayCanvasRefDesktop={overlayCanvasRefDesktop}
        selectedJewelryImage={selectedJewelryImage}
        categoryToJewelryType={categoryToJewelryType}
        isCameraOpen={isCameraOpen}
        videoReady={videoReady}
        isJewelryLoading={isJewelryLoading}
        isOverlayReady={isOverlayReady}
      />

      <TryOnMobile
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedProductIdx={selectedProductIdx}
        setSelectedProductIdx={setSelectedProductIdx}
        selectedFinger={selectedFinger}
        setSelectedFinger={setSelectedFinger}
        photo={photo}
        setPhoto={setPhoto}
        takePhoto={takePhoto}
        downloadPhoto={downloadPhoto}
        handlePrev={handlePrev}
        handleNext={handleNext}
        videoRef={videoRef}
        setVideoRef={setVideoRef}
        canvasRef={canvasRef}
        overlayCanvasRef={overlayCanvasRef}
        overlayCanvasRefMobile={overlayCanvasRefMobile}
        selectedJewelryImage={selectedJewelryImage}
        categoryToJewelryType={categoryToJewelryType}
        isCameraOpen={isCameraOpen}
        videoReady={videoReady}
        handLandmarks={handLandmarks}
        isJewelryLoading={isJewelryLoading}
        isOverlayReady={isOverlayReady}
      />
    </Layout>
  );
};

export default TryOn;