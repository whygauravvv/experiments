import { useIsMobile } from "@/hooks/use-mobile"
import { lazy, Suspense } from "react"

const DesktopApp = lazy(() => import("@/components/desktop-app"))
const MobileExperiments = lazy(() => import("@/components/mobile-experiments"))

export function App() {
  const isMobile = useIsMobile()

  return (
    <Suspense fallback={null}>
      {isMobile ? <MobileExperiments /> : <DesktopApp />}
    </Suspense>
  )
}

export default App
