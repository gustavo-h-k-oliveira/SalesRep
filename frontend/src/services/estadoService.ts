import { apiFetch } from './api'
import type { EstadoRequest, EstadoResponse } from '../types/api'

export async function fetchEstados(): Promise<EstadoResponse[]> {
  return apiFetch<EstadoResponse[]>('/estados')
}

export async function fetchEstadoById(id: number): Promise<EstadoResponse> {
  return apiFetch<EstadoResponse>(`/estados/${id}`)
}

export async function fetchEstadoByUf(uf: string): Promise<EstadoResponse> {
  return apiFetch<EstadoResponse>(`/estados/uf/${encodeURIComponent(uf)}`)
}

export async function fetchEstadosByRegiao(regiaoId: number): Promise<EstadoResponse[]> {
  return apiFetch<EstadoResponse[]>(`/estados/regiao/${regiaoId}`)
}

export async function createEstado(data: EstadoRequest): Promise<EstadoResponse> {
  return apiFetch<EstadoResponse>('/estados', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateEstado(id: number, data: EstadoRequest): Promise<EstadoResponse> {
  return apiFetch<EstadoResponse>(`/estados/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteEstado(id: number): Promise<void> {
  return apiFetch<void>(`/estados/${id}`, {
    method: 'DELETE',
  })
}
