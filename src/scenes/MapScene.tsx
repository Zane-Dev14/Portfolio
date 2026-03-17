"use client"

import { useRef, useEffect, useState } from "react"
import { useFrame, ThreeEvent } from "@react-three/fiber"
import { useGLTF, Html } from "@react-three/drei"
import * as THREE from "three"
import { useSceneStore, LANDMARKS, LandmarkData } from "@/state/sceneStore"
import ForestEnvironment from "@/world/ForestEnvironment"
import ParticleSystem from "@/effects/ParticleSystem"

useGLTF.preload("/models/diorama_minish_woods.glb")
useGLTF.preload("/models/hyrule_castle_interior.glb")
useGLTF.preload("/models/chinese_temple__sacred_peak_shrine.glb")
useGLTF.preload("/models/heart_of_the_forest.glb")

function LandmarkModel({
  modelPath,
  position,
  scale,
  landmark,
  rotationX,
}: {
  modelPath: string
  position: [number, number, number]
  scale: number
  landmark: LandmarkData
  rotationX?: number
}) {
  const { scene } = useGLTF(modelPath)
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const flyToLandmark = useSceneStore((s) => s.flyToLandmark)
  const isTransitioning = useSceneStore((s) => s.isTransitioning)
  const clonedScene = useRef<THREE.Group | null>(null)

  useEffect(() => {
    clonedScene.current = scene.clone(true)
    const s = clonedScene.current

    if (rotationX !== undefined) {
      s.rotation.x = rotationX
    }
    s.scale.setScalar(scale)
    s.updateMatrixWorld(true)

    s.traverse((obj: THREE.Object3D) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh
        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.frustumCulled = true
      }
    })
  }, [scene, scale, rotationX])

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    if (isTransitioning) return
    flyToLandmark(landmark)
  }

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={handleClick}
      onPointerEnter={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = "pointer"
      }}
      onPointerLeave={(e) => {
        e.stopPropagation()
        setHovered(false)
        document.body.style.cursor = "auto"
      }}
    >
      {clonedScene.current && <primitive object={clonedScene.current} />}

      <mesh rotation-x={-Math.PI / 2} position={[0, 0.1, 0]}>
        <ringGeometry args={[1.5 * scale, 2.0 * scale, 32]} />
        <meshBasicMaterial
          color={hovered ? "#00e5ff" : "#1a5c6e"}
          transparent
          opacity={hovered ? 0.6 : 0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      <Html
        position={[0, 3 * scale, 0]}
        center
        distanceFactor={15}
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        <div
          style={{
            background: hovered ? "rgba(0, 229, 255, 0.15)" : "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(8px)",
            border: `1px solid ${hovered ? "rgba(0, 229, 255, 0.5)" : "rgba(255,255,255,0.1)"}`,
            borderRadius: "8px",
            padding: "6px 14px",
            color: hovered ? "#00e5ff" : "#ddd",
            fontSize: "13px",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            whiteSpace: "nowrap",
            textAlign: "center",
            transition: "all 0.3s ease",
          }}
        >
          {landmark.title.split("—")[0].trim()}
        </div>
      </Html>
    </group>
  )
}

function LandmarkBeacon({ position, color = "#00e5ff" }: { position: [number, number, number]; color?: string }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.15)
      ;(ref.current.material as THREE.MeshBasicMaterial).opacity =
        0.4 + Math.sin(state.clock.elapsedTime * 3) * 0.2
    }
  })

  return (
    <mesh ref={ref} position={[position[0], position[1] + 4, position[2]]}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.5} />
    </mesh>
  )
}

export default function MapScene() {
  const { scene: woodsScene, animations } = useGLTF("/models/diorama_minish_woods.glb")
  const mixer = useRef<THREE.AnimationMixer | null>(null)

  useEffect(() => {
    // Reset any cached rotation
    woodsScene.rotation.set(0, 0, 0)
    woodsScene.scale.setScalar(10)
    woodsScene.updateMatrixWorld(true)

    woodsScene.traverse((obj: THREE.Object3D) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh
        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.frustumCulled = true
      }
    })

    if (animations.length > 0) {
      mixer.current = new THREE.AnimationMixer(woodsScene)
      animations.forEach((clip) => {
        const action = mixer.current!.clipAction(clip)
        action.play()
      })
    }

    return () => {
      mixer.current?.stopAllAction()
    }
  }, [woodsScene, animations])

  useFrame((_, delta) => {
    mixer.current?.update(delta)
  })

  return (
    <group>
      <ForestEnvironment />

      <primitive object={woodsScene} />

      <LandmarkModel
        modelPath="/models/hyrule_castle_interior.glb"
        position={LANDMARKS[0].position}
        scale={0.5}
        landmark={LANDMARKS[0]}
        rotationX={-Math.PI / 2}
      />
      <LandmarkBeacon position={LANDMARKS[0].position} />

      <LandmarkModel
        modelPath="/models/chinese_temple__sacred_peak_shrine.glb"
        position={LANDMARKS[1].position}
        scale={0.6}
        landmark={LANDMARKS[1]}
      />
      <LandmarkBeacon position={LANDMARKS[1].position} color="#ff6ec7" />

      <LandmarkModel
        modelPath="/models/heart_of_the_forest.glb"
        position={LANDMARKS[2].position}
        scale={0.8}
        landmark={LANDMARKS[2]}
      />
      <LandmarkBeacon position={LANDMARKS[2].position} color="#ffd700" />

      <ParticleSystem count={150} radius={20} color="#66ffcc" />
    </group>
  )
}
