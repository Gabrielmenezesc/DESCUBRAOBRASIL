"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, PointMaterial, Stars } from "@react-three/drei";
import * as THREE from "three";

function BrazilGlobe() {
  const globeRef = useRef<THREE.Mesh>(null);
  
  // Rotate globe slowly
  useFrame(({ clock }) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = clock.getElapsedTime() * 0.05;
      globeRef.current.rotation.x = clock.getElapsedTime() * 0.02;
    }
  });

  // Create random particles on the sphere surface to represent glowing cities/connections
  const particleCount = 200;
  const positions = useMemo(() => {
    const defaultPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        // Distribute points on a sphere
        const phi = Math.acos(-1 + (2 * i) / particleCount);
        const theta = Math.sqrt(particleCount * Math.PI) * phi;
        
        const r = 2.02; // Slightly larger than globe radius (2.0)
        defaultPositions[i * 3] = r * Math.cos(theta) * Math.sin(phi);
        defaultPositions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
        defaultPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    return defaultPositions;
  }, [particleCount]);

  return (
    <group ref={globeRef}>
      {/* The Core Globe - Light mode wireframe */}
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
      
      {/* Inner solid sphere - very light slate */}
      <Sphere args={[1.98, 32, 32]}>
         <meshBasicMaterial color="#f8fafc" />
      </Sphere>

      {/* Glowing City Nodes */}
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

export default function Globe() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
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
      {/* Gradient overlay to blend with background seamlessly */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background pointer-events-none" />
    </div>
  );
}
