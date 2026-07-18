import { Component, type PropsWithChildren } from "react"

type ExperimentErrorBoundaryState = {
  hasError: boolean
}

export default class ExperimentErrorBoundary extends Component<
  PropsWithChildren,
  ExperimentErrorBoundaryState
> {
  state: ExperimentErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ExperimentErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid h-full min-h-40 w-full place-items-center bg-muted/40 px-6 text-center text-xs text-muted-foreground">
          This experiment could not be loaded.
        </div>
      )
    }

    return this.props.children
  }
}
