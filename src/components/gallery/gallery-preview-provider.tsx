import {
  GalleryPreviewContext,
  GalleryPreviewManager,
} from "@/hooks/use-gallery-preview"
import { type ReactNode, useEffect, useState } from "react"

type GalleryPreviewProviderProps = {
  children: ReactNode
}

export function GalleryPreviewProvider({
  children,
}: GalleryPreviewProviderProps) {
  const [manager] = useState(() => new GalleryPreviewManager())

  useEffect(() => () => manager.destroy(), [manager])

  return (
    <GalleryPreviewContext.Provider value={manager}>
      {children}
    </GalleryPreviewContext.Provider>
  )
}
