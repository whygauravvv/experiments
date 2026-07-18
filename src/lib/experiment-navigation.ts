import { experiments } from "@/experiments"

export function getExperimentNavigation(id?: string) {
  const routeIndex = id
    ? experiments.findIndex((experiment) => experiment.id === id)
    : 0
  const activeIndex = routeIndex === -1 ? 0 : routeIndex

  return {
    routeIndex,
    activeExperiment: experiments[activeIndex],
    previousExperiment:
      experiments[(activeIndex - 1 + experiments.length) % experiments.length],
    nextExperiment: experiments[(activeIndex + 1) % experiments.length],
  }
}
