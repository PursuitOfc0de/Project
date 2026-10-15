import {Canvas,useFrame,useThree,} from "@react-three/fiber";
import * as THREE from "three";
import { useRef, useEffect, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger);

/* =========================
   REALISTIC PROCEDURAL MOUNTAIN
========================= */

function Mountain({ position, scale = 1 }) {
  const ref = useRef();

  const geometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(
      2.8,
      5.4,
      48,
      32
    );

    const pos = geo.attributes.position;
    const colors = [];

    const rock = new THREE.Color("#26302f");
    const rockLight = new THREE.Color("#555b59");
    const snow = new THREE.Color("#c9d1d5");

    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      const angle = Math.atan2(z, x);

      const ridge =
        Math.sin(angle * 5.0) * 0.16 +
        Math.sin(angle * 9.0 + 1.2) * 0.09 +
        Math.sin(angle * 17.0) * 0.035;

      const heightFactor = THREE.MathUtils.clamp(
        (y + 2.7) / 5.4,
        0,
        1
      );

      const displacement =
        ridge * (0.4 + heightFactor);

      const radialScale =
        1 + displacement * 0.55;

      x *= radialScale;
      z *= radialScale;

      y +=
        Math.sin(x * 3.1 + z * 2.0) *
        Math.sin(z * 2.7) *
        0.045;

      pos.setXYZ(i, x, y, z);

      const normalizedHeight = (y + 2.7) / 5.4;

      const rockVariation =
        Math.sin(x * 4.0 + z * 3.0) * 0.5 + 0.5;

      const baseColor = rock.clone().lerp(
        rockLight,
        rockVariation * 0.55
      );

      const snowLine =
        0.69 +
        Math.sin(angle * 4.0) * 0.035 +
        Math.sin(angle * 11.0) * 0.018;

      if (normalizedHeight > snowLine) {
        const snowAmount = THREE.MathUtils.smoothstep(
          normalizedHeight,
          snowLine,
          snowLine + 0.09
        );

        baseColor.lerp(snow, snowAmount);
      }

      colors.push(baseColor.r, baseColor.g, baseColor.b);
    }

    geo.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );

    geo.computeVertexNormals();

    return geo;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;

    ref.current.rotation.y =
      Math.sin(state.clock.elapsedTime * 0.08) * 0.008;
  });

  return (
    <group
      ref={ref}
      position={position}
      scale={scale}
    >
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          vertexColors
          roughness={0.96}
          metalness={0.02}
          flatShading={false}
        />
      </mesh>
    </group>
  );
}

/* =========================
   UNEVEN FOREST TERRAIN
========================= */

function Ground() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(
      60,
      60,
      100,
      100
    );

    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);

      const hills =
        Math.sin(x * 0.32) * 0.12 +
        Math.cos(y * 0.27) * 0.10 +
        Math.sin((x + y) * 0.18) * 0.08;

      pos.setZ(i, hills);
    }

    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -2, 0]}
      receiveShadow
    >
      <meshStandardMaterial
        color="#101b19"
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}

/* =========================
   TREE
========================= */

function Tree({ position, scale = 1 }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;

    ref.current.rotation.y =
      Math.sin(state.clock.elapsedTime * 0.3 + position[0]) * 0.015;
  });

  return (
    <group
      ref={ref}
      position={position}
      scale={scale}
    >
      {/* Trunk */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.12, 0.18, 1.6, 6]} />
        <meshStandardMaterial
          color="#3b2920"
          roughness={1}
        />
      </mesh>

      {/* Bottom foliage */}
      <mesh position={[0, 1.7, 0]}>
        <coneGeometry args={[1.05, 2.1,12,5]} />
        <meshStandardMaterial
          color="#10251f"
          roughness={1}
        />
      </mesh>

      {/* Middle foliage */}
      <mesh position={[0, 2.35, 0]}>
        <coneGeometry args={[0.78,1.65, 12, 5]} />
        <meshStandardMaterial
          color="#17352a"
          roughness={1}
        />
      </mesh>

      {/* Top foliage */}
      <mesh position={[0, 2.9, 0]}>
        <coneGeometry args={[0.5, 1.35,12,5]} />
        <meshStandardMaterial
          color="#204333"
          roughness={1}
        />
      </mesh>
    </group>
  );
}
        

function Forest({ count = 30 }) {
  const trees = useMemo(() => {
    const generatedTrees = [];

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 18;
      const z = Math.random() * 8 - 4;

      // Background trees smaller,
      // foreground trees larger
      const depthScale =
        z < -1
          ? 0.45 + Math.random() * 0.4
          : 0.7 + Math.random() * 0.8;

      generatedTrees.push({
        x,
        z,
        scale: depthScale,
      });
    }

    return generatedTrees;
  }, [count]);

  return (
    <group>
      {trees.map((tree, index) => (
        <Tree
          key={index}
          position={[tree.x, -1.5, tree.z]}
          scale={tree.scale}
        />
      ))}
    </group>
  );
}

/* =========================
   MOON
========================= */

function Moon() {
  const ref = useRef();

  useFrame((state) => {
    ref.current.position.y =
      4.5 +
      Math.sin(
        state.clock.elapsedTime * 0.2
      ) * 0.15;
  });

  return (
    <mesh
      ref={ref}
      position={[4, 4.5, -8]}
    >
      <sphereGeometry
        args={[0.7, 32, 32]}
      />

      <meshStandardMaterial
          color="#eef4ff"
          emissive="#b9d4ff"
          emissiveIntensity={0.8}
      />
    </mesh>
  );
}

/* =========================
   STARS
========================= */

function Stars() {
  const stars = useRef();

  const positions = [];

  for (let i = 0; i < 250; i++) {
    positions.push(
      (Math.random() - 0.5) * 25,
      Math.random() * 10,
      -Math.random() * 15
    );
  }

  useFrame((state) => {
    stars.current.rotation.y =
      state.clock.elapsedTime * 0.01;
  });

  return (
    <points ref={stars}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={new Float32Array(positions)}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        size={0.035}
        color="#ffffff"
        transparent
        opacity={0.8}
      />
    </points>
  );
}

/* =========================
   PARALLAX GROUP
========================= */

function ParallaxGroup({
  children,
  factor = 1,
}) {
  const ref = useRef();

  const mouse = useRef({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event) => {
      mouse.current.x =
        (event.clientX / window.innerWidth) * 2 - 1;

      mouse.current.y =
        -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );
    };
  }, []);

  useFrame(() => {
    if (!ref.current) return;

    const targetX =
      mouse.current.x * factor * 0.45;

    const targetY =
      mouse.current.y * factor * 0.25;

    ref.current.position.x =
      THREE.MathUtils.lerp(
        ref.current.position.x,
        targetX,
        0.035
      );

    ref.current.position.y =
      THREE.MathUtils.lerp(
        ref.current.position.y,
        targetY,
        0.035
      );
  });

  return (
    <group ref={ref}>
      {children}
    </group>
  );
}
/* =========================
   CAMERA CONTROLLER
========================= */

function CameraController() {
  const cameraGroup = useRef();

  const mouse = useRef({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event) => {
      mouse.current.x =
        (event.clientX /
          window.innerWidth) *
          2 -
        1;

      mouse.current.y =
        -(event.clientY /
          window.innerHeight) *
          2 +
        1;
    };

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    const ctx = gsap.context(() => {
      gsap.to(cameraGroup.current.position, {
        z: 1.5,
        y: 2.8,

        scrollTrigger: {
          trigger: ".about",
          start: "top bottom",
          end: "top center",
          scrub: 1,
        },
      });

      gsap.to(cameraGroup.current.position, {
        z: -2,
        y: 3.2,

        scrollTrigger: {
          trigger: ".projects",
          start: "top bottom",
          end: "top center",
          scrub: 1,
        },
      });

      gsap.to(cameraGroup.current.position, {
        z: -5,
        y: 3.8,

        scrollTrigger: {
          trigger: ".contact",
          start: "top bottom",
          end: "top center",
          scrub: 1,
        },
      });
    });

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      ctx.revert();
    };
  }, []);

  useFrame((state) => {
    const targetX =
      mouse.current.x * 0.25;

    const targetY =
      cameraGroup.current.position.y +
      mouse.current.y * 0.15;

    state.camera.position.x =
      THREE.MathUtils.lerp(
        state.camera.position.x,
        targetX,
        0.04
      );

    state.camera.position.y =
      THREE.MathUtils.lerp(
        state.camera.position.y,
        targetY,
        0.04
      );

    state.camera.position.z =
      THREE.MathUtils.lerp(
        state.camera.position.z,
        cameraGroup.current.position.z,
        0.04
      );

    state.camera.lookAt(
      0,
      0,
      -3
    );
  });

  return (
    <group ref={cameraGroup} />
  );
}

function DynamicMoonLight() {
  const lightRef = useRef();

  const mouse = useRef({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event) => {
      mouse.current.x =
        (event.clientX / window.innerWidth) * 2 - 1;

      mouse.current.y =
        -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );
    };
  }, []);

  useFrame(() => {
    if (!lightRef.current) return;

    const targetX =
      4 + mouse.current.x * 2;

    const targetY =
      5 + mouse.current.y * 1.5;

    lightRef.current.position.x =
      THREE.MathUtils.lerp(
        lightRef.current.position.x,
        targetX,
        0.03
      );

    lightRef.current.position.y =
      THREE.MathUtils.lerp(
        lightRef.current.position.y,
        targetY,
        0.03
      );
  });

  return (
    <pointLight
      ref={lightRef}
      position={[4, 5, -6]}
      intensity={5}
      distance={18}
      color="#dce7ff"
    />
  );
}

/* =========================
   SCENE CONTENT
========================= */

function SceneContent() {
  return (
    <>
      {/* Background */}

<color
  attach="background"
  args={["#030807"]}
/>

<fog
  attach="fog"
  args={["#101522", 7, 30]}
/>

<ambientLight
  intensity={0.28}
  color="#9bb7b0"
/>

<directionalLight
  position={[-5, 8, 3]}
  intensity={1}
  color="#b7d4ff"
/>

<DynamicMoonLight/>

      {/* Ground */}

      <Ground />

      <ParallaxGroup factor={0.15}>
  <Mountain
    position={[0, 0, -5]}
    scale={2}
  />

  <Mountain
    position={[-5, -0.5, -7]}
    scale={1.5}
  />

  <Mountain
    position={[5, -0.5, -8]}
    scale={1.7}
  />

  <Mountain
    position={[-9, -1, -10]}
    scale={1.3}
  />

  <Mountain
    position={[9, -1, -11]}
    scale={1.4}
  />
</ParallaxGroup>


      <ParallaxGroup factor={0.4}>
            <Forest count={35} />
      </ParallaxGroup>

      {/* =====================
          FOREGROUND FOREST
      ===================== */}

      <ParallaxGroup factor={0.8}>
        <Forest count={15} />
      </ParallaxGroup>

      <ParallaxGroup factor={0.05}>
        <Moon />
      </ParallaxGroup>

      <ParallaxGroup factor={0.08}>
        <Stars />
      </ParallaxGroup>

      <CameraController />
    </>
  );
}

/* =========================
   MAIN SCENE
========================= */

export default function Scene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{
        antialias: false,
        powerPreference: "high-performance",
        alpha: false,
      }}
      camera={{
        position: [0, 2, 8],
        fov: 58,
      }}
    >
      <SceneContent />
    </Canvas>
  );
}
