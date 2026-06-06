import { apiFetch } from './api'
import type { RegiaoRequest, RegiaoResponse, ClienteResponse, RepresentanteResponse } from '../types/api'

export async function fetchRegioes(): Promise<RegiaoResponse[]> {
  return apiFetch<RegiaoResponse[]>('/regioes')
}

export async function fetchRegiaoById(id: number): Promise<RegiaoResponse> {
  return apiFetch<RegiaoResponse>(`/regioes/${id}`)
}

export async function fetchRegioesByUf(uf: string): Promise<RegiaoResponse[]> {
  return apiFetch<RegiaoResponse[]>(`/regioes/uf/${encodeURIComponent(uf)}`)
}

export async function fetchRegiaoClientes(id: number): Promise<ClienteResponse[]> {
  return apiFetch<ClienteResponse[]>(`/regioes/${id}/clientes`)
}

export async function fetchRegiaoRepresentantes(id: number): Promise<RepresentanteResponse[]> {
  return apiFetch<RepresentanteResponse[]>(`/regioes/${id}/representantes`)
}

export async function createRegiao(data: RegiaoRequest): Promise<RegiaoResponse> {
  return apiFetch<RegiaoResponse>('/regioes', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateRegiao(id: number, data: RegiaoRequest): Promise<RegiaoResponse> {
  return apiFetch<RegiaoResponse>(`/regioes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteRegiao(id: number): Promise<void> {
  return apiFetch<void>(`/regioes/${id}`, {
    method: 'DELETE',
  })
}
