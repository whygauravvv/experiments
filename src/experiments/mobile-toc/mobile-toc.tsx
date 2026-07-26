import CardShell from "@/components/card-shell"
import IPhoneMockup from "@/components/iphone-mockup"
import { useEscapeKey } from "@/hooks/use-escape-key"
import { MOTION_EASE } from "@/lib/motion"
import { ChevronRight } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { useRef, useState } from "react"

import "./mobile-toc.css"

const EXIT_EASE: [number, number, number, number] = [0.4, 0, 1, 1]

const ARTICLE_SECTIONS = [
  {
    id: "introduction",
    title: "Introduction",
    paragraphs: [
      "Modern software rarely lives in isolation. It connects to identity providers, billing systems, analytics tools, and the internal services that keep a product running. Each connection introduces its own language, constraints, and edge cases.",
      "A thoughtful implementation begins with the people who will operate it. Clear defaults make the common path easy, while carefully chosen escape hatches leave room for unusual requirements without making every workflow feel complicated.",
    ],
  },
  {
    id: "inactive-users",
    title: "Handle inactive users",
    paragraphs: [
      "Consistency becomes especially important as a system grows. Shared patterns help teams recognize what will happen next, reduce the number of decisions they need to make, and create a product that feels dependable across every screen.",
      "Inactive accounts need equally clear rules. Retention windows, ownership changes, and reactivation paths should be predictable enough that teams can act without losing important context.",
    ],
  },
  {
    id: "scaling",
    title: "Make sure it scales",
    paragraphs: [
      "Scale changes the nature of small technical choices. A shortcut that works for a handful of customers can become expensive when thousands of organizations depend on it. Durable boundaries and observable behavior make those transitions easier to manage.",
      "Performance is part of that experience. Fast feedback creates confidence, while predictable loading and transition states help people understand what the system is doing even when an operation takes more time than expected.",
    ],
  },
  {
    id: "out-of-sync-events",
    title: "Handle out-of-sync events",
    paragraphs: [
      "Good interfaces acknowledge that work is rarely perfect on the first attempt. They preserve context, explain errors in plain language, and make recovery feel like a natural part of the workflow rather than an exceptional event.",
      "When events arrive late or out of order, the system should show what changed, retain the latest trustworthy state, and offer a safe path back to consistency.",
    ],
  },
  {
    id: "concurrent-requests",
    title: "Handle concurrent requests",
    paragraphs: [
      "Concurrency deserves the same care. Conflicting edits should be detected before information is overwritten, and the recovery path should make it obvious which values were preserved.",
      "Accessibility strengthens these foundations. Semantic structure, keyboard support, and clear focus states make an interface easier to navigate for everyone, especially when the surrounding task is already demanding.",
    ],
  },
  {
    id: "tls",
    title: "Use TLS 1.2",
    paragraphs: [
      "Security should be a dependable part of the platform rather than a final layer added at launch. Modern transport encryption, careful defaults, and visible operational signals help protect every connection.",
      "Over time, those small improvements compound. A reliable experience earns trust not through a single dramatic feature, but through hundreds of considered decisions that continue to hold together from the first screen to the last.",
    ],
  },
]

/** A mobile reading surface that slides aside to reveal a compact table of contents. */
export default function MobileToc() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSectionId, setActiveSectionId] = useState("introduction")
  const articleRef = useRef<HTMLElement>(null)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const shouldReduceMotion = useReducedMotion()

  useEscapeKey(isOpen, () => setIsOpen(false))

  function syncActiveSection() {
    const article = articleRef.current

    if (!article) return

    const readingLine = article.scrollTop + article.clientHeight * 0.2
    let nextSectionId = "introduction"

    for (const section of ARTICLE_SECTIONS) {
      const element = sectionRefs.current[section.id]

      if (!element || element.offsetTop > readingLine) break
      nextSectionId = section.id
    }

    setActiveSectionId((currentId) =>
      currentId === nextSectionId ? currentId : nextSectionId
    )
  }

  function goToSection(sectionId: string) {
    const article = articleRef.current
    const section = sectionRefs.current[sectionId]

    if (!article || !section) return

    setActiveSectionId(sectionId)
    setIsOpen(false)

    requestAnimationFrame(() => {
      section.focus({ preventScroll: true })
      article.scrollTo({
        top: Math.max(0, section.offsetTop - article.clientHeight * 0.065),
        behavior: shouldReduceMotion ? "auto" : "smooth",
      })
    })
  }

  return (
    <CardShell className="mobile-toc">
      <IPhoneMockup
        variant="silver"
        screenClassName="bg-black shadow-none"
        contentClassName="mobile-toc__screen"
        showStatusBar={false}
        showHomeBar={false}
      >
        <motion.div
          className="mobile-toc__track"
          animate={{ x: isOpen ? "-63%" : "0%" }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.36, ease: MOTION_EASE }
          }
        >
          <article
            ref={articleRef}
            aria-label="Identity infrastructure article"
            aria-hidden={isOpen}
            className="mobile-toc__article"
            onScroll={syncActiveSection}
          >
            <div className="mobile-toc__article-copy">
              {ARTICLE_SECTIONS.map((section) => (
                <section
                  key={section.id}
                  ref={(element) => {
                    sectionRefs.current[section.id] = element
                  }}
                  id={`mobile-toc-section-${section.id}`}
                  className="mobile-toc__article-section"
                  tabIndex={-1}
                >
                  <h2>{section.title}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </section>
              ))}
            </div>
          </article>

          <nav
            id="mobile-toc-navigation"
            aria-label="Table of contents"
            aria-hidden={!isOpen}
            className="mobile-toc__navigation"
          >
            <ol>
              {ARTICLE_SECTIONS.map((section, index) => (
                <motion.li
                  key={section.id}
                  initial={false}
                  animate={
                    isOpen
                      ? {
                          opacity: 1,
                          x: 0,
                          y: 0,
                          filter: "blur(0px)",
                        }
                      : {
                          opacity: 0,
                          x: "22%",
                          y: 4,
                          filter: "blur(2px)",
                        }
                  }
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : isOpen
                        ? {
                            delay: 0.08 + index * 0.045,
                            duration: 0.22,
                            ease: MOTION_EASE,
                          }
                        : {
                            delay:
                              (ARTICLE_SECTIONS.length - 1 - index) * 0.035,
                            duration: 0.17,
                            ease: EXIT_EASE,
                          }
                  }
                  className={
                    activeSectionId === section.id
                      ? "mobile-toc__navigation-item--active"
                      : ""
                  }
                >
                  <button
                    type="button"
                    className="mobile-toc__navigation-button"
                    aria-current={
                      activeSectionId === section.id ? "location" : undefined
                    }
                    tabIndex={isOpen ? 0 : -1}
                    onClick={() => goToSection(section.id)}
                  >
                    {section.title}
                  </button>
                </motion.li>
              ))}
            </ol>
          </nav>

          <button
            type="button"
            aria-label={
              isOpen ? "Close table of contents" : "Open table of contents"
            }
            aria-expanded={isOpen}
            aria-controls="mobile-toc-navigation"
            className="mobile-toc__handle"
            data-open={isOpen}
            onClick={() => setIsOpen((open) => !open)}
          >
            <svg
              aria-hidden="true"
              className="mobile-toc__handle-shape"
              viewBox="0 0 24 104"
              preserveAspectRatio="none"
            >
              <path d="M24 0C24 13 0 14 0 31V73C0 90 24 91 24 104V0Z" />
            </svg>

            <span className="mobile-toc__grip" aria-hidden="true">
              {ARTICLE_SECTIONS.map((section) => (
                <span
                  key={section.id}
                  data-active={activeSectionId === section.id}
                />
              ))}
            </span>

            <ChevronRight
              aria-hidden="true"
              className="mobile-toc__chevron"
              strokeWidth={1.7}
            />
          </button>
        </motion.div>
      </IPhoneMockup>
    </CardShell>
  )
}
