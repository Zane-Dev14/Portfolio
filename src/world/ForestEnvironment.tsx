"use client"

import { Environment } from "@react-three/drei"

interface ForestEnvironmentProps {
  hdri?: string
  fogColor?: string
  fogNear?: number
  fogFar?: number
}

export default function ForestEnvironment({
  hdri = "/textures/spruit_sunrise_4k.exr",
  fogColor = "#0f172a",
  fogNear = 10,
  fogFar = 80,
}: ForestEnvironmentProps) {
  return (
    <>
      <Environment files={hdri} background environmentIntensity={1.2} />
      <fog attach="fog" args={[fogColor, fogNear, fogFar]} />
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={60}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <hemisphereLight args={["#b1e1ff", "#0f172a", 0.4]} />
    </>
  )
}
