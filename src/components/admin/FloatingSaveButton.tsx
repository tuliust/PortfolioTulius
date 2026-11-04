export function FloatingSaveButton({
  enabled,
  onClick,
  label = "Salvar alterações",
}: {
  enabled: boolean
  onClick: () => void | Promise<unknown>
  label?: string
}) {
  return (
    <div className="admin-floating-save" role="region" aria-label="Salvar edições">
      <span role="status">{enabled ? "Alterações não salvas" : "Nenhuma alteração pendente"}</span>
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
