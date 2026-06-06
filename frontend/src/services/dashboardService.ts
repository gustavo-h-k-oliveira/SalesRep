import { apiFetch } from './api'
import type { DashboardDto } from '../types/api'

export async function fetchDashboard(): Promise<DashboardDto> {
  return apiFetch<DashboardDto>('/dashboard')
}
