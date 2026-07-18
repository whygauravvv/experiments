import MobileExperiments from "@/components/mobile-experiments"
import { useIsMobile } from "@/hooks/use-mobile"
import { AnimatePresence, motion, usePresence } from "motion/react"
import { useCallback, useEffect, useLayoutEffect, useState } from "react"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"
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
  const transitionState = location.state as {
    activeExperimentId?: string
    transitionFromDetail?: boolean
    transitionFromGallery?: boolean
  } | null
  const isGalleryRoute = location.pathname === "/"
  const isDetailRoute = location.pathname.startsWith("/experiments/")
  const isOverlayTransition = Boolean(
    isDetailRoute && transitionState?.transitionFromGallery
  )
  const [galleryScrollPosition, setGalleryScrollPosition] = useState(0)
  const [activeExperimentId, setActiveExperimentId] = useState<string>()
  const [wasOverlayDetail, setWasOverlayDetail] = useState(false)
  const isReturningFromDetail = Boolean(
    isGalleryRoute &&
    (wasOverlayDetail || transitionState?.transitionFromDetail)
  )

  const openExperiment = useCallback((experimentId: string) => {
    setGalleryScrollPosition(window.scrollY)
    setActiveExperimentId(experimentId)
    setWasOverlayDetail(true)
  }, [])
  const finishGalleryReturn = useCallback(() => {
    setWasOverlayDetail(false)
  }, [])

  useEffect(() => {
    if (!isDetailRoute) return

    const timer = window.setTimeout(
      () => setWasOverlayDetail(isOverlayTransition),
      0
    )
    return () => window.clearTimeout(timer)
  }, [isDetailRoute, isOverlayTransition])

  useEffect(() => {
    if (!isOverlayTransition) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOverlayTransition])

  return (
    <AnimatePresence initial={false} mode="sync">
      {isGalleryRoute ? (
        <DesktopGalleryRoute
          key="gallery"
          activeExperimentId={
            activeExperimentId ?? transitionState?.activeExperimentId
          }
          isReturningFromDetail={isReturningFromDetail}
          scrollPosition={galleryScrollPosition}
          onOpenExperiment={openExperiment}
          onReturnComplete={finishGalleryReturn}
        />
      ) : isDetailRoute ? (
        <motion.div
          key="detail"
          role={isOverlayTransition ? "dialog" : undefined}
          aria-modal={isOverlayTransition ? "true" : undefined}
          aria-label={isOverlayTransition ? "Experiment details" : undefined}
          className="fixed inset-0 z-50 overflow-hidden"
          initial={
            isOverlayTransition
              ? { backgroundColor: "rgba(250, 250, 250, 0)" }
              : false
          }
          animate={{
            backgroundColor: "rgba(250, 250, 250, 1)",
            transition: {
              duration: isOverlayTransition ? 0.4 : 0.01,
              ease: [0.16, 1, 0.3, 1],
            },
          }}
          exit={{
            backgroundColor: "rgba(250, 250, 250, 0)",
            transition: {
              delay: isOverlayTransition ? 0.1 : 0,
              duration: isOverlayTransition ? 0.22 : 0.01,
              ease: [0.16, 1, 0.3, 1],
            },
          }}
        >
          <Routes location={location}>
            <Route
              path="/experiments/:id"
              element={<ExperimentDetail isOverlay={isOverlayTransition} />}
            />
          </Routes>
        </motion.div>
      ) : (
        <motion.div key={location.pathname}>
          <NotFound />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function DesktopGalleryRoute({
  activeExperimentId,
  isReturningFromDetail,
  scrollPosition,
  onOpenExperiment,
  onReturnComplete,
}: {
  activeExperimentId?: string
  isReturningFromDetail: boolean
  scrollPosition: number
  onOpenExperiment: (experimentId: string) => void
  onReturnComplete: () => void
}) {
  const [isPresent, safeToRemove] = usePresence()

  useLayoutEffect(() => {
    if (!isReturningFromDetail) return

    const frame = requestAnimationFrame(() =>
      window.scrollTo(0, scrollPosition)
    )
    return () => cancelAnimationFrame(frame)
  }, [isReturningFromDetail, scrollPosition])

  useEffect(() => {
    if (isPresent) return

    const timer = window.setTimeout(safeToRemove, 420)
    return () => window.clearTimeout(timer)
  }, [isPresent, safeToRemove])

  useEffect(() => {
    if (!isPresent || !isReturningFromDetail) return

    const timer = window.setTimeout(onReturnComplete, 420)
    return () => window.clearTimeout(timer)
  }, [isPresent, isReturningFromDetail, onReturnComplete])

  return (
    <ExperimentsGallery
      activeExperimentId={activeExperimentId}
      isDetailOpen={!isPresent}
      isEnteringFromDetail={isReturningFromDetail}
      onOpenExperiment={onOpenExperiment}
    />
  )
}

export default App
