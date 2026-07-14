import type { ReactNode } from "react"

interface CardShellProps {
  children: ReactNode
}

export default function CardShell({ children }: CardShellProps) {
  return (
    <div className="flex h-full items-center justify-center p-4">
      {children}
    </div>
  )
}
