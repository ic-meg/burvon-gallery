import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Experience } from "./Experience";
import GuidedOverlay from "./GuidedOverlay";
import { ACESFilmicToneMapping } from "three";

export default function ThreePage({ modelPath }) {
  return (
    <div style={{ width: "100%", height: "100%", position: 'relative' }}>
      <Canvas
        style={{ width: "100%", height: "100%" }}
        gl={{ 
          antialias: true,
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1,
          pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
        }}
        shadows
        camera={{ position: [3, 3, 3], fov: 30 }}
        frameloop="always"
      >
        <Suspense fallback={null}>
          <Experience modelPath={modelPath} />
        </Suspense>
      </Canvas>
      {/* Guided overlay instructing rotate/zoom; only show if there's a modelPath */}
      <GuidedOverlay visible={!!modelPath} />
    </div>
  );
}