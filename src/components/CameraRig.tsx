"use client"

import { useRef, useEffect, useCallback } from "react"
import { useThree, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"
import gsap from "gsap"
import { useSceneStore } from "@/state/sceneStore"
import type { OrbitControls as OrbitControlsType } from "three-stdlib"

const SCENE_CAMERAS: Record<string, { position: [number, number, number]; target: [number, number, number] }> = {
  LANDING: { position: [8, 6, 8], target: [0, 2, 0] },
  MAP: { position: [12, 10, 12], target: [0, 0, 0] },
  AURA: { position: [6, 4, 6], target: [0, 1, 0] },
  NEURON: { position: [8, 6, 8], target: [0, 2, 0] },
}

export default function CameraRig() {
  const controlsRef = useRef<OrbitControlsType>(null)
  const { camera } = useThree()
  const currentScene = useSceneStore((s) => s.currentScene)
  const isTransitioning = useSceneStore((s) => s.isTransitioning)
  const selectedLandmark = useSceneStore((s) => s.selectedLandmark)
  const idleAngle = useRef(0)
  const prevScene = useRef(currentScene)

  const animateCamera = useCallback(
    (pos: [number, number, number], target: [number, number, number], duration = 2) => {
      if (!controlsRef.current) return

      controlsRef.current.enabled = false

      gsap.to(camera.position, { x: pos[0], y: pos[1], z: pos[2], duration, ease: "power3.inOut" })
      gsap.to(controlsRef.current.target, {
        x: target[0], y: target[1], z: target[2], duration, ease: "power3.inOut",
        onComplete: () => { if (controlsRef.current) controlsRef.current.enabled = true },
      })
    },
    [camera]
  )

  useEffect(() => {
    if (prevScene.current === currentScene) return
    prevScene.current = currentScene

    if (selectedLandmark && (currentScene === "AURA" || currentScene === "NEURON")) {
      animateCamera(selectedLandmark.cameraPosition, selectedLandmark.cameraTarget)
    } else {
      const cam = SCENE_CAMERAS[currentScene]
      if (cam) animateCamera(cam.position, cam.target)
    }
  }, [currentScene, selectedLandmark, animateCamera])

  useFrame((_, delta) => {
    if (currentScene === "LANDING" && !isTransitioning && controlsRef.current) {
      idleAngle.current += delta * 0.1
      const radius = 12
      const x = Math.sin(idleAngle.current) * radius
      const z = Math.cos(idleAngle.current) * radius
      camera.position.set(x, 6, z)
      controlsRef.current.target.set(0, 2, 0)
      controlsRef.current.update()
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      maxPolarAngle={Math.PI / 2.2}
      minDistance={5}
      maxDistance={40}
      enabled={!isTransitioning && currentScene !== "LANDING"}
    />
  )
}
