
import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

function AvatarModel() {
  const groupRef = useRef();

  // Load the GLB model
  const gltf = useLoader(GLTFLoader, "/models/Avatar.glb");

  // Normalize the model size and position
  const model = useMemo(() => {
    const clone = gltf.scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const maxDimension = Math.max(size.x, size.y, size.z) || 1;
    const scale = 3 / maxDimension;

    clone.scale.setScalar(scale);
    clone.position.set(
      -center.x * scale,
      -box.min.y * scale,
      -center.z * scale
    );

    return clone;
  }, [gltf]);

  // Smooth mouse-following rotation
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      state.pointer.x * 0.35,
      3,
      delta
    );

    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      -state.pointer.y * 0.06,
      3,
      delta
    );
  });

    return (
      <group ref={groupRef} position={[0, -1.5, 0]}>
        <primitive object={model} />
      </group>
    );
}

export default function AboutAvatar({ onClick }) {
  function handlePointerMove(event) {
  const rect = event.currentTarget.getBoundingClientRect();

  event.currentTarget.style.setProperty(
    "--mouse-x",
    `${event.clientX - rect.left}px`
  );

  event.currentTarget.style.setProperty(
    "--mouse-y",
    `${event.clientY - rect.top}px`
  );
}
  return (
    
    <div className="about-avatar" onPointerMove={handlePointerMove} onClick={onClick}
        role="button"
       tabIndex={0}
    aria-label="Open certifications page"
      title="Click to view certifications"
      onKeyDown={(event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick?.();
    }
  }}>
      <Canvas
        camera={{ position: [0, 1.5, 5], fov: 35 }}
        dpr={[1, 1.25]}
        gl={{ antialias: false, alpha: true }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight
          position={[3, 5, 4]}
          intensity={2}
          color="#e0d7ff"
        />
        <pointLight
          position={[-3, 2, -2]}
          intensity={1.5}
          color="#9270ff"
        />

        <Suspense fallback={null}>
          <AvatarModel />
        </Suspense>
      </Canvas>
      <div className="avatar-click-hint" aria-hidden="true">
        <span className="hint-spark">✦</span>
        <span>Explore My Certifications</span>
        <span className="hint-arrow">↗</span>
     </div>
    </div>
  );
}
