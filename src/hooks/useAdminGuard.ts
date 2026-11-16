import { useEffect, useState } from "react"
import { isAdmin } from "../lib/supabase"

/** Shared guard for admin UI and the read-only PDF preview route. */
export function useAdminGuard() {
  const [state, setState] = useState<"loading" | "allowed" | "denied">("loading")
  useEffect(() => {
    let mounted = true
    isAdmin()
      .then((allowed) => {
        if (mounted) setState(allowed ? "allowed" : "denied")
      })
      .catch(() => {
        if (mounted) setState("denied")
      })
    return () => {
      mounted = false
    }
  }, [])
  return state
}
