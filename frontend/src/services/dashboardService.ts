import { apiFetch } from './api'
import type { DashboardDto } from '../types/api'

export const EMPTY_DASHBOARD: DashboardDto = {
  faturamentoTotal: 0,
  clientesAtivos: 0,
  clientesInativos: 0,
  alertasPendentes: 0,
  regioesCriticas: [],
  produtosCriticos: [],
  metaFaturamento: 0,
  faturamentoMesAtual: 0,
  atingimentoMetaPercentual: 0,
  metaPositivacaoClientes: 0,
  metaReativacaoInativos: 0,
}

export async function fetchDashboard(): Promise<DashboardDto> {
  try {
    const data = await apiFetch<DashboardDto>('/dashboard')
    if (data) return data
  } catch (err) {
    console.warn('Backend /dashboard indisponível ou sem dados:', err)
  }
  return EMPTY_DASHBOARD
}
