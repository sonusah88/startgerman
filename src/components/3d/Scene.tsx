'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Float } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// A simple abstract avatar placeholder. 
// In production, this would be a loaded GLTF model using useGLTF.
function AbstractAvatar({ isSpeaking }: { isSpeaking: boolean }) {
  const meshRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Mouse tracking for the entire group
    targetRotation.current.y = (state.pointer.x * Math.PI) / 4;
    targetRotation.current.x = (-state.pointer.y * Math.PI) / 8;

    if (meshRef.current) {
      // Smoothly interpolate rotation towards the mouse target
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotation.current.y, 0.1);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotation.current.x, 0.1);
      
      // Idle float animation
      meshRef.current.position.y = Math.sin(time * 2) * 0.05 + 1;
    }
    
    // Speaking animation on the head
    if (headRef.current) {
      if (isSpeaking) {
        headRef.current.scale.y = 1 + Math.sin(time * 15) * 0.1;
      } else {
        headRef.current.scale.y = THREE.MathUtils.lerp(headRef.current.scale.y, 1, 0.1);
      }
    }
  });

  return (
    <group ref={meshRef}>
      {/* Body */}
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[0.5, 0.4, 1.5, 32]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          roughness={0.2} 
          metalness={0.8}
          envMapIntensity={1.5}
        />
      </mesh>
      
      {/* Head */}
      <mesh ref={headRef} position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial 
          color="#fcd5ce" 
          roughness={0.3} 
          metalness={0.2}
          emissive="#fcd5ce"
          emissiveIntensity={isSpeaking ? 0.2 : 0}
        />
      </mesh>

      {/* Floating abstract accent (Halo/Brain) */}
      <Float speed={5} rotationIntensity={2} floatIntensity={2}>
        <mesh position={[0, 1.3, 0]}>
          <torusGeometry args={[0.3, 0.02, 16, 100]} />
          <meshStandardMaterial 
            color="#f59e0b" 
            emissive="#f59e0b" 
            emissiveIntensity={isSpeaking ? 2 : 0.5} 
            toneMapped={false} 
          />
        </mesh>
      </Float>
    </group>
  );
}

export function TutorScene({ isSpeaking = false }: { isSpeaking?: boolean }) {
  return (
    <div className="w-full h-full min-h-[400px] relative rounded-2xl overflow-hidden glass border border-white/5">
      <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          {/* Cinematic dual lighting */}
          <directionalLight position={[5, 5, 5]} intensity={2} color="#f59e0b" castShadow />
          <directionalLight position={[-5, 5, -5]} intensity={1} color="#3b82f6" />
          
          <Environment preset="studio" />
          
          <AbstractAvatar isSpeaking={isSpeaking} />
          
          <ContactShadows position={[0, -0.2, 0]} opacity={0.7} scale={10} blur={2.5} far={4} color="#000000" />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
