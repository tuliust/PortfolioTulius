import { lazy, Suspense } from "react"
import { createBrowserRouter } from "react-router"
import { NotFound } from "../components/NotFound"
import { PublicSite } from "../components/public/PublicSite"

const AdminApp = lazy(() =>
  import("../components/admin/AdminApp").then((module) => ({
    default: module.AdminApp,
  })),
)
const AdminLogin = lazy(() =>
  import("../components/admin/AdminLogin").then((module) => ({
    default: module.AdminLogin,
  })),
)
const AdminPreview = lazy(() =>
  import("../components/admin/AdminApp").then((module) => ({
    default: module.AdminPreview,
  })),
)

function Deferred({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="admin-loading">Carregando…</div>}>{children}</Suspense>
}

export const router = createBrowserRouter([
  { path: "/", Component: PublicSite },
  {
    path: "/admin/login",
    element: (
      <Deferred>
        <AdminLogin />
      </Deferred>
    ),
  },
  {
    path: "/admin/preview",
    element: (
      <Deferred>
        <AdminPreview />
      </Deferred>
    ),
  },
  {
    path: "/admin/*",
    element: (
      <Deferred>
        <AdminApp />
      </Deferred>
    ),
  },
  { path: "*", Component: NotFound },
])
