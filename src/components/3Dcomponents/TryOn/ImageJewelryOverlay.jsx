import { useEffect, useRef } from "react";
import { useFaceLandmarks } from "../../../contexts/FaceLandmarksContext";
import { useHandLandmarks } from "../../../contexts/HandLandmarksContext";
import { useControls } from "leva";

// Finger landmark mapping
// Each finger has MCP (base) and PIP (middle joint) landmarks
const FINGER_LANDMARKS = {
  THUMB: { MCP: 2, PIP: 3 },     // Thumb MCP and IP joint
  INDEX: { MCP: 5, PIP: 6 },     // Index finger MCP and PIP
  MIDDLE: { MCP: 9, PIP: 10 },   // Middle finger MCP and PIP
  RING: { MCP: 13, PIP: 14 },    // Ring finger MCP and PIP
  PINKY: { MCP: 17, PIP: 18 },   // Pinky finger MCP and PIP
};

export const ImageJewelryOverlay = ({ videoRef, canvasRef: externalCanvasRef, useImageOverlay, jewelryType, selectedJewelryImage, videoReady, selectedFinger }) => {
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
  //   ringRotationOffset,
  //   ringAutoRotate,
  //   ringBandWidth,
  //   ringPerspectiveHeight,
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
  //   necklaceWidthMultiplier: { value: 1.0, min: 1.0, max: 3.0, step: 0.1, label: "Necklace Width Multiplier" },
  //   necklaceHeightRatio: { value: 0.80, min: 0.3, max: 0.8, step: 0.05, label: "Necklace Height Ratio" },
  //   necklaceYOffset: { value: 30, min: 0, max: 100, step: 5, label: "Necklace Y Offset (px)" },
  //   ringSizeMultiplier: { value: 2, min: 0.8, max: 2.0, step: 0.1, label: "Ring Size Multiplier" },
  //   ringYOffset: { value: -4, min: -50, max: 50, step: 1, label: "Ring Y Offset (px)" },
  //   ringZOffset: { value: -3, min: -200, max: 200, step: 1, label: "Ring Z Offset (depth adjustment)" },
  //   ringRotationOffset: { value: 0, min: -180, max: 180, step: 1, label: "Ring Rotation Offset (degrees)" },
  //   ringAutoRotate: { value: true, label: "Ring Auto-Rotate with Hand" },
  //   ringBandWidth: { value: 0.55, min: 0.1, max: 1.0, step: 0.05, label: "Ring Band Width (thickness)" },
  //   ringPerspectiveHeight: { value: 0.80, min: 0.1, max: 0.8, step: 0.05, label: "Ring Perspective Height" },
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
const ringImage = jewelryType === "ring" && selectedJewelryImage ? selectedJewelryImage : "/image/Rings/TianaImage.png";
const earringImage = jewelryType === "earrings" && selectedJewelryImage ? selectedJewelryImage : "/image/Earrings/EspoirImage.png";

const necklaceWidthMultiplier = 1.0;
const necklaceHeightRatio = 0.80;
const necklaceYOffset = 60;
const ringSizeMultiplier = 2.0;
const ringYOffset = -4;
const ringZOffset = -3;
const ringRotationOffset = 0;
const ringAutoRotate = true;
const ringBandWidth = 0.55;
const ringPerspectiveHeight = 0.80;
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
// Increased z-depth thresholds for better mobile detection
// Mobile cameras often have less accurate z-depth, so we use a more lenient threshold
const earringLeftMaxZDepth = 0.15; // Increased from 0.08 for better mobile support
const earringRightMaxZDepth = 0.15; // Increased from 0.08 for better mobile support

  // Load images into cache
  useEffect(() => {
    const loadImage = (src) => {
      if (!src) return Promise.resolve(null);
      
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
        img.onerror = (err) => {
          console.error(`[ImageJewelryOverlay] Failed to load image: ${src}`, err);
          reject(err);
        };
        img.src = src;
      });
    };

    // Preload all images, including selectedJewelryImage if it's different
    const imagesToLoad = [necklaceImage, braceletImage, ringImage, earringImage];
    if (selectedJewelryImage && !imagesToLoad.includes(selectedJewelryImage)) {
      imagesToLoad.push(selectedJewelryImage);
    }
    
    imagesToLoad.forEach((src) => {
      if (src) {
        loadImage(src).catch((err) => {
          console.warn(`[ImageJewelryOverlay] Failed to load image: ${src}`, err);
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
    let isActive = true; // Flag to prevent drawing after cleanup
    let lastDrawTime = 0;

    // Detect if user is on mobile device
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    // Android: 50ms = 20fps (more aggressive), iOS: 33ms = 30fps, Desktop: 16ms = ~60fps
     const drawInterval = isMobileDevice ? 66 : 16;

    const updateCanvasSize = () => {
      if (video && video.videoWidth && video.videoHeight) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }
      }
    };

    // Initial size setup
    updateCanvasSize();

    // Update size when video metadata loads
    const handleLoadedMetadata = () => {
      if (isActive) {
        updateCanvasSize();
      }
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

      // Get the current image path (may have changed)
      const currentNecklaceImage = jewelryType === "necklace" && selectedJewelryImage ? selectedJewelryImage : necklaceImage;
      const image = imageCacheRef.current[currentNecklaceImage];
      if (!image || !image.complete) {
        // Image not loaded yet, wait for it
        if (Math.random() < 0.01) {
          console.warn('[ImageJewelryOverlay] Necklace image not loaded:', currentNecklaceImage, 'Cache keys:', Object.keys(imageCacheRef.current));
        }
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

      // Determine which finger to use based on selectedFinger prop
      // Default to MIDDLE if no finger is selected
      const fingerToUse = selectedFinger || "MIDDLE";
      const fingerLandmarks = FINGER_LANDMARKS[fingerToUse];

      if (!fingerLandmarks) {
        console.warn(`[ImageJewelryOverlay] Invalid finger selected: ${fingerToUse}`);
        return;
      }

      // Get the MCP (base) and PIP (middle joint) landmarks for the selected finger
      const fingerMCP = landmarks[fingerLandmarks.MCP];
      const fingerPIP = landmarks[fingerLandmarks.PIP];

      if (!fingerMCP || !fingerPIP) {
        return;
      }

      // Interpolate between MCP and PIP to get a position just above the base
      // 0.2 = 20% from MCP toward PIP (just above the base, where rings are typically worn)
      const interpolationFactor = 0.2;
      const ringLandmark = {
        x: fingerMCP.x + (fingerPIP.x - fingerMCP.x) * interpolationFactor,
        y: fingerMCP.y + (fingerPIP.y - fingerMCP.y) * interpolationFactor,
        z: fingerMCP.z + (fingerPIP.z - fingerMCP.z) * interpolationFactor,
      };

      // Get the current image path (may have changed)
      const currentRingImage = jewelryType === "ring" && selectedJewelryImage ? selectedJewelryImage : ringImage;
      const image = imageCacheRef.current[currentRingImage];
      if (!image || !image.complete) {
        // Image not loaded yet, wait for it
        if (Math.random() < 0.01) {
          console.warn('[ImageJewelryOverlay] Ring image not loaded:', currentRingImage, 'Cache keys:', Object.keys(imageCacheRef.current));
        }
        return;
      }

      // Calculate ring size based on finger width (using actual distance, not just X difference)
      // This ensures consistent size regardless of hand orientation
      // Use Euclidean distance between MCP and PIP joints for sizing
      const mcpX = fingerMCP.x * canvas.width;
      const mcpY = fingerMCP.y * canvas.height;
      const pipX = fingerPIP.x * canvas.width;
      const pipY = fingerPIP.y * canvas.height;
      
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

      // Calculate rotation angle based on hand orientation
      let rotationAngle = 0;
      if (ringAutoRotate) {
        // Calculate angle from MCP to PIP (finger direction)
        const angle = Math.atan2(pipY - mcpY, pipX - mcpX);
        // Convert to degrees and adjust to align ring with finger
        rotationAngle = angle + Math.PI / 2; // Add 90 degrees to align ring perpendicular to finger
      }

      // Add manual rotation offset
      const rotationOffsetRad = (ringRotationOffset * Math.PI) / 180;
      rotationAngle += rotationOffsetRad;

      // Save canvas state
      ctx.save();

      // Translate to ring position and rotate
      ctx.translate(x, y);
      ctx.rotate(rotationAngle);

      // Draw ring with proper wrapping effect
      // Use elliptical shape to simulate 3D perspective
      const ringWidth = ringSize * ringBandWidth;
      const ringHeight = ringSize * ringPerspectiveHeight;

      // --- Draw BACK half of ring (behind the finger) ---
      ctx.save();
      ctx.globalAlpha = 0.65; // Darker for depth

      // Clip to bottom half only
      ctx.beginPath();
      ctx.rect(-ringWidth, 0, ringWidth * 2, ringHeight);
      ctx.clip();

      // Draw ring image compressed vertically for perspective
      ctx.drawImage(
        image,
        -ringWidth,
        -ringHeight / 2,
        ringWidth * 2,
        ringHeight
      );

      ctx.restore();

      // --- Draw FRONT half of ring (in front of the finger) ---
      ctx.save();
      ctx.globalAlpha = 1.0; // Full brightness for front

      // Clip to top half only
      ctx.beginPath();
      ctx.rect(-ringWidth, -ringHeight, ringWidth * 2, ringHeight);
      ctx.clip();

      // Draw ring image compressed vertically for perspective
      ctx.drawImage(
        image,
        -ringWidth,
        -ringHeight / 2,
        ringWidth * 2,
        ringHeight
      );

      ctx.restore();

      // Restore canvas state
      ctx.restore();
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

      // Get the current image path (may have changed)
      const currentBraceletImage = jewelryType === "bracelet" && selectedJewelryImage ? selectedJewelryImage : braceletImage;
      const image = imageCacheRef.current[currentBraceletImage];
      if (!image || !image.complete) {
        // Image not loaded yet, wait for it
        if (Math.random() < 0.01) {
          console.warn('[ImageJewelryOverlay] Bracelet image not loaded:', currentBraceletImage, 'Cache keys:', Object.keys(imageCacheRef.current));
        }
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
      // 132: Left ear (user's left) - primary
      // 361: Right ear (user's right) - primary
      // Fallback landmarks for better mobile detection:
      // 234: Left cheek (can help estimate left ear position)
      // 454: Right cheek (can help estimate right ear position)
      // 10: Left temple area
      // 151: Right temple area
      const leftEarLandmark = landmarks[132];
      const rightEarLandmark = landmarks[361];
      const leftCheek = landmarks[234];
      const rightCheek = landmarks[454];

      // Get the current image path (may have changed)
      const currentEarringImage = jewelryType === "earrings" && selectedJewelryImage ? selectedJewelryImage : earringImage;
      const image = imageCacheRef.current[currentEarringImage];
      if (!image || !image.complete) {
        // Image not loaded yet, wait for it
        if (Math.random() < 0.01) {
          console.warn('[ImageJewelryOverlay] Earring image not loaded:', currentEarringImage, 'Cache keys:', Object.keys(imageCacheRef.current));
        }
        return;
      }

      // Helper function to check if an ear landmark is valid and tracked
      const isEarDetected = (earLandmark, useZDepth = true) => {
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
        
        // Check if coordinates are within valid bounds (more lenient for mobile)
        if (earLandmark.x < -0.15 || earLandmark.x > 1.15 ||
            earLandmark.y < -0.15 || earLandmark.y > 1.15) {
          return false;
        }
        
        // Z-depth check - more lenient on mobile, or skip if z-depth is unreliable
        if (useZDepth) {
          // Only check z-depth if it's a reasonable value
          // On mobile, z-depth might be less accurate, so we're more lenient
          if (earLandmark.z > 0.3) {
            // Z-depth is too far back, likely not visible
            return false;
          }
        }
        
        return true;
      };

      // Check if left ear is detected and tracked
      // First check if the primary ear landmark exists and is valid
      let isLeftEarDetected = false;
      let useLeftFallback = false;
      
      if (leftEarLandmark && isEarDetected(leftEarLandmark, false)) {
        // Primary landmark exists and is valid, check z-depth
        // If z-depth is too high, ear is not visible (turned away) - don't show earring
        if (leftEarLandmark.z < earringLeftMaxZDepth) {
          // Also check relative z-depth - if right ear is much closer, left ear is likely not visible
          if (rightEarLandmark && isEarDetected(rightEarLandmark, false)) {
            const zDiff = leftEarLandmark.z - rightEarLandmark.z;
            // If left ear is significantly further back (z-diff > 0.1), it's likely not visible
            if (zDiff > 0.1) {
              isLeftEarDetected = false; // Don't show left earring
            } else {
              isLeftEarDetected = true;
            }
          } else {
            isLeftEarDetected = true;
          }
        } else if (leftEarLandmark.z < 0.25) {
          // Z-depth is slightly higher but still reasonable - might be mobile z-depth inaccuracy
          // Only use fallback if z-depth is not too high (ear might still be somewhat visible)
          // But don't use fallback if z-depth is very high (ear is definitely not visible)
          if (leftCheek && isEarDetected(leftCheek, false) && leftCheek.z < earringLeftMaxZDepth) {
            // Check relative z-depth before using fallback
            if (rightEarLandmark && isEarDetected(rightEarLandmark, false)) {
              const zDiff = leftEarLandmark.z - rightEarLandmark.z;
              if (zDiff <= 0.1) {
                // Cheek is visible and relative position is okay, use as fallback
                isLeftEarDetected = true;
                useLeftFallback = true;
              }
            } else {
              isLeftEarDetected = true;
              useLeftFallback = true;
            }
          }
        }
        // If z-depth >= 0.25, ear is definitely not visible - don't show earring
      }
      // If primary landmark doesn't exist at all, don't show earring (isLeftEarDetected stays false)

      // Check if right ear is detected and tracked
      let isRightEarDetected = false;
      let useRightFallback = false;
      
      if (rightEarLandmark && isEarDetected(rightEarLandmark, false)) {
        // Primary landmark exists and is valid, check z-depth
        // If z-depth is too high, ear is not visible (turned away) - don't show earring
        if (rightEarLandmark.z < earringRightMaxZDepth) {
          // Also check relative z-depth - if left ear is much closer, right ear is likely not visible
          if (leftEarLandmark && isEarDetected(leftEarLandmark, false)) {
            const zDiff = rightEarLandmark.z - leftEarLandmark.z;
            // If right ear is significantly further back (z-diff > 0.1), it's likely not visible
            if (zDiff > 0.1) {
              isRightEarDetected = false; // Don't show right earring
            } else {
              isRightEarDetected = true;
            }
          } else {
            isRightEarDetected = true;
          }
        } else if (rightEarLandmark.z < 0.25) {
          // Z-depth is slightly higher but still reasonable - might be mobile z-depth inaccuracy
          // Only use fallback if z-depth is not too high (ear might still be somewhat visible)
          // But don't use fallback if z-depth is very high (ear is definitely not visible)
          if (rightCheek && isEarDetected(rightCheek, false) && rightCheek.z < earringRightMaxZDepth) {
            // Check relative z-depth before using fallback
            if (leftEarLandmark && isEarDetected(leftEarLandmark, false)) {
              const zDiff = rightEarLandmark.z - leftEarLandmark.z;
              if (zDiff <= 0.1) {
                // Cheek is visible and relative position is okay, use as fallback
                isRightEarDetected = true;
                useRightFallback = true;
              }
            } else {
              isRightEarDetected = true;
              useRightFallback = true;
            }
          }
        }
        // If z-depth >= 0.25, ear is definitely not visible - don't show earring
      }
      // If primary landmark doesn't exist at all, don't show earring (isRightEarDetected stays false)

      // Calculate face width for sizing (only if at least one ear is detected)
      let faceWidth = 200; // Default size
      if (isLeftEarDetected && isRightEarDetected) {
        // Use the actual landmarks (ear or fallback) for width calculation
        const leftLandmark = useLeftFallback ? leftCheek : leftEarLandmark;
        const rightLandmark = useRightFallback ? rightCheek : rightEarLandmark;
        if (leftLandmark && rightLandmark) {
          faceWidth = Math.abs(rightLandmark.x - leftLandmark.x) * canvas.width;
        }
      } else if (isLeftEarDetected || isRightEarDetected) {
        // If only one ear is detected, use a reasonable default based on canvas size
        faceWidth = Math.min(canvas.width, canvas.height) * 0.3;
      }

      // Draw left earring only if left ear is detected and tracked
      if (isLeftEarDetected) {
        // Use primary ear landmark if available, otherwise use fallback (cheek)
        const landmark = useLeftFallback ? leftCheek : leftEarLandmark;
        
        if (landmark) {
          // Adjust position slightly if using fallback landmark
          const offsetX = useLeftFallback ? earringLeftOffsetX - 15 : earringLeftOffsetX;
          const offsetY = useLeftFallback ? earringLeftOffsetY - 5 : earringLeftOffsetY;
          
          const x = landmark.x * canvas.width + offsetX;
          const y = landmark.y * canvas.height + offsetY;
          const earringSize = (faceWidth * 0.15) * earringSizeMultiplier;
          
          ctx.drawImage(
            image,
            x - earringSize / 2,
            y - earringSize / 2,
            earringSize,
            earringSize
          );
        }
      }

      // Draw right earring only if right ear is detected and tracked
      if (isRightEarDetected) {
        // Use primary ear landmark if available, otherwise use fallback (cheek)
        const landmark = useRightFallback ? rightCheek : rightEarLandmark;
        
        if (landmark) {
          // Adjust position slightly if using fallback landmark
          const offsetX = useRightFallback ? earringRightOffsetX + 15 : earringRightOffsetX;
          const offsetY = useRightFallback ? earringRightOffsetY - 5 : earringRightOffsetY;
          
          const x = landmark.x * canvas.width + offsetX;
          const y = landmark.y * canvas.height + offsetY;
          const earringSize = (faceWidth * 0.15) * earringSizeMultiplier;
          
          ctx.drawImage(
            image,
            x - earringSize / 2,
            y - earringSize / 2,
            earringSize,
            earringSize
          );
        }
      }
    };

    const draw = (currentTime) => {
      // Stop drawing if component has been cleaned up
      if (!isActive || !canvasRef.current || !videoRef?.current) {
        return;
      }

      // Throttle drawing based on device type
      const elapsed = currentTime - lastDrawTime;
      if (elapsed < drawInterval) {
        // Not enough time has passed, skip this frame
        if (isActive) {
          animationFrameId = requestAnimationFrame(draw);
        }
        return;
      }

      // Update last draw time
      lastDrawTime = currentTime;

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
        } else if (jewelryType === "bracelet") {
          if (handLandmarksRef.current) {
            drawBracelet(ctx, canvas);
          } else {
            if (Math.random() < 0.01) {
              console.warn('[ImageJewelryOverlay] Cannot draw bracelet: no hand landmarks');
            }
          }
        } else if (jewelryType === "ring") {
          if (handLandmarksRef.current) {
            drawRing(ctx, canvas);
          } else {
            if (Math.random() < 0.01) {
              console.warn('[ImageJewelryOverlay] Cannot draw ring: no hand landmarks');
            }
          }
        }
      }

      // Only continue animation loop if still active
      if (isActive) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      // Mark as inactive to stop drawing
      isActive = false;
      
      // Cancel any pending animation frame
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      
      // Remove event listener
      if (video) {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      }
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
    ringRotationOffset,
    ringAutoRotate,
    ringBandWidth,
    ringPerspectiveHeight,
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
    selectedFinger,
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

