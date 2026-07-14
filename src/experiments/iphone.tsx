import CardShell from "@/components/card-shell"
import IphoneMockup from "@/components/iphone-mockup"
import CodexAtmosphere from "./codex-atmosphere"

export default function MotionButton() {
  return (
    <CardShell>
      <IphoneMockup variant="orange">
        <div className="flex h-full w-full items-center justify-center">
          <CodexAtmosphere />
        </div>
      </IphoneMockup>
    </CardShell>
  )
}
