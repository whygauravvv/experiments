import PageWrapper from "@/components/page-wrapper"
import ExperimentDetail from "@/pages/experiment-detail"
import ExperimentsGallery from "@/pages/experiments-gallery"
import NotFound from "@/pages/not-found"
import { AnimatePresence } from "motion/react"
import { useCallback, useRef } from "react"
import { matchPath, Route, Routes, useLocation } from "react-router-dom"

function getPageKey(pathname: string) {
  if (pathname === "/") return "gallery"

  return matchPath({ path: "/experiments/:id", end: true }, pathname)
    ? "experiment-detail"
    : "not-found"
}

export default function DesktopApp() {
  const location = useLocation()
  const pageKey = getPageKey(location.pathname)
  const galleryScrollTop = useRef(0)

  const rememberGalleryScroll = useCallback((scrollTop: number) => {
    galleryScrollTop.current = scrollTop
  }, [])

  const getGalleryScrollTop = useCallback(() => galleryScrollTop.current, [])

  return (
    <div className="grid h-dvh overflow-hidden bg-background">
      <AnimatePresence initial={false} mode="sync">
        <PageWrapper
          key={pageKey}
          getInitialScrollTop={
            pageKey === "gallery" ? getGalleryScrollTop : undefined
          }
          onScrollTopChange={
            pageKey === "gallery" ? rememberGalleryScroll : undefined
          }
        >
          <Routes location={location}>
            <Route path="/" element={<ExperimentsGallery />} />
            <Route path="/experiments/:id" element={<ExperimentDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageWrapper>
      </AnimatePresence>
    </div>
  )
}
