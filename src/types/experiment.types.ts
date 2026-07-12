import type { ComponentType } from "react"

export type ExperimentItem = {
  id: string
  title: string
  description: string
  Component: ComponentType
}
