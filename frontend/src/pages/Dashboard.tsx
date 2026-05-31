import { useNavigate } from 'react-router-dom'
import { clearToken, getToken } from '../services/authService'

export default function DashboardPage() {
  const navigate = useNavigate()
  const token = getToken()

  const handleLogout = () => {
    clearToken()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
            <p className="mt-2 text-sm text-slate-600">Bem-vindo! Você está autenticado.</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500"
          >
            Sair
          </button>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm text-slate-700">Token armazenado localmente:</p>
          <pre className="mt-3 max-h-40 overflow-auto rounded-2xl bg-white p-4 text-xs text-slate-800">
            {token ?? 'Nenhum token encontrado'}
          </pre>
        </div>
      </div>
    </div>
  )
}
