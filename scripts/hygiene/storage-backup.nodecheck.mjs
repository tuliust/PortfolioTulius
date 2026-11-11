import test from "node:test"
import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import { lstat, mkdtemp, mkdir, readFile, symlink, unlink, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"

const ref = "zfnrhzplwpjpdljraypt"
const script = fileURLToPath(new URL("./storage-backup.mjs", import.meta.url))
const sha = (value) => createHash("sha256").update(value).digest("hex")
const fileFor = (bucket, path) => sha(Buffer.from(JSON.stringify([bucket, path]))) + ".bin"

async function fixture(mutator = (index) => index) {
  const root = await mkdtemp(join(tmpdir(), "portfolio-storage-backup-"))
  const directory = join(root, "backup")
  await mkdir(directory)
  const content = Buffer.from("bytes verificaveis")
  const entry = {
    bucket: "portfolio-public",
    path: "folder/example.bin",
    file: fileFor("portfolio-public", "folder/example.bin"),
    bytes: content.byteLength,
    sha256: sha(content),
  }
  const index = mutator({
    version: 1,
    projectRef: ref,
    complete: true,
    expectedObjects: 1,
    expectedBytes: content.byteLength,
    items: [entry],
  })
  const manifest = {
    version: 1,
    projectRef: ref,
    items: [{
      bucket: entry.bucket,
      path: entry.path,
      registered: false,
      currentPublished: false,
      anyBlock: false,
      inRevisions: true,
      inSeo: false,
      sameMetaPair: false,
      size: content.byteLength,
      sha256: entry.sha256,
    }],
  }
  const manifestPath = join(root, "manifest.json")
  await writeFile(join(directory, entry.file), content)
  await writeFile(join(directory, "index.json"), JSON.stringify(index))
  await writeFile(manifestPath, JSON.stringify(manifest))
  return { directory, entry, manifestPath }
}

function verify(directory, manifestPath = null) {
  const args = [script, "--verify-backup", directory]
  if (manifestPath) args.push("--manifest", manifestPath)
  return spawnSync(process.execPath, args, {
    encoding: "utf8",
  })
}

function inspectPartial(directory, manifestPath) {
  return spawnSync(process.execPath, [
    script, "--manifest", manifestPath, "--inspect-partial", directory,
  ], { encoding: "utf8" })
}

function executeBackup(directory, manifestPath) {
  return spawnSync(process.execPath, [
    script, "--manifest", manifestPath, "--execute-backup",
  ], {
    encoding: "utf8",
    env: {
      ...process.env,
      HYG_STORAGE_URL: "https://zfnrhzplwpjpdljraypt.supabase.co/",
      HYG_STORAGE_SERVICE_ROLE_KEY: "offline-test-placeholder",
      HYG_BACKUP_DIR: directory,
    },
  })
}

test("accepts a complete deterministic backup index matched to its manifest", async () => {
  const { directory, manifestPath } = await fixture()
  const result = verify(directory, manifestPath)
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /"verified":1/)
  assert.match(result.stdout, /"manifestMatched":true/)
})

test("does not claim manifest proof when verification omits the manifest", async () => {
  const { directory } = await fixture()
  const result = verify(directory)
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /"manifestMatched":false/)
})

test("rejects wrong project, forged filename and inconsistent totals", async () => {
  for (const mutate of [
    (index) => ({ ...index, projectRef: "wrong" }),
    (index) => ({ ...index, items: [{ ...index.items[0], file: "0".repeat(64) + ".bin" }] }),
    (index) => ({ ...index, expectedBytes: index.expectedBytes + 1 }),
  ]) {
    const { directory } = await fixture(mutate)
    const result = verify(directory)
    assert.notEqual(result.status, 0)
    assert.match(result.stderr, /HYG_(INVALID_BACKUP_INDEX|BACKUP_TOTAL_MISMATCH)/)
  }
})

test("rejects duplicate objects and unindexed files", async () => {
  const duplicated = await fixture((index) => ({
    ...index,
    expectedObjects: 2,
    expectedBytes: index.expectedBytes * 2,
    items: [index.items[0], { ...index.items[0] }],
  }))
  assert.notEqual(verify(duplicated.directory).status, 0)

  const extra = await fixture()
  await writeFile(join(extra.directory, "not-indexed.bin"), "extra")
  const result = verify(extra.directory)
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /HYG_BACKUP_DIRECTORY_MISMATCH/)
})

test("rejects a self-consistent backup that is truncated against the manifest", async () => {
  const { directory, manifestPath } = await fixture()
  const secondContent = Buffer.from("segundo objeto")
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"))
  manifest.items.push({
    ...manifest.items[0],
    path: "folder/second.bin",
    size: secondContent.byteLength,
    sha256: sha(secondContent),
  })
  await writeFile(manifestPath, JSON.stringify(manifest))
  const result = verify(directory, manifestPath)
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /HYG_BACKUP_MANIFEST_COUNT_MISMATCH/)
})

test("rejects manifest size or checksum disagreement", async () => {
  for (const mutate of [
    (item) => ({ ...item, size: item.size + 1 }),
    (item) => ({ ...item, sha256: "0".repeat(64) }),
  ]) {
    const { directory, manifestPath } = await fixture()
    const manifest = JSON.parse(await readFile(manifestPath, "utf8"))
    manifest.items[0] = mutate(manifest.items[0])
    await writeFile(manifestPath, JSON.stringify(manifest))
    const result = verify(directory, manifestPath)
    assert.notEqual(result.status, 0)
    assert.match(result.stderr, /HYG_BACKUP_MANIFEST_MISMATCH/)
  }
})

test("accepts an intact resumable partial backup without network access", async () => {
  const { directory, manifestPath } = await fixture()
  const index = JSON.parse(await readFile(join(directory, "index.json"), "utf8"))
  await unlink(join(directory, "index.json"))
  const result = inspectPartial(directory, manifestPath)
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /"reusable":1/)
  assert.match(result.stdout, /"sourceHashVerified":1/)
  assert.match(result.stdout, /"networkUsed":false/)
  assert.equal(index.items.length, 1)
})

test("treats a verified completed backup as an idempotent no-op", async () => {
  const { directory, manifestPath } = await fixture()
  const result = executeBackup(directory, manifestPath)
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /"alreadyComplete":true/)
  assert.match(result.stdout, /"downloaded":0/)
  assert.match(result.stdout, /"reused":1/)
})

test("recovers from a stale partial index and commits a complete index atomically", async () => {
  const { directory, manifestPath } = await fixture()
  await unlink(join(directory, "index.json"))
  await writeFile(join(directory, ".index.json.partial"), "indice interrompido")

  const result = executeBackup(directory, manifestPath)
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /"downloaded":0/)
  assert.match(result.stdout, /"reused":1/)
  assert.equal((await lstat(join(directory, "index.json"))).isFile(), true)
  await assert.rejects(lstat(join(directory, ".index.json.partial")), { code: "ENOENT" })
  assert.equal(verify(directory, manifestPath).status, 0)
})

test("rejects an unsafe stale partial index instead of deleting it", async () => {
  const { directory, manifestPath } = await fixture()
  await unlink(join(directory, "index.json"))
  await symlink(manifestPath, join(directory, ".index.json.partial"))

  const result = executeBackup(directory, manifestPath)
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /HYG_BACKUP_UNSAFE_INDEX_PARTIAL/)
})

test("rejects corrupt, unexpected or symbolic-link partial files", async () => {
  const corrupt = await fixture()
  await unlink(join(corrupt.directory, "index.json"))
  await writeFile(join(corrupt.directory, corrupt.entry.file), "bytes corrompidos")
  assert.match(inspectPartial(corrupt.directory, corrupt.manifestPath).stderr,
    /HYG_BACKUP_PARTIAL_(SIZE|SHA256)_MISMATCH/)

  const extra = await fixture()
  await unlink(join(extra.directory, "index.json"))
  await writeFile(join(extra.directory, "unexpected.bin"), "extra")
  assert.match(inspectPartial(extra.directory, extra.manifestPath).stderr,
    /HYG_BACKUP_PARTIAL_DIRECTORY_MISMATCH/)

  const linked = await fixture()
  await Promise.all([
    unlink(join(linked.directory, "index.json")),
    unlink(join(linked.directory, linked.entry.file)),
  ])
  await symlink(linked.manifestPath, join(linked.directory, linked.entry.file))
  const linkedResult = inspectPartial(linked.directory, linked.manifestPath)
  assert.notEqual(linkedResult.status, 0)
  assert.match(linkedResult.stderr, /HYG_BACKUP_UNSAFE_FILE/)
})
