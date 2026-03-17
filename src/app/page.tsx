"use client"

import dynamic from "next/dynamic"
import UIOverlay from "@/components/UIOverlay"

// Dynamic import to avoid SSR issues with Three.js/WebGL
const CanvasRoot = dynamic(() => import("@/components/CanvasRoot"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#050a15",
        color: "rgba(0, 229, 255, 0.6)",
        fontFamily: "'Inter', sans-serif",
        fontSize: "14px",
        letterSpacing: "3px",
        textTransform: "uppercase",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "2px solid rgba(0, 229, 255, 0.2)",
            borderTopColor: "#00e5ff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px",
          }}
        />
        Loading World...
      </div>
    </div>
  ),
})

export default function Home() {
  return (
    <main
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#050a15",
      }}
    >
      <CanvasRoot />
      <UIOverlay />
    </main>
  )
}