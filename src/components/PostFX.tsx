"use client"

import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing"

export default function PostFX() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.8}
        luminanceThreshold={0.85}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <Vignette
        eskil={false}
        offset={0.3}
        darkness={0.6}
      />
    </EffectComposer>
  )
}
