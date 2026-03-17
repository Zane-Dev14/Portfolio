"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { EnergyLineMaterial } from "@/shaders/energyLineMaterial"
import ParticleSystem from "@/effects/ParticleSystem"

function KubernetesPods() {
  const count = 50
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + time * 0.1
      const radius = 10 + Math.sin(time * 0.5 + i) * 2
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const y = Math.sin(time * 2 + i) * 0.5
      dummy.position.set(x, y, z)
      dummy.rotation.x = Math.sin(time + i) * 0.1
      dummy.rotation.y = time * 0.2 + i
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow receiveShadow>
      <boxGeometry args={[0.8, 0.8, 0.8]}>
        <instancedBufferAttribute attach="attributes-color" args={[new Float32Array(count * 3), 3]} />
      </boxGeometry>
      <meshStandardMaterial
        color="#00e5ff"
        emissive="#00e5ff"
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </instancedMesh>
  )
}

function MainNode() {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.1
      ref.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2
    }
  })
  return (
    <group ref={ref}>
      <mesh castShadow receiveShadow>
        <octahedronGeometry args={[2, 0]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.5} wireframe />
      </mesh>
      <mesh>
        <octahedronGeometry args={[1.8, 0]} />
        <meshStandardMaterial color="#0f172a" metalness={1} roughness={0} />
      </mesh>
    </group>
  )
}

function EnergyLines() {
  const lineMaterial = useMemo(() => new EnergyLineMaterial(), [])

  useFrame((state) => {
    lineMaterial.time = state.clock.elapsedTime
  })

  const points = useMemo(() => {
    const pts = []
    for (let i = 0; i < 50; i++) {
      const angle = (i / 50) * Math.PI * 2
      pts.push(new THREE.Vector3(0, 0, 0))
      pts.push(new THREE.Vector3(Math.cos(angle) * 15, (Math.random() - 0.5) * 5, Math.sin(angle) * 15))
    }
    return pts
  }, [])
  const lineGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points])
  return (
    <lineSegments geometry={lineGeometry}>
      <primitive object={lineMaterial} attach="material" />
    </lineSegments>
  )
}

export default function AuraScene() {
  return (
    <group>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#00e5ff" distance={30} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <MainNode />
      <KubernetesPods />
      <EnergyLines />
      <ParticleSystem count={300} radius={25} color="#00e5ff" />
    </group>
  )
}
