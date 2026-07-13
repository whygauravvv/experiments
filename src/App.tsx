import { AnimatePresence, LayoutGroup, motion } from "motion/react"
import { Route, Routes, useLocation } from "react-router-dom"
import ExperimentDetail from "./pages/experiment-detail"
import ExperimentsGallery from "./pages/experiments-gallery"

export function App() {
  const location = useLocation()
  const isExperimentDetail = location.pathname.startsWith("/experiments/")

  return (
    <LayoutGroup>
      <AnimatePresence
        initial={false}
        mode="sync"
        onExitComplete={() => {
          if (window.location.pathname.startsWith("/experiments/")) {
            window.scrollTo(0, 0)
          }
        }}
      >
        <motion.div
          key={location.pathname}
          className={
            isExperimentDetail
              ? "fixed inset-0 z-50 overflow-hidden"
              : "min-h-screen"
          }
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12, ease: "linear" }}
          style={{ willChange: "opacity" }}
        >
          <Routes location={location}>
            <Route path="/" element={<ExperimentsGallery />} />
            <Route path="/experiments/:id" element={<ExperimentDetail />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </LayoutGroup>
  )
}

export default App
