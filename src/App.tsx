import MobileExperiments from "@/components/mobile-experiments"
import { useIsMobile } from "@/hooks/use-mobile"
import { AnimatePresence, motion } from "motion/react"
import { useEffect } from "react"
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  type Location,
} from "react-router-dom"
import ExperimentDetail from "./pages/experiment-detail"
import ExperimentsGallery from "./pages/experiments-gallery"
import NotFound from "./pages/not-found"

export function App() {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Routes>
        <Route path="/" element={<MobileExperiments />} />
        <Route path="/experiments/:id" element={<MobileExperiments />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  return <DesktopApp />
}

function DesktopApp() {
  const location = useLocation()
  const backgroundLocation = (
    location.state as { backgroundLocation?: Location } | null
  )?.backgroundLocation
  const isOverlay = Boolean(
    backgroundLocation && location.pathname.startsWith("/experiments/")
  )
  const activeExperimentId = isOverlay
    ? location.pathname.split("/").filter(Boolean).at(-1)
    : undefined

  useEffect(() => {
    if (!isOverlay) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOverlay])

  return (
    <>
      <Routes location={backgroundLocation ?? location}>
        <Route
          path="/"
          element={
            <ExperimentsGallery
              activeExperimentId={activeExperimentId}
              isDetailOpen={isOverlay}
            />
          }
        />
        <Route path="/experiments/:id" element={<ExperimentDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <AnimatePresence>
        {isOverlay && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Experiment details"
            className="fixed inset-0 z-50 overflow-hidden"
            initial={{ backgroundColor: "rgba(250, 250, 250, 0)" }}
            animate={{
              backgroundColor: "rgba(250, 250, 250, 1)",
              transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
            }}
            exit={{
              backgroundColor: "rgba(250, 250, 250, 0)",
              transition: {
                delay: 0.1,
                duration: 0.22,
                ease: [0.16, 1, 0.3, 1],
              },
            }}
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
    </>
  )
}

export default App
