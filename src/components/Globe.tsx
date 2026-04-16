"use client";

import { useRef, useMemo, useState, useEffect } from "react";
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

export default function Globe() {
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setWebglSupported(false);
    } catch {
      setWebglSupported(false);
    }
  }, []);

  // Fallback bonito para dispositivos sem WebGL
  if (!webglSupported) {
    return (
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-blue-50 to-slate-100" />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "radial-gradient(circle at 30% 50%, rgba(16,185,129,0.2) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(59,130,246,0.15) 0%, transparent 50%)"
        }} />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} onCreated={({ gl }) => { gl.setClearColor("transparent"); }}>
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
