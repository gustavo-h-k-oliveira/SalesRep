import { apiFetch } from './api'
import type {
  ClienteResponse,
  ClienteRequest,
  ClientePerfilDto,
  ClientePrioritarioDto,
  ProdutoRecomendadoDto,
} from '../types/api'

export async function fetchClientes(): Promise<ClienteResponse[]> {
  return apiFetch<ClienteResponse[]>('/clientes')
}

export async function fetchClienteById(id: number): Promise<ClienteResponse> {
  return apiFetch<ClienteResponse>(`/clientes/${id}`)
}

export async function fetchClientesByRegiao(regiaoId: number): Promise<ClienteResponse[]> {
  return apiFetch<ClienteResponse[]>(`/clientes/regiao/${regiaoId}`)
}

export async function fetchClientesByRepresentante(representanteId: number): Promise<ClienteResponse[]> {
  return apiFetch<ClienteResponse[]>(`/clientes/representante/${representanteId}`)
}

export async function fetchClientesByStatus(status: string): Promise<ClienteResponse[]> {
  return apiFetch<ClienteResponse[]>(`/clientes/status/${encodeURIComponent(status)}`)
}

export async function fetchClientesInativos(): Promise<ClienteResponse[]> {
  return apiFetch<ClienteResponse[]>('/clientes/inativos')
}

export async function fetchClientesPrioritarios(): Promise<ClientePrioritarioDto[]> {
  return apiFetch<ClientePrioritarioDto[]>('/clientes/prioritarios')
}

export async function fetchClientePerfil(id: number): Promise<ClientePerfilDto> {
  return apiFetch<ClientePerfilDto>(`/clientes/${id}/perfil`)
}

export async function createCliente(data: ClienteRequest): Promise<ClienteResponse> {
  return apiFetch<ClienteResponse>('/clientes', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateCliente(id: number, data: ClienteRequest): Promise<ClienteResponse> {
  return apiFetch<ClienteResponse>(`/clientes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteCliente(id: number): Promise<void> {
  return apiFetch<void>(`/clientes/${id}`, {
    method: 'DELETE',
  })
}

export async function fetchRecomendacoesByCliente(clienteId: number): Promise<ProdutoRecomendadoDto[]> {
  return apiFetch<ProdutoRecomendadoDto[]>(`/clientes/${clienteId}/recomendacoes`)
}
