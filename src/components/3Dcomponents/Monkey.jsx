import { Gltf } from "@react-three/drei";
import { forwardRef } from "react";


export const Monkey = forwardRef(({ src, ...props }, ref) => {
  if (!src) return null;
  return (
    <group ref={ref} {...props}>
      <Gltf position-y={0} scale={0.5} src={src} castShadow />
    </group>
  );
});
