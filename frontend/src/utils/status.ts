export type BadgeTone = 'green' | 'amber' | 'orange' | 'red' | 'blue'

/**
 * Deriva a cor do badge a partir do texto de status do cliente vindo da API.
 * Ajuste os termos aqui se o back-end padronizar os valores de status.
 */
export function clienteStatusTone(status: string): BadgeTone {
  const normalized = status.toLowerCase()
  if (normalized.includes('crít') || normalized.includes('crit')) return 'red'
  if (normalized.includes('quase')) return 'amber'
  if (normalized.includes('inativ')) return 'orange'
  return 'green'
}

/**
 * Deriva a cor do badge a partir do texto de status do pedido vindo da API.
 */
export function pedidoStatusTone(status: string): BadgeTone {
  const normalized = status.toLowerCase()
  if (normalized.includes('fatur')) return 'green'
  if (normalized.includes('envi')) return 'green'
  if (normalized.includes('anális') || normalized.includes('analise')) return 'amber'
  if (normalized.includes('cancel')) return 'red'
  return 'blue'
}
