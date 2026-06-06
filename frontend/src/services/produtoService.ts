import { apiFetch } from './api'
import type { ProdutoRequest, ProdutoResponse } from '../types/api'

export async function fetchProdutos(): Promise<ProdutoResponse[]> {
  return apiFetch<ProdutoResponse[]>('/produtos')
}

export async function fetchProdutoById(id: number): Promise<ProdutoResponse> {
  return apiFetch<ProdutoResponse>(`/produtos/${id}`)
}

export async function fetchProdutoBySku(sku: string): Promise<ProdutoResponse> {
  return apiFetch<ProdutoResponse>(`/produtos/sku/${encodeURIComponent(sku)}`)
}

export async function fetchProdutosCriticos(): Promise<ProdutoResponse[]> {
  return apiFetch<ProdutoResponse[]>('/produtos/criticos')
}

export async function createProduto(data: ProdutoRequest): Promise<ProdutoResponse> {
  return apiFetch<ProdutoResponse>('/produtos', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateProduto(id: number, data: ProdutoRequest): Promise<ProdutoResponse> {
  return apiFetch<ProdutoResponse>(`/produtos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteProduto(id: number): Promise<void> {
  return apiFetch<void>(`/produtos/${id}`, {
    method: 'DELETE',
  })
}
