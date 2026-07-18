import "../styles/icon-reveal.css"

import GridGlowBackground from "@/components/backgrounds/grid-glow-background"
import { useState } from "react"

const ICONS = [
  {
    name: "Innie",
    src: "https://onvxqlqjvloc8o0x.public.blob.vercel-storage.com/icons/70055fd117ffbe8c7db2d044c0ac578b70b1975a.jpg",
  },
  {
    name: "Dion",
    src: "https://onvxqlqjvloc8o0x.public.blob.vercel-storage.com/icons/ab19dd9545d46b336c980dd72f51b4fc9b94a471.jpg",
  },
  {
    name: "Are.na",
    src: "https://onvxqlqjvloc8o0x.public.blob.vercel-storage.com/icons/802c7527760cacbbb03b0a58246960b51535894c.jpg",
  },
] as const

export default function IconReveal() {
  const [failedIcons, setFailedIcons] = useState(() => new Set<string>())

  return (
    <GridGlowBackground
      className="icon-reveal"
      role="region"
      aria-label="Color reveal icon experiment"
    >
      <div className="icon-reveal__content">
        <div className="icon-reveal__icons">
          {ICONS.map((icon) => (
            <button
              key={icon.name}
              type="button"
              className="icon-reveal__icon"
              aria-label={`Reveal ${icon.name} icon in color`}
            >
              {failedIcons.has(icon.name) ? (
                <span className="icon-reveal__fallback" aria-hidden="true">
                  {icon.name.slice(0, 1)}
                </span>
              ) : (
                <>
                  <img
                    src={icon.src}
                    alt=""
                    draggable={false}
                    onError={() => {
                      setFailedIcons((current) =>
                        new Set(current).add(icon.name)
                      )
                    }}
                  />
                  <img
                    src={icon.src}
                    alt=""
                    draggable={false}
                    aria-hidden="true"
                  />
                </>
              )}
            </button>
          ))}
        </div>

        <p className="icon-reveal__hint">Hover or focus an icon</p>
      </div>
    </GridGlowBackground>
  )
}
