import IphoneMockup from "@/components/iphone-mockup"
import CodexAtmosphere from "./codex-atmosphere"

export default function MotionButton() {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <IphoneMockup variant="orange">
        <div className="flex h-full w-full items-center justify-center">
          <CodexAtmosphere />
        </div>
      </IphoneMockup>
    </div>
  )
}
