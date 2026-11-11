import test from "node:test"
import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import { mkdtemp, mkdir, writeFile } from "node:fs/promises"
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
  await writeFile(join(directory, entry.file), content)
  await writeFile(join(directory, "index.json"), JSON.stringify(index))
  return { directory, entry }
}

function verify(directory) {
  return spawnSync(process.execPath, [script, "--verify-backup", directory], {
    encoding: "utf8",
  })
}

test("accepts a complete deterministic backup index", async () => {
  const { directory } = await fixture()
  const result = verify(directory)
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /"verified":1/)
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
