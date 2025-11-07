import { useEffect, useRef } from "react";
import { useFaceLandmarks } from "../../../contexts/FaceLandmarksContext";
import { useHandLandmarks } from "../../../contexts/HandLandmarksContext";
import { useControls } from "leva";

export const ImageJewelryOverlay = ({ videoRef, canvasRef: externalCanvasRef, useImageOverlay, jewelryType, selectedJewelryImage, videoReady }) => {
  const internalCanvasRef = useRef(null);
  const canvasRef = externalCanvasRef || internalCanvasRef;
  const { faceLandmarks } = useFaceLandmarks();
  const { handLandmarks } = useHandLandmarks();
  const imageCacheRef = useRef({});
  const faceLandmarksRef = useRef(faceLandmarks);
  const handLandmarksRef = useRef(handLandmarks);

  // Update refs with latest landmark values
  useEffect(() => {
    faceLandmarksRef.current = faceLandmarks;
    handLandmarksRef.current = handLandmarks;
  }, [faceLandmarks, handLandmarks]);

  // Leva controls
  // const {
  //   necklaceImage: levaNecklaceImage,
  //   braceletImage: levaBraceletImage,
  //   ringImage: levaRingImage,
  //   earringImage: levaEarringImage,
  //   necklaceWidthMultiplier,
  //   necklaceHeightRatio,
  //   necklaceYOffset,
  //   ringSizeMultiplier,
  //   ringYOffset,
  //   ringZOffset,
  //   braceletWidthMultiplier,
  //   braceletHeightRatio,
  //   braceletYOffset,
  //   braceletRotationOffset,
  //   earringSizeMultiplier,
  //   earringLeftOffsetX,
  //   earringLeftOffsetY,
  //   earringRightOffsetX,
  //   earringRightOffsetY,
  //   earringLeftMaxZDepth,
  //   earringRightMaxZDepth,
  // } = useControls("Image Overlay Settings", {
  //   necklaceImage: {
  //     value: "/image/Necklace/Silver-Necklace.png",
  //     options: [
  //       "/image/Necklace/Silver-Necklace.png",
  //       "/image/Gold-Jewellery-PNG-Picture.png",
  //       "/image/Silver-Necklace.png",
  //       "/image/ChatGPT Image May 7, 2025, 07_57_45 PM.png",
  //     ],
  //     label: "Necklace Image"
  //   },
  //   braceletImage: {
  //     value: "/image/Bracelets/SoleilImage.png",
  //     options: [
  //       "/image/Bracelets/SoleilImage.png",
  //       "/image/90-jewelry-png-image.png",
  //     ],
  //     label: "Bracelet Image"
  //   },
  //   ringImage: {
  //     value: "/image/Rings/ring_PNG106.png",
  //     options: [
  //       "/image/Rings/ring_PNG106.png",
  //     ],
  //     label: "Ring Image"
  //   },
  //   earringImage: {
  //     value: "/image/Earrings/EspoirImage.png",
  //     options: [
  //       "/image/Earrings/EspoirImage.png",
  //       "/image/Gold-Jewellery-PNG-Picture.png",
  //       "/image/Silver-Necklace.png",
  //     ],
  //     label: "Earring Image"
  //   },
  //   necklaceWidthMultiplier: { value: 1.3, min: 1.0, max: 3.0, step: 0.1, label: "Necklace Width Multiplier" },
  //   necklaceHeightRatio: { value: 0.80, min: 0.3, max: 0.8, step: 0.05, label: "Necklace Height Ratio" },
  //   necklaceYOffset: { value: 40, min: 0, max: 100, step: 5, label: "Necklace Y Offset (px)" },
  //   ringSizeMultiplier: { value: 1.2, min: 0.8, max: 2.0, step: 0.1, label: "Ring Size Multiplier" },
  //   ringYOffset: { value: -13, min: -50, max: 50, step: 1, label: "Ring Y Offset (px)" },
  //   ringZOffset: { value: 0, min: -200, max: 200, step: 1, label: "Ring Z Offset (depth adjustment)" },
  //   braceletWidthMultiplier: { value: 1.0, min: 1.0, max: 2.0, step: 0.1, label: "Bracelet Width Multiplier" },
  //   braceletHeightRatio: { value: 0.50, min: 0.2, max: 0.5, step: 0.05, label: "Bracelet Height Ratio" },
  //   braceletYOffset: { value: 1, min: -100, max: 100, step: 1, label: "Bracelet Y Offset (px)" },
  //   braceletZOffset: { value: 0, min: -200, max: 200, step: 1, label: "Bracelet Z Offset (depth adjustment)" },
  //   braceletRotationOffset: { value: 0, min: -180, max: 180, step: 1, label: "Bracelet Rotation Offset (degrees)" },
  //   earringSizeMultiplier: { value: 1.5, min: 0.5, max: 2.0, step: 0.1, label: "Earring Size Multiplier" },
  //   earringLeftOffsetX: { value: -4, min: -100, max: 100, step: 1, label: "Left Earring X Offset (px)" },
  //   earringLeftOffsetY: { value: 7, min: -100, max: 100, step: 1, label: "Left Earring Y Offset (px)" },
  //   earringRightOffsetX: { value: 4, min: -100, max: 100, step: 1, label: "Right Earring X Offset (px)" },
  //   earringRightOffsetY: { value: 8, min: -100, max: 100, step: 1, label: "Right Earring Y Offset (px)" },
  //   earringLeftMaxZDepth: { value: 0.08, min: -0.5, max: 0.5, step: 0.01, label: "Left Ear Max Z Depth (Visibility)" },
  //   earringRightMaxZDepth: { value: 0.08, min: -0.5, max: 0.5, step: 0.01, label: "Right Ear Max Z Depth (Visibility)" },
  // });

  // Use selectedJewelryImage if provided, otherwise use Leva controls
  // const necklaceImage = jewelryType === "necklace" && selectedJewelryImage ? selectedJewelryImage : levaNecklaceImage;
  // const braceletImage = jewelryType === "bracelet" && selectedJewelryImage ? selectedJewelryImage : levaBraceletImage;
  // const ringImage = jewelryType === "ring" && selectedJewelryImage ? selectedJewelryImage : levaRingImage;
  // const earringImage = jewelryType === "earrings" && selectedJewelryImage ? selectedJewelryImage : levaEarringImage;

  // Instead of using levaNecklaceImage, use direct values:
const necklaceImage = jewelryType === "necklace" && selectedJewelryImage ? selectedJewelryImage : "/image/Necklace/Silver-Necklace.png";
const braceletImage = jewelryType === "bracelet" && selectedJewelryImage ? selectedJewelryImage : "/image/Bracelets/SoleilImage.png";
const ringImage = jewelryType === "ring" && selectedJewelryImage ? selectedJewelryImage : "/image/Rings/ring_PNG106.png";
const earringImage = jewelryType === "earrings" && selectedJewelryImage ? selectedJewelryImage : "/image/Earrings/EspoirImage.png";

const necklaceWidthMultiplier = 1.3;
const necklaceHeightRatio = 0.80;
const necklaceYOffset = 40;
const ringSizeMultiplier = 1.2;
const ringYOffset = -13;
const ringZOffset = 0;
const braceletWidthMultiplier = 1.0; // Reduced from 1.6 to match wrist size better
const braceletHeightRatio = 0.50;
const braceletYOffset = 1; // Y offset for bracelet position (positive = down, negative = up)
const braceletZOffset = 0; // Z offset for bracelet position (positive = forward, negative = backward)
const braceletRotationOffset = 0;
const earringSizeMultiplier = 1.3;
const earringLeftOffsetX = -4;
const earringLeftOffsetY = 7;
const earringRightOffsetX = 4;
const earringRightOffsetY = 8;
const earringLeftMaxZDepth = 0.08;
const earringRightMaxZDepth = 0.08;

  // Load images into cache
  useEffect(() => {
    const loadImage = (src) => {
      if (imageCacheRef.current[src]) {
        return Promise.resolve(imageCacheRef.current[src]);
      }

      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          imageCacheRef.current[src] = img;
          resolve(img);
        };
        img.onerror = reject;
        img.src = src;
      });
    };

    // Preload all images
    const imagesToLoad = [necklaceImage, braceletImage, ringImage, earringImage];
    imagesToLoad.forEach((src) => {
      if (src) {
        loadImage(src).catch((err) => {
          console.warn(`Failed to load image: ${src}`, err);
        });
      }
    });
  }, [necklaceImage, braceletImage, ringImage, earringImage, selectedJewelryImage]);

  // Draw jewelry on canvas
  useEffect(() => {
    if (!useImageOverlay || !canvasRef.current || !videoRef?.current || !videoReady) {

      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const video = videoRef.current;

    let animationFrameId = null;

    const updateCanvasSize = () => {
      if (video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
    };

    // Initial size setup
    updateCanvasSize();

    // Update size when video metadata loads
    const handleLoadedMetadata = () => {
      updateCanvasSize();
    };
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    // Define draw functions inside useEffect to access latest values
    const drawNecklace = (ctx, canvas) => {
      const landmarks = faceLandmarksRef.current;
      if (!landmarks || !Array.isArray(landmarks) || landmarks.length < 468) {
        return;
      }

      // NECKLACE LANDMARKS 
      // 152: Chin center - PRIMARY ANCHOR POINT
      // 234: Left cheek
      // 454: Right cheek
      const chin = landmarks[152];
      const left = landmarks[234];
      const right = landmarks[454];

      if (!chin || !left || !right) {
        return;
      }

      const image = imageCacheRef.current[necklaceImage];
      if (!image || !image.complete) {
        // Image not loaded yet, wait for it
        return;
      }

      // Calculate position and size (matching TryOn.html exactly)
      const x = chin.x * canvas.width;
      const y = chin.y * canvas.height;
      const faceWidth = (right.x - left.x) * canvas.width;
      const width = faceWidth * necklaceWidthMultiplier;
      const height = width * necklaceHeightRatio;

      // Draw necklace centered on chin, slightly below
      ctx.drawImage(
        image,
        x - width / 2,
        y - height / 2 + necklaceYOffset,
        width,
        height
      );
    };

    const drawRing = (ctx, canvas) => {
      const landmarks = handLandmarksRef.current;
      if (!landmarks || !Array.isArray(landmarks) || landmarks.length < 21) {
        return;
      }

      // RING LANDMARKS:
      // 9: Middle finger MCP joint (base of finger)
      // 10: Middle finger PIP joint (middle joint)
      // We'll interpolate between MCP and PIP to position the ring just above the base
      const middleFingerMCP = landmarks[9]; // Middle finger MCP (base)
      const middleFingerPIP = landmarks[10]; // Middle finger PIP (middle joint)

      if (!middleFingerMCP || !middleFingerPIP) {
        return;
      }

      // Interpolate between MCP and PIP to get a position just above the base
      // 0.2 = 20% from MCP toward PIP (just above the base, where rings are typically worn)
      const interpolationFactor = 0.2;
      const ringLandmark = {
        x: middleFingerMCP.x + (middleFingerPIP.x - middleFingerMCP.x) * interpolationFactor,
        y: middleFingerMCP.y + (middleFingerPIP.y - middleFingerMCP.y) * interpolationFactor,
        z: middleFingerMCP.z + (middleFingerPIP.z - middleFingerMCP.z) * interpolationFactor,
      };

      const image = imageCacheRef.current[ringImage];
      if (!image || !image.complete) {
        // Image not loaded yet, wait for it
        return;
      }

      // Calculate ring size based on finger width (using actual distance, not just X difference)
      // This ensures consistent size regardless of hand orientation
      // Use Euclidean distance between MCP and PIP joints for sizing
      const mcpX = middleFingerMCP.x * canvas.width;
      const mcpY = middleFingerMCP.y * canvas.height;
      const pipX = middleFingerPIP.x * canvas.width;
      const pipY = middleFingerPIP.y * canvas.height;
      
      // Calculate actual distance between MCP and PIP joints
      const fingerSegmentLength = Math.sqrt(
        Math.pow(pipX - mcpX, 2) + Math.pow(pipY - mcpY, 2)
      );
      
      // Use a portion of the finger segment length as the ring size reference
      // This gives a more consistent size that doesn't change with hand rotation
      const ringSize = fingerSegmentLength * 0.3 * ringSizeMultiplier;

      // Get Z coordinate for depth adjustment
      const ringZ = ringLandmark.z || 0; // Z coordinate for depth (0 if not available)
      
      // Apply Y and Z offsets
      // Z offset affects Y position based on depth (simulating perspective)
      // Positive Z = closer to camera, negative Z = farther away
      const zAdjustedY = ringZ * ringZOffset;
      
      const x = ringLandmark.x * canvas.width;
      const y = ringLandmark.y * canvas.height + ringYOffset + zAdjustedY;

      // Draw ring
      ctx.drawImage(
        image,
        x - ringSize / 2,
        y - ringSize / 2,
        ringSize,
        ringSize
      );
    };

    const drawBracelet = (ctx, canvas) => {
      const landmarks = handLandmarksRef.current;
      if (!landmarks || !Array.isArray(landmarks) || landmarks.length < 21) {
        return;
      }

      // BRACELET LANDMARKS (from guide):
      // 0: Wrist center - PRIMARY ANCHOR POINT
      // 1: Thumb CMC (base of thumb)
      // 17: Pinky MCP (base of pinky)
      // 9: Middle finger MCP (for rotation calculation)
      const wrist = landmarks[0];
      const thumbBase = landmarks[1];
      const pinkyBase = landmarks[17];
      const middleFingerBase = landmarks[9];

      if (!wrist || !thumbBase || !pinkyBase || !middleFingerBase) {
        return;
      }

      const image = imageCacheRef.current[braceletImage];
      if (!image || !image.complete) {
        // Image not loaded yet, wait for it
        return;
      }

      // Calculate wrist width using actual distance (works for any hand orientation)
      const thumbX = thumbBase.x * canvas.width;
      const thumbY = thumbBase.y * canvas.height;
      const pinkyX = pinkyBase.x * canvas.width;
      const pinkyY = pinkyBase.y * canvas.height;
      const wristWidth = Math.sqrt(
        Math.pow(pinkyX - thumbX, 2) + Math.pow(pinkyY - thumbY, 2)
      );
      
      const braceletWidth = wristWidth * braceletWidthMultiplier;
      const braceletHeight = braceletWidth * braceletHeightRatio;

      // Calculate hand rotation angle based on wrist to middle finger direction
      const middleX = middleFingerBase.x * canvas.width;
      const middleY = middleFingerBase.y * canvas.height;
      const wristX = wrist.x * canvas.width;
      const wristY = wrist.y * canvas.height;
      
      // Calculate angle from wrist to middle finger (hand's forward direction)
      const angle = Math.atan2(middleY - wristY, middleX - wristX);
      
      // Adjust angle to be perpendicular to the hand (bracelet wraps around wrist)
      // Convert rotation offset from degrees to radians and add to the angle
      const rotationOffsetRad = (braceletRotationOffset * Math.PI) / 180;
      const braceletAngle = angle + Math.PI / 2 + rotationOffsetRad;

      const x = wristX;
      const y = wristY + braceletYOffset;

      // Save canvas state
      ctx.save();

      // Translate to wrist position and rotate
      ctx.translate(x, y);
      ctx.rotate(braceletAngle);

      // Draw bracelet centered on wrist (now at 0,0 after translate)
      ctx.drawImage(
        image,
        -braceletWidth / 2,
        -braceletHeight / 2,
        braceletWidth,
        braceletHeight
      );

      // Restore canvas state
      ctx.restore();
    };

    const drawEarrings = (ctx, canvas) => {
      const landmarks = faceLandmarksRef.current;
      if (!landmarks || !Array.isArray(landmarks) || landmarks.length < 468) {
        return;
      }

      // EARRING LANDMARKS (from EarringModel.jsx):
      // 132: Left ear (user's left)
      // 361: Right ear (user's right)
      const leftEarLandmark = landmarks[132];
      const rightEarLandmark = landmarks[361];

      const image = imageCacheRef.current[earringImage];
      if (!image || !image.complete) {
        return;
      }

      // Helper function to check if an ear landmark is valid and tracked
      const isEarDetected = (earLandmark) => {
        if (!earLandmark) {
          return false;
        }
        
        // Check if landmark has valid numeric properties
        if (typeof earLandmark.x !== 'number' || 
            typeof earLandmark.y !== 'number' || 
            typeof earLandmark.z !== 'number') {
          return false;
        }
        
        // Check for NaN values
        if (isNaN(earLandmark.x) || 
            isNaN(earLandmark.y) || 
            isNaN(earLandmark.z)) {
          return false;
        }
        
        // Check if coordinates are within valid bounds
        if (earLandmark.x < -0.1 || earLandmark.x > 1.1 ||
            earLandmark.y < -0.1 || earLandmark.y > 1.1) {
          return false;
        }
        
        return true;
      };

      // Check if left ear is detected and tracked
      const isLeftEarDetected = isEarDetected(leftEarLandmark) &&
        leftEarLandmark.z < earringLeftMaxZDepth;

      // Check if right ear is detected and tracked
      const isRightEarDetected = isEarDetected(rightEarLandmark) &&
        rightEarLandmark.z < earringRightMaxZDepth;

      // Calculate face width for sizing (only if at least one ear is detected)
      let faceWidth = 200; // Default size
      if (isLeftEarDetected && isRightEarDetected) {
        faceWidth = Math.abs(rightEarLandmark.x - leftEarLandmark.x) * canvas.width;
      } else if (isLeftEarDetected || isRightEarDetected) {
        // If only one ear is detected, use a reasonable default based on canvas size
        faceWidth = Math.min(canvas.width, canvas.height) * 0.3;
      }

      // Draw left earring only if left ear is detected and tracked
      if (isLeftEarDetected) {
        const x = leftEarLandmark.x * canvas.width + earringLeftOffsetX;
        const y = leftEarLandmark.y * canvas.height + earringLeftOffsetY;
        const earringSize = (faceWidth * 0.15) * earringSizeMultiplier;
        
        ctx.drawImage(
          image,
          x - earringSize / 2,
          y - earringSize / 2,
          earringSize,
          earringSize
        );
      }

      // Draw right earring only if right ear is detected and tracked
      if (isRightEarDetected) {
        const x = rightEarLandmark.x * canvas.width + earringRightOffsetX;
        const y = rightEarLandmark.y * canvas.height + earringRightOffsetY;
        const earringSize = (faceWidth * 0.15) * earringSizeMultiplier;
        
        ctx.drawImage(
          image,
          x - earringSize / 2,
          y - earringSize / 2,
          earringSize,
          earringSize
        );
      }
    };

    const draw = () => {
      // Update canvas size in case video dimensions changed
      updateCanvasSize();

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Handle "all" option - show all supported jewelry types
      if (jewelryType === "all") {
        if (faceLandmarksRef.current) {
          drawNecklace(ctx, canvas);
          drawEarrings(ctx, canvas);
        }
        if (handLandmarksRef.current) {
          drawBracelet(ctx, canvas);
          drawRing(ctx, canvas);
        }
      } else {
        // Show specific jewelry type
        if (jewelryType === "necklace" && faceLandmarksRef.current) {
          drawNecklace(ctx, canvas);
        } else if (jewelryType === "earrings" && faceLandmarksRef.current) {
          drawEarrings(ctx, canvas);
        } else if (jewelryType === "bracelet" && handLandmarksRef.current) {
          drawBracelet(ctx, canvas);
        } else if (jewelryType === "ring" && handLandmarksRef.current) {
          drawRing(ctx, canvas);
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [
    useImageOverlay,
    jewelryType,
    necklaceImage,
    braceletImage,
    ringImage,
    earringImage,
    necklaceWidthMultiplier,
    necklaceHeightRatio,
    necklaceYOffset,
    ringSizeMultiplier,
    ringYOffset,
    ringZOffset,
    braceletWidthMultiplier,
    braceletHeightRatio,
    braceletYOffset,
    braceletRotationOffset,
    earringSizeMultiplier,
    earringLeftOffsetX,
    earringLeftOffsetY,
    earringRightOffsetX,
    earringRightOffsetY,
    earringLeftMaxZDepth,
    earringRightMaxZDepth,
    videoRef,
    videoReady,
  ]);

  if (!useImageOverlay) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 5, // Above video (zIndex: 1) and everything else
        transform: "scaleX(-1)", // Mirror to match video
      }}
    />
  );
};

