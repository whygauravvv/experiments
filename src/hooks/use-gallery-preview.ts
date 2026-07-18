import { createContext, useContext, useEffect, useRef, useState } from "react"

type PreviewSubscriber = (isNearViewport: boolean) => void

type PreviewRecord = {
  isActive: boolean
  subscriber: PreviewSubscriber
}

export class GalleryPreviewManager {
  private enabled: boolean
  private readonly intersectingRecords = new Set<PreviewRecord>()
  private observer?: IntersectionObserver
  private readonly records = new Map<Element, PreviewRecord>()

  constructor(enabled: boolean) {
    this.enabled = enabled
  }

  private getObserver() {
    this.observer ??= new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const record = this.records.get(entry.target)
          if (!record) return

          if (entry.isIntersecting) {
            this.intersectingRecords.add(record)
          } else {
            this.intersectingRecords.delete(record)
          }

          this.setRecordActive(record, this.enabled && entry.isIntersecting)
        })
      },
      {
        root: null,
        rootMargin: "600px 0px",
        threshold: 0,
      }
    )

    return this.observer
  }

  private setRecordActive(record: PreviewRecord, isActive: boolean) {
    if (record.isActive === isActive) return

    record.isActive = isActive
    record.subscriber(isActive)
  }

  observe(element: Element, subscriber: PreviewSubscriber) {
    const record: PreviewRecord = {
      isActive: false,
      subscriber,
    }

    this.records.set(element, record)

    if (typeof IntersectionObserver === "undefined") {
      this.intersectingRecords.add(record)
      this.setRecordActive(record, this.enabled)
    } else {
      this.getObserver().observe(element)
    }

    return () => {
      this.observer?.unobserve(element)
      this.records.delete(element)
      this.intersectingRecords.delete(record)
      this.setRecordActive(record, false)

      if (this.records.size === 0) {
        this.observer?.disconnect()
        this.observer = undefined
      }
    }
  }

  setEnabled(enabled: boolean) {
    if (enabled === this.enabled) return

    this.enabled = enabled
    this.intersectingRecords.forEach((record) => {
      this.setRecordActive(record, enabled)
    })
  }

  destroy() {
    this.observer?.disconnect()
    this.observer = undefined
    this.records.clear()
    this.intersectingRecords.clear()
  }
}

export const GalleryPreviewContext =
  createContext<GalleryPreviewManager | null>(null)

function useGalleryPreviewManager() {
  const manager = useContext(GalleryPreviewContext)

  if (!manager) {
    throw new Error(
      "Gallery preview hooks must be used inside GalleryPreviewProvider"
    )
  }

  return manager
}

export function useNearViewport<T extends Element>() {
  const manager = useGalleryPreviewManager()
  const viewportRef = useRef<T>(null)
  const [isNearViewport, setIsNearViewport] = useState(false)

  useEffect(() => {
    const element = viewportRef.current
    if (!element) return

    return manager.observe(element, setIsNearViewport)
  }, [manager])

  return { isNearViewport, viewportRef }
}
