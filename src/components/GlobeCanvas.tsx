"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, PointMaterial, Stars } from "@react-three/drei";
import * as THREE from "three";

function latLngToVector3(lat: number, lng: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.sin(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.cos(theta);

  return [x, y, z];
}

const HOTSPOTS = [
  { name: "Rio de Janeiro", lat: -22.9068, lng: -43.1729, color: "#3b82f6" },
  { name: "Salvador", lat: -12.9714, lng: -38.5108, color: "#f59e0b" },
  { name: "Manaus", lat: -3.1190, lng: -60.0217, color: "#10b981" },
  { name: "Brasília", lat: -15.7801, lng: -47.9292, color: "#a855f7" },
  { name: "Porto Alegre", lat: -30.0346, lng: -51.2177, color: "#ef4444" }
];

function BrazilGlobe() {
  const globeRef = useRef<THREE.Mesh>(null);
  const [hoveredSpot, setHoveredSpot] = useState<string | null>(null);
  
  useFrame(({ clock }) => {
    if (globeRef.current) {
      // Rotate slowly
      globeRef.current.rotation.y = clock.getElapsedTime() * 0.04;
    }
  });

  const particleCount = 250;
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
      {/* Outer Glow Sphere */}
      <Sphere args={[2, 64, 64]}>
        <meshStandardMaterial 
          color="#0f172a" 
          emissive="#10B981"
          emissiveIntensity={0.25}
          wireframe={true}
          transparent
          opacity={0.18}
        />
      </Sphere>
      
      {/* Inner solid sphere */}
      <Sphere args={[1.98, 32, 32]}>
         <meshBasicMaterial color="#050811" />
      </Sphere>

      {/* Point clouds / Star map of Brazil */}
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
          color="#10B981"
          size={0.065}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </points>

      {/* 3D Hotspot pins on the Globe */}
      {HOTSPOTS.map((spot, idx) => {
        const pos = latLngToVector3(spot.lat, spot.lng, 2.02);
        const isHovered = hoveredSpot === spot.name;
        
        return (
          <mesh 
            key={idx} 
            position={pos}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredSpot(spot.name);
            }}
            onPointerOut={() => setHoveredSpot(null)}
            onClick={() => alert(`Explorar região de ${spot.name}!`)}
          >
            <sphereGeometry args={[isHovered ? 0.08 : 0.05, 16, 16]} />
            <meshBasicMaterial color={spot.color} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function GlobeCanvas() {
  return (
    <div className="w-full h-full relative">
      <Canvas 
        camera={{ position: [0, 0, 4.5], fov: 45 }} 
        onCreated={({ gl }) => { gl.setClearColor("transparent"); }}
        onError={() => {
          console.warn("WebGL canvas error - falling back to gradient");
        }}
        className="w-full h-full"
      >
        <ambientLight intensity={1.5} color="#ffffff" />
        <pointLight position={[10, 10, 10]} intensity={0.6} color="#10B981" />
        <Stars radius={100} depth={50} count={600} factor={4} saturation={0} fade speed={1.2} />
        <BrazilGlobe />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={0.4} 
        />
      </Canvas>
    </div>
  );
}
