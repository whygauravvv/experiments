import { useIsMobile } from "@/hooks/use-mobile"
import { initializeSounds } from "@/lib/sound"
import { lazy, Suspense, useEffect } from "react"

const DesktopApp = lazy(() => import("@/components/desktop-app"))
const MobileExperiments = lazy(() => import("@/components/mobile-experiments"))

export function App() {
  const isMobile = useIsMobile()

  useEffect(() => {
    initializeSounds()
  }, [])

  return (
    <Suspense fallback={null}>
      {isMobile ? <MobileExperiments /> : <DesktopApp />}
    </Suspense>
  )
}

export default App
