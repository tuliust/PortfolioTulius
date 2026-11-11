import { readFileSync } from "node:fs"
import { chmod, lstat, mkdir, readFile, readdir, writeFile } from "node:fs/promises"
import { createHash } from "node:crypto"
import { isAbsolute, relative, resolve, sep, join, parse } from "node:path"
import { loadManifest } from "./storage-plan.mjs"

const sha = (buffer) => createHash("sha256").update(buffer).digest("hex")
const EXPECTED_REF = "zfnrhzplwpjpdljraypt"
const backupFile = (bucket, path) => sha(Buffer.from(JSON.stringify([bucket, path]))) + ".bin"

function validateBackupIndex(data) {
  if (!data || data.version !== 1 || data.projectRef !== EXPECTED_REF ||
      data.complete !== true || !Array.isArray(data.items)) {
    throw new Error("HYG_INVALID_BACKUP_INDEX")
  }
  const objects = new Set()
  const files = new Set()
  let bytes = 0
  for (const entry of data.items) {
    const objectKey = JSON.stringify([entry.bucket, entry.path])
    if (!["portfolio-public", "portfolio-private"].includes(entry.bucket) ||
        typeof entry.path !== "string" || !entry.path ||
        entry.file !== backupFile(entry.bucket, entry.path) ||
        !/^[a-f0-9]{64}$/.test(entry.sha256) ||
        !Number.isSafeInteger(entry.bytes) || entry.bytes < 0 ||
        objects.has(objectKey) || files.has(entry.file)) {
      throw new Error("HYG_INVALID_BACKUP_INDEX")
    }
    objects.add(objectKey)
    files.add(entry.file)
    bytes += entry.bytes
  }
  if (data.expectedObjects !== data.items.length || data.expectedBytes !== bytes) {
    throw new Error("HYG_BACKUP_TOTAL_MISMATCH")
  }
  return { data, files, bytes }
}

function validateBackupAgainstManifest(data, manifest) {
  if (data.items.length !== manifest.items.length) {
    throw new Error("HYG_BACKUP_MANIFEST_COUNT_MISMATCH")
  }
  const recorded = new Map(data.items.map((entry) => [
    JSON.stringify([entry.bucket, entry.path]), entry,
  ]))
  for (const item of manifest.items) {
    const entry = recorded.get(JSON.stringify([item.bucket, item.path]))
    if (!entry || entry.bytes !== item.size ||
        (item.sha256 !== undefined && entry.sha256 !== item.sha256)) {
      throw new Error("HYG_BACKUP_MANIFEST_MISMATCH")
    }
  }
}

async function readSafeBackupFile(target) {
  const stat = await lstat(target)
  if (!stat.isFile() || stat.isSymbolicLink()) throw new Error("HYG_BACKUP_UNSAFE_FILE")
  return readFile(target)
}

async function verifyBackupDirectory(absolute, manifest = null) {
  const { data, files } = validateBackupIndex(
    JSON.parse(readFileSync(join(absolute, "index.json"), "utf8")),
  )
  if (manifest) validateBackupAgainstManifest(data, manifest)
  const directoryEntries = await readdir(absolute)
  const expectedEntries = new Set(["index.json", ...files])
  if (directoryEntries.length !== expectedEntries.size ||
      directoryEntries.some((name) => !expectedEntries.has(name))) {
    throw new Error("HYG_BACKUP_DIRECTORY_MISMATCH")
  }
  for (const entry of data.items) {
    const bytes = await readSafeBackupFile(join(absolute, entry.file))
    if (bytes.byteLength !== entry.bytes || sha(bytes) !== entry.sha256) {
      throw new Error("HYG_BACKUP_CORRUPTED")
    }
  }
  return data
}

export async function inspectPartialBackup(absolute, manifest) {
  const expected = new Map(manifest.items.map((item) => [
    backupFile(item.bucket, item.path), item,
  ]))
  const entries = await readdir(absolute)
  if (entries.includes("index.json")) throw new Error("HYG_BACKUP_INDEX_ALREADY_EXISTS")
  if (entries.some((name) => !expected.has(name))) {
    throw new Error("HYG_BACKUP_PARTIAL_DIRECTORY_MISMATCH")
  }
  const reusable = new Map()
  for (const file of entries) {
    const item = expected.get(file)
    const bytes = await readSafeBackupFile(join(absolute, file))
    if (bytes.byteLength !== item.size) throw new Error("HYG_BACKUP_PARTIAL_SIZE_MISMATCH")
    const digest = sha(bytes)
    if (item.sha256 && digest !== item.sha256) {
      throw new Error("HYG_BACKUP_PARTIAL_SHA256_MISMATCH")
    }
    reusable.set(file, { bytes, digest, sourceHashVerified: Boolean(item.sha256) })
  }
  return reusable
}
const has = (s) => process.argv.includes(s)
const arg = (s) => {
  const i = process.argv.indexOf(s)
  return i < 0 ? null : process.argv[i + 1]
}
const manifestPath = arg("--manifest")
const verifyDirectory = arg("--verify-backup")
const inspectDirectory = arg("--inspect-partial")
if (!manifestPath && !verifyDirectory) {
  throw new Error("Uso: --manifest arquivo.json [--execute-backup|--inspect-partial diretorio] OU --verify-backup diretorio")
}
if (inspectDirectory) {
  const manifest = loadManifest(manifestPath)
  const reusable = await inspectPartialBackup(resolve(inspectDirectory), manifest)
  console.log(JSON.stringify({
    partial: true,
    reusable: reusable.size,
    sourceHashVerified: [...reusable.values()].filter((entry) => entry.sourceHashVerified).length,
    networkUsed: false,
  }))
} else if (verifyDirectory) {
  const absolute = resolve(verifyDirectory)
  const manifest = manifestPath ? loadManifest(manifestPath) : null
  const data = await verifyBackupDirectory(absolute, manifest)
  const paired = new Map()
  for (const entry of data.items) {
    const record = paired.get(entry.path) ?? {}
    record[entry.bucket] = entry.sha256
    paired.set(entry.path, record)
  }
  let matchingPairs = 0
  let differingPairs = 0
  for (const record of paired.values()) {
    if (record["portfolio-public"] && record["portfolio-private"]) {
      if (record["portfolio-public"] === record["portfolio-private"]) matchingPairs++
      else differingPairs++
    }
  }
  console.log(JSON.stringify({
    verified: data.items.length, complete: true,
    manifestMatched: Boolean(manifest), matchingPairs, differingPairs,
    note: "Comparação SHA-256 apenas dos pares presentes neste backup",
  }))
} else {
  const manifest = loadManifest(manifestPath)
  if (!has("--execute-backup")) {
    console.log(JSON.stringify({
      dryRun: true, objects: manifest.items.length, bytesExpected: manifest.items.reduce((n, x) => n + x.size, 0),
      networkUsed: false, written: 0,
    }))
  } else {
    const rawUrl = process.env.HYG_STORAGE_URL
    const secret = process.env.HYG_STORAGE_SERVICE_ROLE_KEY
    const directory = process.env.HYG_BACKUP_DIR
    if (!rawUrl || !secret || !directory || !isAbsolute(directory)) {
      throw new Error("HYG_BACKUP_REQUIRE_EXPLICIT_PRIVATE_ENV")
    }
    const url = new URL(rawUrl)
    if (url.href !== "https://zfnrhzplwpjpdljraypt.supabase.co/" ||
        url.username || url.password) {
      throw new Error("HYG_BACKUP_WRONG_PROJECT")
    }
    const absolute = resolve(directory)
    const repo = resolve(process.cwd())
    const child = relative(repo, absolute)
    if (!child || child === "." || (!child.startsWith(".."+sep) && child !== ".." && !isAbsolute(child))) {
      throw new Error("HYG_BACKUP_MUST_BE_OUTSIDE_REPOSITORY")
    }
    if (absolute === parse(absolute).root || absolute === "/tmp") throw new Error("HYG_BACKUP_UNSAFE_DIRECTORY")
    await mkdir(absolute, { mode: 0o700, recursive: true })
    await chmod(absolute, 0o700)
    const entries = await readdir(absolute)
    if (entries.includes("index.json")) {
      const completed = await verifyBackupDirectory(absolute, manifest)
      console.log(JSON.stringify({
        complete: true, alreadyComplete: true, backedUp: completed.items.length,
        downloaded: 0, reused: completed.items.length,
      }))
      process.exit(0)
    }
    const reusable = await inspectPartialBackup(absolute, manifest)
    const { createClient } = await import("@supabase/supabase-js")
    const client = createClient(url.href, secret, { auth: { persistSession: false, autoRefreshToken: false } })
    const recorded = []
    let downloaded = 0
    let reused = 0
    for (const item of manifest.items) {
      const file = backupFile(item.bucket, item.path)
      const existing = reusable.get(file)
      let content
      let digest
      if (existing?.sourceHashVerified) {
        content = existing.bytes
        digest = existing.digest
        reused++
      } else {
        const result = await client.storage.from(item.bucket).download(item.path)
        if (result.error || !result.data) throw new Error("HYG_DOWNLOAD_FAILED")
        content = Buffer.from(await result.data.arrayBuffer())
        if (content.byteLength !== item.size) throw new Error("HYG_SIZE_MISMATCH")
        digest = sha(content)
        if (item.sha256 && digest !== item.sha256) throw new Error("HYG_SHA256_MISMATCH")
        if (existing) {
          if (digest !== existing.digest) throw new Error("HYG_BACKUP_PARTIAL_REMOTE_MISMATCH")
          reused++
        } else {
          await writeFile(join(absolute, file), content, { flag: "wx", mode: 0o600 })
          downloaded++
        }
      }
      recorded.push({ bucket: item.bucket, path: item.path, file, bytes: content.byteLength, sha256: digest })
    }
    await writeFile(join(absolute, "index.json"), JSON.stringify({
      version: 1,
      projectRef: manifest.projectRef,
      complete: true,
      expectedObjects: manifest.items.length,
      expectedBytes: manifest.items.reduce((total, item) => total + item.size, 0),
      items: recorded,
    }, null, 2), { flag: "wx", mode: 0o600 })
    console.log(JSON.stringify({
      complete: true,
      backedUp: recorded.length,
      downloaded,
      reused,
      verification: "node scripts/hygiene/storage-backup.mjs --verify-backup " + absolute + " --manifest " + resolve(manifestPath),
    }))
  }
}
