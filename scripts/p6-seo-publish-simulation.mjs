// Offline contract demonstrator only. No HTTP, token inspection, or deploy action.
// Real authentication, distributed locks and retries must be tested in LOCAL staging.
export function createOfflineSeoPublisher(deliver) {
  const deliveredVersions = new Set()
  const active = new Map()
  return {
    async onChange({ actorIsAdmin, status, version }) {
      if (!actorIsAdmin) throw new Error("synthetic_admin_required")
      if (status !== "published") return { result: "draft_skipped" }
      if (typeof version !== "string" || !/^[a-z0-9-]{4,64}$/.test(version))
        throw new Error("synthetic_invalid_version")
      if (deliveredVersions.has(version)) return { result: "already_sent" }
      if (active.has(version)) return active.get(version)
      const pending = Promise.resolve()
        .then(() => deliver(version))
        .then(() => {
          deliveredVersions.add(version)
          return { result: "sent" }
        })
        .catch(() => ({ result: "failed_retryable" }))
        .finally(() => { active.delete(version) })
      active.set(version, pending)
      return pending
    },
  }
}
