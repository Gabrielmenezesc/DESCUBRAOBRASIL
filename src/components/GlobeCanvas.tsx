"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, PointMaterial, Stars } from "@react-three/drei";
import * as THREE from "three";

function BrazilGlobe() {
  const globeRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = clock.getElapsedTime() * 0.05;
      globeRef.current.rotation.x = clock.getElapsedTime() * 0.02;
    }
  });

  const particleCount = 200;
  const positions = useMemo(() => {
    const defaultPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / particleCount);
        const theta = Math.sqrt(particleCount * Math.PI) * phi;
        
        const r = 2.02;
        defaultPositions[i * 3] = r * Math.cos(theta) * Math.sin(phi);
        defaultPositions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
        defaultPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    return defaultPositions;
  }, [particleCount]);

  return (
    <group ref={globeRef}>
      <Sphere args={[2, 64, 64]}>
        <meshStandardMaterial 
          color="#e2e8f0" 
          emissive="#10B981"
          emissiveIntensity={0.2}
          wireframe={true}
          transparent
          opacity={0.15}
        />
      </Sphere>
      
      <Sphere args={[1.98, 32, 32]}>
         <meshBasicMaterial color="#f8fafc" />
      </Sphere>

      <points>
        <bufferGeometry>
          {/* @ts-expect-error: r3f typing discrepancy for args */}
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <PointMaterial
          transparent
          color="#059669"
          size={0.06}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

export default function GlobeCanvas() {
  return (
    <Canvas 
      camera={{ position: [0, 0, 5], fov: 45 }} 
      onCreated={({ gl }) => { gl.setClearColor("transparent"); }}
      onError={() => {
        // Silently handle WebGL errors
        console.warn("WebGL canvas error - falling back to gradient");
      }}
    >
      <ambientLight intensity={1.5} color="#ffffff" />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#10B981" />
      <Stars radius={100} depth={50} count={1000} factor={3} saturation={0} fade speed={1} />
      <BrazilGlobe />
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        autoRotate={true}
        autoRotateSpeed={0.5} 
      />
    </Canvas>
  );
}
