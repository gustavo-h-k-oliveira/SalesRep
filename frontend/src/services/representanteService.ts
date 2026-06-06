import { apiFetch } from './api'
import type {
  RepresentanteRequest,
  RepresentanteResponse,
  ClienteResponse,
  PedidoResponse,
} from '../types/api'

export async function fetchRepresentantes(): Promise<RepresentanteResponse[]> {
  return apiFetch<RepresentanteResponse[]>('/representantes')
}

export async function fetchRepresentanteById(id: number): Promise<RepresentanteResponse> {
  return apiFetch<RepresentanteResponse>(`/representantes/${id}`)
}

export async function fetchRepresentantesByRegiao(regiaoId: number): Promise<RepresentanteResponse[]> {
  return apiFetch<RepresentanteResponse[]>(`/representantes/regiao/${regiaoId}`)
}

export async function fetchRepresentanteClientes(id: number): Promise<ClienteResponse[]> {
  return apiFetch<ClienteResponse[]>(`/representantes/${id}/clientes`)
}

export async function fetchRepresentantePedidos(id: number): Promise<PedidoResponse[]> {
  return apiFetch<PedidoResponse[]>(`/representantes/${id}/pedidos`)
}

export async function createRepresentante(data: RepresentanteRequest): Promise<RepresentanteResponse> {
  return apiFetch<RepresentanteResponse>('/representantes', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateRepresentante(id: number, data: RepresentanteRequest): Promise<RepresentanteResponse> {
  return apiFetch<RepresentanteResponse>(`/representantes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteRepresentante(id: number): Promise<void> {
  return apiFetch<void>(`/representantes/${id}`, {
    method: 'DELETE',
  })
}
