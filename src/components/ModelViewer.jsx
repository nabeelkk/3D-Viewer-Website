import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import LoadingSpinner from './LoadingSpinner';

function Model({ url, onLoad, autoRotate }) {
  const groupRef = useRef();
  const { scene } = useGLTF(url);

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  useEffect(() => {
    if (scene) onLoad?.();

    return () => {
      scene?.traverse((child) => {
        if (child.isMesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material?.dispose();
          }
        }
      });
    };
  }, [scene, onLoad]);

  return (
    <primitive
      ref={groupRef}
      object={scene}
      scale={1}
      position={[0, 0, 0]}
    />
  );
}

function CanvasLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-60 z-10">
      <LoadingSpinner text="Loading 3D Model..." />
    </div>
  );
}

export default function ModelViewer({
  modelUrl,
  className = '',
  onModelLoad,
  onModelError,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [controlsEnabled, setControlsEnabled] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const canvasRef = useRef();

  const handleModelLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onModelLoad?.();
  };

  const handleModelError = (error) => {
    console.error('⚠️ Model load failed:', error);
    setIsLoading(false);
    setHasError(true);
    onModelError?.(error);
  };

  if (!modelUrl) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-900 rounded-lg ${className}`}
      >
        <div className="text-center text-gray-400">
          <div className="text-6xl mb-4">🎯</div>
          <p>No model selected</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden ${className}`}
    >
      {isLoading && <CanvasLoader />}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900 bg-opacity-50 z-10">
          <div className="text-center text-white">
            <div className="text-4xl mb-2">❌</div>
            <p>Failed to load model</p>
          </div>
        </div>
      )}

      <Canvas
        ref={canvasRef}
        camera={{ position: [8, 8, 8], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <Model
          url={modelUrl}
          autoRotate={autoRotate}
          onLoad={handleModelLoad}
          onError={handleModelError}
        />

        <Environment preset="city" />

        <OrbitControls
          enablePan={controlsEnabled}
          enableZoom={controlsEnabled}
          enableRotate={controlsEnabled}
          maxPolarAngle={Math.PI}
          minDistance={1}
          maxDistance={20}
          target={[0, 0, 0]}
        />
      </Canvas>

      <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white p-3 rounded-lg text-sm space-y-2">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={controlsEnabled}
            onChange={() => setControlsEnabled(!controlsEnabled)}
          />
          <span>Orbit Controls</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={autoRotate}
            onChange={() => setAutoRotate(!autoRotate)}
          />
          <span>Auto Rotate</span>
        </label>
      </div>

      <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-2 rounded text-xs">
        {controlsEnabled ? (
          <>
            <div>🖱️ Drag to rotate</div>
            <div>📌 Scroll to zoom</div>
          </>
        ) : (
          <div>Controls disabled</div>
        )}
      </div>
    </div>
  );
}

useGLTF.preload('/path/to/default/model.glb');
