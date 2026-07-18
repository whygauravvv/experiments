import ExperimentDetail from "@/pages/experiment-detail"
import ExperimentsGallery from "@/pages/experiments-gallery"
import NotFound from "@/pages/not-found"
import { MOTION_EASE } from "@/lib/motion"
import { AnimatePresence, motion } from "motion/react"
import { useCallback, useEffect, useState } from "react"
import { matchPath, Route, Routes, useLocation } from "react-router-dom"

export default function DesktopApp() {
  const location = useLocation()
  const transitionState = location.state as {
    transitionFromGallery?: boolean
  } | null
  const isGalleryRoute = location.pathname === "/"
  const isDetailRoute = Boolean(
    matchPath({ path: "/experiments/:id", end: true }, location.pathname)
  )
  const isOverlayTransition = Boolean(
    isDetailRoute && transitionState?.transitionFromGallery
  )
  const [galleryPreviewsEnabled, setGalleryPreviewsEnabled] =
    useState(isGalleryRoute)

  const pauseCoveredGalleryPreviews = useCallback(() => {
    setGalleryPreviewsEnabled(false)
  }, [])

  const handleExitComplete = useCallback(() => {
    if (isGalleryRoute) {
      setGalleryPreviewsEnabled(true)
    }
  }, [isGalleryRoute])

  useEffect(() => {
    if (!isOverlayTransition) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOverlayTransition])

  return (
    <>
      {isGalleryRoute || isOverlayTransition ? (
        <ExperimentsGallery
          isDetailOpen={isOverlayTransition}
          previewsEnabled={isGalleryRoute || galleryPreviewsEnabled}
        />
      ) : null}

      <AnimatePresence
        initial={false}
        mode="sync"
        onExitComplete={handleExitComplete}
      >
        {isDetailRoute ? (
          <motion.div
            key="detail"
            role={isOverlayTransition ? "dialog" : undefined}
            aria-modal={isOverlayTransition ? "true" : undefined}
            aria-label={isOverlayTransition ? "Experiment details" : undefined}
            className="fixed inset-0 z-50 overflow-hidden"
            onAnimationComplete={pauseCoveredGalleryPreviews}
            initial={
              isOverlayTransition
                ? { backgroundColor: "rgba(250, 250, 250, 0)" }
                : false
            }
            animate={{
              backgroundColor: "rgba(250, 250, 250, 1)",
              transition: {
                duration: isOverlayTransition ? 0.4 : 0.01,
                ease: MOTION_EASE,
              },
            }}
            exit={{
              backgroundColor: "rgba(250, 250, 250, 0)",
              transition: {
                delay: isOverlayTransition ? 0.1 : 0,
                duration: isOverlayTransition ? 0.22 : 0.01,
                ease: MOTION_EASE,
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
        ) : !isGalleryRoute ? (
          <NotFound />
        ) : null}
      </AnimatePresence>
    </>
  )
}
