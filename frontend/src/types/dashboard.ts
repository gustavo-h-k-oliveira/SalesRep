/**
 * Tipos auxiliares usados apenas no front-end para montar a tela de
 * Visão Geral a partir dos dados que já existem na API hoje.
 *
 * cidadeUf e prazoGestor ainda não são retornados por nenhum endpoint.
 * Enquanto o back-end não expõe esses campos, eles ficam como opcionais
 * e a UI mostra um placeholder ("—") no lugar.
 */
export interface ClienteAtencao {
  id: number
  nome: string
  cidadeUf?: string
  diasSemCompra: number
  status: string
  prazoGestor?: string
}

export type PriorityLevel = 'alta' | 'media' | 'atencao'

export interface PriorityItem {
  level: PriorityLevel
  description: string
  actionLabel: string
  onAction?: () => void
}
