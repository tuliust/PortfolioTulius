export function FloatingSaveButton({
  enabled,
  onClick,
  label = "Salvar alterações",
}: {
  enabled: boolean
  onClick: () => void | Promise<unknown>
  label?: string
}) {
  if (!enabled) return null
  return (
    <div className="admin-floating-save" role="region" aria-label="Salvar edições">
      <span role="status">Alterações não salvas</span>
      <button
        type="button"
        className="primary-button"
        onClick={() => void onClick()}
        disabled={!enabled}
      >
        {label}
      </button>
    </div>
  )
}
