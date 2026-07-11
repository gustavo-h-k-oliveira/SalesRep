import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { redefinirSenha } from '../services/authService'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''

  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccess(false)

    if (novaSenha !== confirmarSenha) {
      setError('As senhas digitadas não coincidem.')
      return
    }

    if (!token) {
      setError('Token de redefinição ausente na URL.')
      return
    }

    setLoading(true)

    try {
      await redefinirSenha(token, novaSenha)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao redefinir a senha')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Redefinir Senha</h1>

        {!success ? (
          <>
            <p className="mt-2 text-sm text-slate-600">
              Crie uma nova senha de acesso para sua conta.
            </p>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {!token && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
                  Aviso: O token de redefinição não foi detectado na URL. Verifique se clicou no link completo.
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700">Nova Senha</label>
                <input
                  type="password"
                  value={novaSenha}
                  onChange={(event) => setNovaSenha(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
                  placeholder="Nova senha"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Confirmar Nova Senha</label>
                <input
                  type="password"
                  value={confirmarSenha}
                  onChange={(event) => setConfirmarSenha(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
                  placeholder="Confirme a nova senha"
                  required
                />
              </div>

              {error && <p className="text-sm text-rose-600">{error}</p>}

              <button
                type="submit"
                disabled={loading || !token}
                className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Redefinindo...' : 'Salvar Nova Senha'}
              </button>
            </form>
          </>
        ) : (
          <div className="mt-6 space-y-6">
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800 text-center">
              Senha redefinida com sucesso!
            </div>
            <p className="text-sm text-slate-600 text-center">
              Você já pode realizar o login utilizando o seu e-mail e a nova senha cadastrada.
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
            Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  )
}
