import React, { useState, useEffect, useRef } from "react";
import Layout from "../../../components/Layout";
import {
  hand, ringThumb, ringIndex, ringMiddle, ringRing, ringPinky,
  friden_tryon, iliao_tryon, neid_tryon, ring_onhand, sample_image,
  again, bracelet, camera, download, earrings, necklace, NextFacts, PrevFacts, rings,
  necklaceBlack, earringsBlack, ringsBlack, braceletBlack,
} from "../../../assets/index.js";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { useFaceLandmarks } from "../../../contexts/FaceLandmarksContext";
import { useHandLandmarks } from "../../../contexts/HandLandmarksContext";
import { ImageJewelryOverlay } from "../../../components/3Dcomponents/TryOn/ImageJewelryOverlay";

const categories = [
  { key: "necklace", label: "NECKLACES", icon: necklace, iconBlack: necklaceBlack },
  { key: "earrings", label: "EARRINGS", icon: earrings, iconBlack: earringsBlack },
  { key: "rings", label: "RINGS", icon: rings, iconBlack: ringsBlack },
  { key: "bracelet", label: "BRACELETS", icon: bracelet, iconBlack: braceletBlack },
];

const products = {
  necklace: [
    { name: "SILVER NECKLACE", image: "/image/Necklace/Silver-Necklace.png" },
  ],
  earrings: [
    { name: "ESPOIR", image: "/image/Earrings/EspoirImage.png" },
  ],
  rings: [
    { name: "RING", image: "/image/Rings/ring_PNG106.png" },
  ],
  bracelet: [
    { name: "SOLEIL", image: "/image/Bracelets/SoleilImage.png" },
  ],
};

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
  videoReady
}) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredPrev, setHoveredPrev] = useState(false);
  const [hoveredNext, setHoveredNext] = useState(false);

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
                          setSelectedFinger(null);
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
                        onMouseEnter={() => setSelectedFinger(finger)}
                        onMouseLeave={() => setSelectedFinger(null)}
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
                    />
                    {!isCameraOpen && (
                      <div className="flex flex-col items-center justify-center w-full h-full absolute top-0 left-0 z-10">
                        <p className="avant cream-text text-lg mb-2">Camera initializing...</p>
                        <p className="avant cream-text text-sm">Please allow camera permissions if prompted</p>
                      </div>
                    )}
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
                        src={prod.image}
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
  videoReady
}) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);

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
                setSelectedFinger(null);
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
            />
            {!isCameraOpen && (
              <div className="flex flex-col items-center justify-center w-full h-full absolute top-0 left-0 z-10">
                <p className="avant cream-text text-sm mb-1">Camera initializing...</p>
                <p className="avant cream-text text-xs">Allow camera permissions if prompted</p>
              </div>
            )}
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
                src={prod.image} 
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
  const [selectedCategory, setSelectedCategory] = useState("necklace");
  const [selectedProductIdx, setSelectedProductIdx] = useState(0);
  const [selectedFinger, setSelectedFinger] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [selectedJewelryImage, setSelectedJewelryImage] = useState("/image/Necklace/Silver-Necklace.png");
  const [videoReady, setVideoReady] = useState(false);

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
        // If we already have a ref but this one is visible, update it
        if (videoRef.current && videoRef.current !== element) {
   
        }
        videoRef.current = element;
        videoRefCallback.current = element;
        setVideoReady(true); // Notify that video element is ready
    
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
  const isInitializing = useRef(false);

  const { setFaceLandmarks } = useFaceLandmarks();
  const { setHandLandmarks } = useHandLandmarks();

  // Map category keys to jewelry types for ImageJewelryOverlay
  const categoryToJewelryType = {
    necklace: "necklace",
    earrings: "earrings",
    rings: "ring",
    bracelet: "bracelet"
  };

  // MediaPipe and camera initialization
  useEffect(() => {

    
    // Prevent double initialization (React Strict Mode) - but allow re-initialization after cleanup
    if (isInitializing.current && cameraRef.current) {

      return;
    }
    
    const startWebcam = async () => {

      try {
        // Wait a bit to ensure video element is in DOM
        if (!videoRef.current) {
  
          await new Promise(resolve => setTimeout(resolve, 100));
          if (!videoRef.current) {
            console.error('[TryOn] Video element still not available');
            return;
          }
        }
        
      
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: false,
        });
     
        
        // Double-check video element is still available
        if (videoRef.current) {
    
          const video = videoRef.current;
          
          // Clear any existing stream first
          if (video.srcObject) {
         
            const oldTracks = video.srcObject.getTracks();
            oldTracks.forEach(track => track.stop());
            video.srcObject = null;
          }
          
          // Set up event listener BEFORE setting srcObject
          const handleLoadedMetadata = () => {
        
            video.play().then(() => {
     
              setIsCameraOpen(true);
            }).catch((err) => {
              console.error('[TryOn] Error playing video:', err);
              setIsCameraOpen(true); // Still set as open even if play fails
            });
          };
          
          video.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
          
          // Set the stream
          video.srcObject = stream;
       
          
          // Also listen for canplay event as additional fallback
          const handleCanPlay = () => {
         
            if (video.paused) {
              video.play().catch(err => console.error('[TryOn] Error in canplay handler:', err));
            }
          };
          video.addEventListener('canplay', handleCanPlay, { once: true });
          
          // Fallback: try to play immediately if metadata already loaded
          if (video.readyState >= 1) {
        
            video.play().then(() => {
           
              setIsCameraOpen(true);
            }).catch((err) => {
              console.error('[TryOn] Error playing video (immediate):', err);
              setIsCameraOpen(true);
            });
          } else {
            // Set a timeout to check if video starts playing
            setTimeout(() => {
              if (video.srcObject && video.paused) {
      
                video.play().then(() => {
            
                  setIsCameraOpen(true);
                }).catch(err => {
                  console.error('[TryOn] Error playing after timeout:', err);
                });
              }
            }, 1000);
          }
        } else {
          console.warn('[TryOn] videoRef.current is null');
        }
      } catch (error) {
        console.error("[TryOn] Error accessing webcam:", error);
        setIsCameraOpen(false);
      }
    };

    const onFaceResults = (results) => {
      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        setFaceLandmarks(results.multiFaceLandmarks[0]);
      } else {
        setFaceLandmarks(null);
      }
    };

    const onHandResults = (results) => {
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        setHandLandmarks(results.multiHandLandmarks[0]);
      } else {
        setHandLandmarks(null);
      }
    };

    const initializeHands = async () => {
      const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      hands.onResults(onHandResults);
      handsRef.current = hands;
    };

    const initializeFaceMesh = async () => {
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

      // Wait for video to be ready
      await startWebcam();

      // Initialize hands
      await initializeHands();

      // Start camera after video is ready with frame throttling
      if (videoRef.current) {
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            // Throttle to ~30 FPS to reduce lag
            const now = performance.now();
            if (now - lastFrameTime.current < 33 || isProcessing.current) {
              return;
            }

            lastFrameTime.current = now;

            if (faceMeshRef.current && videoRef.current) {
              isProcessing.current = true;
              try {
                await faceMeshRef.current.send({ image: videoRef.current });
              } finally {
                isProcessing.current = false;
              }
            }

            // Process hands separately with throttling
            if (now - lastHandFrameTime.current < 33 || isHandProcessing.current) {
              return;
            }

            lastHandFrameTime.current = now;

            if (handsRef.current && videoRef.current) {
              isHandProcessing.current = true;
              try {
                await handsRef.current.send({ image: videoRef.current });
              } finally {
                isHandProcessing.current = false;
              }
            }
          },
          width: 640,
          height: 480,
        });
        camera.start();
        cameraRef.current = camera;
      }
    };

    let initTimer = null;
    
    if (!photo) {
      // Reset camera state when component mounts/remounts
      setIsCameraOpen(false);
      isInitializing.current = true;
      
      // Small delay to ensure DOM is ready
      initTimer = setTimeout(() => {
        initializeFaceMesh();
      }, 50);
    }

    return () => {
      // Clear initialization timer if it exists
      if (initTimer) {
        clearTimeout(initTimer);
      }
      
   
      
      // Stop camera first
      if (cameraRef.current) {
   
        try {
          cameraRef.current.stop();
        } catch (err) {
          console.error('[TryOn] Error stopping camera:', err);
        }
        cameraRef.current = null;
      }

      // Stop webcam tracks
      if (videoRef.current && videoRef.current.srcObject) {
   
        try {
          const tracks = videoRef.current.srcObject.getTracks();
          tracks.forEach((track) => {
            track.stop();
         
          });
          videoRef.current.srcObject = null;
        } catch (err) {
          console.error('[TryOn] Error stopping tracks:', err);
        }
      }

      // Close face mesh
      if (faceMeshRef.current) {
    
        try {
          faceMeshRef.current.close();
        } catch (err) {
          console.error('[TryOn] Error closing face mesh:', err);
        }
        faceMeshRef.current = null;
      }

      // Close hands
      if (handsRef.current) {
   
        try {
          handsRef.current.close();
        } catch (err) {
          console.error('[TryOn] Error closing hands:', err);
        }
        handsRef.current = null;
      }
      
      // Reset initialization flag AFTER cleanup
      isInitializing.current = false;
      setIsCameraOpen(false);
    };
  }, [photo]);

  // Ensure the visible video element gets the ref
  useEffect(() => {
    // Check which video element is visible after render
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
            setVideoReady(true); // Notify that video element is ready
            
            // If the old video had a stream, transfer it to the visible element
            if (oldVideo && oldVideo.srcObject && !video.srcObject) {
           
              video.srcObject = oldVideo.srcObject;
              // Try to play the video
              video.play().then(() => {
             
              }).catch(err => {
                console.error('[TryOn] Error playing visible video:', err);
              });
            }
            break;
          }
        }
      }
    };
    
    // Check after a short delay to ensure CSS has been applied
    const timer = setTimeout(checkVisibleVideo, 100);
    return () => clearTimeout(timer);
  }, [isCameraOpen]);

  // Update selected jewelry image when category or product changes
  useEffect(() => {
    const currentProduct = products[selectedCategory][selectedProductIdx];
    if (currentProduct) {
      setSelectedJewelryImage(currentProduct.image);
    }
  }, [selectedCategory, selectedProductIdx]);

  const takePhoto = () => {
    if (videoRef.current && isCameraOpen) {
      const video = videoRef.current;
      // Use the appropriate overlay canvas based on which one is available/visible
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
        // The overlay canvas content is not flipped (only displayed flipped via CSS),
        // so we need to flip it when capturing to match the flipped video
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
        overlayCanvasRef={overlayCanvasRef}
        overlayCanvasRefDesktop={overlayCanvasRefDesktop}
        selectedJewelryImage={selectedJewelryImage}
        categoryToJewelryType={categoryToJewelryType}
        isCameraOpen={isCameraOpen}
        videoReady={videoReady}
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
      />
    </Layout>
  );
};

export default TryOn;