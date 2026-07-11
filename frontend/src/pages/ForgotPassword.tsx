import { useState } from 'react'
import { Link } from 'react-router-dom'
import { recuperarSenha } from '../services/authService'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      await recuperarSenha(email)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar solicitação')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Recuperação de Senha</h1>
        
        {!success ? (
          <>
            <p className="mt-2 text-sm text-slate-600">
              Digite seu e-mail cadastrado. Nós enviaremos as instruções para você redefinir a sua senha.
            </p>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
                  placeholder="seuemail@company.com"
                  required
                />
              </div>

              {error && <p className="text-sm text-rose-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Processando...' : 'Enviar Link de Recuperação'}
              </button>
            </form>
          </>
        ) : (
          <div className="mt-6 space-y-6">
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800">
              Solicitação enviada com sucesso! Se o e-mail <strong>{email}</strong> estiver cadastrado, um link de recuperação foi enviado.
            </div>
            <p className="text-sm text-slate-600 text-center">
              Para testar localmente, verifique o <strong>link gerado no console/log do servidor Spring Boot</strong>.
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
