import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import { Experience } from "./Experience";
import GuidedOverlay from "./GuidedOverlay";
import ThreeErrorBoundary from "./ThreeErrorBoundary";

export default function ThreePage({ modelPath, onEnvironmentError }) {
  const [isValidModel, setIsValidModel] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Validate model URL before rendering
  useEffect(() => {
    if (!modelPath) {
      setIsValidModel(false);
      setIsLoading(false);
      return;
    }

    const validateModel = async () => {
      setIsLoading(true);
      try {
        // Check if it's a full URL (Supabase) or local path
        const isFullUrl = modelPath.startsWith('http://') || modelPath.startsWith('https://');
        
        if (isFullUrl) {
          const response = await fetch(modelPath, { method: 'HEAD' });
          setIsValidModel(response.ok);
        } else {
          const response = await fetch(modelPath, { method: 'HEAD' });
          const contentType = response.headers.get('content-type') || '';
          setIsValidModel(response.ok && !/text\/html/i.test(contentType));
        }
      } catch (error) {
        console.debug('3D model validation failed:', error);
        setIsValidModel(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateModel();
  }, [modelPath]);

  // Show nothing while loading or if no valid model
  if (isLoading) {
    return (
      <div style={{ width: "100%", height: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#888', fontSize: '14px' }}>Loading 3D model...</div>
      </div>
    );
  }

  if (!modelPath || !isValidModel) {
    return (
      <div style={{ width: "100%", height: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#888', fontSize: '14px' }}>3D model unavailable</div>
      </div>
    );
  }

  return (
    <ThreeErrorBoundary onError={onEnvironmentError}>
      <div style={{ width: "100%", height: "100%", position: 'relative' }}>
        <Canvas
          style={{ width: "100%", height: "100%" }}
          gl={{
            antialias: true,
            alpha: true,
            precision: "highp",
            powerPreference: "high-performance",
          }}
          shadows
          camera={{ position: [3, 3, 3], fov: 30 }}
          frameloop="always"
          onCreated={({ gl }) => {
            gl.setClearColor('#0A0A0A', 0);
          }}
        >
          <Suspense fallback={null}>
            <Experience modelPath={modelPath} onEnvironmentError={onEnvironmentError} />
          </Suspense>
        </Canvas>
        <GuidedOverlay visible={true} />
      </div>
    </ThreeErrorBoundary>
  );
}