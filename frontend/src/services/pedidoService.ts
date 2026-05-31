import { apiFetch } from './api'
import type { PedidoRequest, PedidoResponse } from '../types/api'

export async function fetchPedidos(): Promise<PedidoResponse[]> {
  return apiFetch<PedidoResponse[]>('/pedidos')
}

export async function fetchPedidoById(id: number): Promise<PedidoResponse> {
  return apiFetch<PedidoResponse>(`/pedidos/${id}`)
}

export async function fetchPedidosByCliente(clienteId: number): Promise<PedidoResponse[]> {
  return apiFetch<PedidoResponse[]>(`/pedidos/cliente/${clienteId}`)
}

export async function fetchPedidosByRepresentante(representanteId: number): Promise<PedidoResponse[]> {
  return apiFetch<PedidoResponse[]>(`/pedidos/representante/${representanteId}`)
}

export async function fetchPedidosByStatus(status: string): Promise<PedidoResponse[]> {
  return apiFetch<PedidoResponse[]>(`/pedidos/status/${encodeURIComponent(status)}`)
}

export async function fetchPedidosFaturados(): Promise<PedidoResponse[]> {
  return apiFetch<PedidoResponse[]>('/pedidos/faturados')
}

export async function fetchPedidosNaoFaturados(): Promise<PedidoResponse[]> {
  return apiFetch<PedidoResponse[]>('/pedidos/nao-faturados')
}

export async function fetchPedidosByPeriodo(inicio: string, fim: string): Promise<PedidoResponse[]> {
  const query = new URLSearchParams({ inicio, fim }).toString()
  return apiFetch<PedidoResponse[]>(`/pedidos/periodo?${query}`)
}

export async function createPedido(data: PedidoRequest): Promise<PedidoResponse> {
  return apiFetch<PedidoResponse>('/pedidos', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updatePedido(id: number, data: PedidoRequest): Promise<PedidoResponse> {
  return apiFetch<PedidoResponse>(`/pedidos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deletePedido(id: number): Promise<void> {
  return apiFetch<void>(`/pedidos/${id}`, {
    method: 'DELETE',
  })
}
