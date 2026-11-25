import { afterEach, describe, expect, it, vi } from "vitest"
import { waitForProfilePaint } from "./profile-paint"

function setup({ hash = "", hidden = false, decode = () => Promise.resolve() } = {}) {
  vi.useFakeTimers()
  let serial = 0
  const frames = new Map<number, FrameRequestCallback>()
  const image = { decode: vi.fn(decode) }
  vi.stubGlobal("document", {
    visibilityState: hidden ? "hidden" : "visible",
    querySelector: vi.fn(() => image),
  })
  vi.stubGlobal("window", {
    location: { hash },
    setTimeout,
    clearTimeout,
    requestAnimationFrame: (callback: FrameRequestCallback) => {
      frames.set(++serial, callback)
      return serial
    },
    cancelAnimationFrame: (id: number) => frames.delete(id),
  })
  const frame = async () => {
    const pending = [...frames.values()]
    frames.clear()
    pending.forEach((callback) => callback(0))
    await Promise.resolve()
    await Promise.resolve()
  }
  return { frame, image, frames }
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe("first-fold paint scheduling", () => {
  it("keeps noncritical content pending until decode and a paint opportunity", async () => {
    const { frame, image } = setup()
    const done = vi.fn()
    const pending = waitForProfilePaint().then(done)
    await frame()
    expect(image.decode).toHaveBeenCalledOnce()
    expect(done).not.toHaveBeenCalled()
    await frame()
    expect(done).not.toHaveBeenCalled()
    await frame()
    await pending
    expect(done).toHaveBeenCalledOnce()
  })

  it("releases the graph when an image never decodes, even without animation frames", async () => {
    const { frame, frames } = setup({ decode: () => new Promise<void>(() => {}) })
    const done = vi.fn()
    const pending = waitForProfilePaint().then(done)
    await frame()
    await vi.advanceTimersByTimeAsync(1000)
    await pending
    expect(done).toHaveBeenCalledOnce()
    expect(frames.size).toBe(0)
  })

  it("does not delay deep links or hidden tabs", async () => {
    const { image } = setup({ hash: "#cdi" })
    await waitForProfilePaint()
    expect(image.decode).not.toHaveBeenCalled()
    setup({ hidden: true })
    await waitForProfilePaint()
    expect(vi.getTimerCount()).toBe(0)
  })

  it("continues rendering after an image decoding failure", async () => {
    const { frame } = setup({ decode: () => Promise.reject(new Error("broken image")) })
    const pending = waitForProfilePaint()
    await frame()
    await frame()
    await frame()
    await pending
  })
})
