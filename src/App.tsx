import { useIsMobile } from "@/hooks/use-mobile"
import { lazy, Suspense } from "react"
import { Navigate, Route, Routes } from "react-router-dom"

const DesktopApp = lazy(() => import("@/components/desktop-app"))
const MobileExperiments = lazy(() => import("@/components/mobile-experiments"))

export function App() {
  const isMobile = useIsMobile()

  return (
    <Suspense fallback={null}>
      {isMobile ? (
        <Routes>
          <Route path="/" element={<MobileExperiments />} />
          <Route path="/experiments/:id" element={<MobileExperiments />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      ) : (
        <DesktopApp />
      )}
    </Suspense>
  )
}

export default App
