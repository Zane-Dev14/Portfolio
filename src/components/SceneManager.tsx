"use client"

import { useSceneStore } from "@/state/sceneStore"
import LandingWorld from "@/scenes/LandingWorld"
import MapScene from "@/scenes/MapScene"
import AuraScene from "@/scenes/AuraScene"
import NeuronScene from "@/scenes/NeuronScene"

export default function SceneManager() {
  const currentScene = useSceneStore((s) => s.currentScene)

  return (
    <group>
      {currentScene === "LANDING" && <LandingWorld />}
      {currentScene === "MAP" && <MapScene />}
      {currentScene === "AURA" && <AuraScene />}
      {currentScene === "NEURON" && <NeuronScene />}
    </group>
  )
}
