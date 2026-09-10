import type { LogAuditoriaResponse, PageResponse } from '../types/api'
import { apiFetch } from './api'

export async function fetchLogsAuditoria(
  representanteId?: number,
  username?: string,
  page = 0,
  size = 20
): Promise<PageResponse<LogAuditoriaResponse>> {
  const params = new URLSearchParams()
  params.set('page', page.toString())
  params.set('size', size.toString())
  params.set('sort', 'dataHora,desc')
  
  if (representanteId) {
    params.set('representanteId', representanteId.toString())
  }
  if (username && username.trim()) {
    params.set('username', username.trim())
  }

  return apiFetch<PageResponse<LogAuditoriaResponse>>(`/auditoria?${params.toString()}`)
}
