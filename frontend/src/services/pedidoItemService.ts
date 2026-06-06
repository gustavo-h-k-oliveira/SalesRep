import { apiFetch } from './api'
import type { PedidoItemResponse } from '../types/api'

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

