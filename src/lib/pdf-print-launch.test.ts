import { describe, expect, it, vi } from "vitest"
import {
  pdfPrintErrorMessage,
  preparePdfPreviewForLaunch,
  printDesktopReferenceFrame,
} from "./pdf-print-launch"

const fakeDocument = {} as Document

describe("PDF print launch from the admin preview", () => {
  it("leaves the Mobile preview untouched and validates in the print tab", () => {
    const prepare = vi.fn(() => {
      throw new Error("A preparação não deve ocorrer no iframe Mobile.")
    })
    expect(() =>
      preparePdfPreviewForLaunch(fakeDocument, "mobile", ["perfil", "sobre"], prepare),
    ).not.toThrow()
    expect(prepare).not.toHaveBeenCalled()
  })

  it("retains the approved Desktop preview validation", () => {
    const prepare = vi.fn(() => ({
      widthPx: 1440,
      pages: [{ slug: "perfil", heightPx: 900 }],
    }))
    preparePdfPreviewForLaunch(fakeDocument, "desktop", ["perfil"], prepare)
    expect(prepare).toHaveBeenCalledWith(fakeDocument, "desktop", ["perfil"])
    expect(() =>
      preparePdfPreviewForLaunch(fakeDocument, "desktop", ["perfil", "sobre"], prepare),
    ).toThrow("A quantidade de páginas não corresponde à seleção.")
  })

  it("prints Desktop from the 1440px reference frame, without another tab", () => {
    const frameWindow = { focus: vi.fn(), print: vi.fn() }
    expect(printDesktopReferenceFrame("desktop", frameWindow)).toBe(true)
    expect(frameWindow.focus).toHaveBeenCalledOnce()
    expect(frameWindow.print).toHaveBeenCalledOnce()
  })

  it("keeps Mobile on its separate print tab", () => {
    const frameWindow = { focus: vi.fn(), print: vi.fn() }
    expect(printDesktopReferenceFrame("mobile", frameWindow)).toBe(false)
    expect(frameWindow.focus).not.toHaveBeenCalled()
    expect(frameWindow.print).not.toHaveBeenCalled()
  })

  it("propagates a blocked iframe print to the admin error handler", () => {
    const frameWindow = {
      focus: vi.fn(),
      print: vi.fn(() => {
        throw new Error("Impressão indisponível")
      }),
    }
    expect(() => printDesktopReferenceFrame("desktop", frameWindow)).toThrow(
      "Impressão indisponível",
    )
  })

  it("keeps error messages from iframe realms and other throwable values", () => {
    expect(pdfPrintErrorMessage({ message: "Falha específica no iframe." })).toBe(
      "Falha específica no iframe.",
    )
    expect(pdfPrintErrorMessage("A aba foi bloqueada.")).toBe("A aba foi bloqueada.")
    expect(pdfPrintErrorMessage(new Error("Erro local."))).toBe("Erro local.")
    expect(pdfPrintErrorMessage(null)).toBe("Não foi possível imprimir.")
  })
})
