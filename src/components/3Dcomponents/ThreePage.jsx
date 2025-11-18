import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Experience } from "./Experience";
import GuidedOverlay from "./GuidedOverlay";
import ThreeErrorBoundary from "./ThreeErrorBoundary";

export default function ThreePage({ modelPath, onEnvironmentError }) {
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
        {/* Guided overlay instructing rotate/zoom; only show if there's a modelPath */}
        <GuidedOverlay visible={!!modelPath} />
      </div>
    </ThreeErrorBoundary>
  );
}