import { useEffect, useRef } from "react"

/** Start muted only when the selected player is visible; native controls remain available. */
export function ExperienceVideoPlayer({
  src,
  poster,
  title,
  isActive,
}: {
  src: string
  poster?: string
  title?: string
  isActive: boolean
}) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video || !isActive) return
    video.muted = true
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let visible = false
    let attempted = false
    let resume = false

    function update() {
      if (!video) return
      if (!visible || document.hidden) {
        if (!video.paused) {
          resume = !video.ended
          video.pause()
        }
        return
      }
      if (reducedMotion.matches || video.ended || (attempted && !resume)) return
      attempted = true
      resume = false
      void video.play().catch(() => {
        // Autoplay may be blocked by the browser; native controls remain usable.
      })
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.25)
        update()
      },
      { threshold: 0.25 },
    )
    observer.observe(video)
    document.addEventListener("visibilitychange", update)
    return () => {
      observer.disconnect()
      document.removeEventListener("visibilitychange", update)
      video.pause()
    }
  }, [isActive, src])

  return (
    <video
      ref={ref}
      src={isActive ? src : undefined}
      poster={poster}
      muted
      controls
      playsInline
      preload="none"
      aria-label={title}
    />
  )
}
