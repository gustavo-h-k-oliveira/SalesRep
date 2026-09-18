export interface LoginRequest {
  email: string
  senha: string
  lembreMe?: boolean
}

export interface LoginResponse {
  token: string
  representanteId?: number
}

export interface DashboardDto {
  faturamentoTotal: number
  clientesAtivos: number
  clientesInativos: number
  alertasPendentes: number
  regioesCriticas: string[]
  produtosCriticos: string[]
  representanteNome?: string
  metaFaturamento?: number
  faturamentoMesAtual?: number
  atingimentoMetaPercentual?: number
  metaPositivacaoClientes?: number
  metaReativacaoInativos?: number
}

export interface AlertaDto {
  tipo: string
  criticidade: string
  descricao: string
  status: string
  clienteId: number
  clienteNome: string
  dataGeracao: string
}

export interface ClientePrioritarioDto {
  id: number
  nome: string
  score: number
  diasSemCompra: number
  ticketMedio: number
  totalPedidos: number
  estadoId?: number
  estadoNome?: string
  estadoUf?: string
  regiaoId?: number
  regiaoNome?: string
  status: string
}

export interface PageResponse<T> {
  content: T[]
  totalPages?: number
  totalElements?: number
  size?: number
  number?: number
  first?: boolean
  last?: boolean
  page?: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}

export interface ClienteResponse {
  id: number
  nome: string
  estadoId?: number
  estadoNome?: string
  estadoUf?: string
  regiaoId?: number
  regiaoNome?: string
  representanteId: number
  representanteNome: string
  ultimaCompra: string
  status: string
}

export interface ClientePerfilDto {
  id: number
  nome: string
  representante: string
  estado?: string
  regiao: string
  status: string
  ultimaCompra: string
  diasSemCompra: number
  ticketMedio: number
  totalPedidos: number
  faturamentoTotal: number
}

export interface ClienteRequest {
  nome: string
  estadoId?: number
  regiaoId?: number
  representanteId: number
  ultimaCompra: string
  status: string
}

export interface ProdutoResponse {
  id: number
  sku: string
  descricao: string
  grupo?: string
  faturamento: number
}

export interface ProdutoRequest {
  sku: string
  descricao: string
  grupo?: string
}

export interface RepresentanteResponse {
  id: number
  nome: string
  cpfCnpj?: string
  estadoId?: number
  estadoNome?: string
  estadoUf?: string
  regiaoId?: number
  regiaoNome?: string
  telefone: string
  email?: string
}

export interface RepresentanteRequest {
  nome: string
  estadoId?: number
  regiaoId?: number
  telefone: string
  cpfCnpj?: string
  email?: string
}

export interface EstadoResponse {
  id: number
  nome: string
  uf: string
  regiaoId: number
  regiaoNome?: string
  status: string
}

export interface EstadoRequest {
  nome: string
  uf: string
  regiaoId: number
  status: string
}

export interface RegiaoResponse {
  id: number
  nome: string
  uf?: string
  gerenteRegional: string
  status: string
}

export interface RegiaoRequest {
  nome: string
  gerenteRegional: string
  status: string
}

export interface PedidoRequest {
  clienteId: number
  representanteId: number
  dataEmissao: string
  dataFaturamento?: string | null
  valorTotal: number
  status: string
  autorizacaoComercial: string
}

export interface PedidoResponse {
  id: number
  clienteId: number
  clienteNome: string
  representanteId: number
  representanteNome: string
  dataEmissao: string
  dataFaturamento: string | null
  valorTotal: number
  status: string
  autorizacaoComercial: string
}

export interface PedidoItemRequest {
  pedidoId: number
  produtoId: number
  quantidade: number
  precoUnitario: number
  subTotal: number
}

export interface PedidoItemResponse {
  id: number
  pedidoId: number
  produtoId: number
  quantidade: number
  precoUnitario: number
  subTotal: number
}

export interface ProdutoRecomendadoDto {
  id: number
  sku: string
  descricao: string
  justificativa: string
}

export interface LogAuditoriaResponse {
  id: number
  username: string
  evento: string
  ip: string
  userAgent: string
  dataHora: string
}

