import { apiFetch } from './api'
import type { AlertaDto } from '../types/api'

export async function fetchAlertas(): Promise<AlertaDto[]> {
  return apiFetch<AlertaDto[]>('/alertas')
}
