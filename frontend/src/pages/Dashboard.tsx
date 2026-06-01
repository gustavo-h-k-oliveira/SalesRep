import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearToken } from '../services/authService'
import { fetchDashboard } from '../services/dashboardService'
import type { DashboardDto } from '../types/api'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [dashboard, setDashboard] = useState<DashboardDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await fetchDashboard()
        setDashboard(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar o dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const handleLogout = () => {
    clearToken()
    navigate('/login')
  }

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
            <p className="mt-2 text-sm text-slate-600">
              Bem-vindo{dashboard?.representanteNome ? `, ${dashboard.representanteNome}` : ''}! Você está autenticado.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/clientes')}
              className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Clientes prioritários
            </button>
            <button
              onClick={handleLogout}
              className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500"
            >
              Sair
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-900">Resumo</h2>
            {loading ? (
              <p className="mt-4 text-slate-600">Carregando dados do dashboard...</p>
            ) : error ? (
              <p className="mt-4 text-rose-600">{error}</p>
            ) : dashboard ? (
              <div className="mt-4 space-y-4">
                <div className="rounded-3xl bg-white p-4 shadow-sm">
                  <p className="text-sm text-slate-500">Faturamento total</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {formatCurrency(dashboard.faturamentoTotal)}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white p-4 shadow-sm">
                    <p className="text-sm text-slate-500">Clientes ativos</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">{dashboard.clientesAtivos}</p>
                  </div>
                  <div className="rounded-3xl bg-white p-4 shadow-sm">
                    <p className="text-sm text-slate-500">Clientes inativos</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">{dashboard.clientesInativos}</p>
                  </div>
                </div>

                <div className="rounded-3xl bg-white p-4 shadow-sm">
                  <p className="text-sm text-slate-500">Alertas pendentes</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">
                    {dashboard.alertasPendentes}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-slate-600">Nenhum dado disponível.</p>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-semibold text-slate-900">Regiões críticas</h2>
              {loading ? (
                <p className="mt-4 text-slate-600">Carregando...</p>
              ) : error ? (
                <p className="mt-4 text-rose-600">{error}</p>
              ) : dashboard?.regioesCriticas.length ? (
                <ul className="mt-4 space-y-3">
                  {dashboard.regioesCriticas.map((regiao) => (
                    <li key={regiao} className="rounded-2xl bg-white p-4 text-slate-800 shadow-sm">
                      {regiao}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-slate-600">Nenhuma região crítica.</p>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-semibold text-slate-900">Produtos críticos</h2>
              {loading ? (
                <p className="mt-4 text-slate-600">Carregando...</p>
              ) : error ? (
                <p className="mt-4 text-rose-600">{error}</p>
              ) : dashboard?.produtosCriticos.length ? (
                <ul className="mt-4 space-y-3">
                  {dashboard.produtosCriticos.map((produto) => (
                    <li key={produto} className="rounded-2xl bg-white p-4 text-slate-800 shadow-sm">
                      {produto}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-slate-600">Nenhum produto crítico.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
