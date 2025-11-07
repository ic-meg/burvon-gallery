import { useEffect, useRef, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { FACEMESH_TESSELATION, FACEMESH_RIGHT_EYE, FACEMESH_LEFT_EYE, FACEMESH_RIGHT_EYEBROW, FACEMESH_LEFT_EYEBROW, FACEMESH_FACE_OVAL, FACEMESH_LIPS } from "@mediapipe/face_mesh";
import { HAND_CONNECTIONS } from "@mediapipe/hands";
import { useFaceLandmarks } from "../../../contexts/FaceLandmarksContext";
import { useHandLandmarks } from "../../../contexts/HandLandmarksContext";
import { Canvas, extend } from "@react-three/fiber";
import { EarringModel } from "./EarringModel";
import { NecklaceModel } from "./NecklaceModel";
import { BraceletModel } from "./BraceletModel";
import { RingModel } from "./RingModel";
import { ImageJewelryOverlay } from "./ImageJewelryOverlay";
import { TryOnUI } from "./TryOnUI";
import { Environment } from "@react-three/drei";
import { useControls } from "leva";
import * as THREE from "three/webgpu";
import { WebGPURenderer } from "three/webgpu";

export const Webcam = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const faceMeshRef = useRef(null);
  const handsRef = useRef(null);
  const cameraRef = useRef(null);
  const { setFaceLandmarks } = useFaceLandmarks();
  const { setHandLandmarks } = useHandLandmarks();
  const lastFrameTime = useRef(0);
  const isProcessing = useRef(false);
  const lastHandFrameTime = useRef(0);
  const isHandProcessing = useRef(false);

  // Leva controls commented out - using TryOnUI for jewelry selection
  // const { jewelryType, ear, showMesh, showLandmarks, brightness, contrast, saturation, useImageOverlay } = useControls("Overlay Settings", {
  //   jewelryType: { value: "earrings", options: ["earrings", "necklace", "bracelet", "ring", "all"], label: "Jewelry Type" },
  //   ear: { value: "both", options: ["left", "right", "both"], label: "Ear" },
  //   showMesh: { value: false, label: "Show Face Mesh" },
  //   showLandmarks: { value: false, label: "Show Landmarks" },
  //   brightness: { value: 2.0, min: 0.5, max: 2.0, step: 0.1, label: "Brightness" },
  //   contrast: { value: 1.0, min: 0.5, max: 2.0, step: 0.1, label: "Contrast" },
  //   saturation: { value: 0.9, min: 0.0, max: 2.0, step: 0.1, label: "Saturation" },
  //   useImageOverlay: { value: true, label: "Use Image Overlay (instead of 3D)" },
  // });

  // Default values (controlled by TryOnUI)
  const [jewelryType, setJewelryType] = useState("ring");
  const [selectedJewelryImage, setSelectedJewelryImage] = useState("/image/ring_PNG106.png");
  const ear = "both";
  const showMesh = false;
  const showLandmarks = false;
  const brightness = 2.0;
  const contrast = 1.0;
  const saturation = 0.9;
  const useImageOverlay = true;

  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    const onResults = (results) => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Set canvas dimensions to match video
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      // Clear canvas
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw face mesh if detected
      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];

        // Share landmarks with the 3D scene
        setFaceLandmarks(landmarks);

        if (showMesh) {
          // Draw tesselation
          drawConnectors(ctx, landmarks, FACEMESH_TESSELATION, {
            color: "#C0C0C070",
            lineWidth: 1,
          });

          // Draw face oval
          drawConnectors(ctx, landmarks, FACEMESH_FACE_OVAL, {
            color: "#E0E0E0",
            lineWidth: 2,
          });

          // Draw eyes
          drawConnectors(ctx, landmarks, FACEMESH_RIGHT_EYE, {
            color: "#FF3030",
            lineWidth: 2,
          });
          drawConnectors(ctx, landmarks, FACEMESH_LEFT_EYE, {
            color: "#30FF30",
            lineWidth: 2,
          });

          // Draw eyebrows
          drawConnectors(ctx, landmarks, FACEMESH_RIGHT_EYEBROW, {
            color: "#FF3030",
            lineWidth: 2,
          });
          drawConnectors(ctx, landmarks, FACEMESH_LEFT_EYEBROW, {
            color: "#30FF30",
            lineWidth: 2,
          });

          // Draw lips
          drawConnectors(ctx, landmarks, FACEMESH_LIPS, {
            color: "#E0E0E0",
            lineWidth: 2,
          });
        }

        // Draw landmarks separately (can be toggled independently)
        if (showLandmarks) {
          drawLandmarks(ctx, landmarks, {
            color: "#FFD700",
            radius: 1,
          });
        }
      } else {
        // No face detected, clear landmarks
        setFaceLandmarks(null);
      }

      ctx.restore();
    };

    const onHandResults = (results) => {
      // Share hand landmarks with the 3D scene
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        // Use the first detected hand
        setHandLandmarks(results.multiHandLandmarks[0]);
      } else {
        setHandLandmarks(null);
      }
    };

    const initializeHands = async () => {
      // Initialize Hands
      const hands = new Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        },
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
      // Initialize Face Mesh
      const faceMesh = new FaceMesh({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
        },
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      faceMesh.onResults(onResults);
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

    initializeFaceMesh();

    return () => {
      // Stop camera
      if (cameraRef.current) {
        cameraRef.current.stop();
      }

      // Stop webcam tracks
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }

      // Close face mesh
      if (faceMeshRef.current) {
        faceMeshRef.current.close();
      }

      // Close hands
      if (handsRef.current) {
        handsRef.current.close();
      }
    };
  }, [showMesh, showLandmarks, setFaceLandmarks, setHandLandmarks]);

  const handleCapture = () => {
    // Capture screenshot with jewelry overlay
    const video = videoRef.current;
    const overlayCanvas = document.querySelector('canvas[style*="zIndex: 4"]'); // Get the jewelry overlay canvas

    if (video) {
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
      if (overlayCanvas) {
        ctx.drawImage(overlayCanvas, 0, 0, captureCanvas.width, captureCanvas.height);
      }

      // Download the composite image
      captureCanvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `burvon-jewelry-tryon-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }
  };

  const handleRetake = () => {
    // Reset or refresh - can add logic if needed
    console.log("Retake clicked");
  };

  return (
    <TryOnUI
      onJewelrySelect={(jewelry) => {
        console.log("Selected jewelry:", jewelry);
        setSelectedJewelryImage(jewelry.image);
      }}
      onCategoryChange={(category) => {
        // Map category to jewelryType
        const categoryMap = {
          rings: "ring",
          earrings: "earrings",
          bracelets: "bracelet",
          necklaces: "necklace"
        };
        setJewelryType(categoryMap[category] || "ring");

        // Reset selected jewelry image to the first item of the new category
        const defaultImages = {
          rings: "/image/ring_PNG106.png",
          earrings: "/image/Earrings/EspoirImage.png",
          bracelets: "/image/Bracelet/SoleilImage.png",
          necklaces: "/image/Gold-Jewellery-PNG-Picture.png"
        };
        setSelectedJewelryImage(defaultImages[category]);

        console.log("Changed category:", category);
      }}
      currentCategory="rings"
      currentJewelry={0}
      onCapture={handleCapture}
      onRetake={handleRetake}
    >
      {/* Camera and overlay content */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 0,
            filter: `brightness(${brightness}) contrast(${contrast}) saturate(${saturation})`,
            transform: "scaleX(-1)",
          }}
        />
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
            zIndex: 1,
            transform: "scaleX(-1)",
          }}
        />
        <ImageJewelryOverlay
          videoRef={videoRef}
          useImageOverlay={useImageOverlay}
          jewelryType={jewelryType}
          selectedJewelryImage={selectedJewelryImage}
        />
        {!useImageOverlay && (
          <Canvas
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 2,
              transform: "scaleX(-1)",
            }}
            camera={{ position: [0, 0, 1], fov: 50 }}
            gl={(props) => {
              extend(THREE);
              const renderer = new WebGPURenderer({
                ...props,
                powerPreference: "high-performance",
                antialias: true,
                alpha: true,
                stencil: false,
              });
              return renderer.init().then(() => renderer);
            }}
          >
            <Environment
              preset="warehouse"
              background={false}
              environmentIntensity={3.0}
            />
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 5, 5]} intensity={3.0} castShadow />
            <directionalLight position={[-5, 5, 5]} intensity={2.0} />
            <directionalLight position={[0, 5, 0]} intensity={2.0} />
            <pointLight position={[0, 0, 5]} intensity={2.0} />
            {(jewelryType === "earrings" || jewelryType === "all") && (
              <>
                {ear === "left" || ear === "both" ? <EarringModel key="left-ear" ear="left" /> : null}
                {ear === "right" || ear === "both" ? <EarringModel key="right-ear" ear="right" /> : null}
              </>
            )}
            {(jewelryType === "necklace" || jewelryType === "all") && (
              <NecklaceModel key="necklace" />
            )}
            {(jewelryType === "bracelet" || jewelryType === "all") && (
              <BraceletModel key="bracelet" />
            )}
            {(jewelryType === "ring" || jewelryType === "all") && (
              <RingModel key="ring" />
            )}
          </Canvas>
        )}
      </div>
    </TryOnUI>
  );
};
