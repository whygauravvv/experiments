const links = [
  { name: "Github", href: "https://github.com/whygauravvv/experiments/" },
  { name: "Instagram", href: "https://www.instagram.com/whygauravvv/" },
  { name: "Twitter", href: "https://x.com/whygauravvv" },
  { name: "Home", href: "https://yashgaurav.in" },
]

function GalleryFooter() {
  return (
    <footer className="flex h-14 min-w-0 flex-col gap-2 bg-background p-1">
      <div className="flex gap-2">
        {links.map((link) => (
          <div key={link.name}>
            <a
              href={link.href}
              target="_blank"
              className="bg-muted px-1 py-0.5 font-rounded text-sm text-muted-foreground duration-150 hover:bg-black hover:text-white"
            >
              {link.name}
            </a>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">© 2026 Yash Gaurav</p>
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
