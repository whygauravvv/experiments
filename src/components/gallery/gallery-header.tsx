export default function GalleryHeader() {
  return (
    <header className="relative z-10 flex flex-col p-6 sm:p-8 lg:h-full lg:min-h-0 lg:p-10">
      <div>
        <h1 className="text-[2.65rem] leading-[0.94] font-semibold tracking-[-0.04em]">
          Experiments<span className="inline text-blue-600">.</span>
        </h1>
        <p className="pt-1 text-xs text-muted-foreground/50">By Yash Gaurav</p>

        <div className="mt-10 max-w-64 space-y-5 text-sm leading-relaxed text-muted-foreground">
          <p>
            My attempt to share my interaction studies, interface details, and
            working prototypes.
          </p>
        </div>
      </div>

      <div className="mt-auto flex items-end justify-between gap-4 pt-16 text-[11px] text-muted-foreground">
        <p>
          Made with React,
          <br />
          Motion &amp; curiosity
        </p>
        <p className="text-right">© 2026 Yash Gaurav</p>
      </div>
    </header>
  )
}
