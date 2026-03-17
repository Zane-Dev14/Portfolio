"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF, Html } from "@react-three/drei"
import * as THREE from "three"
import { RuneMaterial } from "@/shaders/runeMaterial"
import ParticleSystem from "@/effects/ParticleSystem"

useGLTF.preload("/models/chinese_temple__sacred_peak_shrine.glb")

function RuneCircle() {
  const material = useMemo(() => new RuneMaterial(), [])
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
      <ringGeometry args={[12, 16, 64]} />
      <primitive object={material} attach="material" transparent side={THREE.DoubleSide} />
    </mesh>
  )
}

function FloatingTerminal({ position, content }: { position: [number, number, number]; content: string }) {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.5
    }
  })

  return (
    <group ref={ref} position={position}>
      <Html
        transform
        distanceFactor={15}
        style={{
          width: "300px",
          background: "rgba(10, 20, 30, 0.8)",
          border: "1px solid rgba(0, 229, 255, 0.3)",
          borderRadius: "8px",
          padding: "16px",
          fontFamily: "'Geist Mono', monospace",
          color: "#00e5ff",
          fontSize: "12px",
          boxShadow: "0 0 20px rgba(0, 229, 255, 0.1)",
        }}
      >
        <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{content}</pre>
      </Html>
    </group>
  )
}

export default function NeuronScene() {
  const { scene } = useGLTF("/models/chinese_temple__sacred_peak_shrine.glb")

  const clonedScene = useMemo(() => {
    const s = scene.clone(true)
    s.scale.setScalar(0.6)
    s.position.set(0, -5, 0)
    s.updateMatrixWorld(true)

    s.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh
        mesh.castShadow = true
        mesh.receiveShadow = true
      }
    })
    return s
  }, [scene])

  const terminalCode = `
// NeuronOS Kernel Init
fn init_memory() -> Result<(), Error> {
    let mut allocator = FrameAllocator::new();
    allocator.init(BOOT_INFO.memory_map);
    
    paging::init(&mut allocator)?;
    println!("Memory mapping complete.");
    
    Ok(())
}
`

  return (
    <group>
      <ambientLight intensity={0.1} color="#1e3a8a" />
      <directionalLight position={[10, 20, 10]} intensity={1.5} color="#e0f2fe" castShadow />
      <pointLight position={[0, 5, 0]} intensity={2} color="#00e5ff" distance={40} />
      
      <fog attach="fog" args={["#020617", 15, 60]} />

      <primitive object={clonedScene} />

      <RuneCircle />

      <FloatingTerminal position={[-8, 6, -5]} content={terminalCode} />
      <FloatingTerminal
        position={[8, 4, 3]}
        content={`sysctl -w net.ipv4.ip_forward=1\nmodprobe br_netfilter\n\nStarting Kubelet...`}
      />

      <ParticleSystem count={400} radius={30} color="#00e5ff" />
    </group>
  )
}
