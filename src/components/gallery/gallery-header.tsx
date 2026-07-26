import { getSoundEnabled, updateSoundEnabled } from "@/lib/sound"
import { Volume2, VolumeX } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"

const links = [
  { name: "Github", href: "https://github.com/whygauravvv/experiments/" },
  { name: "Instagram", href: "https://www.instagram.com/whygauravvv/" },
  { name: "Twitter", href: "https://x.com/whygauravvv" },
  { name: "Home", href: "https://yashgaurav.in" },
]

function GalleryFooter() {
  const [isSoundEnabled, setIsSoundEnabled] = useState(getSoundEnabled)

  const toggleSound = () => {
    const nextEnabled = !isSoundEnabled
    updateSoundEnabled(nextEnabled)
    setIsSoundEnabled(nextEnabled)
  }

  return (
    <footer className="flex h-14 min-w-0 flex-col gap-2 bg-background p-1">
      <div className="flex gap-2">
        {links.map((link) => (
          <div key={link.name}>
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              data-cuelume-hover="tick"
              className="bg-muted px-1 py-0.5 font-rounded text-sm text-muted-foreground duration-150 hover:bg-black hover:text-white"
            >
              {link.name}
            </a>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <p className="text-xs text-muted-foreground">© 2026 Yash Gaurav</p>
        <button
          type="button"
          aria-label={
            isSoundEnabled
              ? "Mute interaction sounds"
              : "Enable interaction sounds"
          }
          aria-pressed={isSoundEnabled}
          title={isSoundEnabled ? "Mute sounds" : "Enable sounds"}
          onClick={toggleSound}
          className="grid size-5 cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.span
              key={isSoundEnabled ? "sound-on" : "sound-off"}
              initial={{ opacity: 0, scale: 0.55, rotate: -18 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.55, rotate: 18 }}
              transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
              className="grid place-items-center"
              aria-hidden="true"
            >
              {isSoundEnabled ? (
                <Volume2 className="size-3" strokeWidth={1.8} />
              ) : (
                <VolumeX className="size-3" strokeWidth={1.8} />
              )}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
    </footer>
  )
}

export default function GalleryHeader() {
  return (
    <header className="relative z-10 flex flex-col justify-between space-y-8 p-6 md:space-y-0 lg:h-full lg:min-h-0 lg:p-8">
      <div className="space-y-6 bg-background p-1">
        <div>
          <h1 className="text-[clamp(2.2rem,3.35vw,2.65rem)] leading-[0.94] font-semibold tracking-[-0.04em]">
            Experiments
            <div className="ml-1 inline-block size-2 rounded-full bg-linear-to-t from-blue-300 to-blue-700" />
          </h1>
          <p className="pt-1 text-xs text-muted-foreground/50">
            By Yash Gaurav
          </p>
        </div>
        <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
          <p>
            My attempt to share my interaction studies, interface details, and
            working prototypes.
          </p>
        </div>
      </div>

      <GalleryFooter />
    </header>
  )
}
