import {
  GalleryPreviewContext,
  GalleryPreviewManager,
} from "@/hooks/use-gallery-preview"
import { type ReactNode, useEffect, useLayoutEffect, useState } from "react"

type GalleryPreviewProviderProps = {
  children: ReactNode
  enabled: boolean
}

export function GalleryPreviewProvider({
  children,
  enabled,
}: GalleryPreviewProviderProps) {
  const [manager] = useState(() => new GalleryPreviewManager(enabled))

  useLayoutEffect(() => {
    manager.setEnabled(enabled)
  }, [enabled, manager])

  useEffect(() => () => manager.destroy(), [manager])

  return (
    <GalleryPreviewContext.Provider value={manager}>
      {children}
    </GalleryPreviewContext.Provider>
  )
}
