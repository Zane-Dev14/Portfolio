import { useSceneStore } from "@/state/sceneStore"
import { motion, AnimatePresence } from "motion/react"

export default function UIOverlay() {
  const currentScene = useSceneStore((s) => s.currentScene)
  const isTransitioning = useSceneStore((s) => s.isTransitioning)
  const showLandingUI = useSceneStore((s) => s.showLandingUI)
  const showProjectPanel = useSceneStore((s) => s.showProjectPanel)
  const selectedLandmark = useSceneStore((s) => s.selectedLandmark)
  const enterWorld = useSceneStore((s) => s.enterWorld)
  const returnToMap = useSceneStore((s) => s.returnToMap)

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10, fontFamily: "'Inter', 'Geist Sans', sans-serif" }}>
      <AnimatePresence>
        {currentScene === "LANDING" && showLandingUI && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "auto" }}>
            <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }} style={{ fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 800, color: "white", textAlign: "center", textShadow: "0 0 40px rgba(0, 229, 255, 0.4), 0 4px 20px rgba(0,0,0,0.6)", letterSpacing: "2px", marginBottom: "8px" }}>ZELDA DEVOPS</motion.h1>
            <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1, duration: 1, ease: "easeOut" }} style={{ fontSize: "clamp(0.9rem, 2vw, 1.2rem)", color: "rgba(200, 230, 255, 0.7)", textAlign: "center", letterSpacing: "4px", textTransform: "uppercase", marginBottom: "50px" }}>Interactive Portfolio Experience</motion.p>
            <motion.button initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.8, duration: 0.6, ease: "easeOut" }} whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(0, 229, 255, 0.4)" }} whileTap={{ scale: 0.95 }} onClick={enterWorld} style={{ padding: "14px 48px", fontSize: "15px", fontWeight: 600, color: "#00e5ff", background: "rgba(0, 229, 255, 0.08)", border: "1px solid rgba(0, 229, 255, 0.4)", borderRadius: "8px", cursor: "pointer", letterSpacing: "3px", textTransform: "uppercase", backdropFilter: "blur(10px)", transition: "background 0.3s", pointerEvents: "auto" }}>Enter World</motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {currentScene === "MAP" && !isTransitioning && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.5, duration: 0.6 }} style={{ position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)", color: "rgba(200, 230, 255, 0.6)", fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>Click a landmark to explore</motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showProjectPanel && selectedLandmark && (
          <motion.div initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 60, opacity: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} style={{ position: "absolute", top: "50%", right: "30px", transform: "translateY(-50%)", width: "340px", background: "rgba(5, 10, 25, 0.85)", backdropFilter: "blur(20px)", border: "1px solid rgba(0, 229, 255, 0.2)", borderRadius: "12px", padding: "28px", pointerEvents: "auto", boxShadow: "0 0 60px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 229, 255, 0.1)" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "8px", lineHeight: 1.3 }}>{selectedLandmark.title}</h2>
            <p style={{ fontSize: "13px", color: "rgba(200, 220, 255, 0.7)", lineHeight: 1.6, marginBottom: "18px" }}>{selectedLandmark.description}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "22px" }}>
              {selectedLandmark.techStack.map((tech) => (
                <span key={tech} style={{ padding: "4px 10px", fontSize: "11px", fontWeight: 500, color: "#00e5ff", background: "rgba(0, 229, 255, 0.08)", border: "1px solid rgba(0, 229, 255, 0.2)", borderRadius: "4px" }}>{tech}</span>
              ))}
            </div>
            <div style={{ display: "flex", gap: "10px", marginBottom: "18px" }}>
              {selectedLandmark.githubUrl && (
                <a href={selectedLandmark.githubUrl} target="_blank" rel="noopener noreferrer" style={{ padding: "8px 18px", fontSize: "12px", fontWeight: 600, color: "#fff", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px", textDecoration: "none", cursor: "pointer", transition: "background 0.2s" }}>GitHub →</a>
              )}
              {selectedLandmark.demoUrl && (
                <a href={selectedLandmark.demoUrl} target="_blank" rel="noopener noreferrer" style={{ padding: "8px 18px", fontSize: "12px", fontWeight: 600, color: "#00e5ff", background: "rgba(0, 229, 255, 0.08)", border: "1px solid rgba(0, 229, 255, 0.3)", borderRadius: "6px", textDecoration: "none", cursor: "pointer" }}>Demo →</a>
              )}
            </div>
            <button onClick={returnToMap} style={{ width: "100%", padding: "10px", fontSize: "12px", fontWeight: 600, color: "rgba(200, 220, 255, 0.6)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", cursor: "pointer", letterSpacing: "1px", textTransform: "uppercase", transition: "all 0.2s" }}>← Return to Map</button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isTransitioning && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} style={{ position: "absolute", inset: 0, background: "#000" }} />
        )}
      </AnimatePresence>
    </div>
  )
}