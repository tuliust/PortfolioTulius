import { type FormEvent, useState } from "react"
import { Link, useNavigate } from "react-router"
import { isAdmin, isSupabaseConfigured, supabase } from "../../lib/supabase"

export function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!supabase) return setMessage("Configure as variáveis públicas do Supabase.")
    setBusy(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setMessage(error.message)
      setBusy(false)
      return
    }
    if (!(await isAdmin())) {
      await supabase.auth.signOut()
      setMessage("Esta conta não possui autorização administrativa.")
      setBusy(false)
      return
    }
    navigate("/admin")
  }

  return (
    <main className="login-page">
      <Link to="/" className="admin-back">
        ← Voltar ao site
      </Link>
      <form className="login-card" onSubmit={submit}>
        <div className="admin-mark">TT</div>
        <p>Área administrativa</p>
        <h1>Conteúdo em boas mãos.</h1>
        <label>
          E-mail
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Senha
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {message && (
          <div className="form-message" role="alert">
            {message}
          </div>
        )}
        <button className="primary-button" disabled={busy || !isSupabaseConfigured}>
          {busy ? "Entrando…" : "Entrar com segurança"}
        </button>
        <small>
          O acesso exige uma conta no Supabase Auth vinculada à tabela protegida de administradores.
        </small>
      </form>
    </main>
  )
}
