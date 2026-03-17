"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

const particleVertexShader = `
  attribute float aSize; attribute float aPhase; uniform float uTime; varying float vAlpha;
  void main() {
    vec3 pos = position;
    pos.y += sin(uTime * 0.3 + aPhase * 6.28) * 0.5 + uTime * 0.15;
    pos.x += sin(uTime * 0.2 + aPhase * 3.14) * 0.3;
    pos.z += cos(uTime * 0.25 + aPhase * 4.71) * 0.3;
    pos.y = mod(pos.y + 10.0, 20.0) - 10.0;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (80.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    vAlpha = (sin(uTime * 1.5 + aPhase * 6.28) * 0.3 + 0.7) * smoothstep(-8.0, -2.0, pos.y) * smoothstep(12.0, 6.0, pos.y);
  }
`
const particleFragmentShader = `
  uniform vec3 uColor; varying float vAlpha;
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    float softEdge = 1.0 - smoothstep(0.2, 0.5, dist);
    gl_FragColor = vec4(uColor, vAlpha * softEdge * 0.7);
  }
`

interface ParticleSystemProps { count?: number; radius?: number; color?: string; size?: number }

export default function ParticleSystem({ count = 200, radius = 15, color = "#66ffcc", size = 1.0 }: ParticleSystemProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { positions, sizes, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3), siz = new Float32Array(count), pha = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3, theta = Math.random() * Math.PI * 2, phi = Math.acos(2 * Math.random() - 1), r = Math.cbrt(Math.random()) * radius
      pos[i3] = r * Math.sin(phi) * Math.cos(theta); pos[i3+1] = (Math.random() - 0.3) * radius * 0.8; pos[i3+2] = r * Math.sin(phi) * Math.sin(theta)
      siz[i] = (Math.random() * 0.6 + 0.4) * size; pha[i] = Math.random()
    }
    return { positions: pos, sizes: siz, phases: pha }
  }, [count, radius, size])

  useFrame((_, delta) => { if (materialRef.current) materialRef.current.uniforms.uTime.value += delta })

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial ref={materialRef} vertexShader={particleVertexShader} fragmentShader={particleFragmentShader} uniforms={{ uTime: { value: 0 }, uColor: { value: new THREE.Color(color) } }} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}
