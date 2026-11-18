import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import path from "node:path"
import { defineConfig } from "vite"

export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  build: {
    modulePreload: {
      // The public entry must not preload the route-only administrative router.
      // Keep the dependencies for dynamic JS imports (including /admin) intact.
      resolveDependencies: (_filename, deps, { hostType }) =>
        hostType === "html"
          ? deps.filter((dep) => !/(^|\/)admin-router-[^/]+\.js$/.test(dep))
          : deps,
    },
    rolldownOptions: {
      // The QA-only multi-page build exercises Vite's optimized CSS in
      // Chromium. The public production build never includes this fixture.
      ...(process.env.PDF_QA_BUILD === "1"
        ? {
            input: {
              app: path.resolve(__dirname, "index.html"),
              pdfExportQa: path.resolve(__dirname, "pdf-export-qa.html"),
            },
          }
        : {}),
      output: {
        // The broad vendor group avoids a 533 kB main-entry regression.
        // AdminApp remains a separate lazy route chunk.
        codeSplitting: {
          groups: [
            {
              // Keep anonymous public queries separate from Auth/Storage/Realtime.
              name: "public-postgrest",
              test: /[\\/]node_modules[\\/]@supabase[\\/]postgrest-js[\\/]/,
            },
            {
              // The complete SDK remains available to authenticated admin routes.
              name: "supabase-sdk",
              test: (id) =>
                /[\\/]node_modules[\\/]@supabase[\\/]/.test(id) &&
                !/[\\/]node_modules[\\/]@supabase[\\/]postgrest-js[\\/]/.test(id),
            },
            {
              // Shared React libraries stay cacheable. React Router is kept
              // outside this eager group so the lazy /admin route owns it.
              name: "vendor",
              test: (id) =>
                /[\\/]node_modules[\\/]/.test(id) &&
                !/[\\/]node_modules[\\/]react-router[\\/]/.test(id),
            },
          ],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 5173,
    strictPort: true,
  },
  preview: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 4173,
    strictPort: true,
  },
})
