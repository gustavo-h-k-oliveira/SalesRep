import { apiFetch } from './api'
import type { PedidoItemRequest, PedidoItemResponse } from '../types/api'

export async function fetchPedidoItens(): Promise<PedidoItemResponse[]> {
  return apiFetch<PedidoItemResponse[]>('/pedido-itens')
}

export async function fetchPedidoItemById(id: number): Promise<PedidoItemResponse> {
  return apiFetch<PedidoItemResponse>(`/pedido-itens/${id}`)
}

export async function fetchPedidoItensByPedido(pedidoId: number): Promise<PedidoItemResponse[]> {
  return apiFetch<PedidoItemResponse[]>(`/pedido-itens/pedido/${pedidoId}`)
}

export async function fetchPedidoItensByProduto(produtoId: number): Promise<PedidoItemResponse[]> {
  return apiFetch<PedidoItemResponse[]>(`/pedido-itens/produto/${produtoId}`)
}

export async function createPedidoItem(data: PedidoItemRequest): Promise<PedidoItemResponse> {
  return apiFetch<PedidoItemResponse>('/pedido-itens', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updatePedidoItem(id: number, data: PedidoItemRequest): Promise<PedidoItemResponse> {
  return apiFetch<PedidoItemResponse>(`/pedido-itens/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deletePedidoItem(id: number): Promise<void> {
  return apiFetch<void>(`/pedido-itens/${id}`, {
    method: 'DELETE',
  })
}
