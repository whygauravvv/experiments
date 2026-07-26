import CardShell from "@/components/card-shell"
import { Airbnb } from "@/components/ui/svgs/airbnb"
import { Discord } from "@/components/ui/svgs/discord"
import { Dropbox } from "@/components/ui/svgs/dropbox"
import { Figma } from "@/components/ui/svgs/figma"
import { Framer } from "@/components/ui/svgs/framer"
import { GithubLight } from "@/components/ui/svgs/githubLight"
import { InstagramIcon } from "@/components/ui/svgs/instagramIcon"
import { Linear } from "@/components/ui/svgs/linear"
import { NetflixIcon } from "@/components/ui/svgs/netflixIcon"
import { Notion } from "@/components/ui/svgs/notion"
import { Raycast } from "@/components/ui/svgs/raycast"
import { ReactLight } from "@/components/ui/svgs/reactLight"
import { Reddit } from "@/components/ui/svgs/reddit"
import { SanityLight } from "@/components/ui/svgs/sanityLight"
import { Slack } from "@/components/ui/svgs/slack"
import { Spotify } from "@/components/ui/svgs/spotify"
import { Stripe } from "@/components/ui/svgs/stripe"
import { Supabase } from "@/components/ui/svgs/supabase"
import { Telegram } from "@/components/ui/svgs/telegram"
import { Twitch } from "@/components/ui/svgs/twitch"
import { Vercel } from "@/components/ui/svgs/vercel"
import { WhatsappIcon } from "@/components/ui/svgs/whatsappIcon"
import { Youtube } from "@/components/ui/svgs/youtube"
import { Zoom } from "@/components/ui/svgs/zoom"
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react"
import {
  useLayoutEffect,
  useRef,
  type ComponentType,
  type KeyboardEvent,
  type SVGProps,
} from "react"

import "./app-icon-loop.css"

const SCENE_WIDTH = 1000
const SCENE_HEIGHT = 600
const CYCLE_DURATION_MS = 11_000
const HOVER_SPEED = 0.3

const LOGOS = [
  { name: "Figma", Icon: Figma },
  { name: "GitHub", Icon: GithubLight },
  { name: "Supabase", Icon: Supabase },
  { name: "Vercel", Icon: Vercel },
  { name: "Sanity", Icon: SanityLight },
  { name: "Discord", Icon: Discord },
  { name: "Slack", Icon: Slack },
  { name: "Spotify", Icon: Spotify },
  { name: "Linear", Icon: Linear },
  { name: "Raycast", Icon: Raycast },
  { name: "Notion", Icon: Notion },
  { name: "Stripe", Icon: Stripe },
  { name: "Framer", Icon: Framer },
  { name: "YouTube", Icon: Youtube },
  { name: "Reddit", Icon: Reddit },
  { name: "Instagram", Icon: InstagramIcon },
  { name: "Twitch", Icon: Twitch },
  { name: "Dropbox", Icon: Dropbox },
  { name: "Airbnb", Icon: Airbnb },
  { name: "Telegram", Icon: Telegram },
  { name: "WhatsApp", Icon: WhatsappIcon },
  { name: "Netflix", Icon: NetflixIcon },
  { name: "Zoom", Icon: Zoom },
  { name: "React", Icon: ReactLight },
] satisfies {
  name: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
}[]

const ITEM_SPACING = 100 / LOGOS.length

function wrapProgress(value: number) {
  return ((value % 100) + 100) % 100
}

function getEdgeOpacity(progress: number) {
  const centeredProgress = (2 * progress) / 100 - 1

  return (1 - Math.abs(centeredProgress) ** 10) ** 2
}

export default function AppIconLoop() {
  const prefersReducedMotion = useReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const progress = useMotionValue(prefersReducedMotion ? 31 : 0)
  const targetSpeed = useMotionValue(1)
  const speed = useSpring(targetSpeed, {
    stiffness: 150,
    damping: 25,
    mass: 0.9,
  })

  useLayoutEffect(() => {
    const stage = stageRef.current
    const scene = sceneRef.current
    if (!stage || !scene) return

    const updateSceneScale = () => {
      const scale = Math.min(
        stage.clientWidth / SCENE_WIDTH,
        stage.clientHeight / SCENE_HEIGHT
      )

      scene.style.setProperty("--app-icon-loop-scale", String(scale))
    }

    updateSceneScale()

    const resizeObserver = new ResizeObserver(updateSceneScale)
    resizeObserver.observe(stage)

    return () => resizeObserver.disconnect()
  }, [])

  useAnimationFrame((_, delta) => {
    if (prefersReducedMotion) return

    const nextProgress =
      progress.get() +
      (delta / CYCLE_DURATION_MS) * 100 * Math.max(speed.get(), 0)

    progress.set(wrapProgress(nextProgress))
  })

  const slow = () => targetSpeed.set(HOVER_SPEED)
  const resume = () => targetSpeed.set(1)

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== " " && event.key !== "Enter") return

    event.preventDefault()
    targetSpeed.set(targetSpeed.get() === HOVER_SPEED ? 1 : HOVER_SPEED)
  }

  return (
    <CardShell
      className="app-icon-loop p-0"
      role="region"
      aria-label="App icon loop experiment"
    >
      <div
        ref={stageRef}
        className="app-icon-loop__stage"
        role="group"
        aria-label="Animated app icons. Hover or focus to slow the loop."
        tabIndex={0}
        onPointerEnter={slow}
        onPointerLeave={resume}
        onFocus={slow}
        onBlur={resume}
        onKeyDown={handleKeyDown}
      >
        <div ref={sceneRef} className="app-icon-loop__scene">
          {LOGOS.map(({ name, Icon }, index) => (
            <LogoItem
              key={name}
              Icon={Icon}
              index={index}
              progress={progress}
            />
          ))}
        </div>
      </div>
    </CardShell>
  )
}

type LogoItemProps = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>
  index: number
  progress: MotionValue<number>
}

function LogoItem({ Icon, index, progress }: LogoItemProps) {
  const itemProgress = useTransform(progress, (latest) =>
    wrapProgress(latest + index * ITEM_SPACING)
  )
  const offsetDistance = useTransform(itemProgress, (latest) => `${latest}%`)
  const opacity = useTransform(itemProgress, getEdgeOpacity)

  return (
    <motion.div
      className="app-icon-loop__tile"
      style={{ offsetDistance, opacity }}
      aria-hidden="true"
    >
      <Icon className="app-icon-loop__logo" />
    </motion.div>
  )
}
