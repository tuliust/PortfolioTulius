/** Let the live first fold paint before mounting the noncritical section graph. */
export function waitForProfilePaint(): Promise<void> {
  // Deep links need their destination immediately. Hidden tabs may not run RAF.
  if (window.location.hash || document.visibilityState === "hidden") return Promise.resolve()
  return new Promise((resolve) => {
    let finished = false
    let frame = 0
    const finish = () => {
      if (finished) return
      finished = true
      window.clearTimeout(deadline)
      window.cancelAnimationFrame(frame)
      resolve()
    }
    // A failed/slow image must never block navigation or the full CMS graph.
    const deadline = window.setTimeout(finish, 1000)
    frame = window.requestAnimationFrame(() => {
      const portrait = document.querySelector<HTMLImageElement>(
        "#perfil-a .mobile-profile-hero img, #perfil-a .mobile360-photo img, .profile-portrait img",
      )
      if (!portrait) {
        finish()
        return
      }
      void portrait
        .decode()
        .catch(() => undefined)
        .then(() => {
          if (finished) return
          // The first callback precedes paint; yield through a second frame so
          // React's noncritical update cannot occupy that first paint slot.
          frame = window.requestAnimationFrame(() => {
            frame = window.requestAnimationFrame(finish)
          })
        })
    })
  })
}
