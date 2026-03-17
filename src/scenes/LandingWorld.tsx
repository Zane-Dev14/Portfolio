"use client"

import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"
import ForestEnvironment from "@/world/ForestEnvironment"
import ParticleSystem from "@/effects/ParticleSystem"

useGLTF.preload("/models/diorama_minish_woods.glb")

export default function LandingWorld() {
  const { scene, animations } = useGLTF("/models/diorama_minish_woods.glb")
  const mixer = useRef<THREE.AnimationMixer | null>(null)

  useEffect(() => {
    // Reset any cached rotation to default
    scene.rotation.set(0, 0, 0)
    scene.scale.setScalar(10)
    scene.updateMatrixWorld(true)

    // Enable shadows and culling
    scene.traverse((obj: THREE.Object3D) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh
        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.frustumCulled = true
      }
    })

    if (animations.length > 0) {
      mixer.current = new THREE.AnimationMixer(scene)
      animations.forEach((clip) => {
        const action = mixer.current!.clipAction(clip)
        action.play()
      })
    }

    return () => {
      mixer.current?.stopAllAction()
    }
  }, [scene, animations])

  useFrame((_, delta) => {
    mixer.current?.update(delta)
  })

  return (
    <group>
      <ForestEnvironment />
      <primitive object={scene} />
      <ParticleSystem count={200} radius={15} color="#66ffcc" />
    </group>
  )
}
