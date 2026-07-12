import MotionButtonDemo from "@/experiments/motion-button"
import type { ComponentType } from "react"

export type ExperimentItem = {
  id: string
  title: string
  description: string
  url?: string
  Component: ComponentType
}

export const experiments: ExperimentItem[] = [
  {
    id: "motion-button-demo",
    title: "Motion Button",
    description: "Simple Framer Motion hover and tap interaction.",
    Component: MotionButtonDemo,
  },
]
