import { motion } from "motion/react"
import { useState } from "react"

import IphoneMockup from "@/components/iphone-mockup"
import { Button } from "@/components/ui/button"

export default function MotionButton() {
  const [isActive, setIsActive] = useState(false)

  return (
    <div className="flex h-full items-center justify-center p-6">
      <IphoneMockup variant="orange">
        <div className="flex h-full w-full items-center justify-center">
          <motion.div
            whileHover={{ y: -4, scale: 1.03 }}
            whileTap={{ scale: 0.96, y: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 20 }}
          >
            <Button size="lg" onClick={() => setIsActive((value) => !value)}>
              <motion.span
                key={isActive ? "active" : "idle"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className="inline-flex min-w-28 justify-center"
              >
                {isActive ? "Clicked" : "Hover me"}
              </motion.span>
            </Button>
          </motion.div>
        </div>
      </IphoneMockup>
    </div>
  )
}
