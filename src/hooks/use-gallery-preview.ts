import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"

type PreviewSubscriber = (isNearViewport: boolean) => void

type PreviewRecord = {
  element: Element
  isActive: boolean
  isIntersecting: boolean
  subscriber: PreviewSubscriber
}

export class GalleryPreviewManager {
  private activeCount = 0
  private readonly countSubscribers = new Set<() => void>()
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
        let activeCountChanged = false

        entries.forEach((entry) => {
          const record = this.records.get(entry.target)
          if (!record) return

          record.isIntersecting = entry.isIntersecting

          if (entry.isIntersecting) {
            this.intersectingRecords.add(record)
          } else {
            this.intersectingRecords.delete(record)
          }

          activeCountChanged =
            this.setRecordActive(
              record,
              this.enabled && entry.isIntersecting
            ) || activeCountChanged
        })

        if (activeCountChanged) this.emitActiveCount()
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
    if (record.isActive === isActive) return false

    record.isActive = isActive
    this.activeCount += isActive ? 1 : -1
    record.subscriber(isActive)
    return true
  }

  private emitActiveCount() {
    this.countSubscribers.forEach((subscriber) => subscriber())
  }

  observe(element: Element, subscriber: PreviewSubscriber) {
    const record: PreviewRecord = {
      element,
      isActive: false,
      isIntersecting: false,
      subscriber,
    }

    this.records.set(element, record)

    if (typeof IntersectionObserver === "undefined") {
      record.isIntersecting = true
      this.intersectingRecords.add(record)
      if (this.setRecordActive(record, this.enabled)) this.emitActiveCount()
    } else {
      this.getObserver().observe(element)
    }

    return () => {
      this.observer?.unobserve(element)
      this.records.delete(element)
      this.intersectingRecords.delete(record)
      if (this.setRecordActive(record, false)) this.emitActiveCount()

      if (this.records.size === 0) {
        this.observer?.disconnect()
        this.observer = undefined
      }
    }
  }

  setEnabled(enabled: boolean) {
    if (enabled === this.enabled) return

    this.enabled = enabled
    let activeCountChanged = false

    this.intersectingRecords.forEach((record) => {
      activeCountChanged =
        this.setRecordActive(record, enabled) || activeCountChanged
    })

    if (activeCountChanged) this.emitActiveCount()
  }

  destroy() {
    this.observer?.disconnect()
    this.observer = undefined
    this.records.clear()
    this.intersectingRecords.clear()
    this.activeCount = 0
    this.emitActiveCount()
    this.countSubscribers.clear()
  }

  subscribeToCount = (subscriber: () => void) => {
    this.countSubscribers.add(subscriber)
    return () => this.countSubscribers.delete(subscriber)
  }

  getActiveCount = () => this.activeCount
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

export function useNearViewportCount() {
  const manager = useGalleryPreviewManager()

  return useSyncExternalStore(
    manager.subscribeToCount,
    manager.getActiveCount,
    () => 0
  )
}
