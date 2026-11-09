import { beforeEach, describe, expect, it, vi } from "vitest"
import { publishPrivateMedia, uploadPublishedMedia } from "./media-library-actions"

const mocks = vi.hoisted(() => ({
  updateResult: vi.fn(),
  insertResult: vi.fn(),
  readResult: vi.fn(),
  removeResult: vi.fn(),
  downloadResult: vi.fn(),
  uploadResult: vi.fn(),
  removals: [] as string[],
}))

vi.mock("./supabase", () => {
  const query = {
    eq: () => query,
    select: () => query,
    single: () => mocks.updateResult(),
    maybeSingle: () => mocks.readResult(),
  }
  return {
    supabase: {
      from: () => ({
        update: () => query,
        select: () => query,
        insert: () => mocks.insertResult(),
      }),
      storage: {
        from: (bucket: string) => ({
          download: () => mocks.downloadResult(),
          upload: () => mocks.uploadResult(),
          remove: () => {
            mocks.removals.push(bucket)
            return mocks.removeResult(bucket)
          },
        }),
      },
    },
  }
})

const asset = {
  id: "private-asset-fixture",
  storage_bucket: "portfolio-private",
  storage_path: "synthetic/release.svg",
  mime_type: "image/svg+xml",
}
const privateRow = {
  storage_bucket: "portfolio-private",
  storage_path: asset.storage_path,
  status: "draft",
}
const publicRow = {
  storage_bucket: "portfolio-public",
  storage_path: asset.storage_path,
  status: "published",
}

describe("private media publication reconciliation", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.removals.length = 0
    mocks.downloadResult.mockResolvedValue({ data: new Blob(["synthetic"]), error: null })
    mocks.uploadResult.mockResolvedValue({ error: null })
    mocks.removeResult.mockResolvedValue({ error: null })
    mocks.updateResult.mockResolvedValue({ data: { id: asset.id }, error: null })
    mocks.insertResult.mockResolvedValue({ error: null })
    mocks.readResult.mockResolvedValue({ data: privateRow, error: null })
  })

  it("removes the private duplicate after a confirmed publication", async () => {
    const result = await publishPrivateMedia(asset)
    expect(result.ok).toBe(true)
    expect(mocks.removals).toEqual(["portfolio-private"])
  })

  it("preserves the public copy when an error response follows a committed update", async () => {
    mocks.updateResult.mockResolvedValue({
      data: null,
      error: { message: "connection interrupted" },
    })
    mocks.readResult.mockResolvedValue({ data: publicRow, error: null })
    const result = await publishPrivateMedia(asset)
    expect(result.ok).toBe(true)
    expect(mocks.removals).toEqual(["portfolio-private"])
  })

  it("compensates the public copy only when a fresh read proves the row remains private", async () => {
    mocks.updateResult.mockResolvedValue({ data: null, error: { message: "rejected" } })
    const result = await publishPrivateMedia(asset)
    expect(result.ok).toBe(false)
    expect(result.message).toContain("Cópia pública revertida")
    expect(mocks.removals).toEqual(["portfolio-public"])
  })

  it("retains both copies when the result cannot be confirmed", async () => {
    mocks.updateResult.mockRejectedValue(new Error("network interrupted"))
    mocks.readResult.mockResolvedValue({ data: null, error: { message: "network interrupted" } })
    const result = await publishPrivateMedia(asset)
    expect(result.ok).toBe(false)
    expect(result.message).toContain("preservada para reconciliação")
    expect(mocks.removals).toEqual([])
  })

  it("reports unsuccessful private cleanup without hiding the successful publication", async () => {
    mocks.removeResult.mockResolvedValue({ error: { message: "storage unavailable" } })
    const result = await publishPrivateMedia(asset)
    expect(result.ok).toBe(true)
    expect(result.warning).toContain("cópia privada")
    expect(mocks.removals).toEqual(["portfolio-private"])
  })
})

describe("published media upload uncertain result reconciliation", () => {
  const file = { name: "public-local.svg", type: "image/svg+xml", size: 250 } as File

  beforeEach(() => {
    vi.clearAllMocks()
    mocks.removals.length = 0
    mocks.uploadResult.mockResolvedValue({ error: null })
    mocks.removeResult.mockResolvedValue({ error: null })
    mocks.insertResult.mockResolvedValue({ error: null })
    mocks.readResult.mockResolvedValue({ data: null, error: null })
  })

  it("publishes normally without compensating a confirmed insert", async () => {
    const result = await uploadPublishedMedia(file)
    expect(result.ok).toBe(true)
    expect(mocks.removals).toEqual([])
  })

  it("preserves a catalog-backed object after an ambiguous insert error", async () => {
    mocks.insertResult.mockResolvedValue({ error: { message: "response lost" } })
    mocks.readResult.mockResolvedValue({ data: { id: "local", status: "published" }, error: null })
    const result = await uploadPublishedMedia(file)
    expect(result.ok).toBe(true)
    expect(mocks.removals).toEqual([])
  })

  it("keeps the uploaded object if the read is also unavailable", async () => {
    mocks.insertResult.mockRejectedValue(new Error("network interrupted"))
    mocks.readResult.mockResolvedValue({ data: null, error: { message: "network unavailable" } })
    const result = await uploadPublishedMedia(file)
    expect(result.ok).toBe(false)
    expect(result.message).toContain("foi preservado")
    expect(mocks.removals).toEqual([])
  })

  it("compensates an upload only when a read proves the insert failed", async () => {
    mocks.insertResult.mockResolvedValue({ error: { message: "constraint rejected" } })
    const result = await uploadPublishedMedia(file)
    expect(result.ok).toBe(false)
    expect(result.message).toContain("revertido")
    expect(mocks.removals).toEqual(["portfolio-public"])
  })

  it("reports pending cleanup when confirmed-absent catalog cannot remove Storage", async () => {
    mocks.insertResult.mockResolvedValue({ error: { message: "constraint rejected" } })
    mocks.removeResult.mockResolvedValue({ error: { message: "storage unavailable" } })
    const result = await uploadPublishedMedia(file)
    expect(result.ok).toBe(false)
    expect(result.message).toContain("remoção física pendente")
    expect(mocks.removals).toEqual(["portfolio-public"])
  })
})
