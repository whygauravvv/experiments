import CardShell from "@/components/card-shell"
import IPhoneMockup from "@/components/iphone-mockup"
import CodexAtmosphere from "./codex-atmosphere"

export default function CodexPhone() {
  return (
    <CardShell>
      <IPhoneMockup variant="orange">
        <div className="flex h-full w-full items-center justify-center">
          <CodexAtmosphere />
        </div>
      </IPhoneMockup>
    </CardShell>
  )
}
