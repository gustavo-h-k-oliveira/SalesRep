import { apiFetch } from './api'
import type { PedidoResponse } from '../types/api'

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

