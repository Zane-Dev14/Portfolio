"use client"

import { create } from "zustand"

export type SceneName = "LANDING" | "MAP" | "AURA" | "NEURON"

export interface LandmarkData {
  name: string
  sceneTarget: SceneName
  position: [number, number, number]
  cameraPosition: [number, number, number]
  cameraTarget: [number, number, number]
  title: string
  description: string
  techStack: string[]
  githubUrl?: string
  demoUrl?: string
}

export const LANDMARKS: LandmarkData[] = [
  {
    name: "Hyrule Castle",
    sceneTarget: "AURA",
    position: [6, 0, -4],
    cameraPosition: [6, 4, 6],
    cameraTarget: [0, 1, 0],
    title: "AURA — Kubernetes Intelligence",
    description: "An intelligent Kubernetes cluster management platform with real-time monitoring, auto-scaling, and AI-driven optimization.",
    techStack: ["Kubernetes", "Go", "Prometheus", "React", "gRPC"],
  },
  {
    name: "Sacred Temple",
    sceneTarget: "NEURON",
    position: [-6, 0, -4],
    cameraPosition: [8, 6, 8],
    cameraTarget: [0, 2, 0],
    title: "NeuronOS — Custom Linux OS",
    description: "A custom Linux distribution built from scratch with a focus on developer tooling, security, and performance optimization.",
    techStack: ["Linux", "C", "Rust", "SystemD", "LLVM"],
  },
  {
    name: "Sword Shrine",
    sceneTarget: "MAP",
    position: [0, 0, 6],
    cameraPosition: [4, 3, 10],
    cameraTarget: [0, 1, 6],
    title: "Work Experience",
    description: "Professional experience across DevOps, cloud infrastructure, and full-stack development.",
    techStack: ["AWS", "Docker", "Terraform", "CI/CD", "Python"],
  },
]

interface SceneState {
  currentScene: SceneName
  previousScene: SceneName | null
  isTransitioning: boolean
  selectedLandmark: LandmarkData | null
  showProjectPanel: boolean
  showLandingUI: boolean
  setScene: (scene: SceneName) => void
  startTransition: () => void
  endTransition: () => void
  flyToLandmark: (landmark: LandmarkData) => void
  returnToMap: () => void
  enterWorld: () => void
  setShowProjectPanel: (show: boolean) => void
}

export const useSceneStore = create<SceneState>((set, get) => ({
  currentScene: "LANDING", previousScene: null, isTransitioning: false, selectedLandmark: null, showProjectPanel: false, showLandingUI: true,
  setScene: (scene) => set((s) => ({ previousScene: s.currentScene, currentScene: scene })),
  startTransition: () => set({ isTransitioning: true }),
  endTransition: () => set({ isTransitioning: false }),
  flyToLandmark: (landmark) => {
    get().startTransition(); set({ selectedLandmark: landmark })
    setTimeout(() => set({ currentScene: landmark.sceneTarget, isTransitioning: false, showProjectPanel: true }), 2200)
  },
  returnToMap: () => {
    get().startTransition(); set({ showProjectPanel: false, selectedLandmark: null })
    setTimeout(() => set({ currentScene: "MAP", previousScene: null, isTransitioning: false }), 1500)
  },
  enterWorld: () => {
    get().startTransition(); set({ showLandingUI: false })
    setTimeout(() => set({ currentScene: "MAP", isTransitioning: false }), 2000)
  },
  setShowProjectPanel: (show) => set({ showProjectPanel: show }),
}))
