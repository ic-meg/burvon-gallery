import { OrbitControls, Environment, Gltf } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { degToRad } from "three/src/math/MathUtils.js";
import * as THREE from "three";
// import { useControls } from "leva";

export const Experience = ({ modelPath, onEnvironmentError }) => {
  const blobCacheRef = useRef(new Map());
  const [blobUrl, setBlobUrl] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [envError, setEnvError] = useState(false);
  const effectiveModelPath = blobUrl || null;

  
  const isPairModel = modelPath?.toLowerCase().includes('/earrings/') ||
                       modelPath?.toLowerCase().includes('earring');

  const isBracelet = modelPath?.toLowerCase().includes('/bracelets/') ||
                     modelPath?.toLowerCase().includes('bracelet');

  // Default values for earring spacing
  const earringGapX = 2.0;
  const earringOffsetZ = 1.0;
  const cameraDistance = isPairModel ? 5.0 : 2.5;

  // Leva controls for earring spacing (commented out)
  // const { earringGapX, earringOffsetZ } = useControls('Earring Spacing', {
  //   earringGapX: { value: 2.0, min: 0, max: 2, step: 0.05, label: 'Left-Right Gap (X)' },
  //   earringOffsetZ: { value: 1.0, min: -1, max: 1, step: 0.05, label: 'Front-Back Offset (Z)' }
  // });

  // Leva controls for camera (commented out)
  // const { cameraDistance } = useControls('Camera', {
  //   cameraDistance: { value: 5.0, min: 1, max: 15, step: 0.1, label: 'Distance Multiplier' }
  // });

  useEffect(() => {
    let cancelled = false;
    if (!modelPath) {
      setBlobUrl(null);
      setFetching(false);
      return;
    }

    if (blobCacheRef.current.has(modelPath)) {
      setBlobUrl(blobCacheRef.current.get(modelPath));
      setFetching(false);
      return;
    }

    const probeAndFetch = async () => {
      setFetching(true);
      try {
        // Try HEAD first to avoid downloading the whole GLB
        const head = await fetch(modelPath, { method: "HEAD" });
        const ctHead = head.headers.get("content-type") || "";
        if (head.ok && /text\/html/i.test(ctHead)) {
          console.warn(
            "Model HEAD returned HTML, rejecting:",
            modelPath,
            ctHead,
            head.status
          );
        } else if (head.ok) {
          // likely binary — fetch blob
          const get = await fetch(modelPath, { method: "GET" });
          const ct = get.headers.get("content-type") || "";
          if (get.ok && !/text\/html/i.test(ct)) {
            const blob = await get.blob();
            const objectUrl = URL.createObjectURL(blob);
            if (!cancelled) {
              blobCacheRef.current.set(modelPath, objectUrl);
              setBlobUrl(objectUrl);
              setFetching(false);
            }
            return;
          }
        }
      } catch (err) {
        // HEAD might be blocked — try GET directly
        try {
          const get2 = await fetch(modelPath, { method: "GET" });
          const ct2 = get2.headers.get("content-type") || "";
          if (get2.ok && !/text\/html/i.test(ct2)) {
            const blob = await get2.blob();
            const objectUrl = URL.createObjectURL(blob);
            if (!cancelled) {
              blobCacheRef.current.set(modelPath, objectUrl);
              setBlobUrl(objectUrl);
              setFetching(false);
            }
            return;
          } else {
            console.warn(
              "Model GET returned HTML or non-binary, rejecting:",
              modelPath,
              ct2,
              get2.status
            );
          }
        } catch (_e) {
          console.warn("Model fetch failed:", modelPath, _e);
        }
      }

      if (!cancelled) {
        setBlobUrl(null);
        setFetching(false);
      }
    };

    probeAndFetch();

    return () => {
      cancelled = true;
    };
  }, [modelPath]);

  const modelRef = useRef();
  const controlsRef = useRef();
  const rightRef = useRef();
  const leftRef = useRef();

  const { camera, scene } = useThree();

  useLayoutEffect(() => {
    let mounted = true;

    const trySetup = () => {
      if (!mounted) return;
      if (!controlsRef.current || !modelRef.current) {
        requestAnimationFrame(trySetup);
        return;
      }

      try {
        if (modelRef.current) modelRef.current.updateWorldMatrix(true, true);

        const box = new THREE.Box3().setFromObject(modelRef.current);
        const center = new THREE.Vector3();
        box.getCenter(center);

        // Move group so its bottom sits on the ground (y=0)
        const minY = box.min.y || 0;
        if (modelRef.current) modelRef.current.position.y += -minY;

        const shiftedBox = new THREE.Box3().setFromObject(modelRef.current);
        shiftedBox.getCenter(center);
        const size = new THREE.Vector3();
        shiftedBox.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z, 0.001);
        const fitDistance = Math.max(1.5, maxDim * cameraDistance);

        camera.position.set(
          center.x + fitDistance,
          center.y + fitDistance * 0.6,
          center.z + fitDistance
        );

        if (controlsRef.current) {
          controlsRef.current.target.copy(center);
          controlsRef.current.update();
        }

        if (isPairModel) {
          if (rightRef.current) {
            rightRef.current.position.set(-earringGapX, 0, -earringOffsetZ);
          }
          if (leftRef.current) {
            leftRef.current.position.set(earringGapX, 0, earringOffsetZ);
          }
        }

        const applyReflectiveToLowest = (group, makeDoubleSide) => {
          if (!group) return;
          let lowestMesh = null;
          let lowestY = Infinity;
          group.updateWorldMatrix(true, true);
          group.traverse((obj) => {
            if (obj.isMesh) {
              const pos = new THREE.Vector3();
              obj.getWorldPosition(pos);
              if (pos.y < lowestY) {
                lowestY = pos.y;
                lowestMesh = obj;
              }
            }
          });
          if (!lowestMesh) return;
          let mat = lowestMesh.material;
          if (mat && mat.clone) mat = mat.clone();

          const envIntensity = isBracelet ? 1.2 : 2.5;
          const roughness = isBracelet ? 0.15 : 0.1;

          if (
            mat &&
            (mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial)
          ) {
            mat.envMap = scene.environment;
            mat.envMapIntensity = envIntensity;
            mat.roughness = roughness;
            mat.metalness = 0.9;
            mat.clearcoat = 1;
            mat.clearcoatRoughness = 0.05;
            if (makeDoubleSide) mat.side = THREE.DoubleSide;
            mat.needsUpdate = true;
            lowestMesh.material = mat;
          } else if (mat) {
            lowestMesh.material = new THREE.MeshPhysicalMaterial({
              map: mat.map,
              color: mat.color ? mat.color.clone() : new THREE.Color(0xffffff),
              envMap: scene.environment,
              envMapIntensity: envIntensity,
              roughness: roughness,
              metalness: 0.9,
              clearcoat: 1,
              clearcoatRoughness: 0.05,
              side: makeDoubleSide ? THREE.DoubleSide : THREE.FrontSide,
            });
          }
        };

        if (!isPairModel) {
          applyReflectiveToLowest(rightRef.current, false);
        }
      } catch (err) {
        requestAnimationFrame(trySetup);
      }
    };

    trySetup();

    return () => {
      mounted = false;
    };
  }, [effectiveModelPath, camera, scene, isPairModel, earringGapX, earringOffsetZ, cameraDistance]);

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.12}
        maxDistance={30}
        minDistance={1}
        minPolarAngle={0}
        maxPolarAngle={degToRad(80)}
      />

      {/* Primary environment with fallback */}
      {!envError ? (
        <Environment
          preset="warehouse"
          files="/hdri/Jewel-hdri-diamond-set1-3.hdr"
          background
          blur={0.2}
          onError={(error) => {
            console.warn("Warehouse preset failed, switching to fallback HDRIs:", error);
            setEnvError(true);
            if (onEnvironmentError) {
              onEnvironmentError(error);
            }
          }}
        />
      ) : (
        // Fallback HDRIs when warehouse preset fails
        <Environment
          files="/hdri/Jewel-hdri-diamond-set1-3.hdr"
          background
          blur={0.2}
        />
      )}
      {isBracelet && (
        <Environment files="/hdri/Contrast-Black-Jewelry-HDRI-Vol2.hdr" background={false} />
      )}
      <group
        ref={modelRef}
        onPointerOver={() => (document.body.style.cursor = "grab")}
        onPointerOut={() => (document.body.style.cursor = "default")}
        onPointerDown={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "grabbing";
        }}
        onPointerUp={() => (document.body.style.cursor = "grab")}
      >
        {effectiveModelPath ? (
          isPairModel ? (
            // Render pair for earrings
            <>
              <group name="earring-right" ref={rightRef} position={[-earringGapX, 0, -earringOffsetZ]}>
                <Gltf
                  src={effectiveModelPath}
                  position-y={0}
                  scale={0.5}
                  castShadow
                />
              </group>
              <group
                name="earring-left"
                ref={leftRef}
                position={[earringGapX, 0, earringOffsetZ]}
                rotation={[0, Math.PI, 0]}
              >
                <Gltf
                  src={effectiveModelPath}
                  position-y={0}
                  scale={0.5}
                  castShadow
                />
              </group>
            </>
          ) : (
            // Render single model for bracelets, necklaces, rings
            <group name="single-model" ref={rightRef} position={[0, 0, 0]}>
              <Gltf
                src={effectiveModelPath}
                position-y={0}
                scale={0.5}
                castShadow
              />
            </group>
          )
        ) : fetching ?
        null : (
          // harmless fallback if no model path is provided after probing
          <mesh position-y={0}>
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshStandardMaterial color="#888" />
          </mesh>
        )}
      </group>

      <mesh
        position-y={-0.001}
        rotation-x={-Math.PI * 0.5}
        scale={50}
        receiveShadow
      >
        <planeGeometry />
        <shadowMaterial transparent opacity={0.15} />
      </mesh>

      <ambientLight intensity={0.5} />
      <hemisphereLight
        skyColor={0xddeeff}
        groundColor={0x444455}
        intensity={8}
      />
      <directionalLight
        castShadow
        position={[3, 10, 4]}
        intensity={1.5}
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
        shadow-bias={-0.00005}
        shadow-normalBias={0.02}
      />
    </>
  );
};
