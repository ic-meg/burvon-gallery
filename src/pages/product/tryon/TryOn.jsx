import React, { useState, useEffect, useRef } from "react";
import Layout from "../../../components/Layout";
import {
  hand, ringThumb, ringIndex, ringMiddle, ringRing, ringPinky,
  friden_tryon, iliao_tryon, neid_tryon, ring_onhand, sample_image,
  again, bracelet, camera, download, earrings, necklace, NextFacts, PrevFacts, rings,
  necklaceBlack, earringsBlack, ringsBlack, braceletBlack, 
} from "../../../assets/index.js";

const categories = [
  { key: "necklace", label: "NECKLACES", icon: necklace, iconBlack: necklaceBlack },
  { key: "earrings", label: "EARRINGS", icon: earrings, iconBlack: earringsBlack },
  { key: "rings", label: "RINGS", icon: rings, iconBlack: ringsBlack },
  { key: "bracelet", label: "BRACELETS", icon: bracelet, iconBlack: braceletBlack },
];

const products = {
  necklace: [
    { name: "NEID", image: neid_tryon },
    { name: "FRIDEN", image: friden_tryon },
    { name: "ILIAO", image: iliao_tryon },
  ],
  earrings: [
    { name: "EARRINGS", image: sample_image },
  ],
  rings: [
    { name: "RINGS", image: ring_onhand },
  ],
  bracelet: [
    { name: "BRACELETS", image: sample_image },
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
  canvasRef,
  isCameraOpen
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
              <div className="relative bg-[#232323] rounded-2xl flex items-center justify-center w-[800px] h-[500px] mx-auto mb-8 border-2 border-[#FFF7DC]">
                {!photo ? (
                  <>
                    {isCameraOpen ? (
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        className="rounded-2xl w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-full">
                        <p className="avant cream-text text-lg mb-2">Camera not available</p>
                        <p className="avant cream-text text-sm">Please check camera permissions</p>
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
  canvasRef,
  isCameraOpen
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
      <div className="relative bg-[#232323] rounded-2xl flex items-center justify-center w-full h-[300px] mx-auto mb-6 border-2 border-[#FFF7DC]">
        {!photo ? (
          <>
            {isCameraOpen ? (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="rounded-2xl w-full h-full object-cover" 
              />
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full">
                <p className="avant cream-text text-sm mb-1">Camera not available</p>
                <p className="avant cream-text text-xs">Check camera permissions</p>
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
  const [selectedProductIdx, setSelectedProductIdx] = useState(1);
  const [selectedFinger, setSelectedFinger] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [photo, setPhoto] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Improved camera initialization
  useEffect(() => {
    let stream = null;

    const openCamera = async () => {
      try {
        // Check if we're in a secure context
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.error("Camera API not available in this context");
          setIsCameraOpen(false);
          return;
        }

        // Request camera permissions
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user" 
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Wait for video to be ready
          videoRef.current.onloadedmetadata = () => {
            setIsCameraOpen(true);
          };
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setIsCameraOpen(false);
        
        // Show specific error messages
        if (err.name === 'NotAllowedError') {
          console.error("Camera permission denied");
        } else if (err.name === 'NotFoundError') {
          console.error("No camera found");
        } else if (err.name === 'NotSupportedError') {
          console.error("Camera not supported");
        }
      }
    };

    // Only open camera if no photo is taken and we're not on a mobile device that might have issues
    if (!photo) {
      openCamera();
    }

    return () => {
      // Clean up camera stream
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, [photo]);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current && isCameraOpen) {
      const ctx = canvasRef.current.getContext("2d");
      const video = videoRef.current;
      
      // Ensure video is ready
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        canvasRef.current.width = video.videoWidth;
        canvasRef.current.height = video.videoHeight;
        
        ctx.drawImage(video, 0, 0, canvasRef.current.width, canvasRef.current.height);
        setPhoto(canvasRef.current.toDataURL("image/png"));
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
        canvasRef={canvasRef}
        isCameraOpen={isCameraOpen}
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
        canvasRef={canvasRef}
        isCameraOpen={isCameraOpen}
      />
    </Layout>
  );
};

export default TryOn;