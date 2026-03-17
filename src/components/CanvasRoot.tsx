"use client"

import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import { Preload } from "@react-three/drei"
import * as THREE from "three"
import SceneManager from "./SceneManager"
import CameraRig from "./CameraRig"
import PostFX from "./PostFX"

export default function CanvasRoot() {
  return (
    <Canvas
      camera={{ position: [8, 6, 8], fov: 50, near: 0.1, far: 200 }}
      shadows
      dpr={[1, 1.5]}
      gl={{
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
        outputColorSpace: THREE.SRGBColorSpace,
        antialias: true,
        powerPreference: "high-performance",
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Suspense fallback={null}>
        <SceneManager />
        <CameraRig />
        <PostFX />
        <Preload all />
      </Suspense>
    </Canvas>
  )
}