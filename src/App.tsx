import { useEffect } from "react"
import { AnimatePresence, LayoutGroup, motion } from "motion/react"
import {
  Route,
  Routes,
  useLocation,
  type Location,
} from "react-router-dom"
import ExperimentDetail from "./pages/experiment-detail"
import ExperimentsGallery from "./pages/experiments-gallery"

export function App() {
  const location = useLocation()
  const backgroundLocation = (
    location.state as { backgroundLocation?: Location } | null
  )?.backgroundLocation
  const isOverlay = Boolean(
    backgroundLocation && location.pathname.startsWith("/experiments/"),
  )

  useEffect(() => {
    if (!isOverlay) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOverlay])

  return (
    <LayoutGroup>
      <Routes location={backgroundLocation ?? location}>
        <Route path="/" element={<ExperimentsGallery />} />
        <Route path="/experiments/:id" element={<ExperimentDetail />} />
      </Routes>

      <AnimatePresence initial={false}>
        {isOverlay && (
          <motion.div
            key={location.pathname}
            role="dialog"
            aria-modal="true"
            aria-label="Experiment details"
            className="fixed inset-0 z-50 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12, ease: "linear" }}
            style={{ willChange: "opacity" }}
          >
            <Routes location={location}>
              <Route
                path="/experiments/:id"
                element={<ExperimentDetail isOverlay />}
              />
            </Routes>
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  )
}

export default App
