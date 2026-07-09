import { useEffect, useState } from 'react'
import { fetchDashboard } from '../services/dashboardService'
import { isRepresentante } from '../services/authService'
import type { DashboardDto } from '../types/api'
import DashboardRepresentante from './DashboardRepresentante'
import DashboardGestor from './DashboardGestor'
import { WarningCircleIcon } from '@phosphor-icons/react'

export default function DashboardPage() {
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/50 p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-650 border-t-transparent" />
          <p className="text-sm font-medium text-slate-600">Carregando dados do painel...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/50 p-6">
        <div className="rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm max-w-md">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <WarningCircleIcon className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-900">Falha ao Carregar</h2>
          <p className="mt-2 text-sm text-slate-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!dashboard) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/50 p-6">
        <p className="text-sm font-medium text-slate-600">Nenhum dado disponível.</p>
      </div>
    )
  }

  // Renderiza o Dashboard apropriado baseado na função do usuário
  if (isRepresentante()) {
    return <DashboardRepresentante data={dashboard} />
  }

  return <DashboardGestor data={dashboard} />
}

