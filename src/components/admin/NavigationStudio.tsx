import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import { registerAdminSaveAction } from "./AdminConfirmationHost"
import { AdminNotice } from "./AdminNotice"
import { FloatingSaveButton } from "./FloatingSaveButton"
import { Icon } from "../ui/Icons"

/** Global public navigation editor. Only edited state participates in aggregate save. */
export function NavigationStudio({ onDirtyChange }: { onDirtyChange?: (dirty: boolean) => void }) {
  const [items, setItems] = useState<Record<string, any>[]>([])
  const [savedItems, setSavedItems] = useState("[]")
  const navigationDirty = JSON.stringify(items) !== savedItems
  useEffect(() => onDirtyChange?.(navigationDirty), [navigationDirty, onDirtyChange])
  const [message, setMessage] = useState("")
  const load = async (): Promise<boolean> => {
    if (!supabase) return false
    const { data, error } = await supabase.from("navigation_items").select("*").order("sort_order")
    if (error) {
      setMessage(error.message)
      return false
    }
    setItems(data ?? [])
    setSavedItems(JSON.stringify(data ?? []))
    setMessage("")
    return true
  }
  useEffect(() => {
    void load()
  }, [])
  function patch(index: number, values: Record<string, any>) {
    const next = [...items]
    next[index] = { ...next[index], ...values }
    setItems(next)
  }
  function create() {
    setItems([
      ...items,
      {
        id: crypto.randomUUID(),
        label: "Novo item",
        target_slug: "perfil",
        group_name: "Menu",
        sort_order: items.length + 1,
        is_visible: false,
        status: "published",
      },
    ])
  }
  async function save(): Promise<boolean> {
    if (!supabase) return false
    setMessage("Salvando navegação…")
    const rows = items.map(({ id, label, target_slug, sort_order, is_visible }) => ({
      id,
      label,
      target_slug,
      group_name: "Menu",
      sort_order,
      is_visible,
      status: "published",
    }))
    const { error } = await supabase.from("navigation_items").upsert(rows, { onConflict: "id" })
    if (error) {
      setMessage(error.message)
      return false
    }
    const confirmed = await load()
    setMessage(
      confirmed ? "Navegação salva." : "Gravação realizada, mas leitura de confirmação falhou.",
    )
    return confirmed
  }
  useEffect(() => registerAdminSaveAction(save, () => navigationDirty), [save, navigationDirty])
  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= items.length) return
    const next = [...items]
    ;[next[index], next[target]] = [next[target], next[index]]
    setItems(next.map((item, order) => ({ ...item, sort_order: order + 1 })))
  }
  return (
    <>
      <header className="admin-header">
        <div>
          <p>Menu público</p>
          <h1>Navegação</h1>
          <span>
            Menu único: rótulos, ordem, âncoras e visibilidade. Sem títulos de grupo no site.
          </span>
        </div>
        <div className="header-actions">
          <button
            className="secondary-button"
            onClick={create}
            disabled
            title="Criação de itens desativada"
          >
            Novo item
          </button>
          <FloatingSaveButton enabled={navigationDirty} onClick={save} label="Salvar menu" />
        </div>
      </header>
      <section className="admin-card navigation-form">
        {items.map((item, index) => (
          <div key={item.id}>
            <div className="order-buttons">
              <button onClick={() => move(index, -1)} aria-label="Mover item para cima">
                <Icon name="up" size={17} />
              </button>
              <button onClick={() => move(index, 1)} aria-label="Mover item para baixo">
                <Icon name="down" size={17} />
              </button>
            </div>
            <label>
              Rótulo
              <input
                value={item.label}
                onChange={(event) => patch(index, { label: event.target.value })}
              />
            </label>
            <label>
              Âncora
              <input
                value={item.target_slug}
                onChange={(event) => patch(index, { target_slug: event.target.value })}
              />
            </label>
            <label className="toggle-field">
              <input
                type="checkbox"
                checked={item.is_visible}
                onChange={(event) => patch(index, { is_visible: event.target.checked })}
              />
              Visível
            </label>
          </div>
        ))}
        <AdminNotice message={message} />
      </section>
    </>
  )
}
