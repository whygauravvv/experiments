import IphoneMockup from "@/components/iphone-mockup"
import { Button } from "@/components/ui/button"

export default function IphoneMockupDemo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <IphoneMockup variant="orange" overlayColor="white">
        <div className="bg- flex h-full w-full items-center justify-center">
          <Button className="">Hello</Button>
        </div>
      </IphoneMockup>
    </div>
  )
}
